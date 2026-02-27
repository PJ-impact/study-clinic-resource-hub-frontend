"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeroProps {
  onUploadClick: () => void
}

export function DashboardHero({ onUploadClick }: DashboardHeroProps) {
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-background pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to Resource Hub</h1>
          <p className="text-lg text-muted-foreground">Your comprehensive academic and growth platform</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for notes, videos, or blueprints..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={onUploadClick} className="bg-primary hover:bg-primary/90">
            Upload Resource
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-muted-foreground">Total Resources</p>
            <p className="text-2xl font-bold text-primary mt-1">1,245</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-muted-foreground">Downloads This Week</p>
            <p className="text-2xl font-bold text-primary mt-1">892</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-muted-foreground">Active Contributors</p>
            <p className="text-2xl font-bold text-primary mt-1">342</p>
          </div>
        </div>
      </div>
    </div>
  )
}
