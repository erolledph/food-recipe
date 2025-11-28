import { Skeleton } from "@/components/ui/skeleton"

export function BlogPostSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <article className="container px-4 sm:px-8 mx-auto xl:px-5 max-w-screen-lg py-16 md:py-24">
        <div className="mx-auto max-w-screen-md">
          <Skeleton className="h-12 sm:h-16 lg:h-20 w-full mb-4" />
          <Skeleton className="h-12 sm:h-16 lg:h-20 w-3/4 mb-8" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 pb-8 border-b border-shadow-gray">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
          </div>

          <div className="flex flex-wrap gap-2 mb-12">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
        </div>
      </article>

      <div className="relative z-0 mx-auto max-w-screen-lg overflow-hidden lg:rounded-lg mb-4 px-4 sm:px-8">
        <Skeleton className="w-full aspect-video rounded-lg" />
        <Skeleton className="h-3 w-48 mx-auto mt-2" />
      </div>

      <article className="container px-4 sm:px-8 mx-auto xl:px-5 max-w-screen-lg py-16 md:py-20">
        <div className="mx-auto max-w-screen-md">
          <div className="space-y-6 mb-16">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />

            <div className="my-10">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>

            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />

            <div className="my-10">
              <Skeleton className="h-8 w-2/3 mb-4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>

            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>

          <div className="mb-12 flex justify-center pt-8 border-t border-shadow-gray">
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>

          <div className="rounded-2xl bg-muted/20 px-6 py-8 sm:px-10 sm:py-10 border border-shadow-gray">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full mx-auto sm:mx-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-32 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto sm:mx-0" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
