"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Check } from "lucide-react"

interface SubscribeFormProps {
  postSlug?: string
}

export function SubscribeForm({ postSlug }: SubscribeFormProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email")
      return
    }

    setLoading(true)

    try {
      await addDoc(collection(db, "subscribers"), {
        email: email.trim().toLowerCase(),
        subscribedAt: serverTimestamp(),
        postSlug: postSlug || null,
      })

      setSubscribed(true)
      setEmail("")
    } catch (error: any) {
      console.error("Subscribe error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-16 pt-12 border-t border-shadow-gray">
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/20 px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col items-center text-center">
          {!subscribed ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Subscribe to Our Newsletter
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Get the latest articles delivered straight to your inbox. No spam, unsubscribe anytime.
              </p>

              <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="flex-1 min-h-12"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-h-12 px-6 font-medium"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </>
          ) : (
            <div className="py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Thank You for Subscribing!
              </h2>
              <p className="text-muted-foreground max-w-md">
                You've successfully subscribed to our newsletter. Get ready for great content delivered straight to your inbox.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
