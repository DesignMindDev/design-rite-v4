import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Design-Rite™ - AI-Powered Security Design Platform',
  description: 'Transform security system design from days to minutes with AI-powered assessments, automated proposals, and comprehensive documentation. Professional security design software for integrators, enterprises, and consultants.',
  keywords: 'security design, AI security assessment, security proposals, security integrators, enterprise security, security consultants, security system design, automated security proposals, security documentation, physical security design',
  authors: [{ name: 'Design-Rite' }],
  creator: 'Design-Rite',
  publisher: 'Design-Rite',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Design-Rite',
    title: 'Design-Rite™ - AI-Powered Security Design Platform',
    description: 'Transform security system design from days to minutes with AI-powered assessments, automated proposals, and comprehensive documentation.',
    url: 'https://design-rite.com',
    images: [
      {
        url: 'https://design-rite.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Design-Rite AI-Powered Security Design Platform',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design-Rite™ - AI-Powered Security Design Platform',
    description: 'Transform security system design from days to minutes with AI-powered assessments and automated proposals.',
    images: ['https://design-rite.com/twitter-image.jpg'],
    creator: '@designrite',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://design-rite.com',
  },
  category: 'Technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Security Headers */}
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* DNS Prefetch and Preconnect */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Font Loading */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme and Viewport */}
        <meta name="theme-color" content="#1f2937" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-inter antialiased">{children}</body>
    </html>
  )
}
