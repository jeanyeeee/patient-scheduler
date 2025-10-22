// Core scheduling logic (pure functions)
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const START_HOUR = 9;
export const END_HOUR = 17;
export const SLOT_DURATION = 60; // minutes
export const SLOTS_PER_DAY = ((END_HOUR - START_HOUR) * 60) / SLOT_DURATION;

// Using sample data first
// Role mappings to patient goal fields and assignment fields
export const ROLE_TO_PATIENT_GOAL_FIELD = {
  Music: 'musicArtGoal',
  Speech: 'speechGoal',
  Acupuncture: 'acupunctureGoal',
  Occupational: 'occupationalGoal',
  Physio: 'physioGoal',
};

export const ROLE_TO_ASSIGNMENT_FIELD = {
  Music: 'musicArtID',
  Speech: 'speechID',
  Acupuncture: 'acupunctureID',
  Occupational: 'occupationalID',
  Physio: 'physioID',
};


export function buildAssignmentIndex(samplePatientTherapistAssignments) {
  const index = {};
  for (const row of samplePatientTherapistAssignments) {
    const roleMap = {};
    for (const role of Object.keys(ROLE_TO_ASSIGNMENT_FIELD)) {
      const field = ROLE_TO_ASSIGNMENT_FIELD[role];
      roleMap[role] = row[field] || null;
    }
    index[row.patientId] = roleMap;
  }
  return index;
}

export function buildTherapistAvailabilityIndex(sampleTherapistTime, days) {
  // Map: therapistId -> day -> Set(slot)
  const availability = new Map();
  for (const t of sampleTherapistTime) {
    const perDay = new Map();
    for (const d of days) perDay.set(d, new Set(t.availability[d] || []));
    availability.set(t.therapistId, perDay);
  }
  return availability;
}

export function countFreeSlots(availability, therapistId, day) {
  return availability.get(therapistId)?.get(day)?.size ?? 0;
}

export function goalDayRandomiser(patientId, role, count, DAYS_ORDER, rnd = Math.random) {
  const shuffled = [...DAYS_ORDER].sort(() => rnd() - 0.5);
  return shuffled.slice(0, Math.min(count, DAYS_ORDER.length));
}


function isPatientBooked(patientSchedule, patientId, day, slot) {
  return Boolean(
    patientSchedule.get(patientId)?.[day]?.[slot]
  );
}

function setPatientSlot(patientSchedule, patientId, day, slot, value) {
  if (!patientSchedule.has(patientId)) patientSchedule.set(patientId, {});
  if (!patientSchedule.get(patientId)[day]) patientSchedule.get(patientId)[day] = {};
  patientSchedule.get(patientId)[day][slot] = value;
}

function setTherapistSlot(therapistSchedule, therapistId, day, slot, patientId) {
  if (!therapistSchedule.has(therapistId)) therapistSchedule.set(therapistId, {});
  if (!therapistSchedule.get(therapistId)[day]) therapistSchedule.get(therapistId)[day] = {};
  therapistSchedule.get(therapistId)[day][slot] = patientId;
}

// MAIN ENTRY POINT
export function schedulePatients({
  patients,
  therapists,
  assignmentsArray,
  therapistTime,
  DAYS_ORDER,
  SLOTS,
  tryOtherDaysIfFull = true,
}) {
  const assignmentIndex = buildAssignmentIndex(assignmentsArray);
  const availability = buildTherapistAvailabilityIndex(therapistTime, DAYS_ORDER);

  // For UI rendering
  const patientSchedule = new Map(); // patientId -> day -> slot -> { therapistId, role }
  const therapistSchedule = new Map(); // therapistId -> day -> slot -> patientId
  const unscheduled = [];

  // Precompute role index if needed later (not used since we skip unassigned)
  const roleIndex = therapists.reduce((acc, t) => {
    acc[t.therapyTypes] = acc[t.therapyTypes] || [];
    acc[t.therapyTypes].push(t.id);
    return acc;
  }, {});

  // Expand goals into targeted days per role per patient
  const targets = []; // { patientId, role, day }
  for (const p of patients) {
    for (const role of Object.keys(ROLE_TO_PATIENT_GOAL_FIELD)) {
      const goalField = ROLE_TO_PATIENT_GOAL_FIELD[role];
      const goalCount = p[goalField] || 0;
      if (!goalCount) continue;

      const chosenDays = goalDayRandomiser(p.id, role, goalCount, DAYS_ORDER);
      for (const day of chosenDays) {
        targets.push({ patientId: p.id, role, day });
      }
    }
  }

  // Group by day for day-first scheduling
  const byDay = new Map(); // day -> array of { patientId, role }
  for (const t of targets) {
    if (!byDay.has(t.day)) byDay.set(t.day, []);
    byDay.get(t.day).push({ patientId: t.patientId, role: t.role });
  }

  // Helper to attempt scheduling a single (patient, role) on a given day
  const tryScheduleOnDay = (patientId, role, day) => {
    const assignedTid = assignmentIndex[patientId]?.[role] || null;
    if (!assignedTid) {
      unscheduled.push({ patientId, role, day, reason: 'no therapist assigned' });
      return false;
    }

    const freeSet = availability.get(assignedTid)?.get(day);
    if (!freeSet || freeSet.size === 0) return false;

    // iterate slots to find first compatible slot
    for (const slot of SLOTS) {
      if (!freeSet.has(slot)) continue;
      if (isPatientBooked(patientSchedule, patientId, day, slot)) continue;

      // assign
      freeSet.delete(slot);
      setPatientSlot(patientSchedule, patientId, day, slot, { therapistId: assignedTid, role });
      setTherapistSlot(therapistSchedule, assignedTid, day, slot, patientId);
      return true;
    }
    return false;
  };

  // Day-first scheduling
  for (const day of DAYS_ORDER) {
    const items = byDay.get(day) || [];

    // Sort items by restrictiveness of their assigned therapist (fewest free slots first)
    items.sort((a, b) => {
      const ta = assignmentIndex[a.patientId]?.[a.role];
      const tb = assignmentIndex[b.patientId]?.[b.role];
      const fa = ta ? countFreeSlots(availability, ta, day) : Infinity;
      const fb = tb ? countFreeSlots(availability, tb, day) : Infinity;
      return fa - fb;
    });

    for (const item of items) {
      const ok = tryScheduleOnDay(item.patientId, item.role, day);
      if (!ok && tryOtherDaysIfFull) {
        // try alternate days (excluding current day)
        for (const altDay of DAYS_ORDER) {
          if (altDay === day) continue;
          if (tryScheduleOnDay(item.patientId, item.role, altDay)) {
            break; // scheduled on alternate day
          }
        }
      }
    }
  }

  return { patientSchedule, therapistSchedule, unscheduled, roleIndex };
}

