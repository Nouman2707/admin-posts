"use client"

import { Textarea } from "@/components/ui/textarea"

interface SimpleTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function SimpleTextEditor({ content, onChange, placeholder = "Start writing..." }: SimpleTextEditorProps) {
  return (
    <Textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-h-[150px] sm:min-h-[200px] resize-none text-sm sm:text-base"
      rows={8}
    />
  )
}
