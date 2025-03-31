"use client";
import styles from "./GoalEdit.module.scss";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import GoalModal from "@/components/GoalModal/GoalModal";
import { GoalType } from "@/types/Goal";

interface GoalEditProps {
  goal: GoalType;
  onGoalUpdated: (updatedGoal: GoalType) => void;
}

export default function GoalEdit({ goal, onGoalUpdated }: GoalEditProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={styles.editButton} onClick={() => setIsOpen(true)}>
        <FaEdit />
      </button>
      {isOpen && (
        <GoalModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          onGoalAdded={onGoalUpdated} 
          initialData={goal} 
        />
      )}
    </>
  );
}
