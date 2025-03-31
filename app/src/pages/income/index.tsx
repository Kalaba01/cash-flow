"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { IncomeBarChart, TransactionList } from "@/components";
import { showNotification } from "@/components/Notification/Notification";
import { TransactionItem } from "@/types/TransactionItem";

export default function IncomePage() {
  const [incomeData, setIncomeData] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/income", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIncomeData(response.data);
      } catch {
        showNotification({ message: "Failed to fetch income data.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, []);

  const handleTransactionUpsert = (transaction: TransactionItem) => {
    setIncomeData((prevData) => {
      const index = prevData.findIndex(item => item.id === transaction.id);
      if (index !== -1) {
        const newData = [...prevData];
        newData[index] = transaction;
        return newData;
      }
      return [transaction, ...prevData];
    });
  };

  return (
    <div>
      <IncomeBarChart incomeData={incomeData} loading={loading} />
      <TransactionList 
        title="incomeList.title"
        addButtonTitle="incomeList.addIncome"
        type="income"
        data={incomeData}
        loading={loading}
        onTransactionAdded={handleTransactionUpsert}
      />
    </div>
  );
}
