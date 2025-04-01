// Interface representing a single transaction item (income or expense)
export interface TransactionItem {
  id?: string;
  category_name: string;
  amount: number;
  date: string;
  description?: string;
}
