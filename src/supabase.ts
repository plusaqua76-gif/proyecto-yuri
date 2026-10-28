import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cborwkzzoynfimbyxczy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3J3a3p6b3luZmltYnl4Y3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxOTQ2MzgsImV4cCI6MjEwODc3MDYzOH0.zHHgzPw1d2o8nF3zsX2LrHaenI9sofdmJEQ_8xvdYs0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
