"use client";
import styles from "./TransactionDelete.module.scss";
import { FaTrash } from "react-icons/fa";

export default function TransactionDelete() {
  return (
    <button className={styles.deleteButton}>
      <FaTrash />
    </button>
  );
}
