// Predefined categories with icons
export type CategoryItem = {
  id: string;
  label: string;
  icon: string;
  type: "income" | "expense";
};

export const PREDEFINED_CATEGORIES: CategoryItem[] = [
  // Income categories
  { id: "salary", label: "Salary", icon: "💼", type: "income" },
  { id: "freelance", label: "Freelance", icon: "💻", type: "income" },
  { id: "investment", label: "Investment", icon: "📈", type: "income" },
  { id: "gift", label: "Gift", icon: "🎁", type: "income" },
  { id: "bonus", label: "Bonus", icon: "🎉", type: "income" },
  { id: "refund", label: "Refund", icon: "💵", type: "income" },
  
  // Expense categories
  { id: "food", label: "Food", icon: "🍔", type: "expense" },
  { id: "transport", label: "Transport", icon: "🚗", type: "expense" },
  { id: "shopping", label: "Shopping", icon: "🛍️", type: "expense" },
  { id: "bills", label: "Bills", icon: "📄", type: "expense" },
  { id: "health", label: "Health", icon: "🏥", type: "expense" },
  { id: "education", label: "Education", icon: "📚", type: "expense" },
  { id: "entertainment", label: "Entertainment", icon: "🎮", type: "expense" },
  { id: "travel", label: "Travel", icon: "✈️", type: "expense" },
  { id: "rent", label: "Rent", icon: "🏠", type: "expense" },
  { id: "utilities", label: "Utilities", icon: "💡", type: "expense" },
  { id: "insurance", label: "Insurance", icon: "🛡️", type: "expense" },
  { id: "gym", label: "Gym", icon: "🏋️", type: "expense" },
  { id: "other_expense", label: "Other", icon: "📦", type: "expense" },
  
  // Other income
  { id: "other_income", label: "Other", icon: "📦", type: "income" },
];

// In-memory storage for custom categories (will be replaced with DB later)
let customCategories: CategoryItem[] = [];

export function getCategories(type?: "income" | "expense"): CategoryItem[] {
  const all = [...PREDEFINED_CATEGORIES, ...customCategories];
  if (!type) return all;
  return all.filter((c) => c.type === type);
}

export function addCustomCategory(
  label: string,
  type: "income" | "expense",
  icon = "📌",
): CategoryItem {
  const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const newCategory: CategoryItem = { id, label, icon, type };
  customCategories.push(newCategory);
  return newCategory;
}

export function getCategoryById(id: string): CategoryItem | undefined {
  return [...PREDEFINED_CATEGORIES, ...customCategories].find((c) => c.id === id);
}

export function getCategoryByLabel(label: string): CategoryItem | undefined {
  return [...PREDEFINED_CATEGORIES, ...customCategories].find(
    (c) => c.label.toLowerCase() === label.toLowerCase(),
  );
}
