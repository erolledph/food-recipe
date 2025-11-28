import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-md bg-muted", className)}
      style={{
        animation: "skeleton-loading 2s linear infinite",
      }}
      {...props}
    />
  )
}

export { Skeleton }
