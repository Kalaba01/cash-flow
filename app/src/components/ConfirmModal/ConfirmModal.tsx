"use client";
import styles from "./ConfirmModal.module.scss";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";

// Props definition for the ConfirmModal component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

// ConfirmModal component used for displaying a confirmation dialog
export default function ConfirmModal({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) {
  const t = useTranslations();

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{t("confirm.title")}</h3>
          <FaTimes className={styles.closeIcon} onClick={onClose} />
        </div>
        <div className={styles.modalBody}>
          <p>{t(message)}</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>{t("confirm.cancel")}</button>
          <button className={styles.confirmButton} onClick={onConfirm}>{t("confirm.confirm")}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
