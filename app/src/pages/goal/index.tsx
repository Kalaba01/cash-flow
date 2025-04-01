"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { GoalList } from "@/components/";
import { showNotification } from "@/components/Notification/Notification";
import { GoalType } from "@/types/Goal";

export default function GoalPage() {
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/goal", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setGoals(response.data);
      } catch {
        showNotification({ message: "Failed to fetch goals.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleGoalUpsert = (goal: GoalType) => {
    setGoals((prevGoals) => {
      const index = prevGoals.findIndex((item) => item.id === goal.id);
      if (index !== -1) {
        const newGoals = [...prevGoals];
        newGoals[index] = goal;
        return newGoals;
      }
      return [goal, ...prevGoals];
    });
  };

  const handleGoalDeleted = (goalId: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
  };

  return (
    <div>
      <GoalList 
        goals={goals} 
        loading={loading} 
        onGoalUpsert={handleGoalUpsert} 
        onGoalDeleted={handleGoalDeleted}
        showButtons={true}
      />
    </div>
  );
}
