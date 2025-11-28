"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { storage } from "@/lib/firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Link2, List, ListOrdered, Heading1, Heading2, Code, Quote, Eye, EyeOff, Image, Upload, ImagePlus } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { toast } from "sonner"
import { fromBlob } from "image-resize-compress"

export default function CreatePostPage() {
  const router = useRouter()
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const headerImageInputRef = useRef<HTMLInputElement>(null)
  const contentImageInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [uploadingHeaderImage, setUploadingHeaderImage] = useState(false)
  const [uploadingContentImage, setUploadingContentImage] = useState(false)
  const [headerImageProgress, setHeaderImageProgress] = useState(0)
  const [contentImageProgress, setContentImageProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: "",
    author: "DigitalAxis",
    excerpt: "",
    tags: "",
    image: "",
    content: "",
  })

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.content.substring(start, end)
    const newText = formData.content.substring(0, start) + before + selectedText + after + formData.content.substring(end)

    setFormData({ ...formData, content: newText })

    setTimeout(() => {
      textarea.focus()
      const newPosition = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const insertImage = () => {
    insertMarkdown("![Alt text](", "image_url)")
  }

  const handleHeaderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB")
      return
    }

    setUploadingHeaderImage(true)
    setHeaderImageProgress(0)

    try {
      toast.info("Compressing image...")

      const compressedBlob = await fromBlob(file, 85, 1200, 630, 'webp')

      const timestamp = Date.now()
      const fileName = `blog-headers/${timestamp}-header.webp`
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, compressedBlob)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setHeaderImageProgress(progress)
        },
        (error) => {
          console.error("Upload error:", error)
          toast.error("Failed to upload image")
          setUploadingHeaderImage(false)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          setFormData({ ...formData, image: downloadURL })
          toast.success("Header image uploaded and optimized")
          setUploadingHeaderImage(false)
          setHeaderImageProgress(0)
          if (headerImageInputRef.current) {
            headerImageInputRef.current.value = ''
          }
        }
      )
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
      setUploadingHeaderImage(false)
    }
  }

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB")
      return
    }

    setUploadingContentImage(true)
    setContentImageProgress(0)

    try {
      toast.info("Compressing image...")

      const compressedBlob = await fromBlob(file, 85, 1200, 'auto', 'webp')

      const timestamp = Date.now()
      const fileName = `blog-content/${timestamp}-content.webp`
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, compressedBlob)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setContentImageProgress(progress)
        },
        (error) => {
          console.error("Upload error:", error)
          toast.error("Failed to upload image")
          setUploadingContentImage(false)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          const textarea = contentRef.current
          if (!textarea) return

          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const imageMarkdown = `![Image](${downloadURL})`
          const newContent = formData.content.substring(0, start) + imageMarkdown + formData.content.substring(end)

          setFormData({ ...formData, content: newContent })

          setTimeout(() => {
            textarea.focus()
            const newPosition = start + imageMarkdown.length
            textarea.setSelectionRange(newPosition, newPosition)
          }, 0)

          toast.success("Image uploaded and optimized")
          setUploadingContentImage(false)
          setContentImageProgress(0)
          if (contentImageInputRef.current) {
            contentImageInputRef.current.value = ''
          }
        }
      )
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
      setUploadingContentImage(false)
    }
  }

  const markdownTools = [
    { icon: Bold, label: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertMarkdown("*", "*") },
    { icon: Heading1, label: "Heading 1", action: () => insertMarkdown("# ") },
    { icon: Heading2, label: "Heading 2", action: () => insertMarkdown("## ") },
    { icon: Link2, label: "Link", action: () => insertMarkdown("[", "](url)") },
    { icon: List, label: "Bullet List", action: () => insertMarkdown("- ") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertMarkdown("1. ") },
    { icon: Code, label: "Code", action: () => insertMarkdown("`", "`") },
    { icon: Quote, label: "Quote", action: () => insertMarkdown("> ") },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("[Create Post] Starting submission...")
    console.log("[Create Post] Form data:", {
      hasTitle: !!formData.title,
      hasContent: !!formData.content,
      titleLength: formData.title?.length || 0,
      contentLength: formData.content?.length || 0,
      hasImage: !!formData.image,
      hasTags: !!formData.tags,
    })

    try {
      console.log("[Create Post] Sending POST request to /api/posts...")
      
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          excerpt: formData.excerpt,
          tags: tagsArray,
          image: formData.image,
          content: formData.content,
        }),
      })

      console.log("[Create Post] Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      })

      if (!response.ok) {
        const data = await response.json()
        console.error("[Create Post] Error response:", data)
        throw new Error(data.error || "Failed to create post")
      }

      const result = await response.json()
      console.log("[Create Post] Success!", result)
      toast.success("Post created successfully!")
      
      // Auto-submit to Bing for faster indexing
      try {
        const slug = result.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""
        const postUrl = `${siteUrl}/blog/${slug}`
        
        console.log("[Create Post] Submitting to Bing:", postUrl)
        const bingResponse = await fetch("/api/bing-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: [postUrl] }),
        })
        
        if (bingResponse.ok) {
          const bingResult = await bingResponse.json()
          console.log("[Create Post] Bing submission successful:", bingResult)
          toast.success("Search engines notified! 🔍")
        } else if (bingResponse.status === 429) {
          console.warn("[Create Post] Bing quota exceeded")
          toast.warning("Post created! Daily Bing quota exceeded, will try tomorrow.")
        } else {
          const errorData = await bingResponse.json()
          console.warn("[Create Post] Bing submission failed:", {
            status: bingResponse.status,
            error: errorData,
          })
          toast.info("Post created! (Search engine notification skipped)")
        }
      } catch (bingError) {
        console.error("[Create Post] Bing error:", bingError)
        // Don't fail post creation if Bing submission fails
      }
      
      router.push("/admin/dashboard?tab=content")
    } catch (err) {
      console.error("[Create Post] Error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to create post"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Create Post</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">Write a new blog post</p>
          </div>
          <Link href="/admin/dashboard" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="sm:h-9 w-full sm:w-auto">Cancel</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Blog Post</CardTitle>
            <CardDescription>Fill in the details below to create a new post</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Post title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Your name"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of the post"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="tag1, tag2, tag3"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Header Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1"
                  />
                  <input
                    ref={headerImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleHeaderImageUpload}
                    className="hidden"
                    id="header-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => headerImageInputRef.current?.click()}
                    disabled={uploadingHeaderImage}
                    className="flex-shrink-0"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingHeaderImage ? `${Math.round(headerImageProgress)}%` : "Upload"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a URL or upload an image. Uploaded images are automatically compressed and resized to 1200x630px (webp format) for optimal performance and SEO.
                </p>
                {formData.image && (
                  <div className="mt-2 rounded-md border border-shadow-gray overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="border border-input rounded-md overflow-hidden">
                                    <div className="flex items-center justify-between gap-1 p-2 bg-muted/30 border-b border-shadow-gray">
                    <div className="flex items-center gap-1 flex-wrap">
                      {markdownTools.map((tool) => (
                        <Button
                          key={tool.label}
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={tool.action}
                          title={tool.label}
                          className="h-8 w-8"
                        >
                          <tool.icon className="w-4 h-4" />
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={insertImage}
                        title="Insert Image URL"
                        className="h-8 w-8"
                      >
                        <Image className="w-4 h-4" />
                      </Button>
                      <input
                        ref={contentImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleContentImageUpload}
                        className="hidden"
                        id="content-image-upload"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => contentImageInputRef.current?.click()}
                        disabled={uploadingContentImage}
                        title={uploadingContentImage ? `Uploading ${Math.round(contentImageProgress)}%` : "Upload Image"}
                        className="h-8 w-8"
                      >
                        <ImagePlus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant={showPreview ? "default" : "ghost"}
                      size="icon-sm"
                      onClick={() => setShowPreview(!showPreview)}
                      title={showPreview ? "Hide Preview" : "Show Preview"}
                      className="h-8 w-8 flex-shrink-0"
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {!showPreview ? (
                    <Textarea
                      ref={contentRef}
                      id="content"
                      placeholder="Write your post content in Markdown..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={15}
                      className="font-mono border-0 focus-visible:ring-0 rounded-none resize-none"
                      required
                    />
                  ) : (
                    <div className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                      {formData.content ? (
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4 mt-6" style={{ fontFamily: 'Georgia, serif' }}>
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3 mt-5" style={{ fontFamily: 'Georgia, serif' }}>
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 mt-4">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-base leading-relaxed text-foreground/90 mb-4">
                                {children}
                              </p>
                            ),
                            a: ({ href, children }) => (
                              <a href={href} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                            code: ({ children }) => (
                              <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                                                            <pre className="overflow-x-auto bg-muted p-4 rounded my-4 border border-shadow-gray">
                                {children}
                              </pre>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-shadow-gray pl-4 my-4 italic text-foreground/75">
                                {children}
                              </blockquote>
                            ),
                            ul: ({ children }) => <ul className="space-y-2 my-4 ml-6 list-disc">{children}</ul>,
                            ol: ({ children }) => <ol className="space-y-2 my-4 ml-6 list-decimal">{children}</ol>,
                            li: ({ children }) => (
                              <li className="text-base leading-relaxed text-foreground/90">
                                {children}
                              </li>
                            ),
                            img: ({ src, alt }) => (
                              <img src={src} alt={alt || ''} className="rounded-lg my-4 max-w-full h-auto" />
                            ),
                          }}
                        >
                          {formData.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground italic">Start typing to see preview...</p>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {showPreview ? "Click the eye icon to return to editing" : "Use the toolbar above or type Markdown directly"}
                </p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Publishing..." : "Publish Post"}
                </Button>
                <Link href="/admin/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
