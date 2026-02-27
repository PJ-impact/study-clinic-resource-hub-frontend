"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ResourceCard } from "@/components/resource-card"
import { ChevronLeft, Filter } from "lucide-react"
import Link from "next/link"
import { ResourceType } from "@/types"

const departmentData = {
  law: {
    name: "Law",
    description: "Comprehensive legal resources and coursework",
    courses: ["Constitutional Law", "Corporate Law", "Criminal Law", "International Law"],
  },
  pharmacy: {
    name: "Pharmacy",
    description: "Pharmaceutical sciences and practice resources",
    courses: ["Pharmacology", "Pharmacokinetics", "Medicinal Chemistry", "Pharmacy Practice"],
  },
  it: {
    name: "Information Technology",
    description: "Programming, systems, and technology resources",
    courses: ["Web Development", "Data Structures", "Databases", "Cloud Computing"],
  },
}

interface DepartmentContentProps {
  slug: string
  departmentName?: string
  initialLevel?: string
  resources: {
    id: string
    title: string
    type: ResourceType
    downloads: number
    createdAt: Date
    url: string
    level: string | null
  }[]
}

export default function DepartmentContent({ slug, departmentName, initialLevel, resources }: DepartmentContentProps) {
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")
  const [selectedLevel, setSelectedLevel] = useState<string | null>(initialLevel ?? null)
  const [resourcesState, setResourcesState] = useState(resources)
  const [isLoadingResources, setIsLoadingResources] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const dept = departmentData[slug as keyof typeof departmentData] || {
    name: departmentName || "Department",
    description: departmentName ? `${departmentName} Resources` : "Department resources",
    courses: [],
  }

  const baseLevels = ["Level 100", "Level 200", "Level 300", "Level 400"]
  const normalizedName = (departmentName || dept.name).toLowerCase()
  const levels = [
    ...baseLevels,
    ...(normalizedName.includes("pharmacy") ? ["Level 500", "Level 600"] : []),
    ...(normalizedName.includes("architecture") ? ["Level 500"] : []),
  ]
  const departmentDisplayName = departmentName || dept.name

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setIsLoadingResources(true)
      setLoadError(null)

      const params = new URLSearchParams()
      if (departmentDisplayName) params.set("department", departmentDisplayName)
      if (selectedLevel) params.set("level", selectedLevel)
      params.set("sort", sortBy === "popular" ? "popular" : "recent")

      try {
        const res = await fetch(`/api/v1/resources?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error("Failed to load resources")
        }

        const data = await res.json()
        setResourcesState(data.items || [])
      } catch (error: any) {
        if (error?.name === "AbortError") return
        setResourcesState([])
        setLoadError("Failed to load resources.")
      } finally {
        setIsLoadingResources(false)
      }
    }

    load()

    return () => controller.abort()
  }, [departmentDisplayName, selectedLevel, sortBy])

  const formattedResources = resourcesState.map(r => ({
    ...r,
    date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: (r as any).type.toLowerCase() as "document" | "video"
  }))

  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 w-[calc(100%-16rem)] flex-1">
        {/* Header */}
        <div className="bg-gradient-to-b from-indigo-50 to-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
              <ChevronLeft className="w-4 h-4" />
              Back to Hub
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">{dept.name} Hub</h1>
            <p className="text-lg text-muted-foreground">{dept.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Courses Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dept.courses.map((course) => (
                <div
                  key={course}
                  className="bg-card rounded-lg p-4 border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="font-semibold text-card-foreground mb-1">{course}</h3>
                  <p className="text-sm text-muted-foreground">View materials</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Levels</h2>
            <div className="max-w-xs">
              <select
                value={selectedLevel || ""}
                onChange={(e) => setSelectedLevel(e.target.value || null)}
                className="w-full border border-border rounded-lg px-3 py-2 bg-card text-foreground text-sm"
              >
                <option value="">All Levels</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                Select a level to filter resources for this department.
              </p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <button
                onClick={() => setSortBy("recent")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === "recent"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === "popular"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Most Popular
              </button>
            </div>
          </div>

          {/* Resources Grid */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Department Resources</h2>
            {isLoadingResources ? (
              <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-lg">
                <p>Loading resources...</p>
              </div>
            ) : loadError ? (
              <div className="text-center py-12 text-red-500 bg-secondary/20 rounded-lg">
                <p>{loadError}</p>
              </div>
            ) : formattedResources.length > 0 ? (
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
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-lg">
                <p>No resources found for this department yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-12" />
      </main>
    </div>
  )
}
