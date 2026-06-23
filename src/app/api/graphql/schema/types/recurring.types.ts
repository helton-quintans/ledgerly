export type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface CreateRecurringInput {
  amount: number;
  currency: string;
  category: string;
  description?: string | null;
  frequency: Frequency;
  interval?: number;
  daysOfWeek?: string | null; // CSV or JSON
  dayOfMonth?: number | null;
  startDate?: string | null; // ISO date string
  endDate?: string | null; // ISO date string
}

export interface UpdateRecurringInput extends Partial<CreateRecurringInput> {
  id: string;
}

export interface RecurringTransactionDTO {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  category: string;
  description?: string | null;
  frequency: Frequency;
  interval: number;
  daysOfWeek?: string | null;
  dayOfMonth?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  nextRunAt?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default {};
