"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components";
import { isUserAuthenticated } from "@/utils/auth";

// Component that prevents authenticated users from accessing public pages
export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isUserAuthenticated()) {
      router.replace("/dashboard");
      return;
    }
    setIsAuthenticated(false);
  }, [router]);

  // Shows loading spinner while checking authentication state
  if (isAuthenticated) {
    return <Loading />;
  }

  return <>{children}</>;
}
