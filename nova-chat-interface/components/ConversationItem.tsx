"use client";

import type { Conversation } from "@/types";

interface Props {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full text-left px-3 py-2 rounded-lg transition-colors " +
        (isActive
          ? "bg-white/10 text-white"
          : "text-gray-300 hover:bg-white/5 hover:text-white")
      }
    >
      <div className="text-sm font-medium truncate">{conversation.title}</div>
      <div className="text-xs text-gray-500 mt-1">
        {new Date(conversation.lastUpdated).toLocaleTimeString()}
      </div>
    </button>
  );
}
