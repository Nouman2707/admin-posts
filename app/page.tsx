"use client"

import { useState } from "react"
import { usePosts } from "@/lib/hooks/use-posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { PostListSkeleton } from "@/components/post-skeleton"
import { Pagination } from "@/components/pagination"
import { SearchInput } from "@/components/search-input"
import { MobileSearch } from "@/components/mobile-search"
import { AlertCircle, Settings, RefreshCw } from "lucide-react"
import Link from "next/link"

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "")
}

function truncateText(text: string, maxLength = 150) {
  const stripped = stripHtml(text)
  if (stripped.length <= maxLength) return stripped
  return stripped.slice(0, maxLength) + "..."
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 12
  const { data: postsResponse, isLoading, error, refetch } = usePosts(currentPage, postsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container-responsive py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Title and count */}
              <div className="flex items-center gap-3 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold whitespace-nowrap">Posts</h1>
                <span className="text-sm text-muted-foreground hidden sm:inline">Error loading</span>
              </div>

              {/* Center - Search (Desktop) */}
              <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
                <SearchInput placeholder="Search posts..." className="w-full max-w-lg" />
              </div>

              {/* Right side - Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <MobileSearch className="md:hidden" />
                <Button asChild variant="outline" size="sm" className="button-responsive">
                  <Link href="/admin">
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Admin</span>
                    <span className="sm:hidden">Admin</span>
                  </Link>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>
        <main className="container-responsive py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center px-4">
              <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mx-auto mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Failed to load posts</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Please check your internet connection and try again
              </p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Title and count */}
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold whitespace-nowrap">Posts</h1>
              {postsResponse && (
                <span className="text-sm text-muted-foreground hidden sm:inline">({postsResponse.total} total)</span>
              )}
            </div>

            {/* Center - Search (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
              <SearchInput placeholder="Search posts..." className="w-full max-w-lg" />
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <MobileSearch className="md:hidden" />
              <Button asChild variant="outline" size="sm" className="button-responsive">
                <Link href="/admin">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Admin</span>
                  <span className="sm:hidden">Admin</span>
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-6 sm:py-8">
        {isLoading ? (
          <PostListSkeleton />
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {postsResponse?.data?.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow duration-200 flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-2 text-base sm:text-lg leading-tight">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div
                      className="text-muted-foreground mb-4 text-sm sm:text-base line-clamp-3 flex-1 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: truncateText(post.body) }}
                    />
                    <Button asChild variant="outline" size="sm" className="mobile-full button-responsive mt-auto">
                      <Link href={`/posts/${post.id}`}>Read More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {postsResponse && postsResponse.totalPages > 1 && (
              <div className="mt-8 sm:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={postsResponse.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {postsResponse && postsResponse.data.length === 0 && (
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center px-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">No posts found</h2>
              <p className="text-sm sm:text-base text-muted-foreground">There are no posts to display at the moment</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
