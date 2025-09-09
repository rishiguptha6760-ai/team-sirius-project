import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { UserRole } from '../types';
import { SpinnerIcon, XIcon } from './Icons';

interface AuthModalProps {
  role: UserRole;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ role, onClose }) => {
  // Only participants (students) can sign up themselves.
  const allowSignUp = role === 'PARTICIPANT';
  
  // Start with the sign-in view.
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Only attempt sign-up if the user is in the sign-up view AND the role allows it.
      if (isSignUp && allowSignUp) {
        // Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role },
          },
        });
        if (signUpError) throw signUpError;
        setMessage("Account created successfully! Please sign in.");
        setIsSignUp(false); // Switch to sign-in form
      } else {
        // Sign In
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onClose(); // On successful sign-in, close the modal.
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentAction = isSignUp && allowSignUp ? 'Sign Up' : 'Sign In';
  const buttonText = currentAction === 'Sign Up' ? 'Create Account' : 'Sign In';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800 capitalize">{role.toLowerCase()} {currentAction}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon className="w-6 h-6" /></button>
        </div>
        <div className="p-6">
          <form onSubmit={handleAuth} className="space-y-4">
            {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded">{error}</p>}
            {message && <p className="text-green-600 text-sm bg-green-100 p-2 rounded">{message}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
              {loading ? <SpinnerIcon className="w-5 h-5"/> : buttonText}
            </button>
          </form>
          {/* The toggle between Sign In/Sign Up is only shown for roles that allow self-signup. */}
          {allowSignUp && (
            <div className="mt-4 text-center">
              <button onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }} className="text-sm text-blue-600 hover:underline">
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
