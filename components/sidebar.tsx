"use client"

import { useEffect, useState } from "react"
import { ChevronDown, BookOpen, Lightbulb, Briefcase, Heart, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { logout } from "@/actions/auth"

const growthCategories = [
  { label: "Spiritual", icon: Heart, color: "text-blue-500" },
  { label: "Personal", icon: Lightbulb, color: "text-yellow-500" },
  { label: "Career", icon: Briefcase, color: "text-indigo-600" },
]

export function Sidebar() {
  const router = useRouter()
  const [expandedDept, setExpandedDept] = useState(true)
  const [expandedGrowth, setExpandedGrowth] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [departments, setDepartments] = useState<{ id: string; name: string; slug: string }[]>([])
  const [isLoadingDepts, setIsLoadingDepts] = useState(false)
  const [deptError, setDeptError] = useState<string | null>(null)
  const [openDeptId, setOpenDeptId] = useState<string | null>(null)

  const baseLevels = ["Level 100", "Level 200", "Level 300", "Level 400"]

  const getLevelsForDepartment = (name: string) => {
    const normalized = name.toLowerCase()
    return [
      ...baseLevels,
      ...(normalized.includes("pharmacy") ? ["Level 500", "Level 600"] : []),
      ...(normalized.includes("architecture") ? ["Level 500"] : []),
    ]
  }

  useEffect(() => {
    let isMounted = true

    async function loadDepartments() {
      setIsLoadingDepts(true)
      setDeptError(null)
      try {
        const res = await fetch("/api/v1/departments", { cache: "no-store" })
        if (!res.ok) {
          throw new Error("Failed to load departments")
        }
        const data = await res.json()
        if (!isMounted) return
        setDepartments(
          (Array.isArray(data) ? data : []).map((d: any) => ({
            id: String(d.id),
            name: d.name as string,
            slug: d.slug as string,
          })),
        )
      } catch (error) {
        console.error("Error loading departments from API", error)
        if (isMounted) {
          setDeptError("Failed to load departments")
          setDepartments([])
        }
      } finally {
        if (isMounted) {
          setIsLoadingDepts(false)
        }
      }
    }

    loadDepartments()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} flex flex-col z-40`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between shrink-0">
        <div className={`flex items-center gap-2 ${isCollapsed ? "hidden" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-primary">Hub</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? "rotate-90" : "-rotate-90"}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Departments Section */}
        <div className="p-4 space-y-2">
        <button
          onClick={() => setExpandedDept(!expandedDept)}
          className={`w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground font-medium text-sm ${!isCollapsed ? "" : "justify-center"}`}
        >
          {!isCollapsed && "Academic Departments"}
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedDept ? "" : "-rotate-90"}`} />
        </button>

        {expandedDept && !isCollapsed && (
          <div className="space-y-1">
            {isLoadingDepts ? (
              <div className="px-3 py-2 text-xs text-sidebar-foreground/70">Loading departments...</div>
            ) : deptError ? (
              <div className="px-3 py-2 text-xs text-red-500">{deptError}</div>
            ) : (
              departments.map((dept) => (
                <div key={dept.id} className="space-y-1">
                  <button
                    onClick={() => setOpenDeptId(openDeptId === dept.id ? null : dept.id)}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-primary transition-colors"
                  >
                    {dept.name}
                  </button>
                  {openDeptId === dept.id && (
                    <div className="mt-1 ml-4">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const value = e.target.value
                          const basePath = `/departments/${dept.slug}`
                          const href = value ? `${basePath}?level=${encodeURIComponent(value)}` : basePath
                          router.push(href)
                        }}
                        className="w-full border border-sidebar-border bg-sidebar rounded-md px-2 py-1 text-xs text-sidebar-foreground"
                      >
                        <option value="">All Levels</option>
                        {getLevelsForDepartment(dept.name).map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Growth Section */}
      <div className="p-4 space-y-2 border-t border-sidebar-border">
        <button
          onClick={() => setExpandedGrowth(!expandedGrowth)}
          className={`w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground font-medium text-sm ${!isCollapsed ? "" : "justify-center"}`}
        >
          {!isCollapsed && "Growth"}
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedGrowth ? "" : "-rotate-90"}`} />
        </button>

        {expandedGrowth && !isCollapsed && (
          <div className="space-y-1">
            {growthCategories.map(({ label, icon: Icon, color }) => (
              <Link
                key={label}
                href={`/growth/${label.toLowerCase()}`}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-primary transition-colors"
              >
                <Icon className={`w-4 h-4 ${color}`} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-sidebar-border shrink-0">
        <form action={logout}>
          <button
            type="submit"
            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-sidebar-foreground font-medium text-sm ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && "Logout"}
          </button>
        </form>
      </div>
    </aside>
  )
}
