import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component client
export const createClientSupabase = () => createClientComponentClient()

// Server component client
export const createServerSupabase = () => createServerComponentClient({ cookies })

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          company_name: string
          subscription_tier: "trial" | "professional" | "enterprise"
          trial_assessments_remaining: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          company_name: string
          subscription_tier?: "trial" | "professional" | "enterprise"
          trial_assessments_remaining?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          company_name?: string
          subscription_tier?: "trial" | "professional" | "enterprise"
          trial_assessments_remaining?: number
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          company_name: string
          facility_type: string
          assessment_content: string
          status: "pending" | "processing" | "completed" | "failed"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          facility_type: string
          assessment_content?: string
          status?: "pending" | "processing" | "completed" | "failed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          assessment_content?: string
          status?: "pending" | "processing" | "completed" | "failed"
          updated_at?: string
        }
      }
    }
  }
}
