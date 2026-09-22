import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetPassword() {
  const targetEmail = process.argv[2] || 'admin@sanjayproperties.in';
  const newPassword = process.argv[3] || 'sanjay123';

  console.log(`Setting password for ${targetEmail}...`);

  const { data: list, error: listErr } = await adminClient.auth.admin.listUsers();
  if (listErr) {
    console.error('Failed to list users:', listErr.message);
    process.exit(1);
  }

  const existingUser = list.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());

  if (existingUser) {
    const { data, error } = await adminClient.auth.admin.updateUserById(existingUser.id, {
      password: newPassword,
      email_confirm: true
    });
    if (error) {
      console.error('Failed to update password:', error.message);
      process.exit(1);
    }
    console.log(`✅ Successfully updated password for ${targetEmail} (ID: ${data.user.id})`);
    console.log(`New Password: ${newPassword}`);
  } else {
    const { data, error } = await adminClient.auth.admin.createUser({
      email: targetEmail,
      password: newPassword,
      email_confirm: true,
      user_metadata: { name: 'Sanjay Admin' }
    });
    if (error) {
      console.error('Failed to create user:', error.message);
      process.exit(1);
    }
    console.log(`✅ Successfully created user ${targetEmail} (ID: ${data.user.id})`);
    console.log(`Password: ${newPassword}`);
  }
}

resetPassword().catch(console.error);
