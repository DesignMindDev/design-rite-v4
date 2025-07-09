import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { AuthProvider } from "@/components/providers/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Design-Rite V3 - AI-Powered Security Assessment Platform",
  description:
    "Transform security system design from days to minutes with AI-powered assessments and automated proposal generation.",
  keywords: "security assessment, AI security, security design, security consulting",
  authors: [{ name: "Design-Rite Team" }],
  openGraph: {
    title: "Design-Rite V3 - AI Security Platform",
    description: "Professional security assessments in minutes, not days.",
    type: "website",
    url: "https://design-rite-v3.vercel.app",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
