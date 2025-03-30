"use client";
import styles from "./TransactionEdit.module.scss";
import { FaEdit } from "react-icons/fa";

export default function TransactionEdit() {
  return (
    <button className={styles.editButton}>
      <FaEdit />
    </button>
  );
}
