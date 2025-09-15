const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ickwrbdpuorzdpzqbqpf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja3dyYmRwdW9yemRwenFicXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk1MDc4MywiZXhwIjoyMDY2NTI2NzgzfQ.LGGTBZF3ADOZv7cW7rEGzUi_0JluWf59yw2jWLuOJHo'
);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  // Test 1: Check if waitlist_subscribers table exists
  const { data, error } = await supabase
    .from('waitlist_subscribers')
    .select('*')
    .limit(1);
    
  if (error) {
    console.log('❌ Error:', error.message);
    console.log('Table might not exist. Creating tables now...');
  } else {
    console.log('✅ Connected! Table exists.');
    console.log('Current records:', data);
  }
}

testConnection();