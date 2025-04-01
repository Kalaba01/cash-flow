"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { ExpenseLineChart, TransactionList } from "@/components";
import { TransactionItem } from "@/types/TransactionItem";

export default function ExpensePage() {
  const [expenseData, setExpenseData] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/expense", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpenseData(response.data);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleTransactionUpsert = (transaction: TransactionItem) => {
    setExpenseData((prevData) => {
      const index = prevData.findIndex((item) => item.id === transaction.id);
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
      <ExpenseLineChart expenseData={expenseData} loading={loading} />
      <TransactionList 
        title="expenseList.title"
        addButtonTitle="expenseList.addExpense"
        type="expense"
        data={expenseData}
        loading={loading}
        onTransactionAdded={handleTransactionUpsert}
        showButtons={true}
      />
    </div>
  );
}
