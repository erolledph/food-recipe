"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react"

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => window.open(shareLinks.twitter, "_blank", "noopener,noreferrer")}
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => window.open(shareLinks.facebook, "_blank", "noopener,noreferrer")}
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => window.open(shareLinks.linkedin, "_blank", "noopener,noreferrer")}
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleCopyLink}
        title="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </Button>
    </div>
  )
}
