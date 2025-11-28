"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Author } from "@/components/ui/author"
import { AuthorCard } from "@/components/ui/author-card"
import { SocialShare } from "@/components/ui/social-share"
import { SubscribeForm } from "@/components/blog/SubscribeForm"
import { CommentSection } from "@/components/blog/CommentSection"
import { RecentPosts } from "@/components/blog/RecentPosts"
import { AnchorLink } from "@/components/blog/AnchorLink"
import { calculateReadingTime } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface BlogPostData {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  date: string
  author?: string
  tags?: string[]
  image?: string
}

interface BlogPostProps {
  post: BlogPostData
  siteUrl: string
}

export function BlogPost({ post, siteUrl }: BlogPostProps) {
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const readingTime = calculateReadingTime(post.content)

  return (
    <main className="min-h-screen bg-background">
      <article className="container px-4 sm:px-8 mx-auto xl:px-5 max-w-screen-lg py-16 md:py-24">
        <header className="mx-auto max-w-screen-md">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground dark:text-white lg:leading-tight mb-8 font-serif">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 pb-8 border-b border-shadow-gray">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Author name={post.author || 'Anonymous'} />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
                <span aria-hidden="true">·</span>
                <span>{readingTime}</span>
              </div>
            </div>
            <div className="flex justify-start sm:justify-end">
              <SocialShare url={postUrl} title={post.title} description={post.excerpt} />
            </div>
          </div>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12" role="list" aria-label="Post tags">
              {post.tags.map((tag) => (
                <span key={tag} role="listitem" className="inline-block text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full bg-muted text-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.image && (
          <figure className="relative z-0 mx-auto max-w-screen-lg overflow-hidden lg:rounded-lg mb-8">
            <img
              alt={`Featured image for ${post.title}`}
              src={post.image}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <figcaption className="text-center text-xs text-muted-foreground mt-2">{post.title}</figcaption>
          </figure>
        )}

        <div className="mx-auto max-w-screen-md">
          <div className="prose mx-auto dark:prose-invert prose-a:text-primary max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => {
                  const id = typeof children === 'string'
                    ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    : undefined
                  return (
                    <h2 id={id} className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground dark:text-white mt-16 mb-8 scroll-mt-24 font-serif">
                      {children}
                    </h2>
                  )
                },
                h2: ({ children }) => {
                  const id = typeof children === 'string'
                    ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    : undefined
                  return (
                    <h3 id={id} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground dark:text-white mt-14 mb-6 scroll-mt-24 font-serif">
                      {children}
                    </h3>
                  )
                },
                h3: ({ children }) => {
                  const id = typeof children === 'string'
                    ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    : undefined
                  return (
                    <h4 id={id} className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground dark:text-white mt-12 mb-5 scroll-mt-24">
                      {children}
                    </h4>
                  )
                },
                p: ({ children }) => (
                  <p className="text-lg leading-relaxed text-foreground/85 dark:text-gray-300 mb-8">
                    {children}
                  </p>
                ),
                a: ({ href, children }) => {
                  if (!href) return <span>{children}</span>
                  
                  const isAnchorLink = href.startsWith('#')
                  const isExternalLink = href.startsWith('http')

                  if (isAnchorLink) {
                    return <AnchorLink href={href}>{children}</AnchorLink>
                  }

                  if (isExternalLink) {
                    return (
                      <a
                        href={href}
                        className="text-primary hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    )
                  }

                  return (
                    <a href={href} className="text-primary hover:underline font-medium">
                      {children}
                    </a>
                  )
                },
                code: ({ children }) => (
                  <code className="bg-muted dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-foreground dark:text-gray-300">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="overflow-x-auto bg-muted dark:bg-gray-800 p-6 rounded my-10 border border-shadow-gray dark:border-gray-700">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-6 my-10 italic text-foreground/75 dark:text-gray-400">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => <ul className="space-y-3 my-8 ml-6 list-disc">{children}</ul>,
                ol: ({ children }) => <ol className="space-y-3 my-8 ml-6 list-decimal">{children}</ol>,
                li: ({ children }) => (
                  <li className="text-lg leading-relaxed text-foreground/85 dark:text-gray-300">
                    {children}
                  </li>
                ),
                img: ({ src, alt }) => (
                  <img
                    src={src}
                    alt={alt || 'Content image'}
                    className="rounded-lg my-4 max-w-full h-auto"
                    loading="lazy"
                    width={1200}
                    height={800}
                  />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8 border border-shadow-gray rounded-lg">
                    <table className="w-full border-collapse text-sm md:text-base">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted dark:bg-gray-800 border-b border-shadow-gray">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-border">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-muted/50 dark:hover:bg-gray-800/50 transition-colors">
                    {children}
                  </tr>
                ),
                th: ({ children, align }) => (
                  <th 
                    className={`px-4 py-3 text-left font-semibold text-foreground dark:text-gray-200 ${
                      align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    {children}
                  </th>
                ),
                td: ({ children, align }) => (
                  <td 
                    className={`px-4 py-3 text-foreground/85 dark:text-gray-300 ${
                      align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    {children}
                  </td>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <nav className="mb-12 mt-16 flex justify-center pt-8 border-t border-shadow-gray" aria-label="Post navigation">
            <Link href="/blog">
              <Button variant="ghost" className="bg-muted/20 rounded-full px-6 py-2 text-sm text-primary hover:text-primary/80 font-medium">
                ← View all posts
              </Button>
            </Link>
          </nav>

          <aside aria-label="Author information">
            <AuthorCard name={post.author || 'Anonymous'} image="/avatar.svg" />
          </aside>

          <aside aria-label="Newsletter subscription">
            <SubscribeForm postSlug={post.slug} />
          </aside>

          <section aria-label="Comments">
            <CommentSection postSlug={post.slug} />
          </section>

          <section aria-label="Recommended Posts" className="mt-16 pt-12 border-t border-shadow-gray">
            <div className="mb-12">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">Recommended</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>More Posts</h3>
            </div>
            <RecentPosts excludeSlug={post.slug} showCTA={true} />
          </section>
        </div>
      </article>
    </main>
  )
}
