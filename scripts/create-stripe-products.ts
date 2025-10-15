/**
 * Script to create Stripe products and prices
 * Run with: npx tsx scripts/create-stripe-products.ts
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

async function createProducts() {
  try {
    console.log('Creating Design-Rite products in Stripe...\n')

    // Create Starter Product
    console.log('Creating Starter product...')
    const starterProduct = await stripe.products.create({
      name: 'Design-Rite Starter',
      description: 'AI-powered security proposals for growing businesses',
      metadata: {
        plan: 'starter',
        features: 'AI assessments, professional proposals, 3,000+ products database'
      }
    })

    // Create Starter Monthly Price
    const starterMonthly = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 9700, // $97.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      nickname: 'Starter Monthly'
    })

    // Create Starter Annual Price
    const starterAnnual = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 97000, // $970.00 (save $194/year)
      currency: 'usd',
      recurring: {
        interval: 'year'
      },
      nickname: 'Starter Annual'
    })

    console.log('✅ Starter product created!')
    console.log(`   Product ID: ${starterProduct.id}`)
    console.log(`   Monthly Price ID: ${starterMonthly.id}`)
    console.log(`   Annual Price ID: ${starterAnnual.id}\n`)

    // Create Professional Product
    console.log('Creating Professional product...')
    const proProduct = await stripe.products.create({
      name: 'Design-Rite Professional',
      description: 'Unlimited proposals, priority support, advanced features',
      metadata: {
        plan: 'professional',
        features: 'Everything in Starter + unlimited quotes, priority support, custom branding'
      }
    })

    // Create Professional Monthly Price
    const proMonthly = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 29700, // $297.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      nickname: 'Professional Monthly'
    })

    // Create Professional Annual Price
    const proAnnual = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 297000, // $2,970.00 (save $594/year)
      currency: 'usd',
      recurring: {
        interval: 'year'
      },
      nickname: 'Professional Annual'
    })

    console.log('✅ Professional product created!')
    console.log(`   Product ID: ${proProduct.id}`)
    console.log(`   Monthly Price ID: ${proMonthly.id}`)
    console.log(`   Annual Price ID: ${proAnnual.id}\n`)

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 Products created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('📋 Add these to your .env.local file:\n')
    console.log(`STRIPE_STARTER_PRICE_ID=${starterMonthly.id}`)
    console.log(`STRIPE_PROFESSIONAL_PRICE_ID=${proMonthly.id}`)
    console.log(`STRIPE_STARTER_ANNUAL_PRICE_ID=${starterAnnual.id}`)
    console.log(`STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID=${proAnnual.id}\n`)

    console.log('💡 View products at: https://dashboard.stripe.com/test/products\n')

  } catch (error: any) {
    console.error('❌ Error creating products:', error.message)
    process.exit(1)
  }
}

createProducts()
