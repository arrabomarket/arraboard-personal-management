// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://ihkefwdmuhhdboscjpqp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloa2Vmd2RtdWhoZGJvc2NqcHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MjI4NzEsImV4cCI6MjA0NTk5ODg3MX0.hxwnZ_6UW7qRUumdNGTFtkEu9TerXDTyslNkJcVhqTk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);