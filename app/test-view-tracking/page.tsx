"use client";

import { ViewTracker } from "@/components/view-tracker";

export default function TestViewTrackingPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">ViewTracker Test Page</h1>

      <div className="bg-blue-100 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Testing ViewTracker Component</h2>
        <p>This page includes a ViewTracker component for article ID 999.</p>
        <p>Check the browser console and database for tracking results.</p>
      </div>

      <ViewTracker articleId={999} title="Test Article for ViewTracker Debug" />

      <div className="bg-yellow-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <p>1. Open browser developer tools (F12)</p>
        <p>2. Check the Console tab for ViewTracker logs</p>
        <p>3. Look for tracking messages starting with 🔄 or ✅</p>
      </div>
    </div>
  );
}
