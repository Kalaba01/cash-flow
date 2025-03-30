"use client";
import styles from "./TransactionAdd.module.scss";
import { FaPlus } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface TransactionAddProps {
    title: string,
    type: "income" | "expense"
}

export default function TransactionAdd({ title, type }: TransactionAddProps) {
    const t = useTranslations();

    return (
        <button className={styles[`${type}Button`]}>
          <FaPlus /> {t(title)}
        </button>
      );
}
