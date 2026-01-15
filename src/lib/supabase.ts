import { createClient } from '@supabase/supabase-js'

// These are placeholder values - users need to replace with their own Supabase credentials
// Get free credentials at https://supabase.com
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
