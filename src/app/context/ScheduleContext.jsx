'use client'

import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { schedulePatients } from '../lib/schedulingEngine';
import { samplePatients } from '../data/samplePatient';
import { sampleTherapists } from '../data/sampleTherapist';
import { samplePatientTherapistAssignments } from '../data/samplePatientTherapist';
import { DAYS, SLOTS, sampleTherapistTime } from '../data/sampleTherapistTime';

const ScheduleContext = createContext(null);

export function ScheduleProvider({ children }) {
    const [patientSchedule, setPatientSchedule] = useState(new Map());
    const [therapistSchedule, setTherapistSchedule] = useState(new Map());
    const [unscheduled, setUnscheduled] = useState([]);
    const [generatedAt, setGeneratedAt] = useState(null);

    const generateSchedule = useCallback(() => {
        const { patientSchedule, therapistSchedule, unscheduled } = schedulePatients({
            patients: samplePatients,
            therapists: sampleTherapists,
            assignmentsArray: samplePatientTherapistAssignments,
            therapistTime: sampleTherapistTime,
            DAYS_ORDER: DAYS,
            SLOTS,
            tryOtherDaysIfFull: true,
        });
        setPatientSchedule(patientSchedule);
        setTherapistSchedule(therapistSchedule);
        setUnscheduled(unscheduled);
        setGeneratedAt(Date.now());
    }, []);

    const clearSchedule = useCallback(() => {
        setPatientSchedule(new Map());
        setTherapistSchedule(new Map());
        setUnscheduled([]);
        setGeneratedAt(null);
    }, []);

    const value = useMemo(() => ({
        patientSchedule,
        therapistSchedule,
        unscheduled,
        generatedAt,
        generateSchedule,
        clearSchedule,
    }), [patientSchedule, therapistSchedule, unscheduled, generatedAt, generateSchedule, clearSchedule]);

    return (
        <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>
    );
}

export function useSchedule() {
    const ctx = useContext(ScheduleContext);
    if (!ctx) throw new Error('useSchedule must be used within a ScheduleProvider');
    return ctx;
}


