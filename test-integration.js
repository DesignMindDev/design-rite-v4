// test-integration.js - Quick test to verify connection

// Simple Node.js test since we can't directly import TypeScript modules
const fetch = require('node-fetch').default || require('node-fetch');

async function testIntegration() {
  console.log('🧪 Testing Design-Rite Platform Integration...\n');

  const harvesterApiUrl = 'http://localhost:8002';

  // Test 1: Health check
  console.log('1. Testing harvester connection...');
  try {
    const response = await fetch(`${harvesterApiUrl}/`);
    const isHealthy = response.ok;
    console.log(`   Result: ${isHealthy ? '✅ CONNECTED' : '❌ FAILED'}\n`);

    if (!isHealthy) {
      console.log('❌ Cannot proceed - harvester not accessible');
      console.log('💡 Make sure harvester API is running on port 8002');
      return;
    }
  } catch (error) {
    console.log('   Result: ❌ FAILED - Connection error');
    console.log('💡 Make sure harvester API is running on port 8002');
    return;
  }

  // Test 2: Product search
  console.log('2. Testing product search...');
  try {
    const response = await fetch(`${harvesterApiUrl}/api/v1/products/search?query=axis&limit=5`);
    const data = await response.json();
    const products = data.products || [];

    console.log(`   Found: ${products.length} real products`);
    if (products.length > 0) {
      const sample = products[0];
      const price = sample.pricing?.street_price ? `$${sample.pricing.street_price}` : 'No price';
      console.log(`   Sample: ${sample.description || sample.name} - ${price}`);
    }
    console.log();
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 3: Mock smart recommendations test
  console.log('3. Testing mock smart recommendations logic...');
  try {
    // Simulate what our unified service would do
    const searchTerms = ['camera', 'access control'];
    let allProducts = [];

    for (const term of searchTerms) {
      const response = await fetch(`${harvesterApiUrl}/api/v1/products/search?query=${term}&limit=10`);
      const data = await response.json();
      if (data.products) {
        allProducts.push(...data.products);
      }
    }

    // Remove duplicates by model
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex(p => p.model === product.model)
    );

    // Sort by price (products with pricing first)
    const sortedProducts = uniqueProducts
      .sort((a, b) => {
        const aHasPrice = (a.pricing?.street_price || 0) > 0;
        const bHasPrice = (b.pricing?.street_price || 0) > 0;

        if (aHasPrice && !bHasPrice) return -1;
        if (!aHasPrice && bHasPrice) return 1;

        return (a.pricing?.street_price || 0) - (b.pricing?.street_price || 0);
      })
      .slice(0, 5);

    console.log(`   Generated: ${sortedProducts.length} recommendations`);
    sortedProducts.forEach((rec, i) => {
      const price = rec.pricing?.street_price ? `$${rec.pricing.street_price.toLocaleString()}` : 'Quote Required';
      const isReal = rec.pricing?.street_price > 0;
      console.log(`   ${i+1}. ${rec.description || rec.name} - ${price} ${isReal ? '(Real CDW Data)' : '(Generic)'}`);
    });

    const realDataCount = sortedProducts.filter(p => p.pricing?.street_price > 0).length;
    console.log(`\n🎯 Integration test complete!`);
    console.log(realDataCount > 0 ?
      `✅ SUCCESS: Using ${realDataCount}/5 products with real CDW pricing data` :
      '⚠️  WARNING: Still using generic data'
    );

  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
}

// Run test
testIntegration().catch(console.error);