import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"

export const runtime = 'edge'

export async function GET() {
  try {
    const commentsRef = collection(db, "comments")
    const q = query(commentsRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const comments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}
