"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import { mockConversations } from "@/lib/mockData";
import type { Conversation, Message } from "@/types";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>(
    mockConversations
  );
  const [activeId, setActiveId] = useState<string | null>(
    mockConversations[0]?.id ?? null
  );

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? null;

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
  };

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: String(Date.now()),
      title: "Nouvelle conversation",
      messages: [],
      lastUpdated: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
  };

  const handleSendMessage = (text: string) => {
    if (!activeId) return;

    const newMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastUpdated: Date.now(),
            }
          : c
      )
    );

    // TODO: appeler l'API Nova ici et ajouter la réponse
  };

  return (
    <div className="h-screen flex bg-black text-white">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
      />
      <ChatWindow
        conversation={activeConversation}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
