import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, addDoc, Timestamp } from "firebase/firestore"

export const runtime = 'edge'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email format
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      )
    }

    const trimmedEmail = email.trim().toLowerCase()

    // Validate email format with regex
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      )
    }

    // Prevent email spam/abuse - rate limit by email
    if (trimmedEmail.length > 254) {
      return NextResponse.json(
        { message: "Email address is too long" },
        { status: 400 }
      )
    }

    // Check if email already subscribed to prevent duplicates
    const subscribersRef = collection(db, "subscribers")
    const q = query(subscribersRef, where("email", "==", trimmedEmail))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 409 } // Conflict
      )
    }

    // Add new subscriber
    const docRef = await addDoc(subscribersRef, {
      email: trimmedEmail,
      subscribedAt: Timestamp.now(),
      source: "website", // Track where subscription came from
      verified: false, // Can implement email verification later
      unsubscribed: false // For unsubscribe functionality
    })

    return NextResponse.json(
      {
        message: "Successfully subscribed to newsletter",
        subscriberId: docRef.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Subscribe API error:", error)
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
