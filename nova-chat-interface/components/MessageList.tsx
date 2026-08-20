"use client";

import type { Message } from "@/types";

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((m) => (
        <div
          key={m.id}
          className={
            "max-w-2xl mx-auto rounded-lg p-3 " +
            (m.role === "user"
              ? "bg-white/10 text-white"
              : "bg-white/5 text-gray-100")
          }
        >
          <div className="text-xs text-gray-400 mb-1">
            {m.role === "user" ? "Toi" : "Nova"}
          </div>
          <div className="whitespace-pre-wrap">{m.content}</div>
        </div>
      ))}
    </div>
  );
}
