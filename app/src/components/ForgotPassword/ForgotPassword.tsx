"use client";
import styles from "./ForgotPassword.module.scss";
import axios from "axios";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaLock } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { showNotification } from "@/components/Notification/Notification";

// Props interface for the ForgotPassword modal component
interface ForgotPasswordProps {
  onClose: () => void;
}

// Renders the Forgot Password modal with form and animation
export default function ForgotPassword({ onClose }: ForgotPasswordProps) {
  const t = useTranslations("forgotPassword");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Handles form submission for password reset request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/auth/forgot-password", { email });

      showNotification({ message: t("successMessage"), type: "success" });
      setEmail("");
      setTimeout(() => {
        onClose();
      }, 3000)
    } catch (error: unknown) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className={styles.closeButton} onClick={onClose}>
              <FaTimes />
            </button>

            <div className={styles.modalIcon}>
              <FaLock />
            </div>

            <h2>{t("title")}</h2>
            <p>{t("description")}</p>

            <form onSubmit={handleSubmit}>
              <label>{t("email")}</label>
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? t("loading") : t("resetButton")}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
