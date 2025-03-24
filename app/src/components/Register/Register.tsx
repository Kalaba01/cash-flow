"use client";
import styles from "./Register.module.scss";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface RegisterProps {
  onClose: () => void;
  onLoginOpen: () => void;
}

export default function Register({ onClose, onLoginOpen }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations("register");

  return (
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
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>{t("firstName")}</label>
              <input type="text" placeholder={t("firstNamePlaceholder")} required />
            </div>

            <div className={styles.inputGroup}>
              <label>{t("lastName")}</label>
              <input type="text" placeholder={t("lastNamePlaceholder")} required />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>{t("email")}</label>
            <input type="email" placeholder={t("emailPlaceholder")} required />
          </div>

          <div className={styles.inputGroup}>
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
          </div>

          <div className={styles.inputGroup}>
            <label>{t("confirmPassword")}</label>
            <div className={styles.passwordInput}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("confirmPasswordPlaceholder")}
                required
              />
              <button
                type="button"
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit">{t("signUp")}</button>
        </form>

        <p className={styles.alreadyAccount}>
          {t("alreadyAccount")}{" "}
          <span className={styles.clickable} onClick={onLoginOpen}>
            {t("signIn")}
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}
