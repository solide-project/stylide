import { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"

import { cn } from "@/lib/utils"

import "./globals.css"
import { SolideProviders } from "@/components/providers"

export const metadata: Metadata = {
  title: {
    default: "Stylide | Stylus IDE",
    template: `%s - Stylide`,
  },
  description: "Lightweight Stylus IDE",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

const fontSpace = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "bg-grayscale-000 font-sans antialiased",
            fontSpace.variable
          )}
        >
          <SolideProviders>
            {children}
          </SolideProviders>
        </body >
      </html >
    </>
  )
}