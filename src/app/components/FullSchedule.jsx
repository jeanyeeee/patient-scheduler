import { samplePatients } from '../data/samplePatient';
import { sampleTherapists } from '../data/sampleTherapist';
import { samplePatientTherapistAssignments } from '../data/samplePatientTherapist';
import { DAYS, schedulePatients } from '../lib/schedulingEngine';
import { DAYS as DAYS_DATA, SLOTS, sampleTherapistTime } from '../data/sampleTherapistTime';

function mapAssignmentsByPatient(assignmentsArray) {
    const index = {};
    for (const row of assignmentsArray) index[row.patientId] = row;
    return index;
}

export default function FullSchedule() {
    const { patientSchedule } = schedulePatients({
        patients: samplePatients,
        therapists: sampleTherapists,
        assignmentsArray: samplePatientTherapistAssignments,
        therapistTime: sampleTherapistTime,
        DAYS_ORDER: DAYS_DATA,
        SLOTS,
        tryOtherDaysIfFull: true,
    });

    const asPlain = (pid) => patientSchedule.get(pid) || {};

    return (
        <div className="space-y-6">
            {samplePatients.map(p => (
                <div key={p.id} className="border rounded">
                    <div className="px-3 py-2 font-medium">{p.name} ({p.id})</div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-t text-sm">
                            <thead>
                                <tr>
                                    <th className="p-2 text-left w-28">Day</th>
                                    {SLOTS.map(s => (
                                        <th key={s} className="p-2 text-center w-24">{s}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {DAYS.map(day => (
                                    <tr key={day} className="border-t">
                                        <td className="p-2 font-medium">{day}</td>
                                        {SLOTS.map(s => {
                                            const cell = asPlain(p.id)?.[day]?.[s] || null;
                                            return (
                                                <td key={s} className="p-1">
                                                    <div className={`h-8 rounded flex items-center justify-center ${cell ? 'bg-blue-50 border border-blue-200' : 'bg-gray-100'}`}>
                                                        {cell ? `${cell.role} (${cell.therapistId})` : ''}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}