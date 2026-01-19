"use client";

import TransactionsTypeToggle from "@/components/transactions/TransactionsTypeToggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  addCustomCategory,
  getCategories,
  getCategoryByLabel,
  type CategoryItem,
} from "@/lib/categories";
import { Check, ChevronDown, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type CategorySelectorProps = {
  value: string;
  onChange: (value: string) => void;
  type: "income" | "expense";
};

export default function CategorySelector({ value, onChange, type }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newIcon, setNewIcon] = useState("📌");
  const [newType, setNewType] = useState<"income" | "expense">(type);
  const [refreshKey, setRefreshKey] = useState(0);

  const categories = useMemo(() => getCategories(type), [type, refreshKey]);
  const selectedCategory = getCategoryByLabel(value);

  function handleSelect(cat: CategoryItem) {
    onChange(cat.label);
    setOpen(false);
  }

  function handleCreateNew() {
    if (!newLabel.trim()) {
      toast.error("Category name is required");
      return;
    }
    const created = addCustomCategory(newLabel.trim(), newType, newIcon);
    onChange(created.label);
    setNewLabel("");
    setNewIcon("📌");
    setNewType(type); // Reset to current transaction type
    setRefreshKey((prev) => prev + 1); // Force re-render to show new category
    setShowNewDialog(false);
    setOpen(false);
    toast.success("Category created");
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              {selectedCategory ? (
                <>
                  <span className="text-lg">{selectedCategory.icon}</span>
                  <span>{selectedCategory.label}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Select category</span>
              )}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-75 p-0" align="start">
          <ScrollArea className="h-75">
            <div className="p-2">
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={value === cat.label ? "default" : "ghost"}
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => handleSelect(cat)}
                  >
                    <span className="flex items-center gap-2 w-full">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm flex-1 text-left truncate">
                        {cat.label}
                      </span>
                      {value === cat.label && <Check className="h-4 w-4" />}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
          <div className="border-t p-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setNewType(type); // Initialize with current transaction type
                setShowNewDialog(true);
                setOpen(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New category
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., Coffee"
                maxLength={30}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-icon">Icon (emoji)</Label>
              <div className="flex gap-2">
                <Input
                  id="category-icon"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  placeholder="📌"
                  maxLength={2}
                  className="w-20 text-center text-xl"
                />
                <div className="flex-1 grid grid-cols-8 gap-1 p-2 border rounded-md max-h-32 overflow-y-auto">
                  {[
                    "💼", "💻", "📈", "🎁", "🎉", "💵", "💰", "📊",
                    "🍔", "🚗", "🛍️", "📄", "🏥", "📚", "🎮", "✈️",
                    "🏠", "💡", "🛡️", "🏋️", "☕", "🍕", "🎬", "🎵",
                    "📱", "💳", "🎯", "🔧", "🎨", "📦", "🌟", "❤️",
                    "🔥", "⚡", "🌈", "🎪", "🎭", "🎸", "📌", "🔑"
                  ].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewIcon(emoji)}
                      className={`text-xl hover:bg-muted rounded p-1 transition-colors cursor-pointer ${
                        newIcon === emoji ? "bg-muted" : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <TransactionsTypeToggle value={newType} onChange={setNewType} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewDialog(false);
                setNewLabel("");
                setNewIcon("📌");
                setNewType(type);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateNew}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
