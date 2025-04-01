"use client";
import styles from "./ResetPassword.module.scss";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { showNotification } from "@/components/Notification/Notification";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";

// Page component for resetting user password via token
export default function ResetPassword() {
  const t = useTranslations("resetPassword");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handles the password reset form submission and validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showNotification({ message: t("invalidToken"), type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification({ message: t("passwordsMismatch"), type: "error" });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      showNotification({ message: t("successMessage"), type: "success" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.detail;
        if (errMsg === "New password must be different from old password") {
          showNotification({ message: t("newSameAsOld"), type: "error" });
        } else {
          showNotification({
            message: errMsg || t("errorMessage"),
            type: "error",
          });
        }
      } else {
        showNotification({ message: t("errorMessage"), type: "error" });
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 3100);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
        <form onSubmit={handleSubmit}>
          <label>{t("newPassword")}</label>
          <div className={styles.inputWrapper}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder={t("newPasswordPlaceholder")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className={styles.toggleBtn}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className={styles.inputWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className={styles.toggleBtn}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className={styles["button-container"]}>
            <button type="submit" disabled={loading}>
              {loading ? t("resetting") : t("resetButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
