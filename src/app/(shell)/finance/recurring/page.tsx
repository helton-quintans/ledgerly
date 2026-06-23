"use client";

import RecurringList from "@/components/recurring/RecurringList";

export default function Page() {
  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Recurring</h1>
      </div>

      <RecurringList />
    </main>
  );
}
