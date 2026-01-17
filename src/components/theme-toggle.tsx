"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setIsDark(stored === "dark");
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      // follow system preference
      const prefersDark =
        window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  if (isDark === null) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
