"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  articleId: number;
  title: string;
}

export function ViewTracker({ articleId, title }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        const startTime = Date.now();

        // Track the initial view
        await fetch("/api/track/view", {
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
        // Silently fail for analytics tracking
        console.debug("View tracking failed:", error);
      }
    };

    trackView();
  }, [articleId, title]);

  // This component doesn't render anything
  return null;
}
