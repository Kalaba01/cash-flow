"use client";
import styles from "./GoalDelete.module.scss";
import axios from "axios";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { ConfirmModal } from "@/components/";
import { showNotification } from "@/components/Notification/Notification";
import { useTranslations } from "next-intl";

interface GoalDeleteProps {
  goalId: string;
  onGoalDeleted: (goalId: string) => void;
}

export default function GoalDelete({ goalId, onGoalDeleted }: GoalDeleteProps) {
  const t = useTranslations("goal");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/goal/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification({ message: t("goalDeletedSuccess"), type: "success" });
      onGoalDeleted(goalId);
      setIsModalOpen(false);
    } catch {
      showNotification({ message: t("goalDeletedError"), type: "error" });
    }
  };

  return (
    <>
      <button className={styles.deleteButton} onClick={() => setIsModalOpen(true)}>
        <FaTrash />
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="goal.goalDeleteConfirm"
      />
    </>
  );
}
