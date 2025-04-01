"use client";
import styles from "./GoalAdd.module.scss";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoalType } from "@/types/Goal";
import { GoalModal } from "@/components/";

// Props for GoalAdd component, expects a callback when a goal is added
interface GoalAddProps {
  onGoalAdded: (newGoal: GoalType) => void;
}

// Renders a button that opens the GoalModal to add a new financial goal
export default function GoalAdd({ onGoalAdded }: GoalAddProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={styles.addButton} onClick={() => setIsOpen(true)}>
        <FaPlus /> Add Goal
      </button>

      <GoalModal isOpen={isOpen} onClose={() => setIsOpen(false)} onGoalAdded={onGoalAdded} />
    </>
  );
}
