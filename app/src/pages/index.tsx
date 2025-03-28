"use client";
import { HeroSection, Functionalities, FAQ, PublicRoute } from "@/components";

export default function LandingPage() {
  return (
    <>
      <PublicRoute>
        <HeroSection />
        <Functionalities />
        <FAQ />
      </PublicRoute>
    </>
  );
}
