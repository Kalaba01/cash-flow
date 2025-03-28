"use client";
import styles from "./Login.module.scss";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { showNotification } from "@/components/Notification/Notification";

interface LoginProps {
  onOpen: () => void;
  onClose: () => void;
  onRegisterOpen: () => void;
  onForgotPasswordOpen: () => void;
  isOpen: boolean;
}

export default function Login({ onOpen, onClose, onRegisterOpen, onForgotPasswordOpen, isOpen }: LoginProps) {
  const t = useTranslations("login");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.access_token);
      showNotification({ message: t("loginSuccess"), type: "success" });
    } catch (error: any) {
      showNotification({
        message: error.response?.data?.detail || "Login failed. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        onClose();
        router.push("/dashboard")
      }, 1500);
    }
  };

  return (
    <>
      <FaUser className={styles.userIcon} onClick={onOpen} />

      <AnimatePresence>
        {isOpen && (
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

              <form onSubmit={handleLogin}>
                <label>{t("email")}</label>
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>{t("password")}</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                <button type="submit" disabled={loading}>
                  {loading ? t("loggingIn") : t("signIn")}
                </button>
              </form>

              <p className={styles.forgotPassword}>
                <span className={styles.clickable} onClick={onForgotPasswordOpen}>
                  {t("forgotPassword")}
                </span>
              </p>

              <p className={styles.registerLink}>
                {t("noAccount")}{" "}
                <span className={styles.clickable} onClick={onRegisterOpen}>
                  {t("signUp")}
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
