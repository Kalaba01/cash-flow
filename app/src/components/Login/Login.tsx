"use client";
import styles from "./Login.module.scss";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface LoginProps {
  onClose: () => void;
  onRegisterOpen: () => void;
}

export default function Login({ onClose, onRegisterOpen }: LoginProps) {
  const t = useTranslations("login");
  const [showPassword, setShowPassword] = useState(false);

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

          <div className={styles.modalUserIcon}>
            <FaUser />
          </div>

          <h2>{t("title")}</h2>

          <form>
            <label>{t("email")}</label>
            <input type="email" placeholder={t("emailPlaceholder")} required />

            <label>{t("password")}</label>
            <div className={styles.passwordInput}>
              <input type={showPassword ? "text" : "password"} placeholder={t("passwordPlaceholder")} required />
              <button
                type="button"
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit">{t("signIn")}</button>
          </form>

          <p className={styles.forgotPassword}>
            <span className={styles.clickable}>{t("forgotPassword")}</span>
          </p>

          <p className={styles.registerLink}>
            {t("noAccount")}{" "}
            <span className={styles.clickable} onClick={onRegisterOpen}>
              {t("signUp")}
            </span>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
