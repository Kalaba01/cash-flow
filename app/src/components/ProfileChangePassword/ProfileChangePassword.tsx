"use client";
import styles from "./ProfileChangePassword.module.scss";
import axios from "axios";
import { useState } from "react";
import { FaLock, FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { showNotification } from "@/components/Notification/Notification";

interface ProfileChangePasswordProps {
  onClose: () => void;
}

export default function ProfileChangePassword({ onClose }: ProfileChangePasswordProps) {
  const t = useTranslations("profile");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showNotification({ message: t("passwordMismatch"), type: "error" });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/profile/change-password",
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification({ message: t("passwordUpdated"), type: "success" });
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = error.response.data.detail;
    
          if (errorMessage === "Incorrect old password") {
            showNotification({ message: t("incorrectOldPassword"), type: "error" });
          } else if (errorMessage === "New password must be different from the old password") {
            showNotification({ message: t("passwordSameAsOld"), type: "error" });
          } else {
            showNotification({ message: t("passwordUpdateFailed"), type: "error" });
          }
        } else if (error.request) {
          showNotification({ message: t("serverError"), type: "error" });
        } else {
          showNotification({ message: t("passwordUpdateFailed"), type: "error" });
        }
      } else {
        console.error("Unexpected error:", error);
        showNotification({ message: t("passwordUpdateFailed"), type: "error" });
      }
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3><FaLock /> {t("changePassword")}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form className={styles.form} onSubmit={handlePasswordChange}>
          <label>{t("oldPassword")}</label>
          <input 
            type="password" 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
            required 
          />

          <label>{t("newPassword")}</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />

          <label>{t("confirmPassword")}</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? t("loading") : t("updatePassword")}
          </button>
        </form>
      </div>
    </div>
  );
}
