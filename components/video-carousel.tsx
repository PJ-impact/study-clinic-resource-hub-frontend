"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

interface CarouselItem {
  id: number
  title: string
  thumbnail: string
  duration: string
  category: string
}

interface VideoCarouselProps {
  items: CarouselItem[]
  title: string
}

export function VideoCarousel({ items, title }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const visibleItems = [
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ]

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-foreground mb-6">{title}</h3>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full aspect-video bg-slate-200 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${item.thumbnail}')`,
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <Play className="w-12 h-12 text-white fill-white opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="p-4">
                <div className="text-xs font-semibold text-primary mb-2">{item.category}</div>
                <h4 className="font-semibold text-foreground mb-2 line-clamp-2">{item.title}</h4>
                <div className="text-xs text-muted-foreground">{item.duration}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors md:flex hidden items-center justify-center w-10 h-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors md:flex hidden items-center justify-center w-10 h-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-primary w-8" : "bg-border w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
