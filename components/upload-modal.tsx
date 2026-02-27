"use client"

import { useState, useEffect } from "react"
import { Upload, File, Video, Loader2, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEPARTMENTS } from "@/lib/constants"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [title, setTitle] = useState("")
  const [fileType, setFileType] = useState<"document" | "video">("document")
  const [department, setDepartment] = useState("")
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const departments = DEPARTMENTS
  const baseLevels = ["Level 100", "Level 200", "Level 300", "Level 400"]
  const normalizedDept = department.toLowerCase()
  const isPharmacy = normalizedDept.includes("pharmacy")
  const isArchitecture = normalizedDept.includes("architecture")
  const allowedLevels = [
    ...baseLevels,
    ...(isPharmacy ? ["Level 500", "Level 600"] : []),
    ...(!isPharmacy && isArchitecture ? ["Level 500"] : []),
  ]

  useEffect(() => {
    if (level && !allowedLevels.includes(level)) {
      setLevel("")
    }
  }, [department])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || (!department && !category)) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }

    setIsUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('type', fileType.toUpperCase())
    if (department) formData.append('department', department)
    if (category) formData.append('category', category)
    if (level) formData.append('level', level)

    try {
      const res = await fetch("/api/v1/resources", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: "success", text: "Resource uploaded successfully!" })
        setTimeout(() => {
          onClose()
          setTitle("")
          setFile(null)
          setDepartment("")
          setCategory("")
          setLevel("")
          setMessage(null)
        }, 1500)
      } else {
        const errorText =
          data?.error?.message || data?.message || "Upload failed"
        setMessage({ type: "error", text: errorText })
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred." })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-lg font-semibold text-card-foreground">Upload Resource</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           {message && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {message.type === 'error' && <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Resource Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resource title"
              required
              className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Department (Optional)</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Growth Category (Optional)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category</option>
              <option value="Spiritual">Spiritual</option>
              <option value="Personal">Personal</option>
              <option value="Career">Career</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Level (Optional)</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a level</option>
              {allowedLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* File Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">File Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFileType("document")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-colors ${
                  fileType === "document"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-border"
                }`}
              >
                <File className="w-4 h-4" />
                <span className="text-sm font-medium">Document</span>
              </button>
              <button
                type="button"
                onClick={() => setFileType("video")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-colors ${
                  fileType === "video"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-border"
                }`}
              >
                <Video className="w-4 h-4" />
                <span className="text-sm font-medium">Video</span>
              </button>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <div className="relative flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              {file ? (
                 <div className="text-sm font-medium text-primary break-all">
                    {file.name}
                 </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-card-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX, MP4 (max 50MB)</p>
                </>
              )}
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
                accept={fileType === 'document' ? ".pdf,.doc,.docx" : ".mp4,.mov,.avi"}
              />
              <label
                htmlFor="file-upload"
                className="absolute inset-0 cursor-pointer"
                aria-label="Upload file"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Resource"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
