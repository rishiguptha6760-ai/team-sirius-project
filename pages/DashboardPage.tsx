import React, { useState, useEffect, useMemo } from 'react';
import { Event, Registration, UserRole } from '../types';
import { generateEventDescription } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import { EditIcon, DeleteIcon, PlusIcon, UsersIcon, SparklesIcon, XIcon, RefreshIcon } from '../components/Icons';

// --- Reusable Modal Component ---
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};


// --- Event Form Component ---
const emptyEvent: Omit<Event, 'id' | 'organizerId' | 'clubName' | 'registrationStatus'> = { title: '', date: '', description: '', schedule: '', venue: '', rules: '', contact: '', maxRegistrations: undefined };
interface EventFormProps {
    eventToEdit: Event | null;
    onSave: (event: Omit<Event, 'id' | 'organizerId' | 'clubName' | 'registrationStatus'> | Event) => void;
    onClose: () => void;
}
const EventForm: React.FC<EventFormProps> = ({ eventToEdit, onSave, onClose }) => {
    const [eventData, setEventData] = useState(eventToEdit || emptyEvent);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setEventData(eventToEdit || emptyEvent);
    }, [eventToEdit]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setEventData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? (value === '' ? undefined : parseInt(value, 10)) : value
        }));
    };

    const handleGenerateDescription = async () => {
        if (!eventData.title) return alert("Please enter a title first.");
        setIsGenerating(true);
        const description = await generateEventDescription(eventData.title);
        setEventData(prev => ({ ...prev, description }));
        setIsGenerating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(eventData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                <input type="text" name="title" value={eventData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" value={eventData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
                    <input type="text" name="venue" value={eventData.venue} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                 <div>
                    <label htmlFor="maxRegistrations" className="block text-sm font-medium text-gray-700">Max Registrations</label>
                    <input type="number" name="maxRegistrations" min="1" value={eventData.maxRegistrations || ''} onChange={handleChange} placeholder="Optional limit" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={eventData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="mt-2 flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-800 disabled:text-gray-400">
                    <SparklesIcon className="w-4 h-4" />
                    <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
                </button>
            </div>
            <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Schedule</label>
                <textarea name="schedule" placeholder="e.g., 10:00 AM - Event 1..." value={eventData.schedule} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
                <label htmlFor="rules" className="block text-sm font-medium text-gray-700">Rules</label>
                <textarea name="rules" value={eventData.rules} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Info</label>
                <input type="text" name="contact" value={eventData.contact} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
             <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Event</button>
            </div>
        </form>
    );
};

// --- Registrations Viewer ---
interface RegistrationsViewerProps {
    registrations: Registration[];
}
const RegistrationsViewer: React.FC<RegistrationsViewerProps> = ({ registrations }) => {
    const exportToCSV = () => {
        if(registrations.length === 0) return;
        const headers = "Name,Email,College,ReferenceID,Screenshot\n";
        const csvContent = registrations.map(r => `"${r.name}","${r.email}","${r.college}","${r.referenceId}","${r.paymentScreenshot}"`).join("\n");
        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "registrations.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div>
            {registrations.length > 0 ? (
                <>
                    <button onClick={exportToCSV} className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm">Export to CSV</button>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-left py-2 px-3">Name</th>
                                    <th className="text-left py-2 px-3">Email</th>
                                    <th className="text-left py-2 px-3">College</th>
                                    <th className="text-left py-2 px-3">Reference ID</th>
                                    <th className="text-left py-2 px-3">Screenshot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map(reg => (
                                    <tr key={reg.id} className="border-t">
                                        <td className="py-2 px-3">{reg.name}</td>
                                        <td className="py-2 px-3">{reg.email}</td>
                                        <td className="py-2 px-3">{reg.college}</td>
                                        <td className="py-2 px-3 font-mono text-xs">{reg.referenceId}</td>
                                        <td className="py-2 px-3 text-sm text-blue-600 hover:underline">{reg.paymentScreenshot}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p className="text-gray-600">No registrations for this event yet.</p>
            )}
        </div>
    );
};

// --- Admin Panel ---
interface OrganizerProfile {
    id: string;
    club_name: string;
    email: string;
}

interface AdminPanelProps { onShowNotification: (message: string) => void; }

const AdminPanel: React.FC<AdminPanelProps> = ({ onShowNotification }) => {
    const [organizers, setOrganizers] = useState<OrganizerProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingOrganizer, setEditingOrganizer] = useState<OrganizerProfile | null>(null);

    const [createOrganizerForm, setCreateOrganizerForm] = useState({ club_name: '', email: '', password: '' });
    const [editOrganizerForm, setEditOrganizerForm] = useState({ club_name: '' });

    const fetchOrganizers = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('organizer_profiles').select('*');

        if (error) {
            console.error("Error fetching organizers:", error);
            setError(`Could not fetch organizers: ${error.message}. Ensure you have created the table and RLS policies in Supabase.`);
        } else {
            setOrganizers(data as OrganizerProfile[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrganizers();
    }, []);

    const handleCreateOrganizer = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!createOrganizerForm.club_name || !createOrganizerForm.email || !createOrganizerForm.password) {
             setError("All fields are required.");
             return;
        }

        // Step 1: Create the authentication user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: createOrganizerForm.email,
            password: createOrganizerForm.password,
            options: {
                data: {
                    role: 'ORGANIZER',
                    club_name: createOrganizerForm.club_name.trim(),
                }
            }
        });

        if (authError) {
            setError(`Failed to create user login: ${authError.message}`);
            return;
        }
        
        // Step 2: If auth user is created, create their profile in the database
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('organizer_profiles')
                .insert({
                    id: authData.user.id, // Link to the auth user's ID
                    club_name: createOrganizerForm.club_name.trim(),
                    email: createOrganizerForm.email
                });

            if (profileError) {
                // This is a critical state. The auth user exists but the profile failed.
                // A production app would need a cleanup function. Here, we inform the admin.
                setError(`User login was created, but profile failed: ${profileError.message}. Please delete this user from the 'Authentication' tab in Supabase and try again.`);
            } else {
                onShowNotification(`Organizer "${createOrganizerForm.club_name}" created successfully.`);
                setCreateOrganizerForm({ club_name: '', email: '', password: '' });
                await fetchOrganizers(); // Refresh the list from the database
            }
        }
    };
    
    const handleDeleteOrganizer = async (organizer: OrganizerProfile) => {
        if (window.confirm(`Are you sure you want to delete the organizer "${organizer.club_name}"? This will delete their profile. Note: For full cleanup, you must also delete their login from the Supabase Authentication section.`)) {
             // Deleting the profile. The auth user must be deleted separately in the Supabase dashboard.
            const { error: deleteError } = await supabase.from('organizer_profiles').delete().eq('id', organizer.id);
            if (deleteError) {
                setError(`Failed to delete organizer profile: ${deleteError.message}`);
                onShowNotification(`Error: ${deleteError.message}`);
            } else {
                setOrganizers(prev => prev.filter(o => o.id !== organizer.id));
                onShowNotification("Organizer profile deleted successfully.");
            }
        }
    };
    
    const openEditModal = (organizer: OrganizerProfile) => {
        setEditingOrganizer(organizer);
        setEditOrganizerForm({ club_name: organizer.club_name });
        setEditModalOpen(true);
        setError(null);
    };

    const handleUpdateOrganizer = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!editingOrganizer) return;

        // NOTE: A secure app would use an Edge Function to update both auth metadata and profile table in a single transaction.
        const { data, error: updateError } = await supabase
            .from('organizer_profiles')
            .update({ club_name: editOrganizerForm.club_name })
            .eq('id', editingOrganizer.id)
            .select();

        if (updateError) {
            if (updateError.code === '23505') { // unique constraint violation
                setError("This club name is already taken.");
            } else {
                setError(`Failed to update organizer: ${updateError.message}`);
            }
        } else if (data) {
            // Also update the user's metadata in auth system
            const { error: metaError } = await supabase.auth.updateUser({
                data: { club_name: editOrganizerForm.club_name }
            })
            if (metaError) {
                 onShowNotification("Profile updated, but failed to update auth metadata. User may need to log out and back in.");
            } else {
                 onShowNotification("Organizer updated successfully.");
            }
            
            setOrganizers(prev => prev.map(o => (o.id === editingOrganizer.id ? data[0] : o)));
            setEditModalOpen(false);
            setEditingOrganizer(null);
        }
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Organizer Management */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-700">Organizers</h3>
                    <form onSubmit={handleCreateOrganizer} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                         <h4 className="font-medium">Create New Organizer</h4>
                         {error && <p className="text-sm text-red-600 p-2 bg-red-50 rounded">{error}</p>}
                         <div>
                            <input type="text" placeholder="Club Name" value={createOrganizerForm.club_name} onChange={e => setCreateOrganizerForm({...createOrganizerForm, club_name: e.target.value})} required className="mt-1 block w-full input"/>
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                             <input type="email" placeholder="Email Address" value={createOrganizerForm.email} onChange={e => setCreateOrganizerForm({...createOrganizerForm, email: e.target.value})} required className="mt-1 block w-full input"/>
                             <input type="password" placeholder="Set Initial Password" value={createOrganizerForm.password} onChange={e => setCreateOrganizerForm({...createOrganizerForm, password: e.target.value})} required className="mt-1 block w-full input"/>
                         </div>
                         <button type="submit" className="w-full btn-primary">Create Organizer</button>
                    </form>
                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <h4 className="font-medium">Existing Organizers</h4>
                            <button onClick={fetchOrganizers} className="p-1 text-gray-500 hover:text-blue-600" disabled={loading}><RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}/></button>
                         </div>
                         {loading ? <p>Loading organizers...</p> : organizers.map(org => (
                             <div key={org.id} className="flex justify-between items-center p-2 border rounded-md">
                                 <div>
                                     <p className="font-semibold">{org.club_name}</p>
                                     <p className="text-sm text-gray-500">{org.email}</p>
                                 </div>
                                 <div className="flex space-x-2">
                                     <button onClick={() => openEditModal(org)} className="p-1 text-gray-500 hover:text-green-600"><EditIcon className="w-5 h-5"/></button>
                                     <button onClick={() => handleDeleteOrganizer(org)} className="p-1 text-gray-500 hover:text-red-600"><DeleteIcon className="w-5 h-5"/></button>
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>

                {/* Admin Management Info */}
                <div className="space-y-6">
                     <h3 className="text-xl font-semibold text-gray-700">Important Note</h3>
                     <div className="text-sm text-yellow-800 bg-yellow-50 p-4 rounded-lg space-y-2">
                        <p><strong>This panel now creates both a login and a profile.</strong></p>
                        <p>For this system to work smoothly, you must disable 'Enable email confirmations' in your Supabase project's Authentication settings.</p>
                        <p>Deleting a profile here does not automatically delete the user's login account. This must be done from the Authentication section of your Supabase dashboard to fully remove the user.</p>
                    </div>
                </div>
            </div>

            {/* Edit Organizer Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit Organizer: ${editingOrganizer?.club_name}`}>
                <form onSubmit={handleUpdateOrganizer} className="space-y-4">
                     {error && <p className="text-sm text-red-600">{error}</p>}
                     <div>
                        <label className="block text-sm font-medium">Club Name</label>
                        <input type="text" value={editOrganizerForm.club_name} onChange={e => setEditOrganizerForm({...editOrganizerForm, club_name: e.target.value})} required className="mt-1 block w-full input"/>
                     </div>
                     <div>
                        <label className="block text-sm font-medium">Update Password (Not available)</label>
                        <input type="password" placeholder="Password cannot be changed from here" disabled className="mt-1 block w-full input bg-gray-100 cursor-not-allowed"/>
                         <p className="text-xs text-gray-500 mt-1">For security, use the 'Forgot Password' link on the login page or change it directly in Supabase.</p>
                     </div>
                      <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={() => setEditModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Save Changes</button>
                    </div>
                </form>
            </Modal>

            <style>{`
                .input {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.375rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                .btn-primary {
                    padding: 0.5rem 1rem;
                    background-color: #2563EB;
                    color: white;
                    border-radius: 0.375rem;
                    font-weight: 500;
                }
                .btn-primary:hover { background-color: #1D4ED8; }
                .btn-secondary {
                    padding: 0.5rem 1rem;
                    background-color: #E5E7EB;
                    color: #1F2937;
                    border-radius: 0.375rem;
                    font-weight: 500;
                }
                 .btn-secondary:hover { background-color: #D1D5DB; }
            `}</style>
        </div>
    );
};


// --- Main Dashboard Page Component ---
interface DashboardPageProps {
    events: Event[];
    getRegistrations: (eventId: string) => Registration[];
    onAddEvent: (event: Omit<Event, 'id' | 'organizerId' | 'clubName' | 'registrationStatus'>) => void;
    onUpdateEvent: (event: Event) => void;
    onDeleteEvent: (eventId: string) => void;
    userRole: UserRole;
    userId: string | null;
    onShowNotification: (message: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
    const { events, getRegistrations, onAddEvent, onUpdateEvent, onDeleteEvent, userRole, userId, onShowNotification } = props;
    
    const [isFormOpen, setFormOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

    const [isRegistrationsOpen, setRegistrationsOpen] = useState(false);
    const [selectedEventRegistrations, setSelectedEventRegistrations] = useState<Registration[]>([]);
    const [selectedEventTitle, setSelectedEventTitle] = useState('');

    const [activeTab, setActiveTab] = useState<'my_events' | 'all_events'>('my_events');

    const handleOpenForm = (event?: Event) => {
        setEventToEdit(event || null);
        setFormOpen(true);
    };

    const handleSaveEvent = (eventData: Omit<Event, 'id' | 'organizerId' | 'clubName' | 'registrationStatus'> | Event) => {
        if ('id' in eventData) {
            const currentRegs = getRegistrations(eventData.id).length;
            const newLimit = (eventData as Event).maxRegistrations;
            if (newLimit != null && newLimit < currentRegs) {
                onShowNotification("Error: Limit cannot be lower than current registrations.");
                return;
            }
            onUpdateEvent(eventData as Event);
        } else {
            onAddEvent(eventData);
        }
    };
    
    const handleViewRegistrations = (event: Event) => {
        setSelectedEventRegistrations(getRegistrations(event.id));
        setSelectedEventTitle(event.title);
        setRegistrationsOpen(true);
    };
    
    const handleStatusChange = (event: Event, newStatus: Event['registrationStatus']) => {
        const confirmationMessage: Record<Event['registrationStatus'], string> = {
            'OPEN': "Are you sure you want to re-open registrations?",
            'PAUSED': "Are you sure you want to pause registrations?",
            'CLOSED': "Are you sure you want to permanently close registrations? This action cannot be undone."
        }
        if (window.confirm(confirmationMessage[newStatus])) {
            onUpdateEvent({ ...event, registrationStatus: newStatus });
            onShowNotification(`Event registrations ${newStatus.toLowerCase()}.`);
        }
    };

    const myClubEvents = useMemo(() => 
        events.filter(e => e.organizerId === userId).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events, userId]);

    const allOtherEvents = useMemo(() =>
        events.filter(e => e.organizerId !== userId).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events, userId]);

     const groupedEventsByClub = useMemo(() => {
        return events.reduce((acc, event) => {
            const { clubName } = event;
            if (!acc[clubName]) acc[clubName] = [];
            acc[clubName].push(event);
            return acc;
        }, {} as Record<string, Event[]>);
    }, [events]);

    const renderStatus = (status: Event['registrationStatus']) => {
        const styles: Record<Event['registrationStatus'], string> = {
            OPEN: "bg-green-100 text-green-800",
            PAUSED: "bg-yellow-100 text-yellow-800",
            CLOSED: "bg-red-100 text-red-800"
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>
    }

    const renderEventRow = (event: Event, canEdit: boolean) => (
         <tr key={event.id} className="border-t hover:bg-gray-50">
            <td className="py-3 px-4">
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm text-gray-500">{event.clubName}</div>
            </td>
            <td className="py-3 px-4">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</td>
            <td className="py-3 px-4 font-medium">{getRegistrations(event.id).length} / {event.maxRegistrations || '∞'}</td>
            <td className="py-3 px-4">{renderStatus(event.registrationStatus)}</td>
            <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                    <button onClick={() => handleViewRegistrations(event)} className="text-sm text-blue-600 hover:underline">View Regs</button>
                    {canEdit && (
                        <>
                        <button onClick={() => handleOpenForm(event)} title="Edit Event" className="text-gray-500 hover:text-green-600"><EditIcon className="w-5 h-5"/></button>
                        {event.registrationStatus !== 'CLOSED' && (
                             <div className="flex items-center space-x-2">
                                {event.registrationStatus === 'OPEN' && <button onClick={() => handleStatusChange(event, 'PAUSED')} className="text-sm font-medium text-yellow-600 hover:text-yellow-800">Pause</button>}
                                {event.registrationStatus === 'PAUSED' && <button onClick={() => handleStatusChange(event, 'OPEN')} className="text-sm font-medium text-green-600 hover:text-green-800">Resume</button>}
                                <button onClick={() => handleStatusChange(event, 'CLOSED')} className="text-sm font-medium text-red-600 hover:text-red-800">Close</button>
                             </div>
                        )}
                        <button onClick={() => window.confirm('Are you sure you want to delete this event?') && onDeleteEvent(event.id)} title="Delete Event" className="text-gray-500 hover:text-red-600"><DeleteIcon className="w-5 h-5"/></button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
    
   const tableHeaders = ["Event", "Date", "Registrations", "Status", "Actions"];

return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-black">Dashboard</h1>
            {userRole !== 'ADMIN' && (
            <button 
                onClick={() => handleOpenForm()} 
                className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
                <PlusIcon className="w-5 h-5" />
                <span>Create Event</span>
            </button>
            )}
        </div>

        {/* Tabs for Organizer */}
        {userRole === 'ORGANIZER' && (
            <div className="mb-6 border-b">
                <nav className="-mb-px flex space-x-6">
                    <button 
                        className={`py-3 px-1 font-medium text-lg ${
                            activeTab === 'my_events' 
                                ? 'border-b-2 border-blue-500 text-blue-600' 
                                : 'text-black hover:text-gray-800'
                        }`} 
                        onClick={() => setActiveTab('my_events')}
                    >
                        My Club's Events
                    </button>
                    <button 
                        className={`py-3 px-1 font-medium text-lg ${
                            activeTab === 'all_events' 
                                ? 'border-b-2 border-blue-500 text-blue-600' 
                                : 'text-black hover:text-gray-800'
                        }`} 
                        onClick={() => setActiveTab('all_events')}
                    >
                        All Campus Events
                    </button>
                </nav>
            </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-md text-black">
            {/* Admin View */}
            {userRole === 'ADMIN' && (
                <div className="space-y-8">
                    {Object.entries(groupedEventsByClub).map(([clubName, clubEvents]) => (
                        <div key={clubName}>
                            <h3 className="text-2xl font-semibold mb-4 text-black">{clubName}</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white text-black">
                                    <thead>
                                        <tr>
                                            {tableHeaders.map(h => (
                                                <th 
                                                    key={h} 
                                                    className="text-left py-2 px-4 bg-gray-100 font-semibold text-sm text-black"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clubEvents
                                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                            .map(event => renderEventRow(event, true))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Organizer View */}
            {userRole === 'ORGANIZER' && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white text-black">
                        <thead>
                            <tr>
                                {tableHeaders.map(h => (
                                    <th 
                                        key={h} 
                                        className="text-left py-2 px-4 bg-gray-100 font-semibold text-sm text-black"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activeTab === 'my_events' && myClubEvents.map(event => renderEventRow(event, true))}
                            {activeTab === 'all_events' && allOtherEvents.map(event => renderEventRow(event, false))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {userRole === 'ADMIN' && <AdminPanel onShowNotification={onShowNotification} />}

        {/* Modals */}
        <Modal 
            isOpen={isFormOpen} 
            onClose={() => setFormOpen(false)} 
            title={eventToEdit ? 'Edit Event' : 'Create New Event'}
        >
            <EventForm 
                eventToEdit={eventToEdit} 
                onSave={handleSaveEvent} 
                onClose={() => setFormOpen(false)} 
            />
        </Modal>

        <Modal 
            isOpen={isRegistrationsOpen} 
            onClose={() => setRegistrationsOpen(false)} 
            title={`Registrations for ${selectedEventTitle}`}
        >
            <RegistrationsViewer registrations={selectedEventRegistrations} />
        </Modal>
    </div>
);
};

export default DashboardPage;
