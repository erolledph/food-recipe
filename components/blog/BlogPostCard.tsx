"use client"

import Link from "next/link"

export interface BlogPostCardProps {
  id: string
  title: string
  slug: string
  image?: string
}

export function BlogPostCard({
  id,
  title,
  slug,
  image,
}: BlogPostCardProps) {
  return (
    <article className="group">
      <Link href={`/blog/${slug}`} className="block">
        <div className="flex flex-col gap-4">
          {image && (
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <h2
            className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {title}
          </h2>
        </div>
      </Link>
    </article>
  )
}
