"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ResourceCard } from "@/components/resource-card"
import { ReflectionModeToggle } from "@/components/reflection-mode-toggle"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ResourceType } from "@/types"

const growthData = {
  spiritual: {
    name: "Spiritual Growth",
    description: "Daily devotionals, meditation guides, and spiritual wellness resources",
    color: "from-blue-50 to-cyan-50",
    accent: "text-blue-600",
    bgColor: "#F0F4F8",
  },
  personal: {
    name: "Personal Development",
    description: "Self-improvement, productivity, and personal goals",
    color: "from-yellow-50 to-orange-50",
    accent: "text-yellow-600",
  },
  career: {
    name: "Career Growth",
    description: "Resume templates, interview tips, and job search guides",
    color: "from-indigo-50 to-purple-50",
    accent: "text-indigo-600",
  },
}

interface GrowthContentProps {
  category: string
  resources: {
    id: string
    title: string
    type: ResourceType
    downloads: number
    createdAt: Date
    url: string
  }[]
}

export default function GrowthContent({ category, resources }: GrowthContentProps) {
  const [isReflectionMode, setIsReflectionMode] = useState(false)

  const growth = growthData[category as keyof typeof growthData] || {
    name: "Growth",
    description: "Holistic growth resources",
    color: "from-slate-50 to-slate-100",
    accent: "text-slate-600",
  }

  const isSpiritualPage = category === "spiritual"
  const isCareerPage = category === "career"

  // Format date for display
  const formattedResources = resources.map(r => ({
    ...r,
    date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: r.type.toLowerCase() as "document" | "video" // Map Prisma enum to ResourceCard type
  }))

  return (
    <div className="flex">
      <Sidebar />

      <main
        className={`ml-64 w-[calc(100%-16rem)] flex-1 transition-all ${isReflectionMode && isSpiritualPage ? "bg-[#F0F4F8]" : ""}`}
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-b ${growth.color} border-b border-border ${isReflectionMode && isSpiritualPage ? "opacity-75" : ""}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className={`inline-flex items-center gap-2 ${growth.accent} hover:opacity-80`}>
                <ChevronLeft className="w-4 h-4" />
                Back to Hub
              </Link>
              {isSpiritualPage && <ReflectionModeToggle isActive={isReflectionMode} onToggle={setIsReflectionMode} />}
            </div>
            <h1
              className={`text-4xl font-bold ${growth.accent} mb-2 ${isReflectionMode && isSpiritualPage ? "text-2xl" : ""}`}
            >
              {growth.name}
            </h1>
            <p className={`text-lg text-muted-foreground ${isReflectionMode && isSpiritualPage ? "hidden" : ""}`}>
              {growth.description}
            </p>
          </div>
        </div>

        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 py-12 ${isReflectionMode && isSpiritualPage ? "opacity-90" : ""}`}
        >
          {/* Featured Card */}
          {!isReflectionMode && (
            <div className={`bg-gradient-to-r ${growth.color} rounded-lg p-8 mb-12 border border-border`}>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {category === "spiritual" && "Find Your Inner Peace"}
                {category === "personal" && "Unlock Your Potential"}
                {category === "career" && "Advance Your Career"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {category === "spiritual" &&
                  "Explore our curated collection of spiritual resources, meditations, and wellness guides."}
                {category === "personal" &&
                  "Develop yourself with our comprehensive personal development materials."}
                {category === "career" &&
                  "Prepare for success with interview tips, resume guides, and job search resources."}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {category === "spiritual" && "Spiritual Resources"}
              {category === "personal" && "Personal Growth Resources"}
              {category === "career" && "Career Resources"}
              {category !== "spiritual" && category !== "personal" && category !== "career" && "Featured Resources"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formattedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                    id={resource.id}
                  title={resource.title}
                  type={resource.type}
                  downloads={resource.downloads}
                  date={resource.date}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="h-12" />
      </main>
    </div>
  )
}
