"use client";
import styles from "./TransactionDelete.module.scss";
import axios from "axios";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { ConfirmModal } from "@/components/";
import { showNotification } from "@/components/Notification/Notification";
import { useTranslations } from "next-intl";

interface TransactionDeleteProps {
  transactionId: string;
  type: "income" | "expense";
  onTransactionDeleted: (transactionId: string) => void;
}

export default function TransactionDelete({ transactionId, type, onTransactionDeleted }: TransactionDeleteProps) {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/${type}/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification({ message: t("confirm.success"), type: "success" });
      onTransactionDeleted(transactionId);
    } catch {
      showNotification({ message: t("confirm.error"), type: "error" });
    } finally {
      setIsModalOpen(false);
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
        message="confirm.deleteMessage"
      />
    </>
  );
}
