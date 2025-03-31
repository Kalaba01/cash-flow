"use client";
import styles from "./GoalAdd.module.scss";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoalType } from "@/types/Goal";
import { GoalModal } from "@/components/";

interface GoalAddProps {
  onGoalAdded: (newGoal: GoalType) => void;
}

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
