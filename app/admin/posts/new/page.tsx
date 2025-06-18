"use client"

import type React from "react"

import { useState } from "react"
import { useCreatePost } from "@/lib/hooks/use-posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const createPost = useCreatePost()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    try {
      await createPost.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        userId: 1,
      })
      router.push("/admin")
    } catch (error) {
      console.error("Error creating post:", error)
    }
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
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Create New Post</h2>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Post Details</CardTitle>
        </CardHeader>
        <CardContent>
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
                disabled={createPost.isPending || !title.trim() || !body.trim()}
                className="mobile-full button-responsive"
              >
                {createPost.isPending ? "Creating..." : "Create Post"}
              </Button>
              <Button asChild variant="outline" className="mobile-full button-responsive">
                <Link href="/admin">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
