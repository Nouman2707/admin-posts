export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export interface CreatePostData {
  title: string
  body: string
  userId: number
}

export interface UpdatePostData {
  id: number
  title: string
  body: string
  userId: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const API_BASE = "https://jsonplaceholder.typicode.com"

export const postsApi = {
  // Get paginated posts
  getPosts: async (page = 1, limit = 12): Promise<PaginatedResponse<Post>> => {
    try {
      const response = await fetch(`${API_BASE}/posts`)
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
      }
      const allPosts = await response.json()

      // Simulate pagination since JSONPlaceholder doesn't support it
      const total = allPosts.length
      const totalPages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const data = allPosts.slice(startIndex, endIndex)

      return {
        data: Array.isArray(data) ? data : [],
        total,
        page,
        limit,
        totalPages,
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      throw new Error("Failed to fetch posts. Please check your internet connection.")
    }
  },

  // Get all posts (for admin without pagination)
  getAllPosts: async (): Promise<Post[]> => {
    try {
      const response = await fetch(`${API_BASE}/posts`)
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Error fetching posts:", error)
      throw new Error("Failed to fetch posts. Please check your internet connection.")
    }
  },

  // Get single post
  getPost: async (id: number): Promise<Post> => {
    try {
      if (!id || id <= 0) {
        throw new Error("Invalid post ID")
      }

      const response = await fetch(`${API_BASE}/posts/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Post not found")
        }
        throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      if (!data || !data.id) {
        throw new Error("Invalid post data received")
      }

      return data
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Failed to fetch post. Please try again.")
    }
  },

  // Create post
  createPost: async (data: CreatePostData): Promise<Post> => {
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status} ${response.statusText}`)
      }
      return response.json()
    } catch (error) {
      console.error("Error creating post:", error)
      throw new Error("Failed to create post. Please try again.")
    }
  },

  // Update post
  updatePost: async (data: UpdatePostData): Promise<Post> => {
    try {
      const response = await fetch(`${API_BASE}/posts/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.status} ${response.statusText}`)
      }
      return response.json()
    } catch (error) {
      console.error("Error updating post:", error)
      throw new Error("Failed to update post. Please try again.")
    }
  },

  // Delete post
  deletePost: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      throw new Error("Failed to delete post. Please try again.")
    }
  },
}
