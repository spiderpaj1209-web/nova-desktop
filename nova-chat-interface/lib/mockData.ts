import type { Conversation } from "@/types";

export const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Discussion sur le projet",
    lastUpdated: Date.now() - 1000 * 60 * 5,
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Salut, peux-tu m'aider avec mon projet ?",
        createdAt: Date.now() - 1000 * 60 * 10,
      },
      {
        id: "m2",
        role: "assistant",
        content: "Bien sûr ! Dis-moi en plus sur ton projet.",
        createdAt: Date.now() - 1000 * 60 * 9,
      },
    ],
  },
  {
    id: "2",
    title: "Idé··s de features",
    lastUpdated: Date.now() - 1000 * 60 * 30,
    messages: [
      {
        id: "m3",
        role: "user",
        content: "J'ai besoin d'idé··s pour de nouvelles features.",
        createdAt: Date.now() - 1000 * 60 * 35,
      },
      {
        id: "m4",
        role: "assistant",
        content: "Voici quelques idées : ...",
        createdAt: Date.now() - 1000 * 60 * 34,
      },
    ],
  },
];
