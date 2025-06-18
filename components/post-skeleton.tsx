import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function PostSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <Skeleton className="h-4 sm:h-6 w-3/4" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-3 sm:h-4 w-2/3" />
        </div>
        <Skeleton className="h-8 sm:h-9 w-full mt-4" />
      </CardContent>
    </Card>
  )
}

export function PostListSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  )
}
