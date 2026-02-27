"use client"

import { useState } from "react"
import { File, Play, Download, MoreVertical } from "lucide-react"

interface ResourceCardProps {
  id: string
  title: string
  type: "document" | "video"
  downloads?: number
  date: string
  thumbnail?: string
}

export function ResourceCard({ id, title, type, downloads = 0, date, thumbnail }: ResourceCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!id || isDownloading) return

    try {
      setIsDownloading(true)
      const res = await fetch(`/api/v1/resources/${id}/download`, {
        method: "POST",
      })

      if (!res.ok) {
        console.error("Failed to start download")
        return
      }

      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error during download", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all duration-300">
      {/* Thumbnail/Icon Area */}
      <div className="relative h-32 bg-secondary flex items-center justify-center overflow-hidden">
        {type === "video" ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
            <Play className="w-12 h-12 text-primary opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-200" />
            <File className="w-12 h-12 text-primary opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-card-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{date}</span>
          <span>{downloads} downloads</span>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-xs font-medium"
          >
            <Download className="w-3 h-3" />
            {isDownloading ? "Preparing..." : "Download"}
          </button>
          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
