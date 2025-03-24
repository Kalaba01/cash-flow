import { create } from "zustand";
import { useEffect } from "react";

interface LanguageState {
  locale: string;
  setLocale: (locale: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: typeof window !== "undefined" ? localStorage.getItem("locale") || "en" : "en",
  setLocale: (locale) => {
    localStorage.setItem("locale", locale);
    set({ locale })
  }
}));

export function useInitializeLanguage() {
  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale) {
      useLanguageStore.setState({ locale: storedLocale });
    }
  }, []);
}
