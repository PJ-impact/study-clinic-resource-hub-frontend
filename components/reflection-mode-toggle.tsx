"use client"
import { Moon, Sun } from "lucide-react"

interface ReflectionModeToggleProps {
  isActive: boolean
  onToggle: (active: boolean) => void
}

export function ReflectionModeToggle({ isActive, onToggle }: ReflectionModeToggleProps) {
  return (
    <button
      onClick={() => onToggle(!isActive)}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isActive
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      {isActive ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      {isActive ? "Reflection Mode" : "Normal Mode"}
    </button>
  )
}
