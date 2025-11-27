"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Settings, MessageSquare, Mail, Check, X, Trash2, Download, Reply, User, ShieldCheck, Eye, Pencil, Copy } from "lucide-react"
import { toast } from "sonner"

interface Comment {
  id: string
  postSlug: string
  author: string
  email?: string
  content: string
  createdAt: any
  approved: boolean
  isAdmin?: boolean
  parentId?: string
  mentionedUser?: string
}

interface Subscriber {
  id: string
  email: string
  subscribedAt: any
  postSlug?: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  date: string
  author?: string
  tags?: string[]
  image?: string
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [loadingSubscribers, setLoadingSubscribers] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [submittingReply, setSubmittingReply] = useState(false)
  const [commentFilter, setCommentFilter] = useState<"all" | "pending" | "approved">("all")
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null)
  const [deletingPost, setDeletingPost] = useState<string | null>(null)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchStats()

    // Check for tab query parameter
    const searchParams = new URLSearchParams(window.location.search)
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'comments', 'subscribers', 'content'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [])

  useEffect(() => {
    if (activeTab === "comments") {
      fetchComments()
    } else if (activeTab === "subscribers") {
      fetchSubscribers()
    } else if (activeTab === "content") {
      fetchPosts()
    }
  }, [activeTab])

  async function fetchStats() {
    try {
      const postsResponse = await fetch("/api/posts")
      if (postsResponse.ok) {
        const posts = await postsResponse.json()
        setTotalPosts(posts.length)
      }

      const commentsResponse = await fetch("/api/comments")
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        setTotalComments(commentsData.length)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  async function fetchComments() {
    setLoadingComments(true)
    try {
      const commentsRef = collection(db, "comments")
      const q = query(commentsRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[]
      setComments(fetchedComments)
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Failed to load comments")
    } finally {
      setLoadingComments(false)
    }
  }

  async function fetchSubscribers() {
    setLoadingSubscribers(true)
    try {
      const subscribersRef = collection(db, "subscribers")
      const q = query(subscribersRef, orderBy("subscribedAt", "desc"))
      const querySnapshot = await getDocs(q)
      const fetchedSubscribers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Subscriber[]
      setSubscribers(fetchedSubscribers)
    } catch (error) {
      console.error("Error fetching subscribers:", error)
      toast.error("Failed to load subscribers")
    } finally {
      setLoadingSubscribers(false)
    }
  }

  async function fetchPosts() {
    setLoadingPosts(true)
    try {
      const response = await fetch("/api/posts")
      if (!response.ok) throw new Error("Failed to fetch posts")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast.error("Failed to load posts")
    } finally {
      setLoadingPosts(false)
    }
  }

  async function handleDeletePost(slug: string, title: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    setDeletingPost(slug)
    try {
      const response = await fetch("/api/posts/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete post")
      }

      toast.success("Post deleted successfully")
      await fetchPosts()
      await fetchStats()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete post")
    } finally {
      setDeletingPost(null)
    }
  }

  function handleEditPost(slug: string) {
    router.push(`/admin/edit/${slug}`)
  }

  function handleCopyPostUrl(slug: string) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""
    const postUrl = `${siteUrl}/blog/${slug}`
    navigator.clipboard.writeText(postUrl)
    setCopiedSlug(slug)
    toast.success("URL copied to clipboard!")
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  async function handleApproveComment(commentId: string) {
    try {
      await updateDoc(doc(db, "comments", commentId), {
        approved: true,
      })
      toast.success("Comment approved")
      fetchComments()
      fetchStats()
    } catch (error) {
      console.error("Error approving comment:", error)
      toast.error("Failed to approve comment")
    }
  }

  function countReplies(commentId: string, allComments: Comment[]): number {
    let count = 0
    const directReplies = allComments.filter(c => c.parentId === commentId)

    for (const reply of directReplies) {
      count += 1 + countReplies(reply.id, allComments)
    }

    return count
  }

  async function deleteCommentAndReplies(commentId: string, allComments: Comment[]): Promise<void> {
    const replies = allComments.filter(c => c.parentId === commentId)

    for (const reply of replies) {
      await deleteCommentAndReplies(reply.id, allComments)
    }

    await deleteDoc(doc(db, "comments", commentId))
  }

  async function handleDeleteComment(commentId: string) {
    try {
      const comment = comments.find(c => c.id === commentId)
      if (!comment) return

      const isTopLevel = !comment.parentId
      const replyCount = countReplies(commentId, comments)

      if (isTopLevel && replyCount > 0) {
        const confirmed = window.confirm(
          `Are you sure you want to delete this comment?\n\nThis will also delete ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'} in this thread.\n\nThis action cannot be undone.`
        )

        if (!confirmed) return
      } else if (replyCount > 0) {
        const confirmed = window.confirm(
          `This comment has ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}.\n\nDeleting it will also delete all replies. Continue?`
        )

        if (!confirmed) return
      }

      await deleteCommentAndReplies(commentId, comments)
      toast.success(replyCount > 0 ? `Comment and ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'} deleted` : "Comment deleted")
      fetchComments()
      fetchStats()
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("Failed to delete comment")
    }
  }

  async function handleReplyToComment(comment: Comment) {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply")
      return
    }

    setSubmittingReply(true)

    try {
      const replyData = {
        postSlug: comment.postSlug,
        parentId: comment.parentId || comment.id,
        author: "DigitalAxis",
        content: replyContent.trim(),
        mentionedUser: comment.author,
        createdAt: serverTimestamp(),
        approved: true,
        isAdmin: true,
      }

      await addDoc(collection(db, "comments"), replyData)

      toast.success("Reply submitted successfully")
      setReplyContent("")
      setReplyingTo(null)

      await fetchComments()
      await fetchStats()
    } catch (error) {
      console.error("Error submitting reply:", error)
      toast.error("Failed to submit reply")
    } finally {
      setSubmittingReply(false)
    }
  }

  function handleExportSubscribers() {
    const csv = [
      ["Email", "Subscribed At", "Blog Post"],
      ...subscribers.map((sub) => [
        sub.email,
        sub.subscribedAt?.toDate?.()?.toISOString() || "",
        sub.postSlug || "N/A",
      ]),
    ]
      .map((row) => row.map(cell => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Subscribers exported")
  }

  function formatDate(timestamp: any) {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const pendingComments = comments.filter((c) => !c.approved)
  const approvedComments = comments.filter((c) => c.approved)

  const postSlugs = Array.from(new Set(comments.map((c) => c.postSlug))).sort()

  const filteredComments = comments.filter((comment) => {
    const statusMatch =
      commentFilter === "all" ? true :
      commentFilter === "pending" ? !comment.approved :
      commentFilter === "approved" ? comment.approved : true

    const postMatch = selectedPostSlug === null || comment.postSlug === selectedPostSlug

    return statusMatch && postMatch
  })

  const buildCommentTree = () => {
    const commentMap = new Map<string, Comment[]>()
    const rootComments: Comment[] = []
    const orphanedComments: Comment[] = []

    // Build the comment map with ALL comments for proper tree structure
    comments.forEach((comment) => {
      if (!comment.parentId) {
        // Only add to rootComments if it matches the filter
        if (filteredComments.find(c => c.id === comment.id)) {
          rootComments.push(comment)
        }
      } else {
        if (!commentMap.has(comment.parentId)) {
          commentMap.set(comment.parentId, [])
        }
        commentMap.get(comment.parentId)!.push(comment)
      }
    })

    // Find orphaned comments (replies whose parents don't match the filter)
    filteredComments.forEach((comment) => {
      if (comment.parentId) {
        const parentExists = rootComments.find(c => c.id === comment.parentId) ||
                           filteredComments.find(c => c.id === comment.parentId)
        if (!parentExists) {
          // This is an orphaned comment - show it as a root comment
          orphanedComments.push(comment)
        }
      }
    })

    return { rootComments: [...rootComments, ...orphanedComments], commentMap }
  }

  const { rootComments: rootFilteredComments, commentMap: filteredCommentMap } = buildCommentTree()

  const renderCommentAdmin = (comment: Comment, depth: number, commentMap: Map<string, Comment[]>) => {
    // Only show replies that match the current filter
    const allReplies = commentMap.get(comment.id) || []
    const replies = allReplies.filter(reply => filteredComments.find(c => c.id === reply.id))
    const leftPadding = depth > 0 ? `${depth * 3}rem` : '0'

    return (
      <div key={comment.id}>
        <div className="flex gap-3 mb-4" style={{ paddingLeft: leftPadding }}>
          <div className="flex-shrink-0 mt-0.5">
            <div className={`${comment.isAdmin ? "w-10 h-10 bg-primary" : "w-10 h-10 bg-gradient-to-br from-primary/70 to-primary"} rounded-full flex items-center justify-center`}>
              {comment.isAdmin ? (
                <ShieldCheck className="w-5 h-5 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm text-foreground">
                {comment.author}
              </p>
              {comment.isAdmin && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                  Admin
                </span>
              )}
              {!comment.approved && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-500/10 text-orange-500">
                  Pending
                </span>
              )}
              <span className="text-muted-foreground text-xs">·</span>
              <p className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </p>
            </div>

            {comment.email && (
              <p className="text-xs text-muted-foreground font-mono mb-1">
                {comment.email}
              </p>
            )}

            <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-foreground/90 mb-2">
              {comment.mentionedUser && (
                <span className="text-primary font-medium">@{comment.mentionedUser} </span>
              )}
              {comment.content}
            </p>

            <div className="flex items-center gap-1 -ml-2">
              {!comment.approved && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleApproveComment(comment.id)}
                  className="h-8 px-2 text-primary hover:text-primary/80 hover:bg-primary/10 dark:hover:bg-primary/20"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-xs font-medium">Approve</span>
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteComment(comment.id)}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs font-medium">Delete</span>
              </Button>
              {replyingTo === comment.id ? null : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setReplyingTo(comment.id)
                    setReplyContent(`@${comment.author} `)
                  }}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <Reply className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-xs font-medium">Reply</span>
                </Button>
              )}
            </div>

            {replyingTo === comment.id && (
                            <div className="mt-3 pt-3 border-shadow-gray/50">
                <div className="flex gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-primary/70 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder={`Reply to ${comment.author}...`}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      maxLength={2000}
                      rows={3}
                      className="text-sm resize-none"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center ml-11">
                  <p className="text-xs text-muted-foreground">
                    {replyContent.length}/2000
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent("")
                      }}
                      className="h-8"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReplyToComment(comment)}
                      disabled={submittingReply || !replyContent.trim()}
                      className="h-8 px-4"
                    >
                      {submittingReply ? "Sending..." : "Reply"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {replies.length > 0 && (
          <div>
            {replies.map((reply) => renderCommentAdmin(reply, depth + 1, commentMap))}
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="border-shadow-gray bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'Georgia, serif' }}>Admin Dashboard</h1>
            <div className="flex gap-2 sm:gap-3 flex-shrink-0">
              <Link href="/">
                <Button variant="ghost" size="sm" className="sm:h-9">View Site</Button>
              </Link>
              <Button variant="outline" size="sm" className="sm:h-9" onClick={handleLogout} disabled={loading}>
                {loading ? "Logging out..." : "Sign out"}
              </Button>
            </div>
          </div>

                    <div className="flex gap-2 sm:gap-4 border-shadow-gray overflow-x-auto pb-0 -mb-px">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`pb-3 px-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "comments"
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Comments
              {pendingComments.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                  {pendingComments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("subscribers")}
              className={`pb-3 px-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "subscribers"
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Subscribers
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`pb-3 px-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "content"
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Content
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {activeTab === "overview" && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{totalPosts}</div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Comments</CardTitle>
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{totalComments}</div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Subscribers</CardTitle>
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{subscribers.length}</div>
                </CardHeader>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Quick Actions</h2>
                <Link href="/admin/create">
                  <Button size="lg" className="rounded-full w-full sm:w-auto">
                    Write a story
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/create">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="text-left">
                      <div className="font-semibold mb-1">Create New Story</div>
                      <div className="text-sm text-muted-foreground">Start writing your next article</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/blog">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="text-left">
                      <div className="font-semibold mb-1">View All Stories</div>
                      <div className="text-sm text-muted-foreground">Browse published articles</div>
                    </div>
                  </Button>
                </Link>

                <button onClick={() => setActiveTab("comments")}>
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="text-left">
                      <div className="font-semibold mb-1">Manage Comments</div>
                      <div className="text-sm text-muted-foreground">View and moderate comments</div>
                    </div>
                  </Button>
                </button>

                <button onClick={() => setActiveTab("subscribers")}>
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="text-left">
                      <div className="font-semibold mb-1">View Subscribers</div>
                      <div className="text-sm text-muted-foreground">Manage newsletter subscribers</div>
                    </div>
                  </Button>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "comments" && (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="w-full lg:w-64 lg:border-r border-b lg:border-b-0 border-shadow-gray pb-4 lg:pb-0 lg:pr-6 overflow-y-auto flex-shrink-0">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Filter by Status</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setCommentFilter("all")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      commentFilter === "all"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    All Comments ({comments.length})
                  </button>
                  <button
                    onClick={() => setCommentFilter("pending")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      commentFilter === "pending"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    Pending ({pendingComments.length})
                  </button>
                  <button
                    onClick={() => setCommentFilter("approved")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      commentFilter === "approved"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    Approved ({approvedComments.length})
                  </button>
                </div>
              </div>

              <div className="border-t border-shadow-gray pt-4 mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Filter by Post</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedPostSlug(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedPostSlug === null
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    All Posts
                  </button>
                  {postSlugs.map((slug) => {
                    const postComments = comments.filter((c) => c.postSlug === slug)
                    return (
                      <button
                        key={slug}
                        onClick={() => setSelectedPostSlug(slug)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedPostSlug === slug
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate" title={slug}>{slug}</span>
                          <span className="text-xs opacity-70 flex-shrink-0">({postComments.length})</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto lg:pr-2 lg:h-[calc(100vh-300px)]">
              {loadingComments ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-sm text-muted-foreground mt-3">Loading comments...</p>
                </div>
              ) : filteredComments.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg text-muted-foreground">No comments found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {commentFilter !== "all" && "Try changing the filter"}
                    {selectedPostSlug && " or select a different post"}
                  </p>
                </div>
              ) : (
                <div className="space-y-6 pb-8">
                  {rootFilteredComments.map((comment, index) => (
                    <div key={comment.id}>
                      {renderCommentAdmin(comment, 0, filteredCommentMap)}
                      {index < rootFilteredComments.length - 1 && (
                        <div className="border-b border-shadow-gray/50 my-6"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "subscribers" && (
          <div className="space-y-6">
            {loadingSubscribers ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading subscribers...</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Newsletter Subscribers
                        <span className="text-sm font-normal text-muted-foreground">
                          ({subscribers.length})
                        </span>
                      </CardTitle>
                      <CardDescription>Manage your newsletter subscriber list</CardDescription>
                    </div>
                    {subscribers.length > 0 && (
                      <Button variant="outline" onClick={handleExportSubscribers}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {subscribers.length === 0 ? (
                    <div className="text-center py-16">
                      <Mail className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg text-muted-foreground">No subscribers yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-shadow-gray bg-muted/30">
                            <th className="text-left px-4 py-3 font-semibold text-foreground">Email</th>
                            <th className="text-left px-4 py-3 font-semibold text-foreground">Date Subscribed</th>
                            <th className="text-left px-4 py-3 font-semibold text-foreground">Blog Post</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers.map((subscriber) => (
                            <tr key={subscriber.id} className="border-b border-shadow-gray hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-3 text-foreground font-medium">{subscriber.email}</td>
                              <td className="px-4 py-3 text-muted-foreground">{formatDate(subscriber.subscribedAt)}</td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {subscriber.postSlug ? (
                                  <Link href={`/blog/${subscriber.postSlug}`}>
                                    <span className="text-primary hover:underline cursor-pointer">{subscriber.postSlug}</span>
                                  </Link>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-6">
            {loadingPosts ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground mt-3">Loading posts...</p>
              </div>
            ) : (
              <>
                <Card className="dark:bg-slate-900 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      🔍 Submit URLs to Search Engines
                    </CardTitle>
                    <CardDescription className="dark:text-slate-300">Manually submit your blog URLs to search engines for faster indexing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-foreground dark:text-white mb-3 font-medium">Quick Links:</p>
                        <div className="flex flex-wrap gap-2">
                          <a href="https://www.bing.com/webmasters/home" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              Bing Webmaster Tools →
                            </Button>
                          </a>
                          <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              Google Search Console →
                            </Button>
                          </a>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground dark:text-slate-200 space-y-2">
                        <p>✓ Your sitemap is live at: <code className="bg-blue-100 dark:bg-slate-700 px-2 py-1 rounded text-xs dark:text-slate-100">{`${process.env.NEXT_PUBLIC_SITE_URL || ''}sitemap.xml`}</code></p>
                        <p>✓ You can submit up to 100 URLs per day to Bing Webmaster Tools</p>
                        <p>✓ Copy your blog post URLs below and paste them into Bing Webmaster for instant indexing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Blog Posts
                          <span className="text-sm font-normal text-muted-foreground">
                            ({posts.length})
                          </span>
                        </CardTitle>
                        <CardDescription>Manage your blog content</CardDescription>
                      </div>
                      <Link href="/admin/create">
                        <Button>
                          Create New Post
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                  {posts.length === 0 ? (
                    <div className="text-center py-16">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg text-muted-foreground mb-4">No posts yet</p>
                      <Link href="/admin/create">
                        <Button>Create your first post</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-shadow-gray bg-muted/30">
                            <th className="text-left px-4 py-3 font-semibold text-foreground w-24">Image</th>
                            <th className="text-left px-4 py-3 font-semibold text-foreground">Title</th>
                            <th className="text-left px-4 py-3 font-semibold text-foreground w-32">Date</th>
                            <th className="text-center px-4 py-3 font-semibold text-foreground w-32">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map((post) => (
                            <tr key={post.id} className="border-b border-shadow-gray hover:bg-muted/20 transition-colors\">
                              <td className="px-4 py-3">
                                {post.image ? (
                                  <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium text-foreground line-clamp-1">{post.title}</p>
                                  {post.excerpt && (
                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{post.excerpt}</p>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {new Date(post.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    title="Copy post URL"
                                    onClick={() => handleCopyPostUrl(post.slug)}
                                  >
                                    {copiedSlug === post.slug ? (
                                      <Check className="w-4 h-4 text-primary" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                  <Link href={`/blog/${post.slug}`} target="_blank">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      title="View post"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    title="Edit post"
                                    onClick={() => handleEditPost(post.slug)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                    title="Delete post"
                                    onClick={() => handleDeletePost(post.slug, post.title)}
                                    disabled={deletingPost === post.slug}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
