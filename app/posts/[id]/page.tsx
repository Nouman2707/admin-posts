"use client"

import { usePost } from "@/lib/hooks/use-posts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Suspense } from "react"

function PostContent({ postId }: { postId: number }) {
  const { data: post, isLoading, error } = usePost(postId)

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <Skeleton className="h-6 sm:h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-3 sm:h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="text-center px-4">
          <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Post not found</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            The post you're looking for doesn't exist or failed to load
          </p>
          <Button asChild size="sm" className="button-responsive">
            <Link href="/">Go back to posts</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl lg:text-3xl leading-tight">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-sm sm:prose-base prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </CardContent>
    </Card>
  )
}

export default function PostDetailPage() {
  const params = useParams()
  const postId = Number.parseInt(params.id as string)

  // Validate the post ID
  if (isNaN(postId) || postId <= 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container-responsive py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button asChild variant="ghost" size="sm" className="button-responsive">
                  <Link href="/">
                    <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Back
                  </Link>
                </Button>
                <h1 className="text-lg sm:text-2xl font-bold">Post</h1>
              </div>
              <div className="flex items-center gap-2">
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
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Invalid post ID</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">The post ID provided is not valid</p>
              <Button asChild size="sm" className="button-responsive">
                <Link href="/">Go back to posts</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container-responsive py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button asChild variant="ghost" size="sm" className="button-responsive">
                <Link href="/">
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Back
                </Link>
              </Button>
              <h1 className="text-lg sm:text-2xl font-bold">Post</h1>
            </div>
            <div className="flex items-center gap-2">
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
        <div className="max-w-4xl mx-auto">
          <Suspense
            fallback={
              <Card>
                <CardHeader className="pb-4">
                  <Skeleton className="h-6 sm:h-8 w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-3 sm:h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            }
          >
            <PostContent postId={postId} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
