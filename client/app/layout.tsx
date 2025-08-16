import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FacebookChatPanel } from "@/components/facebook-chat-panel"
import Head from "next/head"
import { Toaster } from "sonner"



export const metadata: Metadata = {
  title: "SocialSphere - Connect, Share, Create",
  description: "A creative social media platform where your world awaits",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap"
        />
      </Head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors />
          <FacebookChatPanel />
        </ThemeProvider>
      </body>
    </html>
  )
}
