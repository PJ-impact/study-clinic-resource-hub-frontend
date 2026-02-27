"use client"

import { StudentLoginPanel } from "@/components/student-login-panel"
import { ContributorLoginPanel } from "@/components/contributor-login-panel"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Desktop: Blurred Library Background (Left side) */}
      <div className="hidden md:block absolute inset-0 md:w-1/2 bg-cover bg-center" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=1920&h=1080&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 via-indigo-500/25 to-transparent backdrop-blur-sm" />
      </div>

      {/* Split-screen content container */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen gap-0">
        {/* Student Portal - Left Side (Hidden on mobile, shown on desktop) */}
        <StudentLoginPanel />

        {/* Contributor Portal - Right Side (Full width on mobile, half on desktop) */}
        <ContributorLoginPanel />
      </div>

      {/* Mobile: Sophisticated gradient background */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10" />
    </div>
  )
}
