import * as dotenv from 'dotenv';
dotenv.config();

import { getSupabaseClient } from '../src/lib/supabase';

async function testQuery() {
  const client = getSupabaseClient()!;
  const propertyId = '737838ec-a052-47c2-9a72-35b24f7ef2ad';

  const { data: acc, error: accErr } = await client
    .from('accommodations')
    .select('*')
    .eq('property_id', propertyId);
  console.log('Accommodations by property_id:', acc, accErr);

  const { data: fac, error: facErr } = await client
    .from('facilities')
    .select('*')
    .eq('property_id', propertyId);
  console.log('Facilities by property_id:', fac?.length, facErr);

  const { data: meals, error: mealErr } = await client
    .from('meal_plans')
    .select('*')
    .eq('property_id', propertyId);
  console.log('Meal plans by property_id:', meals?.length, mealErr);
}

testQuery().catch(console.error);
