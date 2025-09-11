import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Design-Rite™ - AI-Powered Security Design Platform',
  description: 'Transform security system design from days to minutes with AI-powered assessments, automated proposals, and comprehensive documentation.',
  keywords: 'security design, AI security assessment, security proposals, security integrators',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter antialiased">{children}</body>
    </html>
  )
}
