/**
 * Test script to verify session tracking and Supabase integration
 * Run this to test if our session manager is working properly
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Environment check:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Missing')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : 'Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')

  try {
    // Test with a table we know exists from the code search (waitlist_subscribers)
    const { data, error } = await supabase
      .from('waitlist_subscribers')
      .select('count(*)', { count: 'exact', head: true })

    if (error) {
      console.error('❌ Supabase connection error:', error.message)
      console.error('Full error:', error)
      return false
    }

    console.log('✅ Supabase connection successful')
    console.log(`📊 waitlist_subscribers found - connection working`)
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    return false
  }
}

async function testSessionTracking() {
  console.log('🧪 Testing session tracking...')

  const testSessionData = {
    session_id: `test_session_${Date.now()}`,
    user_id: null,
    guest_id: `test_user_${Date.now()}`,
    tool_used: 'security-estimate',
    project_context: `test_project_${Date.now()}`,
    session_data: {
      action: 'test_session_tracking',
      test: true,
      facilitySize: 25000,
      estimatedCost: 125000,
      systems: ['surveillance', 'accessControl'],
      timestamp: new Date().toISOString()
    },
    status: 'active'
  }

  try {
    const { data, error } = await supabase
      .from('ai_sessions')
      .insert([testSessionData])
      .select()

    if (error) {
      console.error('❌ Session tracking failed:', error.message)
      console.error('Error details:', error)
      return false
    }

    console.log('✅ Session tracking successful!')
    console.log('📊 Inserted session data:', data?.[0]?.id)
    return data?.[0]
  } catch (error) {
    console.error('❌ Session tracking error:', error.message)
    return false
  }
}

async function testDataRetrieval() {
  console.log('📖 Testing data retrieval...')

  try {
    const { data, error } = await supabase
      .from('ai_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('❌ Data retrieval failed:', error.message)
      return false
    }

    console.log('✅ Data retrieval successful!')
    console.log(`📊 Retrieved ${data?.length || 0} recent sessions`)

    if (data && data.length > 0) {
      console.log('📋 Latest session:')
      console.log('  - ID:', data[0].id)
      console.log('  - Tool:', data[0].tool_used)
      console.log('  - Session ID:', data[0].session_id)
      console.log('  - Created:', data[0].created_at)
      console.log('  - Has Data:', !!data[0].session_data)
    }

    return data
  } catch (error) {
    console.error('❌ Data retrieval error:', error.message)
    return false
  }
}

async function checkTableSchema() {
  console.log('🏗️ Checking ai_sessions table schema...')

  try {
    // Try to get one record to see the schema
    const { data, error } = await supabase
      .from('ai_sessions')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Schema check failed:', error.message)

      // Common issues
      if (error.message.includes('does not exist')) {
        console.log('💡 The ai_sessions table may not exist. Please create it with:')
        console.log(`
CREATE TABLE ai_sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  guest_id TEXT,
  tool_used TEXT,
  project_context TEXT,
  session_data JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `)
      }
      return false
    }

    console.log('✅ ai_sessions table exists and is accessible')

    if (data && data.length > 0) {
      console.log('📋 Table columns:', Object.keys(data[0]).join(', '))
    }

    return true
  } catch (error) {
    console.error('❌ Schema check error:', error.message)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 Starting session tracking tests...\n')

  const connectionOk = await testSupabaseConnection()
  if (!connectionOk) return

  console.log()
  const schemaOk = await checkTableSchema()
  if (!schemaOk) return

  console.log()
  const trackingOk = await testSessionTracking()

  console.log()
  const retrievalOk = await testDataRetrieval()

  console.log('\n📊 Test Summary:')
  console.log(`  Connection: ${connectionOk ? '✅' : '❌'}`)
  console.log(`  Schema: ${schemaOk ? '✅' : '❌'}`)
  console.log(`  Tracking: ${trackingOk ? '✅' : '❌'}`)
  console.log(`  Retrieval: ${retrievalOk ? '✅' : '❌'}`)

  if (connectionOk && schemaOk && trackingOk && retrievalOk) {
    console.log('\n🎉 All tests passed! Session tracking is working correctly.')
    console.log('\n📈 Next steps:')
    console.log('  1. Visit http://localhost:3002/admin/user-activity to see the admin dashboard')
    console.log('  2. Visit http://localhost:3002/admin/session-debug to see local session data')
    console.log('  3. Test the user flow: /estimate-options → /security-estimate → /ai-assistant')
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.')
  }
}

// Run the tests
runAllTests().catch(console.error)