'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'nova';
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'nova', content: 'Salut ! Je suis Nova, ton assistant personnel local. Comment puis-je t\'aider aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Ici, tu connecteras ton vrai backend Nova
    setTimeout(() => {
      const novaResponse: Message = {
        role: 'nova',
        content: 'Je suis Nova, ton assistant personnel local. Je suis là pour t\'aider avec tout ce dont tu as besoin. Qu\'est-ce que je peux faire pour toi ?'
      };
      setMessages(prev => [...prev, novaResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h1 className="text-xl font-semibold text-white">Nova Desktop</h1>
          </div>
          <div className="text-sm text-gray-300">Assistant personnel local</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex max-w-5xl mx-auto w-full">
        {/* Left Panel - Orbe */}
        <aside className="w-80 border-r border-white/10 p-6 flex flex-col items-center justify-center bg-black/10">
          <div className="relative">
            {/* Orbe animée */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-80 blur-md animate-pulse"></div>
            <div className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-60 blur-xl animate-pulse"></div>
            <div className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-40 blur-2xl animate-pulse"></div>
          </div>
          <h2 className="mt-8 text-2xl font-bold text-white">Nova</h2>
          <p className="mt-2 text-gray-300 text-center">Ton cerveau local, toujours prêt à t&apos;aider.</p>
        </aside>

        {/* Right Panel - Chat */}
        <section className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-100'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {msg.role === 'user' ? 'Toi' : 'Nova'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-white/10 text-gray-100">
                  <div className="text-sm font-medium mb-1">Nova</div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Zone */}
          <div className="border-t border-white/10 p-4 bg-black/20 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto flex gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écris ton message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSend}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 py-3 font-medium transition-colors"
              >
                Envoyer
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
