import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Flower Ecosystem Platform - Discover, Learn & Explore Flowers",
  description: "Explore thousands of flowers, their meanings, classifications, families, uses, purposes, and products. Your premium botanical knowledge platform.",
  keywords: ["flowers", "botanical", "flower discovery", "flower education", "flower classification", "flower families", "flower marketplace"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
