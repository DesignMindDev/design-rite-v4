// Delete user via Supabase Admin API
// This bypasses all the SQL/RLS issues we've been hitting
// Run: node scripts/delete-user-admin-api.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ickwrbdpuorzdpzqbqpf.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja3dyYmRwdW9yemRwenFicXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk1MDc4MywiZXhwIjoyMDY2NTI2NzgzfQ.LGGTBZF3ADOZv7cW7rEGzUi_0JluWf59yw2jWLuOJHo'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function deleteUser() {
  const userEmail = 'plisk@design-rite.com'
  const userId = 'b707a8c1-a298-485f-aed3-aac56bbc9880'

  console.log(`Attempting to delete user: ${userEmail}`)
  console.log(`User ID: ${userId}`)

  try {
    // Use Supabase Admin API to delete user
    // This properly deletes from ALL auth tables including identities
    const { data, error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
      console.error('❌ Error deleting user:', error.message)
      console.error('Full error:', error)
      return
    }

    console.log('✅ User deleted successfully!')
    console.log('Response:', data)

    // Verify deletion
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    const stillExists = users?.users?.find(u => u.email === userEmail)

    if (stillExists) {
      console.error('❌ User still exists after deletion!')
    } else {
      console.log('✅ Verified: User successfully deleted')
      console.log('\n🎉 You can now create Phil\'s account properly via Supabase Dashboard!')
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

deleteUser()
