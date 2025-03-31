"use client";
import styles from "./TransactionEdit.module.scss";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { TransactionModal } from "@/components/";
import { TransactionItem } from "@/types/TransactionItem";

interface TransactionEditProps {
  transaction: TransactionItem;
  type: "income" | "expense";
  onTransactionUpdated: (updatedTransaction: TransactionItem) => void;
}

export default function TransactionEdit({ transaction, type, onTransactionUpdated }: TransactionEditProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={styles.editButton} onClick={() => setIsOpen(true)}>
        <FaEdit />
      </button>

      <TransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type={type}
        initialData={transaction}
        onTransactionUpdated={onTransactionUpdated}
      />
    </>
  );
}
