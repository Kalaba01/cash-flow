"use client";
import styles from "./TransactionList.module.scss";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loading, TransactionAdd, TransactionEdit, TransactionDelete } from "@/components";
import { incomeIcons, expenseIcons, getCategoryIcon } from "@/utils/categoryIcons";
import { TransactionItem } from "@/types/TransactionItem";

interface TransactionListProps {
  title: string;
  addButtonTitle: string;
  type: "income" | "expense";
  data: TransactionItem[];
  loading: boolean;
  onTransactionAdded: (newTransaction: TransactionItem) => void;
}

export default function TransactionList({
  title,
  addButtonTitle,
  type,
  data: initialData,
  loading,
  onTransactionAdded
}: TransactionListProps) {
  
  const t = useTranslations("");
  const [data, setData] = useState<TransactionItem[]>(initialData);
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const availableCategories = type === "income" ? Object.keys(incomeIcons) : Object.keys(expenseIcons);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);

    const now = new Date();
    let isDateInRange = true;
    if (selectedDateRange === "7days") {
      isDateInRange = itemDate >= new Date(now.setDate(now.getDate() - 7));
    } else if (selectedDateRange === "month") {
      isDateInRange = itemDate >= new Date(now.setMonth(now.getMonth() - 1));
    } else if (selectedDateRange === "year") {
      isDateInRange = itemDate >= new Date(now.setFullYear(now.getFullYear() - 1));
    }

    const isCategorySelected = selectedCategory === "all" || item.category_name.toLowerCase() === selectedCategory;

    return isDateInRange && isCategorySelected;
  });

  const handleTransactionDeleted = (transactionId: string) => {
    setData((prevData) => prevData.filter((transaction) => transaction.id !== transactionId));
  };  

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <select className={styles.dropdown} onChange={(e) => setSelectedDateRange(e.target.value)}>
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>

          <select className={styles.dropdown} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <h3>{t(title)}</h3>

        <TransactionAdd title={addButtonTitle} type={type} onTransactionAdded={onTransactionAdded} />
      </div>

      {loading ? (
        <Loading />
      ) : filteredData.length === 0 ? (
        <p>{t("noData")}</p>
      ) : (
        <ul className={styles.list}>
          {filteredData.map((item) => (
            <li
              key={item.id}
              className={`${styles.listItem} ${styles[item.category_name.toLowerCase()]}`}
            >
              <div className={styles.iconWrapper}>
                {getCategoryIcon(item.category_name, type)}
              </div>
              <div className={styles.details}>
                <span className={styles.category}>
                  {item.category_name.charAt(0).toUpperCase() +
                    item.category_name.slice(1)}
                </span>
                <span className={styles.amount}>${item.amount.toFixed(2)}</span>
                <span className={styles.date}>
                  {new Date(item.date).toLocaleDateString()}
                </span>
                {item.description && (
                  <p className={styles.description}>{item.description}</p>
                )}
              </div>
              <div className={styles.actions}>
                <TransactionEdit transaction={item} type={type} onTransactionUpdated={onTransactionAdded} />
                <TransactionDelete transactionId={item.id!} type={type} onTransactionDeleted={handleTransactionDeleted} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
