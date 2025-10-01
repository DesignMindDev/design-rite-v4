import { createClient } from '@supabase/supabase-js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const email = 'dan@design-rite.com';
const password = 'Pl@tformbuilder2025';

const passwordHash = await bcryptjs.hash(password, 10);

// First try to update
const { error: updateError } = await supabase
  .from('users')
  .update({
    password_hash: passwordHash,
    status: 'active',
    role: 'admin',
    failed_login_attempts: 0
  })
  .eq('email', email);

if (updateError && updateError.code === 'PGRST116') {
  // User doesn't exist, create new
  console.log('Creating new user...');
  const { data, error: insertError } = await supabase
    .from('users')
    .insert({
      email: email,
      password_hash: passwordHash,
      full_name: 'Dan Kozisek',
      role: 'admin',
      status: 'active'
    })
    .select();

  if (insertError) {
    console.error('Error:', insertError);
  } else {
    console.log('✅ Created:', data);
  }
} else if (updateError) {
  console.error('Update error:', updateError);
} else {
  console.log('✅ Updated existing user');
}

console.log('\nEmail:', email);
console.log('Password:', password);
