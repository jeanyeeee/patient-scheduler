import { sampleTherapists } from '../data/sampleTherapist';

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

export default function TherapistList() {
    return (
        <div className="grid md:grid-cols-2 gap-2">
            {sampleTherapists.map(t => (
                <div key={t.id} className={`p-3 border rounded ${roleColor(t.therapyTypes)}`}>
                    <div className="font-medium">{t.name} ({t.id})</div>
                    <div className="text-sm">Role: {t.therapyTypes}</div>
                </div>
            ))}
        </div>
    );
}


