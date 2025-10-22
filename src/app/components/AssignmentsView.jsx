import { samplePatients } from '../data/samplePatient';
import { sampleTherapists } from '../data/sampleTherapist';
import { samplePatientTherapistAssignments } from '../data/samplePatientTherapist';

const therapistById = Object.fromEntries(sampleTherapists.map(t => [t.id, t]));
const roleColor = (role) => {
    switch (role) {
        case 'Acupuncture':
            return 'text-orange-700';
        case 'Speech':
            return 'text-red-700';
        case 'Music':
            return 'text-yellow-700';
        case 'Physio':
            return 'text-blue-700';
        case 'Occupational':
            return 'text-green-700';
        default:
            return 'text-gray-700';
    }
}

export default function AssignmentsView() {
    return (
        <div className="space-y-3">
            {samplePatients.map(p => {
                const mapping = samplePatientTherapistAssignments.find(x => x.patientId === p.id);
                return (
                    <div key={p.id} className="p-3 border rounded">
                        <div className="font-medium">{p.name} ({p.id})</div>
                        <div className="grid md:grid-cols-2 gap-x-4 text-sm mt-1">
                            {['musicArtID', 'speechID', 'acupunctureID', 'occupationalID', 'physioID'].map(key => {
                                const tid = mapping?.[key] || null;
                                const t = tid ? therapistById[tid] : null;
                                const role = t?.therapyTypes || key.replace('ID', '');
                                return (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className="w-32 capitalize">{key.replace('ID', '')}</span>
                                        <span className={`truncate ${roleColor(t?.therapyTypes)}`}>
                                            {t ? `${t.name} (${t.id})` : '— Unassigned —'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


