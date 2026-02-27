"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function DashboardCheckTrigger() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    // Fire-and-forget dashboard check feedback trigger
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trigger: "dashboard_check" }),
    }).catch(() => {});
  }, [user]);

  return null;
}
