'use client'

import { useState } from 'react';
import PatientList from './PatientList';
import TherapistList from './TherapistList';
import AssignmentsView from './AssignmentsView';
import AvailabilityGrid from './AvailabilityGrid';
import FullSchedule from './PatientSchedule';
import { ScheduleProvider } from '../context/ScheduleContext';
import WardSchedule from './WardSchedule';

const TABS = [
    { key: 'patients', label: 'Patients' },
    { key: 'therapists', label: 'Therapists' },
    { key: 'assignments', label: 'Assignments' },
    { key: 'availability', label: 'Availability' },
    { key: 'fullSchedule', label: 'Patient Schedule' },
    { key: 'ward', label: 'Ward Schedule' },
];

export default function SchedulerTester() {
    const [active, setActive] = useState('patients');

    return (
        <ScheduleProvider>
            <div className="p-4 space-y-4">
                <div className="flex gap-2 border-b">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActive(tab.key)}
                            className={`px-4 py-2 -mb-px border-b-2 ${active === tab.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div>
                    {active === 'patients' && <PatientList />}
                    {active === 'therapists' && <TherapistList />}
                    {active === 'assignments' && <AssignmentsView />}
                    {active === 'availability' && <AvailabilityGrid />}
                    {active === 'fullSchedule' && <FullSchedule />}
                    {active === 'ward' && <WardSchedule />}
                </div>
            </div>
        </ScheduleProvider>
    );
}


