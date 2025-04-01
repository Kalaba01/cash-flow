"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ProtectedRoute,
  IncomeBarChart,
  ExpenseLineChart,
  TransactionList,
  GoalList
} from "@/components";
import { TransactionItem } from "@/types/TransactionItem";
import { GoalType } from "@/types/Goal";
import { showNotification } from "@/components/Notification/Notification";

export default function Dashboard() {

  const [incomeData, setIncomeData] = useState<TransactionItem[]>([]);
  const [expenseData, setExpenseData] = useState<TransactionItem[]>([]);
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [incomeRes, expenseRes, goalRes] = await Promise.all([
          axios.get("http://localhost:8000/income", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/expense", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/goal", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setIncomeData(incomeRes.data);
        setExpenseData(expenseRes.data);
        setGoals(goalRes.data);
      } catch {
        showNotification({
          message: "Failed to fetch dashboard data.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTransactionUpsert = (item: TransactionItem) => {
    const update = (data: TransactionItem[]) => {
      const index = data.findIndex((t) => t.id === item.id);
      if (index !== -1) {
        const copy = [...data];
        copy[index] = item;
        return copy;
      }
      return [item, ...data];
    };

    const isIncome = incomeData.some((t) => t.id === item.id);
    if (isIncome) {
      setIncomeData((prev) => update(prev));
    } else {
      setExpenseData((prev) => update(prev));
    }
  };

  const handleGoalUpsert = (goal: GoalType) => {
    setGoals((prev) => {
      const index = prev.findIndex((g) => g.id === goal.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = goal;
        return updated;
      }
      return [goal, ...prev];
    });
  };

  const handleGoalDeleted = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  return (
    <ProtectedRoute>
      <div>
        <IncomeBarChart incomeData={incomeData} loading={loading} />

        <TransactionList
          title="dashboard.incomeTitle"
          addButtonTitle="dashboard.addIncome"
          type="income"
          data={incomeData}
          loading={loading}
          onTransactionAdded={handleTransactionUpsert}
          showButtons={false}
        />

        <ExpenseLineChart expenseData={expenseData} loading={loading} />

        <TransactionList
          title="dashboard.expenseTitle"
          addButtonTitle="dashboard.addExpense"
          type="expense"
          data={expenseData}
          loading={loading}
          onTransactionAdded={handleTransactionUpsert}
          showButtons={false}
        />

        <GoalList
          goals={goals}
          loading={loading}
          onGoalUpsert={handleGoalUpsert}
          onGoalDeleted={handleGoalDeleted}
          showButtons={false}
        />
      </div>
    </ProtectedRoute>
  );
}
