"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useDebounce } from "@/lib/hooks/use-debounce"

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface SearchInputProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "")
}

function truncateText(text: string, maxLength = 100) {
  const stripped = stripHtml(text)
  if (stripped.length <= maxLength) return stripped
  return stripped.slice(0, maxLength) + "..."
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

export function SearchInput({ onSearch, placeholder = "Search posts...", className = "" }: SearchInputProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(query, 300)

  // Search function
  const searchPosts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts")
      if (!response.ok) throw new Error("Failed to search posts")

      const allPosts: Post[] = await response.json()

      // Filter posts based on search query
      const filteredPosts = allPosts
        .filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stripHtml(post.body).toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 8) // Limit to 8 results for better UX

      setResults(filteredPosts)
      setIsOpen(true)
    } catch (err) {
      setError("Failed to search posts")
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Effect for debounced search
  useEffect(() => {
    if (debouncedQuery) {
      searchPosts(debouncedQuery)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedQuery])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          className="pl-10 pr-10 h-10 bg-background/50 border-muted-foreground/20 focus:border-primary focus:bg-background transition-all duration-200"
        />
        {query && !isLoading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted rounded-full"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() || results.length > 0 || error) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-hidden shadow-xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
          <CardContent className="p-0">
            {error ? (
              <div className="p-4 text-center text-sm text-destructive">{error}</div>
            ) : results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto overflow-x-hidden">
                <div className="p-3 text-xs text-muted-foreground border-b bg-muted/30 font-medium">
                  Found {results.length} result{results.length === 1 ? "" : "s"}
                </div>
                {results.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    onClick={handleResultClick}
                    className={`block p-4 hover:bg-muted/50 transition-all duration-150 border-b last:border-b-0 search-result-item ${
                      index === 0 ? "bg-muted/20" : ""
                    }`}
                  >
                    <div className="space-y-2">
                      <h4
                        className="font-medium text-sm leading-tight line-clamp-2 text-foreground"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(post.title, query),
                        }}
                      />
                      <p
                        className="text-xs text-muted-foreground line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(truncateText(post.body, 120), query),
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground/70 font-mono">#{post.id}</span>
                        <span className="text-xs text-primary font-medium">Read more →</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {results.length === 8 && (
                  <div className="p-3 text-center text-xs text-muted-foreground bg-muted/20 border-t">
                    Showing first 8 results. Try a more specific search for better results.
                  </div>
                )}
              </div>
            ) : query.trim() && !isLoading ? (
              <div className="p-6 text-center">
                <div className="text-sm text-muted-foreground mb-2">No posts found for</div>
                <div className="text-sm font-medium">"{query}"</div>
                <div className="text-xs text-muted-foreground mt-2">Try different keywords or check spelling</div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
