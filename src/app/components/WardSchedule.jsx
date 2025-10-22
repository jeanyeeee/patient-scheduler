import { useState } from 'react';
import { samplePatients } from '../data/samplePatient';
import { DAYS } from '../lib/schedulingEngine';
import { SLOTS } from '../data/sampleTherapistTime';
import { useSchedule } from '../context/ScheduleContext';

export default function WardSchedule() {
    const [activeDay, setActiveDay] = useState(DAYS[0]);
    const { patientSchedule, generateSchedule, clearSchedule, generatedAt } = useSchedule();

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

    const renderCell = (patientId, day, slot) => {
        const cell = patientSchedule.get(patientId)?.[day]?.[slot] || null;
        return (
            <div className={`h-8 rounded text-xs flex items-center justify-center ${cell ? roleColor(cell.role) : 'bg-gray-100'}`}>
                {cell ? `${cell.role} (${cell.therapistId})` : ''}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 border-b">
                {DAYS.map(d => (
                    <button
                        key={d}
                        onClick={() => setActiveDay(d)}
                        className={`px-4 py-2 -mb-px border-b-2 ${activeDay === d ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600'}`}
                    >
                        {d}
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                <button type="button" className="px-3 py-1 border rounded" onClick={generateSchedule}>Get Assignment</button>
                <button type="button" className="px-3 py-1 border rounded" onClick={clearSchedule}>Clear</button>
                {generatedAt && <span className="text-xs text-gray-500 self-center">Generated: {new Date(generatedAt).toLocaleTimeString()}</span>}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead>
                        <tr>
                            <th className="p-2 text-left w-32">Patient</th>
                            {SLOTS.map(s => (
                                <th key={s} className="p-2 text-center w-24">{s}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {samplePatients.map(p => (
                            <tr key={p.id} className="border-t">
                                <td className="p-2 font-medium">{p.name} ({p.id})</td>
                                {SLOTS.map(s => (
                                    <td key={s} className="p-1">
                                        {renderCell(p.id, activeDay, s)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


