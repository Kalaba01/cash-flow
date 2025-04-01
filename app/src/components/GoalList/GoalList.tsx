"use client";
import styles from "./GoalList.module.scss";
import { GoalItem, GoalAdd } from "@/components/";
import { GoalType } from "@/types/Goal";
import { useTranslations } from "next-intl";

interface GoalListProps {
  goals: GoalType[];
  loading: boolean;
  onGoalUpsert: (goal: GoalType) => void;
  onGoalDeleted: (goalId: string) => void;
  showButtons: boolean
}

export default function GoalList({ goals, loading, onGoalUpsert, onGoalDeleted, showButtons }: GoalListProps) {
  const t = useTranslations("goal");

  return (
    <div className={styles.goalList}>
      <div className={styles.header}>
        <h2>{t("title")}</h2>
        { showButtons && <GoalAdd onGoalAdded={onGoalUpsert} />}
      </div>
      {loading ? (
        <p>{t("loading")}</p>
      ) : goals.length === 0 ? (
        <p>{t("noGoals")}</p>
      ) : (
        <ul>
          {goals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} onGoalDeleted={onGoalDeleted} onGoalUpdated={onGoalUpsert} showButtons={showButtons} />
          ))}
        </ul>
      )}
    </div>
  );
}
