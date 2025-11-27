"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, where, addDoc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Check, X, Trash2 } from "lucide-react"
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
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [submittingReply, setSubmittingReply] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
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
      setLoading(false)
    }
  }

  const handleApprove = async (commentId: string) => {
    try {
      await updateDoc(doc(db, "comments", commentId), {
        approved: true,
      })
      toast.success("Comment approved")
      fetchComments()
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

  const handleReject = async (commentId: string) => {
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
        parentId: comment.id,
        author: "DigitalAxis",
        content: replyContent.trim(),
        createdAt: serverTimestamp(),
        approved: true,
        isAdmin: true,
      }

      await addDoc(collection(db, "comments"), replyData)

      toast.success("Reply submitted successfully")
      setReplyContent("")
      setReplyingTo(null)

      await fetchComments()
    } catch (error) {
      console.error("Error submitting reply:", error)
      toast.error("Failed to submit reply")
    } finally {
      setSubmittingReply(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const pendingComments = comments.filter((c) => !c.approved)
  const approvedComments = comments.filter((c) => c.approved)

  return (
    <main className="min-h-screen bg-background">
            <div className="border-b border-shadow-gray bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                Manage Comments
              </h1>
            </div>
            <Link href="/admin/dashboard" className="flex-shrink-0">
              <Button variant="outline" size="sm" className="sm:h-9 w-full sm:w-auto">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading comments...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingComments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Pending Approval
                    <span className="text-sm font-normal text-muted-foreground">
                      ({pendingComments.length})
                    </span>
                  </CardTitle>
                  <CardDescription>Review and approve or reject comments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border border-shadow-gray rounded-lg p-4 bg-muted/20"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="font-semibold text-foreground">{comment.author}</p>
                            {comment.email && (
                              <p className="text-xs text-muted-foreground font-mono">
                                {comment.email}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              on "{comment.postSlug}" • {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-foreground/90 mb-4 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(comment.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(comment.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {approvedComments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Approved Comments
                    <span className="text-sm font-normal text-muted-foreground">
                      ({approvedComments.length})
                    </span>
                  </CardTitle>
                  <CardDescription>Published comments on your blog</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {approvedComments.map((comment) => (
                      <div
                        key={comment.id}
                                                className="border border-shadow-gray rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">{comment.author}</p>
                              {comment.isAdmin && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                  Admin
                                </span>
                              )}
                            </div>
                            {comment.email && (
                              <p className="text-xs text-muted-foreground font-mono">
                                {comment.email}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              on "{comment.postSlug}" • {formatDate(comment.createdAt)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(comment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-foreground/90 whitespace-pre-wrap mb-3">
                          {comment.content}
                        </p>
                        {!comment.parentId && (
                          <div className="mt-3">
                            {replyingTo === comment.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  placeholder="Write your reply..."
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  maxLength={2000}
                                  rows={3}
                                  className="text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleReplyToComment(comment)}
                                    disabled={submittingReply}
                                  >
                                    {submittingReply ? "Sending..." : "Send Reply"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setReplyingTo(null)
                                      setReplyContent("")
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setReplyingTo(comment.id)}
                              >
                                Reply
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {comments.length === 0 && (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">No comments yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
