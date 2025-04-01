"use client";
import styles from "./ProfileEdit.module.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FaTimes } from "react-icons/fa";
import { showNotification } from "@/components/Notification/Notification";

// Props interface for the profile edit modal component
interface ProfileEditProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: (updatedUser: UserProfile) => void;
}

// Interface representing the structure of user profile data
interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
}


export default function ProfileEdit({ isOpen, onClose, onProfileUpdate }: ProfileEditProps) {
  const t = useTranslations("profile");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    if (isOpen) {
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:8000/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [isOpen]);

  // Handles input field changes and updates form state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Sends updated profile data to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/profile/update",
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification({ message: t("profileUpdated"), type: "success" });
      onProfileUpdate(user);
      onClose();
    } catch (error) {
      showNotification({ message: t("profileUpdateFailed"), type: "error" });
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{t("editProfile")}</h2>
          <FaTimes className={styles.closeIcon} onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>{t("firstName")}</label>
            <input
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>{t("lastName")}</label>
            <input
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>{t("email")}</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveButton} disabled={loading}>
              {loading ? t("saving") : t("saveChanges")}
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
