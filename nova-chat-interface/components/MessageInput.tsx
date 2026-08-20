"use client";

import { useState, KeyboardEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/10 p-3">
      <div className="max-w-3xl mx-auto flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder="É·cris ton message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="px-4 py-2 rounded-md bg-white text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
