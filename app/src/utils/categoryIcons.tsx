"use client";
import { JSX } from "react";
import {
  FaMoneyBillWave,
  FaUtensils,
  FaCar,
  FaHome,
  FaGift,
  FaShoppingCart,
  FaPiggyBank,
  FaFilm,
  FaGraduationCap,
  FaHeartbeat,
  FaChartLine,
  FaShieldAlt,
  FaRedo,
  FaPlane,
  FaEllipsisH
} from "react-icons/fa";

export const incomeIcons: Record<string, () => JSX.Element> = {
  salary: () => <FaMoneyBillWave />,
  savings: () => <FaPiggyBank />,
  investment: () => <FaChartLine />,
  insurance: () => <FaShieldAlt />
};

export const expenseIcons: Record<string, () => JSX.Element> = {
  food: () => <FaUtensils />,
  transport: () => <FaCar />,
  housing: () => <FaHome />,
  gifts: () => <FaGift />,
  shopping: () => <FaShoppingCart />,
  entertainment: () => <FaFilm />,
  education: () => <FaGraduationCap />,
  health: () => <FaHeartbeat />,
  subscriptions: () => <FaRedo />,
  travel: () => <FaPlane />
};

export const getCategoryIcon = (category: string, type: "income" | "expense") => {
  const normalizedCategory = category.trim().toLowerCase();
  return (type === "income" ? incomeIcons[normalizedCategory] : expenseIcons[normalizedCategory])?.() || <FaEllipsisH />;
};
