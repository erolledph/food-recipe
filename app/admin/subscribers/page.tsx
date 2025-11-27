"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Download } from "lucide-react"
import { toast } from "sonner"

interface Subscriber {
  id: string
  email: string
  subscribedAt: any
  postSlug?: string
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
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
      setLoading(false)
    }
  }

  const handleExport = () => {
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

  return (
    <main className="min-h-screen bg-background">
            <div className="border-b border-shadow-gray bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                Subscribers
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
              {subscribers.length > 0 && (
                <Button variant="outline" size="sm" className="sm:h-9 flex-1 sm:flex-none" onClick={handleExport}>
                  <Download className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              )}
              <Link href="/admin/dashboard" className="flex-1 sm:flex-none">
                <Button variant="outline" size="sm" className="sm:h-9 w-full">Back</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading subscribers...</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Newsletter Subscribers
                <span className="text-sm font-normal text-muted-foreground">
                  ({subscribers.length})
                </span>
              </CardTitle>
              <CardDescription>
                Manage your newsletter subscriber list
              </CardDescription>
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
    </main>
  )
}
