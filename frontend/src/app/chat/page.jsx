"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

let messageCounter = 0;
function createMessage(role, content) {
  messageCounter += 1;
  return {
    id: `${role}-${messageCounter}-${Date.now()}`,
    role,
    content,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [greeting, setGreeting] = useState("Hello");

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage = createMessage("user", messageContent);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const payloadMessages = nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Upstream error ${res.status}`);
      }

      const assistantMessage = createMessage("assistant", data.reply);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err.message ||
          "Upstream connection failed. Verify backend service is listening on port 3001."
      );
    } finally {
      setIsLoading(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex h-screen flex-col bg-[#fbfbfd] text-[#1d1d1f]">
      {/* Workbench Navigation Bar */}
      <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center justify-between border-b border-black/[0.08] bg-white/80 px-4 sm:px-8 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-[#6e6e73] hover:text-black transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Overview</span>
          </Link>
          <span className="text-black/15">/</span>
          <span className="text-xs font-semibold tracking-tight uppercase">
            Workbench
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-black/[0.04] border border-black/[0.06] px-2.5 py-0.5 text-[10px] font-mono text-[#6e6e73]">
            qwen/qwen3.8-27b
          </span>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="rounded-full border border-black/[0.08] bg-white px-3 py-1 text-xs font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all"
            >
              New Session
            </button>
          )}
        </div>
      </header>

      {/* Main Conversation Stream */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl h-full flex flex-col">
          {/* Empty State: Clean Greeting Text (No recommend messages) */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center animate-fade-in">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.04] border border-black/[0.06] mb-4">
                <svg className="h-6 w-6 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
                {greeting}.
              </h1>
              <p className="mt-2 text-base text-[#6e6e73] max-w-md">
                How can I help you today?
              </p>
              <p className="mt-1 text-xs text-[#8e8e93]">
                Enter a message or instruction below to start the conversation.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 ${
                        isUser
                          ? "bg-[#1d1d1f] text-white shadow-sm"
                          : "bg-white border border-black/[0.08] text-[#1d1d1f] shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-60 mb-1 border-b border-black/[0.06] pb-1">
                        <span className="font-semibold tracking-wider uppercase">
                          {isUser ? "Operator" : "Assistant"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span>{message.timestamp}</span>
                          {!isUser && (
                            <button
                              onClick={() => handleCopy(message.id, message.content)}
                              className="hover:opacity-100 transition-opacity underline decoration-dotted"
                            >
                              {copiedId === message.id ? "Copied" : "Copy"}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Floating Typing Indicator in Message Stream */}
              {isLoading && (
                <div className="flex justify-start items-center gap-2.5 pt-1">
                  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    <span className="w-2 h-2 rounded-full bg-[#1d1d1f] typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-[#1d1d1f] typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-[#1d1d1f] typing-dot" />
                  </div>
                  <span className="text-[11px] text-[#8e8e93] font-medium tracking-wide">
                    Assistant is typing...
                  </span>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-black/[0.1] bg-black/[0.03] p-4 text-xs text-[#1d1d1f]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Notice</span>
                    <button onClick={() => setError(null)} className="underline text-[#6e6e73]">
                      Dismiss
                    </button>
                  </div>
                  <p className="mt-1 text-[#6e6e73]">{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Input Bar */}
      <footer className="relative border-t border-black/[0.08] bg-white p-3 sm:p-4">
        {/* Floating Indicator Capsule above Input Bar while Chatting */}
        {isLoading && (
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/95 px-3 py-1 shadow-[0_4px_14px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-black typing-dot" />
              <span className="h-1.5 w-1.5 rounded-full bg-black typing-dot" />
              <span className="h-1.5 w-1.5 rounded-full bg-black typing-dot" />
            </span>
            <span className="text-[11px] font-medium text-[#6e6e73]">Thinking...</span>
          </div>
        )}

        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2 rounded-2xl border border-black/[0.1] bg-[#f5f5f7] p-2.5 focus-within:border-black/30 transition-colors"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter message or prompt instruction..."
              maxLength={12000}
              disabled={isLoading}
              className="w-full resize-none bg-transparent px-2 py-1 text-xs sm:text-sm text-[#1d1d1f] placeholder:text-[#8e8e93] focus:outline-none disabled:opacity-50"
            />

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-block text-[10px] text-[#8e8e93] font-mono">
                Return ↵
              </span>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white hover:bg-[#333336] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-sm"
                aria-label="Send query"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
          <div className="mt-2 text-center text-[10px] text-[#8e8e93]">
            Direct server proxy · 60s timeout guard · Responses generated via configured model
          </div>
        </div>
      </footer>
    </div>
  );
}
