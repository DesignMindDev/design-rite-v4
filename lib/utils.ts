import { createClient } from '@supabase/supabase-js'

// Simplified UI utility function that doesn't require additional dependencies
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}

// Supabase clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ickwrbdpuorzdpzqbqpf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja3dyYmRwdW9yenFwenFicXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY0OTgzOTksImV4cCI6MjA0MjA3NDM5OX0.kQDLqZ8fZUlFZs3bJLGy0kEQRoqE_XvN1K8G0z_DkJg'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja3dyYmRwdW9yenFwenFicXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk1MDc4MywiZXhwIjoyMDY2NTI2NzgzfQ.LGGTBZF3ADOZv7cW7rEGzUi_0JluWf59yw2jWLuOJHo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export interface JobApplication {
  first_name: string
  last_name: string
  email: string
  phone?: string
  linkedin_url?: string
  portfolio_url?: string
  years_experience?: string
  current_company?: string
  current_job_title?: string
  cover_letter?: string
  salary_expectations?: string
  available_start_date?: string
  referral_source?: string
  position_applied: string
}