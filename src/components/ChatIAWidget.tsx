"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
export function ChatIAWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello! I'm your AI assistant. Ask about the app or request suggestions!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    // Simulate: replace with fetch to real endpoint
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { role: "assistant", content: "(Simulated IA response)" }]);
      setLoading(false);
    }, 1200);
    setInput("");
  }

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        {!open && (
          <DrawerTrigger asChild>
            <button
              aria-label="Open AI chat"
              className="rounded-full bg-primary text-white shadow-lg p-3 hover:bg-primary/80 transition cursor-pointer"
            >
              <MessageSquare size={24} className="text-white dark:text-black" />
            </button>
          </DrawerTrigger>
        )}
        <DrawerContent className="max-w-md w-full h-full flex flex-col border-l border-border dark:border-zinc-700">
          <DrawerHeader className="flex flex-row items-center justify-between border-b border-border dark:border-zinc-700 p-4">
            <DrawerTitle className="font-bold text-primary">AI Chat</DrawerTitle>
            <DrawerClose asChild>
              <button aria-label="Close chat" className="hover:text-red-500 cursor-pointer">
                <X size={20} />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user"
                  ? "text-right text-foreground"
                  : "text-left text-primary dark:text-blue-300"}
              >
                <span className="inline-block px-2 py-1 rounded bg-muted dark:bg-zinc-800 mb-1">
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-left text-muted">AI is thinking...</div>}
          </div>
          <form onSubmit={sendMessage} className="flex px-3 py-6 border-border dark:border-zinc-700 border-t  gap-2 bg-background sticky bottom-0 z-10">
            <input
              type="text"
              className="flex-1 rounded bg-input px-2 py-1 text-foreground dark:bg-zinc-700 dark:text-white"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="bg-primary text-white rounded px-3 py-1 disabled:opacity-50 cursor-pointer"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
