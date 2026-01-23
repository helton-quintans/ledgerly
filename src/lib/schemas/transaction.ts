import { z } from "zod";

// Supported currencies for the MVP — expand as needed.
export const CurrencyCode = z.enum(["USD", "EUR", "BRL"]);

export type Currency = z.infer<typeof CurrencyCode>;

/**
 * Preprocess amount input (string or number) into integer cents.
 * Accepts strings like "12.34", "12,34", "$12.34" and numbers.
 */
const amountToCents = (val: unknown) => {
  if (typeof val === "string") {
    const cleaned = val.replace(/[^0-9,.-]/g, "").replace(",", ".");
    const n = Number.parseFloat(cleaned);
    if (Number.isNaN(n)) return Number.NaN;
    return Math.round(n * 100);
  }

  if (typeof val === "number") {
    return Math.round(val * 100);
  }

  return val;
};

export const transactionFormSchema = z.object({
  description: z
    .string()
    .max(30, "Description too long, limit is 30 characters")
    .optional(),
  // Accepts either 'amount' or 'amount_cents' for compatibility
  amount_cents: z.preprocess(
    (val) => {
      if (typeof val === "number") return val;
      if (typeof val === "string") return Number(val);
      if (typeof val === "object" && val !== null && "amount" in val) return Number(val.amount);
      return val;
    },
    z
      .number()
      .int()
      .positive({ message: "Amount must be greater than zero" })
      .refine((v) => !Number.isNaN(v) && Number.isFinite(v), {
        message: "Enter a valid number",
      }),
  ),
  currency: CurrencyCode,
  category: z
    .string()
    .min(1, "Category is required")
    .max(30, "Limit is 30 characters"),
  type: z.enum(["income", "expense"]),
  date: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export default transactionFormSchema;
