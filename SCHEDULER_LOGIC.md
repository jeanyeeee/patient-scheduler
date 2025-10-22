# Healthcare Scheduler – Logic Overview

This document explains the scheduling logic used to create a coherent weekly schedule for patients and therapists.

## Goals
- Fulfill each patient’s weekly therapy goals (per therapy type) by booking sessions with their assigned therapist(s).
- A therapist can see only one patient per free slot.
- A patient cannot attend two sessions in the same time slot.
- If the chosen target day has no free slot, the scheduler will try other days before giving up.
- If a patient has a goal for a therapy but no assigned therapist for that therapy, that item is skipped.

## Data Inputs
- `src/app/data/samplePatient.js`: array of patients with weekly goals
  - `id`, `name`, `musicArtGoal`, `speechGoal`, `acupunctureGoal`, `occupationalGoal`, `physioGoal`
- `src/app/data/sampleTherapist.js`: array of therapists (2 per role)
  - `id`, `name`, `therapyTypes` (Music, Speech, Acupuncture, Occupational, Physio)
- `src/app/data/samplePatientTherapist.js`: per-patient therapist assignments
  - `patientId`, `musicArtID`, `speechID`, `acupunctureID`, `occupationalID`, `physioID`
- `src/app/data/sampleTherapistTime.js`: therapist weekly availability
  - Exports: `DAYS` (Mon–Fri), `SLOTS` (7 per day), `sampleTherapistTime`
  - Shape: `[{ therapistId, availability: { Monday: string[], ... } }]`

## Key Constraints & Policies
- One session = one 1-hour slot.
- Therapist capacity: 1 patient per free slot.
- Patient conflict: cannot double-book the same day+slot.
- Unassigned roles are skipped (no auto-assignment).
- Fulfillment retries across other days are enabled.
- No explicit per-day cap (patients usually have < 5 sessions/day).

## Core Concepts
- Slots: `['09:00','10:00','11:00','13:00','14:00','15:00','16:00']`
- Days: `['Monday','Tuesday','Wednesday','Thursday','Friday']`
- Therapist restrictiveness on a day = number of free slots that day (fewer = more restrictive).

## High-Level Algorithm
1) Preprocess
- Build assignment index: `patientId -> role -> therapistId | null`.
- Build therapist availability index: `therapistId -> day -> Set(slots)`.
- Build role index (not required when skipping unassigned roles).

2) Expand goals to targets
- For each patient and therapy role with goal count N, choose N distinct target days using `goalDayRandomiser`.
- Produce targets: `(patientId, role, day)`.

3) Day-first scheduling
- Group targets by day.
- For each day:
  - Sort that day’s targets by assigned therapist’s restrictiveness (ascending).
  - For each target `(patientId, role)`:
    - Find assigned therapist; if none, mark as unscheduled (unassigned) and continue.
    - Iterate `SLOTS` in order:
      - Skip if therapist not free at slot.
      - Skip if patient already booked at day+slot.
      - If found, assign:
        - `patientSchedule[patientId][day][slot] = { therapistId, role }`
        - `therapistSchedule[therapistId][day][slot] = patientId`
        - Remove slot from therapist’s free set.
      - If no slot works on target day, mark to try other days.

4) Fallback across days
- For any target not scheduled on its target day, try other days (excluding the original), applying the same checks.
- If still not schedulable, record in `unscheduled` with a reason.

## Outputs
- `patientSchedule`: `patientId -> day -> slot -> { therapistId, role }`
- `therapistSchedule`: `therapistId -> day -> slot -> patientId`
- `unscheduled`: `[{ patientId, role, day, reason }]`

These outputs drive:
- Full Schedule tab: renders `patientSchedule` (per-patient weekly tables).
- Availability tab: renders therapist availability (role-colored for free, grey for unavailable).

## Conflict Rules (recap)
- Therapist must have the slot in their free set.
- Patient must have no existing booking at the same day+slot.

## Restrictiveness strategy
- Prioritize therapists with fewer free slots on a given day to reduce dead-ends later.

## Randomization
- `goalDayRandomiser(patientId, role, count, DAYS)` picks distinct target days for weekly goals to create distribution and gaps.

## Failure reasons
- `no therapist assigned`
- `no free slots`
- `patient conflict`

## Files
- Engine: `src/app/lib/schedulingEngine.js`
- Data: `src/app/data/`
- Views: `src/app/components/` (e.g., `FullSchedule.jsx`, `AvailabilityGrid.jsx`)
