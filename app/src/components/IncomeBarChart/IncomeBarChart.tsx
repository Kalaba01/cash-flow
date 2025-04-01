"use client";
import styles from "./IncomeBarChart.module.scss";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loading } from "@/components/";
import { FaChartBar } from "react-icons/fa";
import { useTranslations } from "next-intl";

// Props for income items to be shown in chart
interface IncomeItem {
  category_name: string;
  amount: number;
  date: string;
  description?: string;
}

// Props for income bar chart component
interface IncomeBarChartProps {
  incomeData: IncomeItem[];
  loading: boolean;
}

// Props for custom tooltip rendering inside chart
interface CustomTooltipProps {
    active?: boolean;
    payload?: { payload: IncomeItem }[];
}

// Custom tooltip component for displaying income amount and description
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

// Main component for rendering income data as a bar chart
export default function IncomeBarChart({ incomeData, loading }: IncomeBarChartProps) {
  const t = useTranslations("IncomeBarChart");

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
