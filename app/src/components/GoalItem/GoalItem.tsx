"use client";
import styles from "./GoalItem.module.scss";
import { GoalEdit, GoalDelete } from "@/components/";
import { GoalType } from "@/types/Goal";
import { useTranslations } from "next-intl";

// Props for the GoalItem component, includes goal data and event handlers
interface GoalItemProps {
  goal: GoalType;
  onGoalDeleted: (goalId: string) => void;
  onGoalUpdated: (updatedGoal: GoalType) => void;
  showButtons: boolean;
}

// Renders a single goal item with progress bar and optional edit/delete buttons
export default function GoalItem({ goal, onGoalDeleted, onGoalUpdated, showButtons }: GoalItemProps) {
  const t = useTranslations("goal");

  // Returns CSS class for progress bar based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 80) return styles.green;
    if (percentage < 95) return styles.yellow;
    return styles.red;
  };

  const progressPercentage = goal.amount > 0 ? (goal.current_amount / goal.amount) * 100 : 0;
  const formattedPercentage =
    progressPercentage % 1 === 0 ? `${progressPercentage.toFixed(0)}%` : `${progressPercentage.toFixed(2)}%`;

  // Formats goal category with capitalized first letter
  const formatCategory = (category: string) =>
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <li className={styles.goalItem}>
      <div className={styles.details}>
        <h4>{formatCategory(goal.category_name)}</h4>
        <p className={styles.goalType}>
          {goal.goal_type === "income" ? t("incomeGoal") : t("expenseGoal")} - {t(goal.period)}
        </p>
        <div className={styles.progressContainer}>
          <div className={`${styles.progressBar} ${getProgressColor(progressPercentage)}`} style={{ width: `${Math.min(progressPercentage, 100)}%` }}>
            <span className={styles.progressText}>{formattedPercentage}</span>
          </div>
        </div>
        <p className={styles.goalValues}>
          <strong>{goal.current_amount.toFixed(2)}</strong> / {goal.amount.toFixed(2)}
        </p>
      </div>
      <div className={styles.actions}>
        {showButtons && 
          <GoalEdit goal={goal} onGoalUpdated={onGoalUpdated} /> &&
          <GoalDelete goalId={goal.id} onGoalDeleted={onGoalDeleted} />
        }
      </div>
    </li>
  );
}
