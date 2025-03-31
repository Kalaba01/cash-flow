"use client";
import styles from "./TransactionModal.module.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { showNotification } from "@/components/Notification/Notification";
import { TransactionItem } from "@/types/TransactionItem";

interface TransactionFormData {
  category_name: string;
  amount: string;
  date: string;
  description?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "income" | "expense";
  initialData?: TransactionItem;
  onTransactionUpdated: (updatedTransaction: TransactionItem) => void;
}

export default function TransactionModal({
  isOpen,
  onClose,
  type,
  initialData,
  onTransactionUpdated,
}: TransactionModalProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState<TransactionFormData>({
    category_name: "",
    amount: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: String(initialData.amount),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === "amount" ? Number(e.target.value) : e.target.value
    });
  };  

  const handleSubmit = async () => {
    if (!formData.category_name || !formData.amount || !formData.date) {
      showNotification({ message: "Please fill in all required fields.", type: "error" });
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      const payload: TransactionItem = {
        ...formData,
        amount: Number(formData.amount),
      };
  
      let response;
      if (initialData?.id) {
        response = await axios.put(`http://localhost:8000/${type}/${initialData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`, type: "success" });
      } else {
        response = await axios.post(`http://localhost:8000/${type}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`, type: "success" });
      }
  
      onTransactionUpdated(response.data);
      onClose();
      setFormData({ category_name: "", amount: "", date: "", description: "" });
    } catch {
      showNotification({ message: `Failed to process ${type}.`, type: "error" });
    }
  };  

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{t(initialData?.id ? "Edit Transaction" : "Add Transaction")}</h3>
          <FaTimes className={styles.closeIcon} onClick={onClose} />
        </div>

        <div className={styles.modalBody}>
          <label>{t("Category")}</label>
          <input type="text" name="category_name" value={formData.category_name} onChange={handleChange} required />

          <label>{t("Amount")}</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

          <label>{t("Date")}</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />

          <label>{t("Description")}</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>{t("Cancel")}</button>
          <button className={styles.confirmButton} onClick={handleSubmit}>{t("Confirm")}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
