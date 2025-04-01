"use client";
import styles from "./GoalDelete.module.scss";
import axios from "axios";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { ConfirmModal } from "@/components/";
import { showNotification } from "@/components/Notification/Notification";
import { useTranslations } from "next-intl";

// Props for GoalDelete component, includes goal ID and callback after deletion
interface GoalDeleteProps {
  goalId: string;
  onGoalDeleted: (goalId: string) => void;
}

// Renders a delete button and confirmation modal to delete a goal
export default function GoalDelete({ goalId, onGoalDeleted }: GoalDeleteProps) {
  const t = useTranslations("goal");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handles goal deletion by sending DELETE request and notifying the user
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
