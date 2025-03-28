"use client";
import styles from "./IncomeCard.module.scss";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loading } from "@/components/";
import { FaChartBar } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface IncomeItem {
  category_name: string;
  amount: number;
  date: string;
  description?: string;
}

interface IncomeCardProps {
  incomeData: IncomeItem[];
  loading: boolean;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: { payload: IncomeItem }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { description, amount } = payload[0].payload;
    return (
      <div className={styles.tooltip}>
        {description && <p className={styles.description}>{description}</p>}
        <p className={styles.amount}>${amount.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function IncomeCard({ incomeData, loading }: IncomeCardProps) {
  const t = useTranslations("incomeCard");

  const groupedData: Record<string, { amount: number; description?: string }> = {};

  incomeData.forEach((income) => {
    const date = new Date(income.date).toLocaleDateString();
    if (!groupedData[date]) {
      groupedData[date] = { amount: 0, description: income.description };
    }
    groupedData[date].amount += income.amount;
  });

  const chartData = Object.entries(groupedData).map(([date, data]) => ({
    date,
    amount: data.amount,
    description: data.description,
  }));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <FaChartBar className={styles.icon} />
        <h3>{t("title")}</h3>
      </div>
      {loading ? (
        <Loading />
      ) : chartData.length === 0 ? (
        <p>{t("noData")}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" stroke="#555" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#4caf50" barSize={40} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
