"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { IncomeCard, IncomeList } from "@/components";
import { showNotification } from "@/components/Notification/Notification";

interface IncomeItem {
  id: string;
  category_name: string;
  amount: number;
  date: string;
  description?: string;
}

export default function IncomePage() {
  const [incomeData, setIncomeData] = useState<IncomeItem[]>([]);
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

  return (
    <div>
      <IncomeCard incomeData={incomeData} loading={loading} />
      <IncomeList incomeData={incomeData} loading={loading} />
    </div>
  );
}
