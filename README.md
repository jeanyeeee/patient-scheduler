
# Patient Scheduler App

A Next.js application for scheduling therapy sessions between patients and therapists.

## Features

- **Smart Scheduling Algorithm**: Automatically schedules therapy sessions while respecting therapist specialties and availability
- **Even Distribution**: Spreads patient sessions evenly across the week
- **Conflict Detection**: Prevents double-booking of therapists and patients
- **Visual Schedule Display**: Shows weekly schedules for both patients and therapists
- **Utilization Tracking**: Displays therapist utilization rates
- **Unscheduled Goals**: Flags goals that couldn't be scheduled with reasons

## Project Structure

```
/patient-scheduler-app
├── /public                    # Static assets
├── /src
│   ├── /components           # React components
│   │   ├── SchedulerTester.jsx    # Main UI component
│   │   ├── TherapistCard.jsx      # Therapist info display
│   │   ├── PatientCard.jsx        # Patient info display
│   │   ├── ScheduleSummary.jsx    # Summary statistics
│   │   ├── PatientSchedule.jsx    # Patient schedule view
│   │   ├── TherapistSchedule.jsx  # Therapist schedule view
│   │   ├── UnscheduledGoals.jsx   # Alert for unscheduled goals
│   │   └── RulesPanel.jsx         # Scheduling rules display
│   │
│   ├── /lib                  # Business logic
│   │   └── schedulingEngine.js    # Core scheduling algorithm
│   │
│   ├── /data                 # Sample data
│   │   ├── sampleTherapists.js    # Sample therapist data
│   │   └── samplePatients.js      # Sample patient data
│   │
│   ├── /pages                # Next.js pages
│   │   ├── index.js              # Main page
│   │   └── _app.js               # App configuration
│   │
│   └── /styles               # Global styles
│       └── globals.css           # Tailwind CSS imports
│
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
└── postcss.config.js         # PostCSS configuration
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Scheduling Rules

1. **RULE 1:** Therapists work Monday – Friday, 9 AM – 5 PM only.
2. **RULE 2:** Each slot = 30 minutes → maximum 16 slots per day, 80 slots per week per therapist.
3. **RULE 3:** Each therapist can perform only specific therapy types.
4. **RULE 4:** No therapist double-booked – one session per slot.
5. **RULE 5:** No patient double-booked – one session per slot.
6. **RULE 6:** Each patient has required session counts per therapy type per week.
7. **RULE 7:** Spread sessions evenly across the week (avoid clustering on one day).
8. **RULE 8:** If a patient's weekly therapy goals cannot be scheduled, flag as "to be rescheduled."

## Usage

1. **Configuration Tab:** View therapists and their specialties, and patients with their weekly goals
2. **Run Scheduler:** Click the "Run Scheduler" button to generate schedules
3. **Results Tab:** View summary statistics, patient schedules, and therapist schedules
4. **Rules Tab:** Review the scheduling rules and constraints

## Technologies Used

- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Customization

You can modify the sample data in:
- `src/data/sampleTherapists.js` - Add/modify therapists
- `src/data/samplePatients.js` - Add/modify patients

The scheduling logic can be customized in `src/lib/schedulingEngine.js`.
