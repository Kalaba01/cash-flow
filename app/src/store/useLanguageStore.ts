import { create } from "zustand";
import { useEffect } from "react";

// Interface for language state
interface LanguageState {
  locale: string;
  setLocale: (locale: string) => void;
}

// Zustand store for managing app language state (locale)
export const useLanguageStore = create<LanguageState>((set) => ({
  locale: typeof window !== "undefined" ? localStorage.getItem("locale") || "en" : "en",
  setLocale: (locale) => {
    localStorage.setItem("locale", locale);
    set({ locale })
  }
}));

// React hook to initialize language from localStorage on app load
export function useInitializeLanguage() {
  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale) {
      useLanguageStore.setState({ locale: storedLocale });
    }
  }, []);
}
