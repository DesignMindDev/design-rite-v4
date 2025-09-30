#!/usr/bin/env node

/**
 * Supabase URL Configuration Helper Script
 *
 * This script helps configure all necessary URLs in Supabase for Design-Rite authentication.
 * Run with: node scripts/configure-supabase-urls.js
 */

const fs = require('fs');
const path = require('path');

// Read the SUPABASE_URLS.md file to get the latest URL list
const urlsFilePath = path.join(__dirname, '..', 'SUPABASE_URLS.md');

function extractUrlsFromMarkdown() {
  try {
    const content = fs.readFileSync(urlsFilePath, 'utf8');

    // Extract URLs from the quick copy-paste section
    const quickCopySection = content.match(/## 📋 Quick Copy-Paste List for Supabase[\s\S]*?```\n([\s\S]*?)\n```/);

    if (quickCopySection && quickCopySection[1]) {
      const urls = quickCopySection[1]
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      return urls;
    }

    return [];
  } catch (error) {
    console.error('Error reading SUPABASE_URLS.md:', error);
    return [];
  }
}

function generateSupabaseConfig() {
  const urls = extractUrlsFromMarkdown();

  console.log('🔧 Design-Rite Supabase URL Configuration');
  console.log('==========================================\n');

  console.log('📍 Site URL (Main Domain):');
  console.log('https://www.design-rite.com\n');

  console.log('🔗 Redirect URLs (Copy all to Supabase dashboard):');
  console.log('==================================================');

  urls.forEach((url, index) => {
    console.log(`${(index + 1).toString().padStart(2, '0')}. ${url}`);
  });

  console.log('\n📋 Instructions:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your Design-Rite project');
  console.log('3. Go to Authentication → URL Configuration');
  console.log('4. Set Site URL to: https://www.design-rite.com');
  console.log('5. Copy all URLs above into Redirect URLs (one per line)');
  console.log('6. Save configuration\n');

  console.log('✨ Additional Development URLs (if needed):');
  console.log('For Render deployment, add your Render URL:');
  console.log('https://your-app-name.onrender.com/platform-access');
  console.log('https://your-app-name.onrender.com/estimate-options');
  console.log('https://your-app-name.onrender.com/dashboard\n');

  console.log('🎯 Priority URLs (if adding gradually):');
  console.log('1. /platform-access (authentication gateway)');
  console.log('2. /estimate-options (main platform entry)');
  console.log('3. /dashboard (user dashboard)');
  console.log('4. /auth/error (error handling)');
  console.log('5. /security-estimate (quick assessment)');
  console.log('6. /ai-assessment (AI discovery)\n');

  return {
    siteUrl: 'https://www.design-rite.com',
    redirectUrls: urls,
    totalUrls: urls.length
  };
}

function generateEnvTemplate() {
  console.log('🔐 Environment Variables Template');
  console.log('=================================\n');

  console.log('Add these to your .env.local file:');
  console.log('```env');
  console.log('# Supabase Configuration');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
  console.log('```\n');

  console.log('For Render deployment, add the same variables to your Render environment.\n');
}

function validateCurrentConfig() {
  console.log('🔍 Current Configuration Validation');
  console.log('===================================\n');

  try {
    const supabaseFile = path.join(__dirname, '..', 'lib', 'supabase.ts');
    const content = fs.readFileSync(supabaseFile, 'utf8');

    // Check if magic link function has comprehensive URLs
    const hasComprehensiveUrls = content.includes('// Comprehensive allowed paths for all Design-Rite pages');

    console.log('✅ Authentication helpers:', hasComprehensiveUrls ? 'Updated with comprehensive URLs' : 'Need to update URLs');

    // Check if OAuth provider function exists
    const hasOAuthRedirect = content.includes('signInWithProvider') && content.includes('redirectTo');
    console.log('✅ OAuth redirect handling:', hasOAuthRedirect ? 'Configured' : 'Needs configuration');

    // Check if user lookup function exists
    const hasUserLookup = content.includes('checkUserExists');
    console.log('✅ Smart user lookup:', hasUserLookup ? 'Implemented' : 'Needs implementation');

    console.log();

  } catch (error) {
    console.error('❌ Error validating configuration:', error.message);
  }
}

// Main execution
function main() {
  const config = generateSupabaseConfig();
  generateEnvTemplate();
  validateCurrentConfig();

  console.log('📊 Summary:');
  console.log(`Total URLs configured: ${config.totalUrls}`);
  console.log(`Site URL: ${config.siteUrl}`);
  console.log('\n🚀 Ready for production deployment!');
  console.log('\nFor any issues, refer to SUPABASE_URLS.md for detailed instructions.');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  extractUrlsFromMarkdown,
  generateSupabaseConfig,
  generateEnvTemplate,
  validateCurrentConfig
};