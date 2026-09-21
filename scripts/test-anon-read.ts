import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const url = process.env.PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

console.log('Testing anon client with URL:', url);
const supabase = createClient(url, anonKey);

async function test() {
  const { data: props, error: propErr } = await supabase.from('properties').select('*');
  console.log('Properties read:', { count: props?.length, error: propErr });

  const { data: acc, error: accErr } = await supabase.from('accommodations').select('*');
  console.log('Accommodations read:', { count: acc?.length, error: accErr });

  const { data: fac, error: facErr } = await supabase.from('facilities').select('*');
  console.log('Facilities read:', { count: fac?.length, error: facErr });

  const { data: meals, error: mealErr } = await supabase.from('meal_plans').select('*');
  console.log('Meal plans read:', { count: meals?.length, error: mealErr });

  const { data: rates, error: rateErr } = await supabase.from('meal_subscription_rates').select('*');
  console.log('Meal rates read:', { count: rates?.length, error: rateErr });

  const { data: menu, error: menuErr } = await supabase.from('weekly_menu').select('*');
  console.log('Weekly menu read:', { count: menu?.length, error: menuErr });

  const { data: settings, error: setErr } = await supabase.from('site_settings').select('*');
  console.log('Site settings read:', { data: settings, error: setErr });
}

test().catch(console.error);
