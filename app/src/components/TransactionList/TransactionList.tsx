"use client";
import styles from "./TransactionList.module.scss";
import { JSX } from "react";
import { Loading, TransactionAdd, TransactionEdit, TransactionDelete } from "@/components";
import { useTranslations } from "next-intl";
import {
  FaMoneyBillWave,
  FaUtensils,
  FaCar,
  FaHome,
  FaGift,
  FaShoppingCart,
  FaPiggyBank,
  FaEllipsisH
} from "react-icons/fa";

interface TransactionItem {
  id: string;
  category_name: string;
  amount: number;
  date: string;
  description?: string;
}

const categoryIcons: Record<string, JSX.Element> = {
  salary: <FaMoneyBillWave />,
  food: <FaUtensils />,
  transport: <FaCar />,
  housing: <FaHome />,
  gifts: <FaGift />,
  shopping: <FaShoppingCart />,
  savings: <FaPiggyBank />,
};

const getCategoryIcon = (category: string) => {
  const normalizedCategory = category.trim().toLowerCase();
  return categoryIcons[normalizedCategory] || <FaEllipsisH />;
};

interface TransactionListProps {
  title: string;
  addButtonTitle: string;
  type: "income" | "expense";
  data: TransactionItem[];
  loading: boolean;
}

export default function TransactionList({ title, addButtonTitle, type, data, loading }: TransactionListProps) {
  const t = useTranslations("");

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <h3>{t(title)}</h3>
        <TransactionAdd title={addButtonTitle} type={type} />
      </div>

      {loading ? (
        <Loading />
      ) : data.length === 0 ? (
        <p>{t("noData")}</p>
      ) : (
        <ul className={styles.list}>
          {data.map((item) => (
            <li key={item.id} className={`${styles.listItem} ${styles[item.category_name.toLowerCase()]}`}>
              <div className={styles.iconWrapper}>{getCategoryIcon(item.category_name)}</div>
              <div className={styles.details}>
                <span className={styles.category}>
                  {item.category_name.charAt(0).toUpperCase() + item.category_name.slice(1)}
                </span>
                <span className={styles.amount}>${item.amount.toFixed(2)}</span>
                <span className={styles.date}>{new Date(item.date).toLocaleDateString()}</span>
                {item.description && <p className={styles.description}>{item.description}</p>}
              </div>
              <div className={styles.actions}>
                <TransactionEdit />
                <TransactionDelete />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
