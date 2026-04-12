import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/language-context"
import { FirebaseAuthProvider } from "@/lib/firebase-context"
import { CartProvider } from "@/lib/cart-context"
import { ReduxProvider } from "@/lib/redux/provider"
import { CartButton } from "@/components/cart-button"
import { WhatsAppContact } from "@/components/whatsapp-contact"
import { MobileNav } from "@/components/mobile-nav"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DUM & DONE - Online Food Ordering",
  description: "Order authentic Chinese home-style cooking online with fresh ingredients and traditional recipes",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased pb-24 md:pb-0 overflow-x-hidden`} suppressHydrationWarning>
        <ReduxProvider>
          <FirebaseAuthProvider>
            <LanguageProvider>
              <CartProvider>
                {children}
                <CartButton />
                <WhatsAppContact />
                <MobileNav />
              </CartProvider>
            </LanguageProvider>
          </FirebaseAuthProvider>
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}
