"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { ExpenseLineChart, TransactionList } from "@/components";

export default function ExpensePage() {
  const [expenseData, setExpenseData] = useState([]);
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

  return (
    <div>
      <ExpenseLineChart expenseData={expenseData} loading={loading} />
      <TransactionList 
        title="expenseList.title"
        addButtonTitle="expenseList.addExpense"
        type="expense"
        data={expenseData}
        loading={loading}
      />
    </div>
  );
}
