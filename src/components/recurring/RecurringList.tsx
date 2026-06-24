"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import * as recurringClient from "@/services/recurringClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RecurringFormModal from "./RecurringFormModal";

export default function RecurringList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await recurringClient.listRecurrings();
      setItems(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recurring templates</h2>
        <RecurringFormModal
          trigger={<Button>New recurring</Button>}
          onSaved={load}
        />
      </div>

      <Card>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : items.length === 0 ? (
            <div>No recurring templates yet.</div>
          ) : (
            <ul className="space-y-3">
              {items.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {r.description || r.category}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {r.frequency} · {r.amount} {r.currency}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <RecurringFormModal
                      trigger={<Button variant="ghost">Edit</Button>}
                      initial={r}
                      onSaved={load}
                    />
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        const ok = confirm("Delete this recurring template?");
                        if (!ok) return;
                        try {
                          await recurringClient.deleteRecurring(r.id);
                          toast.success("Recurring deleted");
                          load();
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to delete recurring");
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
