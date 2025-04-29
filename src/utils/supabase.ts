import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://egryflripdibifvtttyl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncnlmbHJpcGRpYmlmdnR0dHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Nzk2MzEsImV4cCI6MjA2MTE1NTYzMX0.BpINvdvh2SMqwBuNIvH9E5k4-u9_So4PE22E7-qheXw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
