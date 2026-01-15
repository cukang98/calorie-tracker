import { createClient } from '@supabase/supabase-js'

// These are placeholder values - users need to replace with their own Supabase credentials
// Get free credentials at https://supabase.com
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ymhrkcnrgrodtbtqlsaj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZbVnT5-zgnUhiIsXdRrj2Q_nAU9tffc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
