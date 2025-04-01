// Enum for goal period options (week, month, year, or forever)
export enum GoalPeriod {
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  FOREVER = "forever"
}

// Type definition for a Goal item with all goal-related properties
export type GoalType = {
  id: string;
  user_id: string;
  category_name: string;
  amount: number;
  goal_type: "income" | "expense";
  period: GoalPeriod;
  created_at: string;
  current_amount: number;
};
