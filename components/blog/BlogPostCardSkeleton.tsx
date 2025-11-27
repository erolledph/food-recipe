import { Skeleton } from "@/components/ui/skeleton"

interface BlogPostCardSkeletonProps {
  titleSize?: "small" | "medium" | "large"
  showImage?: boolean
}

export function BlogPostCardSkeleton({
  titleSize = "medium",
  showImage = true,
}: BlogPostCardSkeletonProps) {
  const titleHeightClasses = {
    small: "h-7 sm:h-8",
    medium: "h-8 sm:h-9",
    large: "h-10 sm:h-12",
  }

  const avatarSizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-10 h-10",
  }

  return (
    <article className="border-b border-shadow-gray pb-12 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:gap-8 gap-4 items-start">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton
              className={`${avatarSizeClasses[titleSize === "small" ? "small" : "medium"]} rounded-full`}
            />
            <div className="flex-1">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Skeleton
            className={`${titleHeightClasses[titleSize]} w-full mb-3`}
          />
          <Skeleton className={`${titleHeightClasses[titleSize]} w-3/4 mb-4`} />

          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        {showImage && (
          <div className="hidden sm:block w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            <Skeleton className="w-full h-full rounded-sm" />
          </div>
        )}
      </div>
    </article>
  )
}
