"use client"

interface ResumeTemplateCardProps {
  id: number
  title: string
  description: string
  preview: string
  downloads: number
  tags: string[]
}

export function ResumeTemplateCard({ title, description, preview, downloads, tags }: ResumeTemplateCardProps) {
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-xl hover:border-primary/50 transition-all">
      <div className="relative w-full h-48 bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${preview}')`,
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">{downloads.toLocaleString()} downloads</span>
          <button className="inline-flex items-center px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
