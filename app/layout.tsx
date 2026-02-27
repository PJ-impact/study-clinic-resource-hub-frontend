import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { getCurrentUserFromApi } from "@/actions/auth"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _inter = Inter({ subsets: ["latin"] })
const _jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" })

export const metadata: Metadata = {
  title: "Resource Hub - Academic & Growth Platform",
  description: "Comprehensive academic resources and holistic growth platform",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const currentUser = await getCurrentUserFromApi()

  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_inter.className} ${_jakarta.variable}`}>
        {currentUser && (
          <div className="w-full border-b border-slate-200 bg-slate-50/70 text-xs text-slate-700 px-4 py-2 flex items-center justify-between">
            <span>
              Signed in as{" "}
              <span className="font-semibold">
                {currentUser.name || currentUser.email}
              </span>
            </span>
            <span className="uppercase tracking-wide text-[10px] bg-slate-900 text-slate-50 px-2 py-0.5 rounded-full">
              {currentUser.role}
            </span>
          </div>
        )}
        {children}
      </body>
    </html>
  )
}
