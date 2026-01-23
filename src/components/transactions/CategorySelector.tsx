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
import {
  PREDEFINED_CATEGORIES,
  getCategoryByLabel,
  type CategoryItem,
} from "@/lib/categories";
import { Check, ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState, useEffect, useRef, useLayoutEffect } from "react";
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogFooter as ConfirmDialogFooter, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle } from "@/components/ui/dialog";
// Helper para saber se é categoria customizada (do backend)
function isCustomCategory(cat: CategoryItem) {
  // Considera custom quando o id NÃO está entre as categorias pré-definidas
  return !PREDEFINED_CATEGORIES.some((c) => c.id === cat.id);
}
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
  const [editDialog, setEditDialog] = useState<{ open: boolean; cat?: CategoryItem } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; cat?: CategoryItem } | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const [userCategories, setUserCategories] = useState<CategoryItem[]>([]);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const categories = useMemo(() => {
    return [
      ...PREDEFINED_CATEGORIES.filter((c) => c.type === type),
      ...userCategories.filter((c) => c.type === type),
    ];
  }, [type, userCategories]);
  
    async function loadUserCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setUserCategories(data.map((c: any) => ({
            id: c.id,
            label: c.name,
            icon: c.icon || "📌",
            type: c.type || "expense",
          })));
        }
      } catch {}
    }
    // Atualiza ao abrir popover ou refreshKey
    useEffect(() => { if (open) loadUserCategories(); }, [open, refreshKey, type]);

    // Medir largura do gatilho para aplicar ao PopoverContent
    useLayoutEffect(() => {
      function measure() {
        const w = triggerRef.current?.offsetWidth ?? null;
        setTriggerWidth(w);
      }
      measure();
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }, [open]);
  const selectedCategory = getCategoryByLabel(value);

  function handleSelect(cat: CategoryItem) {
    onChange(cat.label);
    setOpen(false);
  }

  async function handleCreateNew() {
    if (!newLabel.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLabel.trim(), icon: newIcon, type: newType }),
      });
      if (res.ok) {
        toast.success("Category created");
        setRefreshKey((prev) => prev + 1);
        setShowNewDialog(false);
        setOpen(false);
        setNewLabel("");
        setNewIcon("📌");
        setNewType(type);
        // Seleciona a nova categoria
        const data = await res.json();
        onChange(data.name);
      } else {
        toast.error("Failed to create category");
      }
    } catch {
      toast.error("Failed to create category");
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <div ref={triggerRef} className="w-full inline-block">
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
        </div>
        <PopoverContent
          className="max-w-none p-0"
          align="start"
          style={triggerWidth ? { width: triggerWidth } : undefined}
        >
          <div
            ref={scrollRef}
            className="max-h-72 overflow-auto overscroll-contain touch-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
            onWheel={(e) => {
              const el = scrollRef.current;
              if (!el) return;
              const delta = e.deltaY;
              const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
              const canScrollUp = el.scrollTop > 0;
              if ((delta > 0 && canScrollDown) || (delta < 0 && canScrollUp)) {
                // when the inner container can scroll, stop propagation so the page doesn't scroll
                e.stopPropagation();
              }
            }}
          >
            <div className="p-2">
              <div className="grid grid-cols-1 gap-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center group min-w-0">
                    <Button
                      variant={value === cat.label ? "default" : "ghost"}
                      className="justify-start h-auto py-2 px-3 flex-1 min-w-0"
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
                    {isCustomCategory(cat) && (
                      <>
                        <Button size="icon" variant="ghost" className="ml-1 opacity-60 group-hover:opacity-100" onClick={() => { setEditLabel(cat.label); setEditDialog({ open: true, cat }); }} title="Edit category">
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="ml-1 opacity-60 group-hover:opacity-100" onClick={() => setDeleteDialog({ open: true, cat })} title="Delete category">
                          <Trash2 className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
                    {/* Dialog de editar categoria */}
                    <Dialog open={!!editDialog?.open} onOpenChange={(open) => setEditDialog(open ? editDialog : null)}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit category</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-category-name">Name</Label>
                            <Input
                              id="edit-category-name"
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              maxLength={30}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditDialog(null)}>Cancel</Button>
                          <Button
                            onClick={async () => {
                              if (!editDialog?.cat || !editLabel.trim()) return;
                              const res = await fetch(`/api/categories/${editDialog.cat.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ name: editLabel.trim(), icon: editDialog.cat.icon, type: editDialog.cat.type }),
                              });
                              if (res.ok) {
                                toast.success("Category updated");
                                setRefreshKey((k) => k + 1);
                                setEditDialog(null);
                              } else {
                                toast.error("Failed to update category");
                              }
                            }}
                          >Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Dialog de confirmação de exclusão */}
                    <ConfirmDialog open={!!deleteDialog?.open} onOpenChange={(open) => setDeleteDialog(open ? deleteDialog : null)}>
                      <ConfirmDialogContent>
                        <ConfirmDialogHeader>
                          <ConfirmDialogTitle>Delete category</ConfirmDialogTitle>
                        </ConfirmDialogHeader>
                        <div className="py-4">Are you sure you want to delete this category? This action cannot be undone.</div>
                        <ConfirmDialogFooter>
                          <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              if (!deleteDialog?.cat) return;
                              const res = await fetch(`/api/categories/${deleteDialog.cat.id}`, { method: "DELETE" });
                              if (res.ok) {
                                toast.success("Category deleted");
                                setRefreshKey((k) => k + 1);
                                setDeleteDialog(null);
                              } else {
                                toast.error("Failed to delete category");
                              }
                            }}
                          >Delete</Button>
                        </ConfirmDialogFooter>
                      </ConfirmDialogContent>
                    </ConfirmDialog>
              </div>
            </div>
          </div>
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
