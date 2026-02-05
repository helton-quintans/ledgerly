"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Zap,
  Heart,
  GraduationCap,
  Plane,
  ShoppingCart,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  FileText,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

const categories: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: "Food & Dining", label: "Food & Dining", icon: <UtensilsCrossed className="size-4" /> },
  { value: "Transportation", label: "Transportation", icon: <Car className="size-4" /> },
  { value: "Shopping", label: "Shopping", icon: <ShoppingBag className="size-4" /> },
  { value: "Entertainment", label: "Entertainment", icon: <Film className="size-4" /> },
  { value: "Bills & Utilities", label: "Bills & Utilities", icon: <Zap className="size-4" /> },
  { value: "Healthcare", label: "Healthcare", icon: <Heart className="size-4" /> },
  { value: "Education", label: "Education", icon: <GraduationCap className="size-4" /> },
  { value: "Travel", label: "Travel", icon: <Plane className="size-4" /> },
  { value: "Groceries", label: "Groceries", icon: <ShoppingCart className="size-4" /> },
  { value: "Salary", label: "Salary", icon: <Briefcase className="size-4" /> },
  { value: "Freelance", label: "Freelance", icon: <Laptop className="size-4" /> },
  { value: "Investment", label: "Investment", icon: <TrendingUp className="size-4" /> },
  { value: "Gift", label: "Gift", icon: <Gift className="size-4" /> },
  { value: "Other", label: "Other", icon: <FileText className="size-4" /> },
];

export default function CategorySelector({ value, onChange, className }: Props) {
  const current = categories.find((c) => c.value === value) || categories[13]; // Default to "Other"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <span className="mr-2">{current.icon}</span>
          {current.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {categories.map((category) => (
          <DropdownMenuItem key={category.value} onSelect={() => onChange(category.value)}>
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}