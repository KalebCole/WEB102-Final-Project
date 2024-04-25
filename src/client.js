import { createClient } from '@supabase/supabase-js'
const URL = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_REACT_APP_SUPABASE_KEY;

export const supabase = createClient(URL, API_KEY);