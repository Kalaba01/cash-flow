"use client";
import { ProtectedRoute } from "@/components";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </ProtectedRoute>
  );
}
