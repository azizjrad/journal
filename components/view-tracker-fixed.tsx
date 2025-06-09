"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  articleId: number;
  title: string;
}

// Global tracking cache to prevent duplicate tracking across components
const trackingCache = new Set<string>();

export function ViewTracker({ articleId, title }: ViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Prevent duplicate tracking in the same component instance
    if (hasTracked.current) {
      console.log(`🔄 Skipping duplicate tracking for article ${articleId}`);
      return;
    }

    // Check if we've already tracked this article recently (within 5 seconds)
    const now = Date.now();
    const cacheKey = `article-${articleId}-${Math.floor(now / 5000)}`; // 5-second window

    if (trackingCache.has(cacheKey)) {
      console.log(
        `🔄 Skipping recent duplicate tracking for article ${articleId}`
      );
      hasTracked.current = true;
      return;
    }

    const trackView = async () => {
      try {
        const startTime = Date.now();
        console.log(`🔄 Tracking view for article ${articleId}: ${title}`);

        // Add to cache to prevent duplicates
        trackingCache.add(cacheKey);
        hasTracked.current = true;

        // Clean up old cache entries (keep only last 10)
        if (trackingCache.size > 10) {
          const firstKey = trackingCache.values().next().value;
          if (firstKey) {
            trackingCache.delete(firstKey);
          }
        }

        // Track the initial view
        const response = await fetch("/api/track/view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            articleId,
            title,
            referer: document.referrer,
            userAgent: navigator.userAgent,
          }),
        });

        if (response.ok) {
          console.log(`✅ View tracked successfully for article ${articleId}`);
        } else {
          console.error(
            `❌ View tracking failed for article ${articleId}:`,
            response.status,
            await response.text()
          );
        }

        // Track reading time when user leaves or after significant time
        const trackReadingTime = () => {
          const readingTime = Math.floor((Date.now() - startTime) / 1000);

          // Only track if user spent at least 10 seconds reading
          if (readingTime >= 10) {
            fetch("/api/track/engagement", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                articleId,
                engagementType: "reading_time",
                value: readingTime,
              }),
            }).catch(() => {
              // Silently fail for tracking
            });
          }
        };

        // Track reading time on page unload
        const handleBeforeUnload = () => {
          trackReadingTime();
        };

        // Track reading time after 30 seconds of reading
        const readingTimer = setTimeout(() => {
          trackReadingTime();
        }, 30000);

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
          clearTimeout(readingTimer);
          window.removeEventListener("beforeunload", handleBeforeUnload);
          trackReadingTime();
        };
      } catch (error) {
        // Log errors for debugging
        console.error("❌ View tracking failed:", error);
      }
    };

    trackView();
  }, [articleId, title]);

  // This component doesn't render anything
  return null;
}
