import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Only create the client if both URL and key are provided
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface SavedExecution {
  id?: string;
  name: string;
  method: string;
  url: string;
  headers: any;
  params: any;
  request_body: string;
  response_status: number | null;
  response_status_text: string | null;
  response_headers: any;
  response_body: string | null;
  response_time: number | null;
  response_size: number | null;
  created_at?: string;
  updated_at?: string;
}
