"use client";
import styles from "./Language.module.scss";
import { useState } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe } from "react-icons/fa";

// Language selection dropdown using Zustand for locale state
export default function Language() {
  const { locale, setLocale } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.language}>
      <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
        <FaGlobe className={styles.globeIcon} />
        <span>{locale.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <li>
              <button onClick={() => { setLocale("en"); setIsOpen(false); }} disabled={locale === "en"}>
                🇪🇳 English
              </button>
            </li>
            <li>
              <button onClick={() => { setLocale("bs"); setIsOpen(false); }} disabled={locale === "bs"}>
                🇧🇦 Bosanski
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
