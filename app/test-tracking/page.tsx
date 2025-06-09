"use client";

import { ViewTracker } from "@/components/view-tracker";

export default function TestTrackingPage() {
  return (
    <div className="p-8">
      <h1>View Tracker Test Page</h1>
      <p>Check the browser console and server logs for tracking messages.</p>
      <ViewTracker articleId={999} title="Test Tracking Article" />
    </div>
  );
}
