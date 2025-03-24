"use client";
import styles from "./ForgotPassword.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaLock } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface ForgotPasswordProps {
  onClose: () => void;
}

export default function ForgotPassword({ onClose }: ForgotPasswordProps) {
  const t = useTranslations("forgotPassword");

  return (
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

          <form>
            <label>{t("email")}</label>
            <input type="email" placeholder={t("emailPlaceholder")} required />

            <button type="submit">{t("resetButton")}</button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
