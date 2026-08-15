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
              <footer className="py-6 border-t">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} CivicSync. All rights reserved.
                </div>
              </footer>
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
