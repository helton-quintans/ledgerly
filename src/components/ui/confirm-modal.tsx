"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  children: ReactNode; 
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmModal({
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  children,
  onConfirm,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description && <div className="py-2 text-sm text-muted-foreground">{description}</div>}
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => { /* close handled by Dialog */ }}>{cancelLabel}</Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
