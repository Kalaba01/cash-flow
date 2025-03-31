"use client";
import styles from "./GoalModal.module.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { showNotification } from "@/components/Notification/Notification";
import { GoalType, GoalPeriod } from "@/types/Goal";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalAdded: (goal: GoalType) => void;
  initialData?: GoalType;
}

export default function GoalModal({ isOpen, onClose, onGoalAdded, initialData }: GoalModalProps) {
  const t = useTranslations("goal");
  const [formData, setFormData] = useState({
    category_name: "",
    amount: "",
    goal_type: "expense",
    period: GoalPeriod.MONTH
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        category_name: initialData.category_name,
        amount: initialData.amount.toString(),
        goal_type: initialData.goal_type,
        period: initialData.period,
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      let response;
      if (initialData) {
        response = await axios.put(`http://localhost:8000/goal/${initialData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification({ message: t("goalUpdatedSuccess"), type: "success" });
      } else {
        response = await axios.post("http://localhost:8000/goal", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification({ message: t("goalAddedSuccess"), type: "success" });
      }

      onGoalAdded(response.data);
      onClose();
    } catch {
      showNotification({ message: initialData ? t("goalUpdateError") : t("goalAddedError"), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{t(initialData ? "editGoal" : "addGoal")}</h3>
          <FaTimes className={styles.closeIcon} onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <label>{t("category")}</label>
          <input type="text" name="category_name" value={formData.category_name} onChange={handleChange} required />

          <label>{t("amount")}</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

          <label>{t("goalType")}</label>
          <select name="goal_type" value={formData.goal_type} onChange={handleChange}>
            <option value="income">{t("incomeGoal")}</option>
            <option value="expense">{t("expenseGoal")}</option>
          </select>

          <label>{t("period")}</label>
          <select name="period" value={formData.period} onChange={handleChange}>
            {Object.values(GoalPeriod).map((period) => (
              <option key={period} value={period}>
                {t(period)}
              </option>
            ))}
          </select>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              {t("cancel")}
            </button>
            <button type="submit" className={styles.confirmButton} disabled={loading}>
              {loading ? t("saving") : t("confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
