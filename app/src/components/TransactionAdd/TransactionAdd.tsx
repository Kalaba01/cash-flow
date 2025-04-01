"use client";
import styles from "./TransactionAdd.module.scss";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { TransactionModal } from "@/components/";
import { TransactionItem } from "@/types/TransactionItem";

// Props for TransactionAdd component
interface TransactionAddProps {
  title: string;
  type: "income" | "expense";
  onTransactionAdded: (newTransaction: TransactionItem) => void;
}

// Button for opening modal to add a new transaction (income or expense)
export default function TransactionAdd({ title, type, onTransactionAdded  }: TransactionAddProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      <button className={styles[`${type}Button`]} onClick={toggleModal}>
        <FaPlus /> {t(title)}
      </button>

      <TransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type={type}
        onTransactionUpdated={onTransactionAdded}
      />
    </>
  );
}
