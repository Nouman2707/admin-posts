import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { postsApi } from "../api"

export function usePosts(page = 1, limit = 12) {
  return useQuery({
    queryKey: ["posts", page, limit],
    queryFn: () => postsApi.getPosts(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

export function useAllPosts() {
  return useQuery({
    queryKey: ["posts", "all"],
    queryFn: postsApi.getAllPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => postsApi.getPost(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a 404 error
      if (error instanceof Error && error.message.includes("not found")) {
        return false
      }
      return failureCount < 2
    },
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: (error) => {
      console.error("Failed to create post:", error.message)
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postsApi.updatePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["posts", data.id] })
    },
    onError: (error) => {
      console.error("Failed to update post:", error.message)
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: (error) => {
      console.error("Failed to delete post:", error.message)
    },
  })
}

export function useAdminPosts(page = 1, limit = 9) {
  return useQuery({
    queryKey: ["admin-posts", page, limit],
    queryFn: () => postsApi.getPosts(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}
