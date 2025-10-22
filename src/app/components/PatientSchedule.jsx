import { samplePatients } from '../data/samplePatient';
import { DAYS } from '../lib/schedulingEngine';
import { SLOTS } from '../data/sampleTherapistTime';
import { useSchedule } from '../context/ScheduleContext';

function mapAssignmentsByPatient(assignmentsArray) {
    const index = {};
    for (const row of assignmentsArray) index[row.patientId] = row;
    return index;
}
const roleColor = (role) => {
    switch (role) {
        case 'Acupuncture':
            return 'bg-orange-100 text-orange-800 border-orange-300';
        case 'Speech':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'Music':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Physio':
            return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Occupational':
            return 'bg-green-100 text-green-800 border-green-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}

export default function PatientSchedule() {
    const { patientSchedule, generateSchedule, clearSchedule, generatedAt } = useSchedule();

    const asPlain = (pid) => patientSchedule.get(pid) || {};

    return (
        <div>
            <div className="flex gap-2 mb-3">
                <button type="button" className="px-3 py-1 border rounded" onClick={generateSchedule}>Get Assignment</button>
                <button type="button" className="px-3 py-1 border rounded" onClick={clearSchedule}>Clear</button>
                {generatedAt && <span className="text-xs text-gray-500 self-center">Generated: {new Date(generatedAt).toLocaleTimeString()}</span>}
            </div>
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
                                                        <div className={`h-8 rounded flex items-center justify-center ${cell ? roleColor(cell.role) : 'bg-gray-100'}`}>
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
        </div>
    );
}