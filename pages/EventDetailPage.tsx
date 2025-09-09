import React, { useState } from 'react';
import { Event, Registration } from '../types';
import { CalendarIcon, LocationIcon, ShareIcon } from '../components/Icons';

// --- Reusable Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// --- Confirmation Ticket Component ---
interface ConfirmationTicketProps {
  registration: Omit<Registration, 'id' | 'userEmail' | 'detailsEdited'>;
  event: Event;
  onClose: () => void;
}
const ConfirmationTicket: React.FC<ConfirmationTicketProps> = ({ registration, event, onClose }) => {
  return (
    <div className="p-6">
        <div className="text-center border-b-2 border-dashed pb-4">
            <h2 className="text-2xl font-bold text-green-600">Registration Confirmed!</h2>
            <p className="text-gray-600">Thank you for registering. Here is your ticket.</p>
        </div>
        <div className="py-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
            <p><strong className="font-medium text-gray-700">Name:</strong> {registration.name}</p>
            <p><strong className="font-medium text-gray-700">Email:</strong> {registration.email}</p>
            <p><strong className="font-medium text-gray-700">College:</strong> {registration.college}</p>
            <p><strong className="font-medium text-gray-700">Reference ID:</strong> {registration.referenceId}</p>
            <div className="flex items-center text-gray-600 mt-2"><CalendarIcon className="w-5 h-5 mr-2"/>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</div>
            <div className="flex items-center text-gray-600"><LocationIcon className="w-5 h-5 mr-2"/>{event.venue}</div>
        </div>
        <button 
            onClick={onClose} 
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
            Close
        </button>
    </div>
  );
};

// --- Share Modal ---
const ShareModal: React.FC<{ event: Event; onClose: () => void }> = ({ event, onClose }) => {
    const canShare = 'share' in navigator;

    const handleShare = async () => {
        if (!canShare) return;
        try {
            await navigator.share({
                title: event.title,
                text: `Check out this great event: ${event.title}!`,
                url: window.location.href
            });
        } catch (error) {
            console.error("Sharing failed:", error);
            alert("Couldn't share the event. You can still copy the link from your browser's address bar.");
        }
    };

    return (
        <div className="p-0">
            <div className="bg-blue-600 text-white p-6 rounded-t-lg relative">
                <img src={`https://picsum.photos/seed/${event.id}/500/200`} alt={`${event.title} banner`} className="w-full h-32 object-cover rounded-md mb-4" />
                <h2 className="text-2xl font-bold">{event.title}</h2>
                <p className="text-blue-200">Hosted by {event.clubName}</p>
            </div>
            <div className="p-6 space-y-4">
                 <div className="flex items-center text-gray-700"><CalendarIcon className="w-5 h-5 mr-3 text-blue-500"/>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</div>
                <div className="flex items-center text-gray-700"><LocationIcon className="w-5 h-5 mr-3 text-blue-500"/>{event.venue}</div>
                <p className="text-gray-600 pt-2">{event.description}</p>

                <div className="pt-4 flex flex-col space-y-3">
                    {canShare ? (
                         <button onClick={handleShare} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                            <ShareIcon className="w-5 h-5"/>
                            <span>Share Event</span>
                        </button>
                    ) : (
                         <p className="text-sm text-center text-gray-500 p-2 bg-gray-100 rounded-md">
                            To share, please copy the event link from your browser's address bar.
                        </p>
                    )}
                    <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Event Detail Page ---
interface EventDetailPageProps {
  event: Event;
  onRegister: (registration: Omit<Registration, 'id' | 'userEmail' | 'detailsEdited'>) => void;
  onBack: () => void;
  isRegistrationDisabled?: boolean;
  currentRegistrationCount: number;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onRegister, onBack, isRegistrationDisabled = false, currentRegistrationCount }) => {
  const [formData, setFormData] = useState({ name: '', email: '', college: '', referenceId: '', paymentScreenshot: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // For this prototype, we'll just store the file name.
      // A real app would upload the file to a service like Supabase Storage.
      setFormData(prev => ({ ...prev, paymentScreenshot: e.target.files![0].name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.college) {
      onRegister({ ...formData, eventId: event.id });
      setShowConfirmation(true);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setFormData({ name: '', email: '', college: '', referenceId: '', paymentScreenshot: '' });
  };
  
  const isFull = event.maxRegistrations != null && currentRegistrationCount >= event.maxRegistrations;

  const getRegistrationComponent = () => {
    if (isRegistrationDisabled) {
      return <div className="text-center bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm"><p>Registration is available for participants only.</p></div>;
    }
    if (event.registrationStatus === 'CLOSED') {
      return <div className="text-center bg-red-100 text-red-800 p-3 rounded-md text-sm"><p>Registrations for this event are permanently closed.</p></div>;
    }
    if (event.registrationStatus === 'PAUSED') {
       return <div className="text-center bg-blue-100 text-blue-800 p-3 rounded-md text-sm"><p>Registrations are temporarily paused. Please check back later.</p></div>;
    }
    if (isFull) {
        return <div className="text-center bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm"><p>This event is now full. No more registrations can be accepted.</p></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-700">College Name</label>
            <input type="text" id="college" name="college" value={formData.college} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
           <div>
            <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700">Payment Reference ID</label>
            <input type="text" id="referenceId" name="referenceId" value={formData.referenceId} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="paymentScreenshot" className="block text-sm font-medium text-gray-700">Payment Screenshot</label>
            <input type="file" id="paymentScreenshot" name="paymentScreenshot" onChange={handleFileChange} required accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">Register</button>
        </form>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-blue-600 hover:underline">&larr; Back to Events</button>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{event.title}</h1>
                <p className="text-md text-gray-500 mb-4">Hosted by <span className="font-semibold">{event.clubName}</span></p>
            </div>
            <button onClick={() => setShowShareModal(true)} className="flex items-center space-x-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition-colors">
                <ShareIcon className="w-4 h-4" />
                <span>Share</span>
            </button>
          </div>

          <div className="flex items-center space-x-6 mb-6 text-gray-600">
            <span className="flex items-center"><CalendarIcon className="w-5 h-5 mr-2"/> {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
            <span className="flex items-center"><LocationIcon className="w-5 h-5 mr-2"/> {event.venue}</span>
          </div>
          <p className="text-lg text-gray-700 mb-6">{event.description}</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold border-b pb-2 mb-3">Schedule</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{event.schedule}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold border-b pb-2 mb-3">Rules & Regulations</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{event.rules}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold border-b pb-2 mb-3">Contact</h3>
              <p className="text-gray-600">{event.contact}</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-2xl font-bold text-center mb-4">Register Now</h2>
            {getRegistrationComponent()}
          </div>
        </div>
      </div>
      
      <Modal isOpen={showConfirmation} onClose={closeConfirmation}>
        <ConfirmationTicket 
            registration={{...formData, eventId: event.id}} 
            event={event} 
            onClose={closeConfirmation}
        />
      </Modal>

      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)}>
        <ShareModal event={event} onClose={() => setShowShareModal(false)} />
      </Modal>
    </div>
  );
};

export default EventDetailPage;