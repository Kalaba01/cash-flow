"use client";
import styles from "./ProfileOverview.module.scss";
import axios from "axios";
import { FaUserCircle, FaEdit, FaKey } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Loading, ProfileChangePassword, ProfileEdit } from "@/components";
import { useTranslations } from "next-intl";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
}

export default function ProfileOverview() {
  const t = useTranslations("profile");

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  if (loading) return <Loading />;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <FaUserCircle className={styles.userIcon} />
        <h2 className={styles.title}>{t("title")}</h2>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.userInfo}>
          <p>
            <strong>{t("firstName")}:</strong> {user?.first_name}
          </p>
          <p>
            <strong>{t("lastName")}:</strong> {user?.last_name}
          </p>
          <p>
            <strong>{t("email")}:</strong> {user?.email}
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.passwordButton} onClick={() => setIsPasswordModalOpen(true)}>
            <FaKey /> {t("changePassword")}
          </button>
          <button className={styles.editButton} onClick={() => setIsEditModalOpen(true)}>
            <FaEdit /> {t("editProfile")}
          </button>
        </div>
      </div>

      {isPasswordModalOpen && <ProfileChangePassword onClose={() => setIsPasswordModalOpen(false)} />}
      {isEditModalOpen && (
        <ProfileEdit
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

    </div>
  );
}
