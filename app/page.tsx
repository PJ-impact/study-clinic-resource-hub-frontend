"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHero } from "@/components/dashboard-hero"
import { ResourceCard } from "@/components/resource-card"
import { UploadModal } from "@/components/upload-modal"

type DashboardResource = {
  id: string
  title: string
  type: "document" | "video"
  downloads: number
  date: string
}

export default function Home() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [pinnedResources, setPinnedResources] = useState<DashboardResource[]>([])
  const [recentResources, setRecentResources] = useState<DashboardResource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadResources() {
      try {
        const [popularRes, recentRes] = await Promise.all([
          fetch("/api/v1/resources?sort=popular&limit=6", { cache: "no-store" }),
          fetch("/api/v1/resources?sort=recent&limit=6", { cache: "no-store" }),
        ])

        const popularJson = await popularRes.json()
        const recentJson = await recentRes.json()

        if (!isMounted) return

        const mapItems = (items: any[]): DashboardResource[] =>
          items.map((r) => ({
            id: r.id,
            title: r.title,
            type: String(r.type).toLowerCase() === "video" ? "video" : "document",
            downloads: r.downloads ?? 0,
            date: r.createdAt
              ? new Date(r.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "",
          }))

        setPinnedResources(mapItems(popularJson.items || []))
        setRecentResources(mapItems(recentJson.items || []))
      } catch (error) {
        console.error("Failed to load dashboard resources from API", error)
        if (isMounted) {
          setPinnedResources([])
          setRecentResources([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadResources()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 w-[calc(100%-16rem)] flex-1">
        <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />

        <DashboardHero onUploadClick={() => setUploadModalOpen(true)} />

        {/* Pinned Resources Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Pinned Resources</h2>
            <p className="text-muted-foreground">Most popular resources across all departments</p>
          </div>

          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading resources...</div>
          ) : pinnedResources.length === 0 ? (
            <div className="text-sm text-muted-foreground">No resources available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pinnedResources.map((resource) => (
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
          )}
        </div>

        {/* Recent Resources Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-border">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Recent Uploads</h2>
            <p className="text-muted-foreground">Latest additions from the community</p>
          </div>

          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading resources...</div>
          ) : recentResources.length === 0 ? (
            <div className="text-sm text-muted-foreground">No recent uploads yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentResources.map((resource) => (
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
          )}
        </div>

        {/* Footer Padding */}
        <div className="h-12" />
      </main>
    </div>
  )
}
