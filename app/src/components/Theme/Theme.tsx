"use client";
import styles from "./Theme.module.scss";
import { useThemeStore } from "@/store/useThemeStore";
import { FaMoon, FaSun } from "react-icons/fa";

// Theme toggle button component using Zustand for state management
export default function Theme() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle Theme">
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
}
