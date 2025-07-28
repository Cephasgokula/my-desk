"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Link, CalendarIcon, ExternalLink } from "lucide-react"

interface SearchResult {
  id: number
  title: string
  content?: string
  description?: string
  type: "note" | "link" | "task"
  category?: string
  url?: string
}

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: {
    notes: any[]
    links: any[]
    tasks: any[]
  }
  onSelectResult: (result: SearchResult) => void
}

export function SearchModal({ open, onOpenChange, data, onSelectResult }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchResults: SearchResult[] = []
    const lowerQuery = query.toLowerCase()

    // Search notes
    data.notes.forEach((note) => {
      if (note.title.toLowerCase().includes(lowerQuery) || note.content.toLowerCase().includes(lowerQuery)) {
        searchResults.push({ ...note, type: "note" })
      }
    })

    // Search links
    data.links.forEach((link) => {
      if (link.title.toLowerCase().includes(lowerQuery) || link.description.toLowerCase().includes(lowerQuery)) {
        searchResults.push({ ...link, type: "link" })
      }
    })

    // Search tasks
    data.tasks.forEach((task) => {
      if (task.title.toLowerCase().includes(lowerQuery)) {
        searchResults.push({ ...task, type: "task" })
      }
    })

    setResults(searchResults)
  }, [query, data])

  const getIcon = (type: string) => {
    switch (type) {
      case "note":
        return <FileText className="h-4 w-4" />
      case "link":
        return <Link className="h-4 w-4" />
      case "task":
        return <CalendarIcon className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search MyDesk</DialogTitle>
          <DialogDescription>Search across your notes, links, and tasks</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {results.length > 0 && (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {results.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    onSelectResult(result)
                    onOpenChange(false)
                  }}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{result.title}</p>
                        <Badge variant="secondary" className="text-xs">
                          {result.type}
                        </Badge>
                        {result.category && (
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                        )}
                      </div>
                      {(result.content || result.description) && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {result.content || result.description}
                        </p>
                      )}
                      {result.url && (
                        <div className="flex items-center gap-1 mt-1">
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{result.url}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
