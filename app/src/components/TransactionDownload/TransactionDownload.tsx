"use client";
import styles from "./TransactionDownload.module.scss";
import { FaDownload } from "react-icons/fa";
import { TransactionItem } from "@/types/TransactionItem";

// Props for the transaction download component
interface TransactionDownloadProps {
  transactions: TransactionItem[];
  type: "income" | "expense"
}

// Button that generates and downloads filtered transactions as a CSV file
export default function TransactionDownload({ transactions, type }: TransactionDownloadProps) {
  const handleDownload = () => {
    const headers = ["Category", "Amount", "Date", "Description"];
    const rows = transactions.map((t) => [
        t.category_name.charAt(0).toUpperCase() + t.category_name.slice(1),
      t.amount.toFixed(2),
      new Date(t.date).toLocaleDateString(),
      t.description?.trim() || "N/A"
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" && cell.includes(",")
                ? `"${cell.replace(/"/g, '""')}"`
                : cell
            )
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}_transactions.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className={styles.downloadButton} title="Download" onClick={handleDownload}>
      <FaDownload />
    </button>
  );
}
