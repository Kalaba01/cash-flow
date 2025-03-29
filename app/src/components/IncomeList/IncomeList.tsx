"use client";
import styles from "./IncomeList.module.scss";
import { JSX } from "react";
import { Loading } from "@/components";
import { useTranslations } from "next-intl";
import {
  FaMoneyBillWave,
  FaUtensils,
  FaCar,
  FaHome,
  FaGift,
  FaShoppingCart,
  FaPiggyBank,
  FaEllipsisH,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

interface IncomeItem {
  id: string;
  category_name: string;
  amount: number;
  date: string;
  description?: string;
}

const categoryIcons: Record<string, JSX.Element> = {
  salary: <FaMoneyBillWave className={styles.salaryIcon} />,
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

interface IncomeListProps {
  incomeData: IncomeItem[];
  loading: boolean;
}

export default function IncomeList({ incomeData, loading }: IncomeListProps) {
  const t = useTranslations("incomeList");

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <h3>{t("title")}</h3>
        <button className={styles.addButton}>
          <FaPlus /> {t("addIncome")}
        </button>
      </div>
      
      {loading ? (
        <Loading />
      ) : incomeData.length === 0 ? (
        <p>{t("noData")}</p>
      ) : (
        <ul className={styles.list}>
          {incomeData.map((income) => (
            <li key={income.id} className={`${styles.listItem} ${styles[income.category_name.toLowerCase()]}`}>
              <div className={styles.iconWrapper}>{getCategoryIcon(income.category_name)}</div>
              <div className={styles.details}>
                <span className={styles.category}>{income.category_name.charAt(0).toUpperCase() + income.category_name.slice(1)}</span>
                <span className={styles.amount}>${income.amount.toFixed(2)}</span>
                <span className={styles.date}>{new Date(income.date).toLocaleDateString()}</span>
                {<p className={styles.description}>{income.description}</p>}
              </div>
              <div className={styles.actions}>
                <button className={styles.editButton}>
                  <FaEdit />
                </button>
                <button className={styles.deleteButton}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
