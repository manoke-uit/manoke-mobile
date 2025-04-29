import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xxxxx.supabase.co";
const supabaseAnonKey = "your-anon-public-api-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
