import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Event, Registration, UserRole, ViewState } from './types';
import { INITIAL_EVENTS } from './constants';
import { getAIResponse } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import { SparklesIcon } from './components/Icons';

// --- Reusable Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b">
          {title && <h3 className="text-xl font-semibold text-gray-800">{title}</h3>}
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- AI Assistant Component ---
interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, events }) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: 'user' as 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const aiText = await getAIResponse(input, events);
    setMessages([...newMessages, { sender: 'ai' as 'ai', text: aiText }]);
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Event Assistant">
      <div className="flex flex-col h-[60vh]">
        <div className="flex-grow overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 max-w-sm bg-gray-200 text-gray-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about events..."
            className="flex-grow border rounded-l-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
          />
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 disabled:bg-blue-300" disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </Modal>
  );
};


// --- Main App Component ---
function App() {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [clubName, setClubName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [viewState, setViewState] = useState<ViewState>({ view: 'HOME' });
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setLoadingAuth(true);

    const handleSession = (session: Session | null) => {
        setSession(session);
        const metadata = session?.user?.user_metadata ?? {};
        
        setUserRole((metadata.role as UserRole) || null);
        setClubName(metadata.club_name || null);
        setUserId(session?.user?.id || null);
        setUserEmail(session?.user?.email || null);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ view: 'HOME' });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string) => {
    setNotification(message);
  };
  
  const navigate = (state: ViewState) => setViewState(state);

  const addEvent = useCallback((event: Omit<Event, 'id' | 'organizerId' | 'clubName' | 'registrationStatus'>) => {
    if (!userId || !clubName) {
      showNotification("Error: Could not identify the organizer.");
      return;
    }
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      organizerId: userId,
      clubName: clubName,
      registrationStatus: 'OPEN',
    };
    setEvents(prev => [...prev, newEvent]);
    showNotification("Event created successfully!");
  }, [userId, clubName]);

  const updateEvent = useCallback((updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    showNotification("Event updated successfully!");
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setRegistrations(prev => prev.filter(r => r.eventId !== eventId));
    showNotification("Event deleted successfully!");
  }, []);

  const addRegistration = useCallback((registration: Omit<Registration, 'id' | 'userEmail' | 'detailsEdited'>) => {
    if (!userEmail) {
      showNotification("Error: Could not identify the current user.");
      return;
    }
    setRegistrations(prev => [...prev, {
      ...registration,
      id: Date.now().toString(),
      userEmail: userEmail,
      detailsEdited: false,
    }]);
  }, [userEmail]);
  
  const updateRegistration = useCallback((updatedRegistration: Registration) => {
    setRegistrations(prev => prev.map(r => r.id === updatedRegistration.id ? updatedRegistration : r));
    showNotification("Registration details updated successfully!");
  }, []);


  const getEventById = useCallback((id: string) => events.find(e => e.id === id), [events]);
  const getRegistrationsByEventId = useCallback((eventId: string) => registrations.filter(r => r.eventId === eventId), [registrations]);

  const selectedEvent = useMemo(() => {
    if (viewState.view === 'DETAIL') {
      return getEventById(viewState.eventId);
    }
    return undefined;
  }, [viewState, getEventById]);
  
  if (loadingAuth) {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
            <div className="text-xl font-semibold text-gray-700">Loading EventEase...</div>
        </div>
    )
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-down">
          {notification}
        </div>
      )}

      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate({ view: 'HOME' })}>
            EventEase
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate({ view: 'HOME' })} className="text-gray-600 hover:text-blue-600">Home</button>
             {userRole === 'PARTICIPANT' && (
                <button onClick={() => navigate({ view: 'MY_REGISTRATIONS' })} className="text-gray-600 hover:text-blue-600">My Registrations</button>
            )}
            {(userRole === 'ORGANIZER' || userRole === 'ADMIN') && (
              <button onClick={() => navigate({ view: 'DASHBOARD' })} className="text-gray-600 hover:text-blue-600">Dashboard</button>
            )}
            <button
                onClick={() => setAssistantOpen(true)}
                className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
                <SparklesIcon className="w-5 h-5" />
                <span>AI Assistant</span>
            </button>
            <div className="flex items-center space-x-3">
               <span className="text-sm text-gray-500 capitalize">Role: <span className="font-semibold text-gray-800">{userRole?.toLowerCase()}</span></span>
               <button 
                 onClick={handleLogout}
                 className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
               >
                 Logout
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {viewState.view === 'HOME' && <HomePage events={events} onSelectEvent={(eventId) => navigate({ view: 'DETAIL', eventId })} />}
        {viewState.view === 'DETAIL' && selectedEvent && (
          <EventDetailPage 
            event={selectedEvent} 
            onRegister={addRegistration} 
            onBack={() => navigate({ view: 'HOME' })}
            isRegistrationDisabled={userRole !== 'PARTICIPANT'}
            currentRegistrationCount={getRegistrationsByEventId(selectedEvent.id).length}
          />
        )}
        {viewState.view === 'MY_REGISTRATIONS' && userRole === 'PARTICIPANT' && (
            <MyRegistrationsPage
                registrations={registrations}
                events={events}
                userEmail={userEmail!}
                onUpdateRegistration={updateRegistration}
            />
        )}
        {(userRole === 'ORGANIZER' || userRole === 'ADMIN') && viewState.view === 'DASHBOARD' && (
          <DashboardPage 
            events={events}
            getRegistrations={getRegistrationsByEventId}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
            userRole={userRole}
            userId={userId}
            onShowNotification={showNotification}
          />
        )}
         {(userRole === 'PARTICIPANT' && viewState.view === 'DASHBOARD') && (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-2 text-gray-600">You do not have permission to view the dashboard.</p>
          </div>
        )}
      </main>

      <AIAssistant isOpen={isAssistantOpen} onClose={() => setAssistantOpen(false)} events={events} />
    </div>
  );
}

export default App;