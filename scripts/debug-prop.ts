import * as dotenv from 'dotenv';
dotenv.config();

import { getSupabaseClient } from '../src/lib/supabase';

async function debugProp() {
  const client = getSupabaseClient();
  console.log('Client exists?', Boolean(client));
  const { data, error } = await client!.from('properties').select('*');
  console.log('All properties:', data);
  console.log('Error:', error);
}

debugProp().catch(console.error);
