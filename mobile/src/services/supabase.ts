import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nibyqdwvvaqlkdxkaqyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pYnlxZHd2dmFxbGtkeGthcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NDA0MjQsImV4cCI6MjA5MzIxNjQyNH0.utiJj7FQseT7LPxYxVmesnFkumA4-fmM32fclZ8OpOY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
