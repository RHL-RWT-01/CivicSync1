import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import "leaflet/dist/leaflet.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/sonner"
import BackendDownWatcher from "@/components/backend-down-watcher"
import { SiteFooter } from "@/components/site-footer"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CivicSync - Citizen-Issue Reporting & Voting Platform",
  description: "Report and vote on civic issues in your community",
  icons: {
    icon: "logo.png",
    shortcut: "logo.png",
    apple: "logo.png",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <BackendDownWatcher />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <Toaster
              position="top-center"
              richColors
              duration={4000}
              theme="system"
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
