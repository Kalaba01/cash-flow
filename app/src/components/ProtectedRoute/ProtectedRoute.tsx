"use client";
import { useRouter } from "next/navigation";
import { Loading } from "@/components";
import { useEffect, useState } from "react";
import { isUserAuthenticated } from "@/utils/auth";

// Component that protects routes by checking user authentication
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isUserAuthenticated()) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      router.replace("/unauthorized");
    }
  }, [router]);

  // Shows loading spinner while authentication is being verified
  if (!isAuthenticated) {
    return <Loading />
  }

  return <>{children}</>;
}
