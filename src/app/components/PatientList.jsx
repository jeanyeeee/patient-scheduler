import { samplePatients } from '../data/samplePatient';

export default function PatientList() {
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
    return (
        <div className="space-y-2">
            {samplePatients.map(p => (
                <div key={p.id} className="p-3 border rounded">
                    <div className="font-medium">{p.name} ({p.id})</div>
                    <div className="text-sm grid grid-cols-1 gap-1">
                        <div className={`p-1 border rounded ${roleColor('Music')}`}>Music/Art: {p.musicArtGoal}</div>
                        <div className={`p-1 border rounded ${roleColor('Speech')}`}>Speech: {p.speechGoal}</div>
                        <div className={`p-1 border rounded ${roleColor('Acupuncture')}`}>Acupuncture: {p.acupunctureGoal}</div>
                        <div className={`p-1 border rounded ${roleColor('Occupational')}`}>Occupational: {p.occupationalGoal}</div>
                        <div className={`p-1 border rounded ${roleColor('Physio')}`}>Physio: {p.physioGoal}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}


