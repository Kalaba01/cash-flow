import { create } from "zustand";
import { useEffect } from "react";

// Interface for theme state used in Zustand store
interface ThemeState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

// Managing light/dark theme state
export const useThemeStore = create<ThemeState>((set) => ({
  theme: typeof window !== "undefined" ? (localStorage.getItem("theme") as "light" | "dark") || "light" : "light",
  
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      return { theme: newTheme };
    });
  }
}));

// Hook to initialize theme on app load based on stored value
export function useInitializeTheme() {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) {
      useThemeStore.setState({ theme: storedTheme });
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);
}
