import { sampleTherapists } from '../data/sampleTherapist';
import { DAYS, SLOTS, sampleTherapistTime } from '../data/sampleTherapistTime';

const roleColor = (role) => {
    switch (role) {
        case 'Acupuncture':
            return 'bg-orange-500';
        case 'Speech':
            return 'bg-red-500';
        case 'Music':
            return 'bg-yellow-400';
        case 'Physio':
            return 'bg-blue-500';
        case 'Occupational':
            return 'bg-green-500';
        default:
            return 'bg-gray-400';
    }
}

const timeByTherapist = Object.fromEntries(sampleTherapistTime.map(t => [t.therapistId, t]));

export default function AvailabilityGrid() {
    return (
        <div className="space-y-6">
            {sampleTherapists.map(t => {
                const role = t.therapyTypes;
                const times = timeByTherapist[t.id]?.availability || {};
                return (
                    <div key={t.id} className="border rounded">
                        <div className="px-3 py-2 font-medium flex items-center justify-between">
                            <span>{t.name} ({t.id}) — {role}</span>
                            <span className={`inline-block w-3 h-3 rounded ${roleColor(role)}`}></span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-t text-sm">
                                <thead>
                                    <tr>
                                        <th className="p-2 text-left w-28">Day</th>
                                        {SLOTS.map(s => (
                                            <th key={s} className="p-2 text-center w-20">{s}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {DAYS.map(day => (
                                        <tr key={day} className="border-t">
                                            <td className="p-2 font-medium">{day}</td>
                                            {SLOTS.map(s => {
                                                const isFree = (times[day] || []).includes(s);
                                                return (
                                                    <td key={s} className="p-1">
                                                        <div className={`h-6 rounded ${isFree ? roleColor(role) : 'bg-gray-200'}`}></div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


