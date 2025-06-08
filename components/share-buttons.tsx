"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
  articleId?: number;
}

export function ShareButtons({ title, url, articleId }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const trackEngagement = async (platform: string) => {
    if (articleId) {
      try {
        await fetch("/api/track/engagement", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            articleId,
            engagementType: "share",
            platform,
          }),
        });
      } catch (error) {
        // Silently fail for analytics tracking
        console.debug("Engagement tracking failed:", error);
      }
    }
  };

  const shareOnFacebook = () => {
    trackEngagement("facebook");
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnTwitter = () => {
    trackEngagement("twitter");
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      trackEngagement("copy_link");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 mr-2">Share:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnFacebook}
        className="text-blue-600 hover:bg-blue-50"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnTwitter}
        className="text-blue-400 hover:bg-blue-50"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copyLink}
        className={copied ? "text-green-600 bg-green-50" : ""}
      >
        <LinkIcon className="h-4 w-4" />
        {copied && <span className="ml-1 text-xs">Copied!</span>}
      </Button>
    </div>
  );
}
