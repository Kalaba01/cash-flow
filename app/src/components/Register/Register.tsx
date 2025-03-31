"use client";
import styles from "./Register.module.scss";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { showNotification, NotificationContainer } from "@/components/Notification/Notification";

interface RegisterProps {
  onClose: () => void;
  onLoginOpen: () => void;
}

export default function Register({ onClose, onLoginOpen }: RegisterProps) {
  const t = useTranslations("register");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      showNotification({ message: t("passwordMismatch"), type: "error" });
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:8000/auth/register", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });

      showNotification({ message: t("registrationSuccess"), type: "success" });

      setTimeout(() => {
        onClose();
        onLoginOpen();
      }, 3000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        showNotification({ message: error.response?.data?.detail || "An error occurred.", type: "error" });
       } else {
        showNotification({ message: "An unexpected error occurred.", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>{t("firstName")}</label>
              <input
                type="text"
                name="first_name"
                placeholder={t("firstNamePlaceholder")}
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>{t("lastName")}</label>
              <input
                type="text"
                name="last_name"
                placeholder={t("lastNamePlaceholder")}
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>{t("email")}</label>
            <input
              type="email"
              name="email"
              placeholder={t("emailPlaceholder")}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t("password")}</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("passwordPlaceholder")}
                value={formData.password}
                onChange={handleChange}
                required
              />
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
                name="confirmPassword"
                placeholder={t("confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={handleChange}
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

          <button type="submit" disabled={loading}>
            {loading ? t("registering") : t("signUp")}
          </button>
        </form>

        <p className={styles.alreadyAccount}>
          {t("alreadyAccount")}{" "}
          <span className={styles.clickable} onClick={onLoginOpen}>
            {t("signIn")}
          </span>
        </p>
      </motion.div>
      
      <NotificationContainer />
    </motion.div>
  );
}
