"use client"

import { useState } from "react"
import { useAdminPosts, useDeletePost } from "@/lib/hooks/use-posts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostListSkeleton } from "@/components/post-skeleton"
import { Pagination } from "@/components/pagination"
import { Input } from "@/components/ui/input"
import { AlertCircle, Edit, Trash2, Plus, Search } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "")
}

function truncateText(text: string, maxLength = 100) {
  const stripped = stripHtml(text)
  if (stripped.length <= maxLength) return stripped
  return stripped.slice(0, maxLength) + "..."
}

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(9)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: postsResponse, isLoading, error } = useAdminPosts(currentPage, postsPerPage)
  const deletePost = useDeletePost()

  const handleDelete = (id: number) => {
    deletePost.mutate(id, {
      onSuccess: () => {
        // If we're on a page that becomes empty after deletion, go to previous page
        if (postsResponse && postsResponse.data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      },
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePostsPerPageChange = (value: string) => {
    setPostsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Filter posts based on search term (client-side filtering for demo)
  const filteredPosts =
    postsResponse?.data?.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stripHtml(post.body).toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="text-center px-4">
          <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Failed to load posts</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Manage Posts</h2>
          {postsResponse && <span className="text-sm text-muted-foreground">({postsResponse.total} total)</span>}
        </div>
        <Button asChild size="sm" className="mobile-full button-responsive">
          <Link href="/admin/posts/new">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>

        {/* Posts per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
          <Select value={postsPerPage.toString()} onValueChange={handlePostsPerPageChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="9">9</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="18">18</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <PostListSkeleton />
      ) : (
        <>
          {searchTerm && (
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length > 0
                ? `Found ${filteredPosts.length} post${filteredPosts.length === 1 ? "" : "s"} matching "${searchTerm}"`
                : `No posts found matching "${searchTerm}"`}
            </div>
          )}

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {(searchTerm ? filteredPosts : postsResponse?.data || []).map((post) => (
              <Card key={post.id} className="flex flex-col hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base sm:text-lg leading-tight flex-1">
                      {post.title}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md shrink-0">
                      ID: {post.id}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div
                    className="text-muted-foreground mb-4 text-sm sm:text-base line-clamp-3 flex-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: truncateText(post.body) }}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 button-responsive">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex-1 button-responsive">
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="mx-4 max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-base sm:text-lg">Delete Post</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm sm:text-base">
                            Are you sure you want to delete "{post.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="mobile-full">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 mobile-full"
                            disabled={deletePost.isPending}
                          >
                            {deletePost.isPending ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination - only show if not searching and there are multiple pages */}
          {!searchTerm && postsResponse && postsResponse.totalPages > 1 && (
            <div className="mt-8 sm:mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={postsResponse.totalPages}
                onPageChange={handlePageChange}
              />

              {/* Pagination Info */}
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Showing {(currentPage - 1) * postsPerPage + 1} to{" "}
                {Math.min(currentPage * postsPerPage, postsResponse.total)} of {postsResponse.total} posts
              </div>
            </div>
          )}

          {/* Empty State */}
          {postsResponse && postsResponse.data.length === 0 && !searchTerm && (
            <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
              <div className="text-center px-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Get started by creating your first post
                </p>
                <Button asChild>
                  <Link href="/admin/posts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
