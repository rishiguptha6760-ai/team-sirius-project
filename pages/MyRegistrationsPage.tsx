import React, { useState, useMemo } from 'react';
import { Registration, Event } from '../types';
import { CalendarIcon, EditIcon, LocationIcon, XIcon } from '../components/Icons';

// --- Reusable Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- Edit Registration Form ---
interface EditRegistrationFormProps {
    registration: Registration;
    onSave: (updatedRegistration: Registration) => void;
    onClose: () => void;
}

const EditRegistrationForm: React.FC<EditRegistrationFormProps> = ({ registration, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: registration.name,
        college: registration.college,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...registration,
            ...formData,
            detailsEdited: true, // Mark as edited
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <label htmlFor="college" className="block text-sm font-medium text-gray-700">College Name</label>
                <input type="text" name="college" value={formData.college} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
             <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
            </div>
        </form>
    );
}


// --- Main Page Component ---
interface MyRegistrationsPageProps {
    registrations: Registration[];
    events: Event[];
    userEmail: string;
    onUpdateRegistration: (registration: Registration) => void;
}

const MyRegistrationsPage: React.FC<MyRegistrationsPageProps> = ({ registrations, events, userEmail, onUpdateRegistration }) => {

    const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);

    const myRegistrations = useMemo(() => {
        return registrations.filter(r => r.userEmail === userEmail);
    }, [registrations, userEmail]);
    
    const eventsById = useMemo(() => {
        return events.reduce((acc, event) => {
            acc[event.id] = event;
            return acc;
        }, {} as Record<string, Event>);
    }, [events]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">My Registered Events</h1>
                <p className="text-lg text-gray-600 mt-2">Here's a list of all the events you've signed up for.</p>
            </div>

            {myRegistrations.length > 0 ? (
                <div className="space-y-6">
                    {myRegistrations.map(reg => {
                        const event = eventsById[reg.eventId];
                        if (!event) return null;

                        return (
                            <div key={reg.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
                                    <p className="text-sm text-gray-500 mb-3">Hosted by {event.clubName}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-gray-600 mb-4">
                                        <span className="flex items-center"><CalendarIcon className="w-5 h-5 mr-2"/> {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</span>
                                        <span className="flex items-center"><LocationIcon className="w-5 h-5 mr-2"/> {event.venue}</span>
                                    </div>
                                    <div className="mt-2 text-sm bg-gray-50 p-3 rounded-md border">
                                        <p><strong>Your Name:</strong> {reg.name}</p>
                                        <p><strong>Your College:</strong> {reg.college}</p>
                                        <p><strong>Reference ID:</strong> {reg.referenceId}</p>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                                    <button
                                        onClick={() => setEditingRegistration(reg)}
                                        disabled={reg.detailsEdited}
                                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 bg-green-100 text-green-800 hover:bg-green-200"
                                    >
                                        <EditIcon className="w-4 h-4"/>
                                        <span>{reg.detailsEdited ? 'Details Edited' : 'Edit Details'}</span>
                                    </button>
                                     {reg.detailsEdited && <p className="text-xs text-gray-500 mt-1 text-center">One-time edit used.</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700">No Registrations Yet</h2>
                    <p className="text-gray-500 mt-2">You haven't registered for any events. Go find one!</p>
                </div>
            )}
            
            {editingRegistration && (
                <Modal 
                    isOpen={!!editingRegistration} 
                    onClose={() => setEditingRegistration(null)}
                    title="Edit Your Registration Details"
                >
                    <p className="text-sm text-yellow-800 bg-yellow-50 p-3 rounded-md mb-4">
                        Please note: You can only edit your details once per registration. Make sure they are correct before saving.
                    </p>
                    <EditRegistrationForm
                        registration={editingRegistration}
                        onSave={onUpdateRegistration}
                        onClose={() => setEditingRegistration(null)}
                    />
                </Modal>
            )}

        </div>
    );
};

export default MyRegistrationsPage;
