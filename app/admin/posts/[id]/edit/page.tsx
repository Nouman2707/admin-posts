"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePost, useUpdatePost } from "@/lib/hooks/use-posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

export default function EditPostPage() {
  const params = useParams()
  const postId = Number.parseInt(params.id as string)
  const { data: post, isLoading, error } = usePost(postId)
  const updatePost = useUpdatePost()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setBody(post.body)
    }
  }, [post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    try {
      await updatePost.mutateAsync({
        id: postId,
        title: title.trim(),
        body: body.trim(),
        userId: post?.userId || 1,
      })
      router.push("/admin")
    } catch (error) {
      console.error("Error updating post:", error)
    }
  }

  // Validate the post ID
  if (isNaN(postId) || postId <= 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button asChild variant="ghost" size="sm" className="button-responsive">
            <Link href="/admin">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Back to Posts
            </Link>
          </Button>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Edit Post</h2>
        </div>
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center px-4">
            <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Invalid post ID</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">The post ID provided is not valid</p>
            <Button asChild size="sm" className="button-responsive">
              <Link href="/admin">Go back to admin</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button asChild variant="ghost" size="sm" className="button-responsive">
            <Link href="/admin">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Back to Posts
            </Link>
          </Button>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Edit Post</h2>
        </div>
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center px-4">
            <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Post not found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              The post you're trying to edit doesn't exist
            </p>
            <Button asChild size="sm" className="button-responsive">
              <Link href="/admin">Go back to admin</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <Button asChild variant="ghost" size="sm" className="button-responsive">
          <Link href="/admin">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Back to Posts
          </Link>
        </Button>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Edit Post</h2>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12 sm:w-16" />
                <Skeleton className="h-9 sm:h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 sm:w-20" />
                <Skeleton className="h-48 sm:h-64 w-full" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm sm:text-base">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title..."
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body" className="text-sm sm:text-base">
                  Content
                </Label>
                <RichTextEditor content={body} onChange={setBody} placeholder="Write your post content..." />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={updatePost.isPending || !title.trim() || !body.trim()}
                  className="mobile-full button-responsive"
                >
                  {updatePost.isPending ? "Updating..." : "Update Post"}
                </Button>
                <Button asChild variant="outline" className="mobile-full button-responsive">
                  <Link href="/admin">Cancel</Link>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
