export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'personal' | 'work' | 'extra';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: TransactionCategory;
  type: TransactionType;
}