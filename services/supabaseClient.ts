import { createClient } from '@supabase/supabase-js';

// IMPORTANT: These variables should be replaced with your actual Supabase project URL and anon key.
// In a real-world application, it's crucial to store these in environment variables
// for security and to avoid exposing them in client-side code.
// For this project, you will need to create a Supabase project and get these values from the settings.
const supabaseUrl = 'https://zybixxyzpoltdwnakzgn.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Yml4eHl6cG9sdGR3bmFremduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjYwNzEsImV4cCI6MjA3Mjg0MjA3MX0.bPzw_33XBqY-mFd_H19knjhwgFgQ6kxkkBM5aKXAQfg'; 

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL and/or Anon Key are not set. Authentication will not work. " +
    "Please create a `services/supabaseClient.ts` file and add your Supabase credentials."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
