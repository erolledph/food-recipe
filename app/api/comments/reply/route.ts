import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export const runtime = 'edge'

function isAdminAuthenticatedFromCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false
  const cookies = cookieHeader.split(';').map(c => c.trim())
  return cookies.some(cookie => cookie.startsWith('admin-session=true'))
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie')
    const authenticated = isAdminAuthenticatedFromCookie(cookieHeader)
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postSlug, parentId, author, content, mentionedUser } = await request.json()

    if (!postSlug || !content || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Content is too long (max 2000 characters)" },
        { status: 400 }
      )
    }

    const replyData: any = {
      postSlug,
      author: author.trim(),
      content: content.trim(),
      createdAt: serverTimestamp(),
      approved: true,
      isAdmin: true,
    }

    if (parentId) {
      replyData.parentId = parentId
    }

    if (mentionedUser) {
      replyData.mentionedUser = mentionedUser
    }

    const docRef = await addDoc(collection(db, "comments"), replyData)

    return NextResponse.json({ success: true, id: docRef.id })
  } catch (error) {
    console.error("Error creating reply:", error)
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    )
  }
}
