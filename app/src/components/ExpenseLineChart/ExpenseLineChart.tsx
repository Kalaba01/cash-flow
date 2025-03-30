"use client";
import styles from "./ExpenseLineChart.module.scss";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loading } from "@/components/";
import { FaChartLine } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface ExpenseItem {
  category_name: string;
  amount: number;
  date: string;
  description?: string;
}

interface ExpenseLineChartProps {
  expenseData: ExpenseItem[];
  loading: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: ExpenseItem }[];
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

export default function ExpenseLineChart({ expenseData, loading }: ExpenseLineChartProps) {
  const t = useTranslations("ExpenseLineChart");

  const groupedData: Record<string, { amount: number; description?: string }> = {};

  expenseData.forEach((expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    if (!groupedData[date]) {
      groupedData[date] = { amount: 0, description: expense.description };
    }
    groupedData[date].amount += expense.amount;
  });

  const chartData = Object.entries(groupedData).map(([date, data]) => ({
    date,
    amount: data.amount,
    description: data.description,
  }));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <FaChartLine className={styles.icon} />
        <h3>{t("title")}</h3>
      </div>
      {loading ? (
        <Loading />
      ) : chartData.length === 0 ? (
        <p>{t("noData")}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="#555" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="amount" stroke="#f44336" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
