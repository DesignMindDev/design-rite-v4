/**
 * Create Admin User Script
 * Run with: node scripts/create-admin-user.mjs
 */

import { createClient } from '@supabase/supabase-js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createAdminUser() {
  const email = 'dan@design-rite.com';
  const password = 'Pl@tformbuilder2025';
  const fullName = 'Dan Kozisek';

  try {
    console.log('Creating admin user...');

    // Hash the password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('User already exists. Updating password...');

      // Update existing user
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: passwordHash,
          status: 'active',
          role: 'admin',
          failed_login_attempts: 0,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        console.error('Error updating user:', updateError);
        throw updateError;
      }

      console.log('✅ User updated successfully!');
    } else {
      console.log('Creating new user...');

      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: email,
          password_hash: passwordHash,
          full_name: fullName,
          role: 'admin',
          status: 'active',
          access_code: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          login_count: 0,
          failed_login_attempts: 0,
          notes: 'Primary admin account'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        throw insertError;
      }

      console.log('✅ User created successfully!');
      console.log('User ID:', newUser.id);
    }

    console.log('\n📋 Login Credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\n🔗 Login URL: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
