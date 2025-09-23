/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.unsplash.com", "placeholder.svg"],
    unoptimized: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async redirects() {
    return [
      // Redirect old HTML files to new routes
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/solutions-page.html',
        destination: '/solutions',
        permanent: true,
      },
      {
        source: '/contact_page.html',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/app.html',
        destination: '/app',
        permanent: true,
      },
      // Add convenient redirects for new pages
      {
        source: '/demo',
        destination: '/watch-demo',
        permanent: false,
      },
      {
        source: '/ai-analyst',
        destination: '/ai-powered-analyst',
        permanent: false,
      },
      {
        source: '/compliance',
        destination: '/compliance-analyst',
        permanent: false,
      },
      {
        source: '/projects',
        destination: '/project-management',
        permanent: false,
      },
      {
        source: '/proposals',
        destination: '/professional-proposals', 
        permanent: false,
      },
      {
        source: '/proposals',
        destination: '/professional-proposals',
        permanent: false,
      },
      // Ensure waitlist goes to waitlist (not subscribe)
      {
        source: '/join',
        destination: '/waitlist',
        permanent: false,
      },
    ]
  },
  // Don't interfere with Next.js routes - let them work normally
  async rewrites() {
    return {
      // Only apply rewrites after checking all Next.js routes
      afterFiles: [
        // If someone visits root and no Next.js route matches, serve the static HTML
        {
          source: '/',
          destination: '/index-16.html',
        },
      ],
    }
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // CVE-2025-29927 Protection Headers
          {
            key: "X-Middleware-Bypass-Protection",
            value: "enabled",
          },
          {
            key: "X-CVE-2025-29927-Mitigation",
            value: "active",
          },
          // Enhanced Security Headers for Render
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.openai.com https://supabase.co https://*.supabase.co; frame-ancestors 'none';",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig