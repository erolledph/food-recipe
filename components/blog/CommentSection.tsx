"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { MessageSquare, User, ShieldCheck, Reply, AtSign } from "lucide-react"

interface Comment {
  id: string
  author: string
  email?: string
  content: string
  createdAt: any
  approved: boolean
  isAdmin?: boolean
  parentId?: string
  mentionedUser?: string
}

interface CommentSectionProps {
  postSlug: string
}

interface ReplyState {
  commentId: string
  author: string
  isAdmin: boolean
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [author, setAuthor] = useState("")
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")
  const [replyingTo, setReplyingTo] = useState<ReplyState | null>(null)
  const [replyAuthor, setReplyAuthor] = useState("")
  const [replyEmail, setReplyEmail] = useState("")
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  const fetchComments = async () => {
    try {
      const commentsRef = collection(db, "comments")
      const q = query(
        commentsRef,
        where("postSlug", "==", postSlug),
        where("approved", "==", true),
        orderBy("createdAt", "asc")
      )
      const querySnapshot = await getDocs(q)
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[]
      setComments(fetchedComments)
    } catch (error) {
      console.error("Error fetching comments:", error)

      try {
        const commentsRef = collection(db, "comments")
        const fallbackQ = query(
          commentsRef,
          where("postSlug", "==", postSlug),
          where("approved", "==", true)
        )
        const fallbackSnapshot = await getDocs(fallbackQ)
        const fallbackComments = fallbackSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[]
        fallbackComments.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
          return dateA.getTime() - dateB.getTime()
        })
        setComments(fallbackComments)
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!author.trim() || !email.trim() || !content.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (author.length > 100) {
      toast.error("Name is too long (max 100 characters)")
      return
    }

    if (content.length > 2000) {
      toast.error("Comment is too long (max 2000 characters)")
      return
    }

    setSubmitting(true)

    try {
      const newComment = {
        postSlug,
        author: author.trim(),
        email: email.trim().toLowerCase(),
        content: content.trim(),
        createdAt: serverTimestamp(),
        approved: true,
      }

      await addDoc(collection(db, "comments"), newComment)

      toast.success("Comment posted successfully!")
      setAuthor("")
      setEmail("")
      setContent("")

      await fetchComments()
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast.error("Failed to submit comment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (parentId: string, mentionedUser?: string) => {
    if (!replyAuthor.trim() || !replyEmail.trim() || !replyContent.trim()) {
      toast.error("Please fill in all fields to reply")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyEmail)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (replyAuthor.length > 100) {
      toast.error("Name is too long (max 100 characters)")
      return
    }

    if (replyContent.length > 2000) {
      toast.error("Reply is too long (max 2000 characters)")
      return
    }

    setSubmitting(true)

    try {
      const newReply: any = {
        postSlug,
        author: replyAuthor.trim(),
        email: replyEmail.trim().toLowerCase(),
        content: replyContent.trim(),
        createdAt: serverTimestamp(),
        approved: true,
        parentId,
      }

      if (mentionedUser) {
        newReply.mentionedUser = mentionedUser
      }

      await addDoc(collection(db, "comments"), newReply)

      toast.success("Reply posted successfully!")
      setReplyAuthor("")
      setReplyEmail("")
      setReplyContent("")
      setReplyingTo(null)

      await fetchComments()
    } catch (error) {
      console.error("Error submitting reply:", error)
      toast.error("Failed to submit reply. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplyClick = (comment: Comment) => {
    const newReplyState: ReplyState = {
      commentId: comment.id,
      author: comment.author,
      isAdmin: comment.isAdmin || false,
    }

    setReplyingTo(newReplyState)
    setReplyContent(`@${comment.author} `)
  }

  const removeMention = () => {
    const mentionRegex = /@[\w\s]+\s*/
    setReplyContent(replyContent.replace(mentionRegex, ''))
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const buildCommentTree = () => {
    const commentMap = new Map<string, Comment[]>()
    const rootComments: Comment[] = []

    comments.forEach((comment) => {
      if (!comment.parentId) {
        rootComments.push(comment)
      } else {
        if (!commentMap.has(comment.parentId)) {
          commentMap.set(comment.parentId, [])
        }
        commentMap.get(comment.parentId)!.push(comment)
      }
    })

    return { rootComments, commentMap }
  }

  const renderMentionedUser = (mentionedUser: string) => (
    <span className="inline-flex items-center gap-1 text-primary font-medium">
      <AtSign className="w-3 h-3" />
      {mentionedUser}
    </span>
  )

  const renderCommentContent = (comment: Comment) => {
    if (!comment.mentionedUser) {
      return <span>{comment.content}</span>
    }

    const mentionPattern = `@${comment.mentionedUser}`
    const parts = comment.content.split(mentionPattern)

    if (parts.length === 1) {
      return <span>{comment.content}</span>
    }

    return (
      <>
        {parts[0]}
        {renderMentionedUser(comment.mentionedUser)}
        {parts.slice(1).join(mentionPattern)}
      </>
    )
  }

  const getGuestAvatarUrl = (name: string) => {
    // Use DiceBear avatars API for unique, consistent avatars per name
    const encodedName = encodeURIComponent(name)
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}&scale=80`
  }

  const renderComment = (comment: Comment, depth: number = 0, commentMap: Map<string, Comment[]>) => {
    const replies = commentMap.get(comment.id) || []
    const leftPadding = depth > 0 ? `${depth * 3}rem` : '0'

    return (
      <div key={comment.id}>
        <div className="flex gap-3 mb-4" style={{ paddingLeft: leftPadding }}>
          <div className="flex-shrink-0 mt-0.5">
            {comment.isAdmin ? (
              <img src="/avatar.svg" alt={comment.author} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <img 
                src={getGuestAvatarUrl(comment.author)} 
                alt={comment.author} 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none'
                  const parent = (e.target as HTMLImageElement).parentElement
                  if (parent) {
                    const fallback = document.createElement('div')
                    fallback.className = "w-10 h-10 bg-gradient-to-br from-primary/70 to-primary rounded-full flex items-center justify-center"
                    fallback.innerHTML = '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
                    parent.appendChild(fallback)
                  }
                }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm text-foreground hover:underline cursor-pointer">
                {comment.author}
              </p>
              {comment.isAdmin && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                  Author
                </span>
              )}
              <span className="text-muted-foreground text-xs">·</span>
              <p className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </p>
            </div>

            <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-foreground/90 mb-2">
              {renderCommentContent(comment)}
            </p>

            <div className="flex items-center gap-1 -ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => handleReplyClick(comment)}
              >
                <Reply className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs font-medium">Reply</span>
              </Button>
            </div>

            {replyingTo?.commentId === comment.id && (
              <div className="mt-3 pt-3 border-t border-shadow-gray/50">
                <div className="flex gap-3 mb-3">
                  <img 
                    src={replyAuthor ? getGuestAvatarUrl(replyAuthor) : getGuestAvatarUrl("Anonymous")} 
                    alt="Your avatar" 
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="relative">
                      <Textarea
                        id={`reply-content-${comment.id}`}
                        placeholder={`Reply to ${comment.author}...`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        maxLength={2000}
                        rows={3}
                        className="text-sm resize-none"
                      />
                      {replyContent.includes('@') && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={removeMention}
                          className="absolute top-2 right-2 h-6 px-2 text-xs"
                        >
                          Remove @mention
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        id={`reply-author-${comment.id}`}
                        type="text"
                        placeholder="Your name"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        maxLength={100}
                        className="h-8 text-sm"
                      />
                      <Input
                        id={`reply-email-${comment.id}`}
                        type="email"
                        placeholder="your@email.com (private)"
                        value={replyEmail}
                        onChange={(e) => setReplyEmail(e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
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
                        setReplyAuthor("")
                        setReplyEmail("")
                        setReplyContent("")
                      }}
                      className="h-8"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReply(comment.id, replyingTo.author)}
                      disabled={submitting || !replyContent.trim() || !replyAuthor.trim() || !replyEmail.trim()}
                      className="h-8 px-4"
                    >
                      {submitting ? "Posting..." : "Reply"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {replies.length > 0 && (
          <div>
            {replies.map((reply) => renderComment(reply, depth + 1, commentMap))}
          </div>
        )}
      </div>
    )
  }

  const { rootComments, commentMap } = buildCommentTree()

  return (
    <div className="mt-16 pt-12 border-t border-shadow-gray">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
            Comments
          </h2>
          <span className="text-base text-muted-foreground">
            ({comments.length})
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="border-b border-shadow-gray pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <img 
                src={author ? getGuestAvatarUrl(author) : getGuestAvatarUrl("Anonymous")} 
                alt="Your avatar" 
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-0.5"
                onError={(e) => {
                  e.currentTarget.style.backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              />
              <div className="flex-1 space-y-3">
                <Textarea
                  id="content"
                  placeholder="What are your thoughts?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={2000}
                  rows={3}
                  className="resize-none text-[15px]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    id="author"
                    type="text"
                    placeholder="Your name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    maxLength={100}
                    className="h-9 text-sm"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com (private)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center ml-[52px]">
              <p className="text-xs text-muted-foreground">
                {content.length}/2000
              </p>
              <Button
                type="submit"
                disabled={submitting || !content.trim() || !author.trim() || !email.trim()}
                size="sm"
                className="h-9 px-5"
              >
                {submitting ? "Posting..." : "Comment"}
              </Button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground mt-3">Loading comments...</p>
          </div>
        ) : rootComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rootComments.map((comment, index) => (
              <div key={comment.id}>
                {renderComment(comment, 0, commentMap)}
                {index < rootComments.length - 1 && (
                  <div className="border-b border-shadow-gray/50 my-6"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
