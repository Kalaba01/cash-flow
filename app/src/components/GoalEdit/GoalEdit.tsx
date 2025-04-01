"use client";
import styles from "./GoalEdit.module.scss";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import GoalModal from "@/components/GoalModal/GoalModal";
import { GoalType } from "@/types/Goal";

// Props for GoalEdit component, includes goal data and callback after update
interface GoalEditProps {
  goal: GoalType;
  onGoalUpdated: (updatedGoal: GoalType) => void;
}

// Renders an edit button and opens the GoalModal with initial goal data
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
