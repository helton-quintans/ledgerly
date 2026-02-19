"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

type Props = {
  incomes: number;
  expenses: number;
  balance: number;
  hidden: boolean;
  fmt: (v: number) => string;
};

export default function Summary({
  incomes,
  expenses,
  balance,
  hidden,
  fmt,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      <div className="lg:hidden">
        <Card className="relative shadow-md bg-primary text-primary-foreground mb-3 py-0">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Total</div>
              <div className="text-2xl font-extrabold mt-1">
                {hidden ? "......" : fmt(balance)}
              </div>
            </div>
            <DollarSign className="size-5" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Card>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs text-success font-medium">In</div>
                <div className="text-lg font-semibold mt-0.5 truncate">
                  {hidden ? "......" : fmt(incomes)}
                </div>
              </div>
              <ArrowUp className="size-4 text-success shrink-0 ml-1" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs text-destructive font-medium">Out</div>
                <div className="text-lg font-semibold mt-0.5 truncate">
                  {hidden ? "......" : fmt(expenses)}
                </div>
              </div>
              <ArrowDown className="size-4 text-destructive shrink-0 ml-1" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop aligned left */}
      <div className="hidden lg:flex gap-4 lg:flex-row lg:col-span-3 justify-start items-center">
        <Card className="w-64 relative shadow-md bg-primary text-primary-foreground">
          <CardContent className="px-4 py-1 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Total</div>
              <div className="text-xl font-extrabold mt-1">
                {hidden ? "......" : fmt(balance)}
              </div>
            </div>
            <DollarSign className="size-5" />
          </CardContent>
        </Card>

        <Card className="w-64">
          <CardContent className="px-4 py-1 flex items-center justify-between">
            <div>
              <div className="text-sm text-success">In</div>
              <div className="text-xl font-semibold mt-1">
                {hidden ? "......" : fmt(incomes)}
              </div>
            </div>
            <ArrowUp className="size-5 text-success" />
          </CardContent>
        </Card>

        <Card className="w-64">
          <CardContent className="px-4 py-1 flex items-center justify-between">
            <div>
              <div className="text-sm text-destructive">Out</div>
              <div className="text-xl font-semibold mt-1">
                {hidden ? "......" : fmt(expenses)}
              </div>
            </div>
            <ArrowDown className="size-5 text-destructive" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
