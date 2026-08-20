"use client";

import type { Conversation } from "@/types";
import ConversationItem from "./ConversationItem";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
}: Props) {
  return (
    <div className="w-64 border-r border-white/10 bg-black/40 flex flex-col">
      <div className="p-3 border-b border-white/10">
        <button
          onClick={onNew}
          className="w-full bg-white text-black font-medium py-2 rounded-md hover:bg-gray-200 transition"
        >
          Nouvelle conversation
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((c) => (
          <ConversationItem
            key={c.id}
            conversation={c}
            isActive={c.id === activeId}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </div>
    </div>
  );
}
