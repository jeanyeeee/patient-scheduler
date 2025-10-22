# Patient Scheduler

Next.js app to schedule weekly therapy sessions for patients with assigned therapists, using a simple engine and shared React context for state.

## Features

- **Tabs UI**: Patients, Therapists, Assignments, Availability, Patient Schedule, Ward Schedule
- **One-click generation**: "Get Assignment" creates the weekly plan using a scheduling engine
- **Shared state**: Schedule stored in React Context; all tabs reflect the same plan
- **Availability grid**: Weekly free-slot view (grey = unavailable, role-colored = free)
- **Patient/Ward views**: Per-patient weekly tables and per-day ward grid (patients × time)
- **Conflict-safe**: No therapist/patient double-booking; tries other days when target day is full

## Scheduling Model (summary)

- Days: Monday–Friday
- Slots per day: 7 (09:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00)
- One session = 1 hour
- A therapist can see only 1 patient per slot; a patient can attend only 1 session per slot
- Each patient has weekly goals per therapy type and fixed therapist assignments per role
- If target day is full, the engine tries other days; unassigned roles are skipped
- Ordering: more restrictive therapists (fewer free slots that day) are scheduled first

See `SCHEDULER_LOGIC.md` for details.

## Project Structure

```
patient-scheduler/
├── public/
├── src/
│  └── app/
│     ├── components/
│     │  ├── SchedulerTester.jsx        # Main tabbed UI
│     │  ├── PatientList.jsx            # Patients & goals
│     │  ├── TherapistList.jsx          # Therapists by role (colored)
│     │  ├── AssignmentsView.jsx        # Patient→therapist role mappings
│     │  ├── AvailabilityGrid.jsx       # Weekly availability (role colors)
│     │  ├── PatientSchedule.jsx        # Per-patient weekly tables (+ Get Assignment)
│     │  └── WardSchedule.jsx           # Per-day ward grid (patients × time)
│     ├── context/
│     │  └── ScheduleContext.jsx        # Shared schedule state (generate/clear)
│     ├── data/
│     │  ├── samplePatient.js
│     │  ├── sampleTherapist.js
│     │  ├── samplePatientTherapist.js
│     │  └── sampleTherapistTime.js     # DAYS, SLOTS, availability
│     ├── lib/
│     │  └── schedulingEngine.js        # Core scheduling algorithm
│     ├── page.js
│     └── styles/globals.css
├── SCHEDULER_LOGIC.md
├── package.json
├── postcss.config.mjs
└── next.config.mjs
```

## Getting Started

1) Install dependencies
```bash
npm install
```

2) Run dev server
```bash
npm run dev
```

3) Open the app
`http://localhost:3000`

## Using the App

- Patients/Therapists tabs: browse sample data
- Assignments: see per-role therapist assignments per patient
- Availability: weekly free slots per therapist (role colors, grey unavailable)
- Patient Schedule: click "Get Assignment" to generate a weekly plan; "Clear" to reset
- Ward Schedule: per-day view with patients (rows) × time slots (columns), using the same plan

## Data & Colors

- Roles and colors: Acupuncture (orange), Speech (red), Music/Art (yellow), Physio (blue), Occupational (green)
- Sample data lives under `src/app/data/`

## Customize

- Edit goals/assignments/availability in `src/app/data/`
- Tweak engine behavior in `src/app/lib/schedulingEngine.js` (ordering, fallbacks, etc.)

## Tech

- Next.js + React
- Tailwind CSS
