import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://tnlnrehkizeoppoypkez.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubG5yZWhraXplb3Bwb3lwa2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwODMwNzAsImV4cCI6MjA4MDY1OTA3MH0.ARVvU7tZaLsrbPLrlzFG3yZT1jZJwlNJx1oZ1-1E5iw";

export function createClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing.");
  }
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
