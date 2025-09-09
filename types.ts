export interface Registration {
  id: string;
  name: string;
  email: string; // The registrant's email from the form
  college: string;
  eventId: string;
  referenceId: string;
  paymentScreenshot: string; // Will store filename for this prototype
  detailsEdited: boolean;
  userEmail: string; // The logged-in user's email to link the registration
}

export interface Event {
  id: string;
  title: string;
  date: string; // Stored as YYYY-MM-DD for sortability
  description: string;
  schedule: string;
  venue: string;
  rules: string;
  contact: string;
  organizerId: string;
  clubName: string;
  maxRegistrations?: number;
  registrationStatus: 'OPEN' | 'PAUSED' | 'CLOSED';
}

export type UserRole = 'PARTICIPANT' | 'ORGANIZER' | 'ADMIN';

export type ViewState = 
  | { view: 'HOME' }
  | { view: 'DETAIL'; eventId: string }
  | { view: 'DASHBOARD' }
  | { view: 'MY_REGISTRATIONS' };