"use client";

import type { Conversation, Message } from "@/types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface Props {
  conversation: Conversation | null;
  onSendMessage: (text: string) => void;
}

export default function ChatWindow({ conversation, onSendMessage }: Props) {
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Sélectionne une conversation ou en crée une nouvelle.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-white/10 p-3">
        <div className="font-medium">{conversation.title}</div>
      </div>
      <MessageList messages={conversation.messages} />
      <MessageInput onSend={onSendMessage} />
    </div>
  );
}
