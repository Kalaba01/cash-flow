"use client";
import { useRouter } from "next/navigation";
import { Loading } from "@/components";
import { useEffect, useState } from "react";
import { isUserAuthenticated } from "@/utils/auth";

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

  if (!isAuthenticated) {
    return <Loading />
  }

  return <>{children}</>;
}
