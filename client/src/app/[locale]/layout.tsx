import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Head from "next/head"
import { Toaster } from "sonner"
import { ThemeProvider } from "../components/theme-provider"
import { FacebookChatPanel } from "../components/facebook-chat-panel"
import AppProvider from '../components/app-provider'
import { getMessages, getTranslations } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { locales } from "../../config"
export const metadata: Metadata = {
  title: "SocialSphere - Connect, Share, Create",
  description: "A creative social media platform where your world awaits",
  generator: "v0.app",
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages()
  return (
    <html lang="vi" suppressHydrationWarning>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap"
        />
      </Head>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <AppProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster richColors />
              <FacebookChatPanel />
            </ThemeProvider>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
