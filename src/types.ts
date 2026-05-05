export interface Apartment {
  id: string;
  name: string;
  display_name?: string;
  city: string;
  district: string;
  neighborhood: string;
  manager_password?: string;
  created_at?: string;
}

export interface Resident {
  id: string;
  apartment_id: string;
  apartment_no: string;
  name: string;
  is_manager?: boolean;
}

export interface IncomeCategory {
  id: string;
  apartment_id: string;
  name: string;
  required_amount?: number;
}

export interface ExpenseCategory {
  id: string;
  apartment_id: string;
  name: string;
}

export interface IncomeRecord {
  id: string;
  apartment_id: string;
  resident_id: string;
  category_id: string;
  month: number;
  year: number;
  amount: number;
  status: 'paid' | 'exempt' | 'pending';
}

export interface Expense {
  id: string;
  apartment_id: string;
  date: string;
  category_id?: string;
  description: string;
  amount: number;
}

export interface AppData {
  residents: Resident[];
  categories: IncomeCategory[];
  expenseCategories: ExpenseCategory[];
  incomeRecords: IncomeRecord[];
  expenses: Expense[];
  carryover: number;
}
