"use client";

import { useState, useEffect, useRef, useMemo } from "react";

const AVAILABLE_MODELS = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    tagline: "Everyday reasoning, creative ideas & writing",
    badge: "Flagship",
    icon: "✦",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    tagline: "Thoughtful nuance, logic & articulate prose",
    badge: "Reasoning",
    icon: "◆",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    tagline: "Coding questions, math & deep technical tasks",
    badge: "Code",
    icon: "⚡",
  },
  {
    id: "qwen-2.5-72b",
    name: "Qwen 2.5 72B",
    provider: "Alibaba Cloud",
    tagline: "Fast answers, broad knowledge & multi-language",
    badge: "Knowledge",
    icon: "▲",
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta AI",
    tagline: "Quick, balanced & open foundational model",
    badge: "Fast",
    icon: "●",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    tagline: "Large context analysis & comprehensive synthesis",
    badge: "Context",
    icon: "★",
  },
];

const SUGGESTIONS = [
  {
    title: "Write an async Python crawler",
    desc: "Clean script with concurrency limits & error guards",
    prompt: "Write a complete asynchronous Python script using aiohttp with concurrency limits and clean error handling.",
  },
  {
    title: "Monolith vs Microservices",
    desc: "A realistic breakdown of architectural trade-offs",
    prompt: "Explain the realistic architectural trade-offs between a modular monolith and microservices in growing applications.",
  },
  {
    title: "Design a clean messaging schema",
    desc: "Connection pooling, indexing & thread modeling",
    prompt: "Show me a clean schema design and connection pooling implementation for a real-time messaging application.",
  },
  {
    title: "Optimize JavaScript performance",
    desc: "Batching, caching & preventing needless re-renders",
    prompt: "How can I implement an in-memory batch processor in JavaScript with memoization and defensive validation?",
  },
];

// Monochromatic High-Fidelity Code Block
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-neutral-800 bg-[#121214] text-[#e4e4e7] shadow-xs">
      <div className="flex h-9 items-center justify-between border-b border-neutral-800/80 bg-[#18181b] px-3.5 text-xs text-neutral-400">
        <span className="font-mono text-[11px] font-medium lowercase">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          {copied ? (
            <span>Copied ✓</span>
          ) : (
            <>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-neutral-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Monochromatic Markdown Parser & Formatter
function MarkdownRenderer({ content, isTyping = false }) {
  const blocks = useMemo(() => {
    if (!content) return [];
    const parts = [];
    const regex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", value: content.substring(lastIndex, match.index) });
      }
      parts.push({ type: "code", language: match[1] || "text", value: match[2].trimEnd() });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push({ type: "text", value: content.substring(lastIndex) });
    }

    return parts;
  }, [content]);

  const renderInlineFormatted = (text) => {
    const segments = text.split(/(`[^`]+`)/g);
    return segments.map((seg, i) => {
      if (seg.startsWith("`") && seg.endsWith("`") && seg.length > 2) {
        return (
          <code key={i} className="rounded bg-neutral-200/80 px-1.5 py-0.5 font-mono text-[12px] text-neutral-900">
            {seg.slice(1, -1)}
          </code>
        );
      }
      const boldSegments = seg.split(/(\*\*[^*]+\*\*)/g);
      return boldSegments.map((bSeg, j) => {
        if (bSeg.startsWith("**") && bSeg.endsWith("**") && bSeg.length > 4) {
          return (
            <strong key={`${i}-${j}`} className="font-semibold text-neutral-900">
              {bSeg.slice(2, -2)}
            </strong>
          );
        }
        return bSeg;
      });
    });
  };

  const renderTextBlock = (text) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="mt-4 mb-1.5 text-sm font-semibold tracking-tight text-neutral-900">
            {renderInlineFormatted(trimmed.slice(4))}
          </h3>
        );
      }

      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="mt-5 mb-2 text-base font-semibold tracking-tight text-neutral-900">
            {renderInlineFormatted(trimmed.slice(3))}
          </h2>
        );
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <div key={idx} className="my-1 flex items-start gap-2 pl-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600" />
            <span className="flex-1 text-xs sm:text-sm leading-relaxed text-neutral-800">
              {renderInlineFormatted(trimmed.slice(2))}
            </span>
          </div>
        );
      }

      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        return (
          <div key={idx} className="my-1 flex items-start gap-2 pl-2">
            <span className="shrink-0 font-mono text-xs font-semibold text-neutral-500">
              {numMatch[1]}.
            </span>
            <span className="flex-1 text-xs sm:text-sm leading-relaxed text-neutral-800">
              {renderInlineFormatted(numMatch[2])}
            </span>
          </div>
        );
      }

      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed text-neutral-800">
          {renderInlineFormatted(line)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-1">
      {blocks.map((block, i) => {
        if (block.type === "code") {
          return <CodeBlock key={i} language={block.language} code={block.value} />;
        }
        return <div key={i}>{renderTextBlock(block.value)}</div>;
      })}
      {isTyping && (
        <span className="inline-block h-3.5 w-1.5 animate-pulse bg-neutral-900 align-middle ml-1" />
      )}
    </div>
  );
}

export default function HomePage() {
  // Session & User
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [guestId, setGuestId] = useState("");

  // Chats & Messages
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Typing Effect
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [streamingText, setStreamingText] = useState("");
  const typingTimerRef = useRef(null);

  // Model Selection
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let localGuestId = localStorage.getItem("personal_ai_guest_id");
    if (!localGuestId) {
      localGuestId = "guest_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("personal_ai_guest_id", localGuestId);
    }
    setGuestId(localGuestId);

    const savedToken = localStorage.getItem("personal_ai_token");
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsModelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, isLoading]);

  useEffect(() => {
    if (guestId || token) {
      loadChats();
    }
  }, [guestId, token]);

  const fetchCurrentUser = async (authToken) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("personal_ai_token");
        setToken(null);
        setUser(null);
      }
    } catch {
      // Offline fallback
    }
  };

  const loadChats = async () => {
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const url = token ? "/api/chats" : `/api/chats?guestId=${guestId}`;

      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (e) {
      console.warn("Could not load chats:", e);
    }
  };

  const selectChat = async (chat) => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      setTypingMessageId(null);
      setStreamingText("");
    }
    setActiveChatId(chat.id);
    setSelectedModel(chat.model || "gpt-4o");
    setError(null);
    setIsLoading(true);

    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const url = token
        ? `/api/chats/${chat.id}`
        : `/api/chats/${chat.id}?guestId=${guestId}`;

      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else {
        setMessages([]);
      }
    } catch {
      setError("Failed to load conversation messages.");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }
    setTypingMessageId(null);
    setStreamingText("");
    setActiveChatId(null);
    setMessages([]);
    setError(null);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (activeChatId === chatId) {
          startNewChat();
        }
      }
    } catch (err) {
      console.warn("Failed to delete chat:", err);
    }
  };

  const streamTypingEffect = (assistantMsgId, fullText) => {
    setTypingMessageId(assistantMsgId);
    setStreamingText("");

    let currentIndex = 0;
    const totalLength = fullText.length;
    const chunkSize = Math.max(2, Math.floor(totalLength / 120));

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      currentIndex += chunkSize;
      if (currentIndex >= totalLength) {
        clearInterval(typingTimerRef.current);
        setStreamingText(fullText);
        setTypingMessageId(null);

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: fullText } : m))
        );
      } else {
        setStreamingText(fullText.slice(0, currentIndex));
      }
    }, 18);
  };

  const handleSendMessage = async (textToSend) => {
    const content = (textToSend || input).trim();
    if (!content || isLoading) return;

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      setTypingMessageId(null);
      setStreamingText("");
    }

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
      model: selectedModel,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const payload = {
        messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        model: selectedModel,
        chatId: activeChatId,
        guestId: token ? null : guestId,
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate reply.");
      }

      const assistantMsgId = `a-${Date.now()}`;
      const assistantMsg = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        model: data.model || selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);

      streamTypingEffect(assistantMsgId, data.reply);

      if (!activeChatId && data.chatId) {
        setActiveChatId(data.chatId);
      }
      loadChats();
    } catch (err) {
      setError(err.message || "Could not complete request. Please try again.");
      setIsLoading(false);
    } finally {
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

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      authMode === "login"
        ? { identifier: authForm.username, password: authForm.password }
        : { username: authForm.username, email: authForm.email, password: authForm.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("personal_ai_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setAuthModalOpen(false);
      setAuthForm({ username: "", email: "", password: "" });
      loadChats();
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("personal_ai_token");
    setToken(null);
    setUser(null);
    startNewChat();
    loadChats();
  };

  const activeModelObj = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafafa] text-neutral-900 font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Monochromatic Left Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-200 bg-[#f4f4f5] transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:-ml-64"
        }`}
      >
        {/* Brand & New Chat */}
        <div className="flex flex-col gap-2.5 p-3.5 border-b border-neutral-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-neutral-100 text-xs font-semibold">
                ✦
              </span>
              <span className="font-semibold text-sm tracking-tight text-neutral-900">
                Chat
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-neutral-500 hover:text-neutral-900 p-1"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          <button
            onClick={startNewChat}
            className="flex items-center justify-between rounded-lg bg-neutral-900 text-neutral-100 hover:bg-neutral-800 px-3 py-2 text-xs font-medium transition-all active:scale-98 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm leading-none">+</span>
              <span>New chat</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">⌘K</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          <div className="px-2.5 py-1 text-[11px] font-medium text-neutral-500">
            Recent conversations
          </div>

          {chats.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-neutral-400">
              No conversations yet
            </div>
          ) : (
            chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => selectChat(chat)}
                  className={`group relative flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer ${
                    isActive
                      ? "bg-neutral-900 text-neutral-100 font-medium"
                      : "text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900"
                  }`}
                >
                  <span className="truncate pr-4">{chat.title}</span>

                  <button
                    onClick={(e) => deleteChat(e, chat.id)}
                    title="Delete"
                    className={`opacity-0 group-hover:opacity-100 hover:text-neutral-400 p-0.5 text-xs transition-opacity ${
                      isActive ? "text-neutral-400 hover:text-neutral-100" : "text-neutral-500"
                    }`}
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-neutral-200 bg-[#f4f4f5] p-3">
          {user ? (
            <div className="flex items-center justify-between gap-2 rounded-lg p-1.5">
              <div className="flex items-center gap-2 truncate">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-neutral-100 text-[11px] font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="truncate text-left text-xs font-medium text-neutral-900">
                  {user.username}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 p-1">
              <span className="text-xs text-neutral-600 font-medium">Guest mode</span>
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }}
                className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-900 hover:bg-neutral-100 transition-colors shadow-xs"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Screen */}
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-white">
        {/* Monochromatic Header */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-200/80 bg-white px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              title="Toggle sidebar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Model Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200/90 bg-[#fafafa] px-2.5 py-1 text-xs font-medium text-neutral-900 hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <span className="font-semibold">{activeModelObj.name}</span>
                <span className="text-neutral-400 text-[9px]">▼</span>
              </button>

              {isModelDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-72 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg z-50 animate-fade-in">
                  <div className="space-y-0.5">
                    {AVAILABLE_MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m.id);
                          setIsModelDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors ${
                          selectedModel === m.id
                            ? "bg-neutral-100 font-medium text-neutral-900"
                            : "hover:bg-neutral-50 text-neutral-700"
                        }`}
                      >
                        <div>
                          <div className="text-xs text-neutral-900 font-medium">{m.name}</div>
                          <div className="text-[11px] text-neutral-500 leading-snug">{m.tagline}</div>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">{m.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!user && (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }}
                className="rounded-md bg-neutral-900 text-neutral-100 hover:bg-neutral-800 px-3 py-1 text-xs font-medium transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </header>

        {/* Message Stream */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-2xl h-full flex flex-col">
            {messages.length === 0 ? (
              /* Casual & Hooking Welcome State */
              <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 mb-4 shadow-xs">
                  <span className="text-lg text-neutral-900">{activeModelObj.icon}</span>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                  {user ? `Hey, ${user.username}.` : "Hey there."}
                </h1>
                <p className="mt-1.5 text-sm text-neutral-500 max-w-md">
                  What are we exploring today? Ask a question, paste code, or outline a plan.
                </p>

                {/* Casual Monochromatic Suggestions */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                  {SUGGESTIONS.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(item.prompt)}
                      className="group rounded-xl border border-neutral-200 bg-[#fafafa] p-3.5 hover:border-neutral-400 hover:bg-white transition-all text-left shadow-xs"
                    >
                      <div className="font-medium text-xs text-neutral-900 group-hover:text-black">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Conversation Messages */
              <div className="space-y-6 pb-6">
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  const isCurrentlyTyping = message.id === typingMessageId;
                  const displayContent = isCurrentlyTyping ? streamingText : message.content;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {isUser ? (
                        <div className="max-w-[80%] rounded-2xl rounded-tr-xs bg-neutral-900 px-4 py-2.5 text-xs sm:text-sm leading-relaxed text-neutral-100 shadow-xs break-words">
                          {message.content}
                        </div>
                      ) : (
                        <div className="max-w-[92%] sm:max-w-[88%] w-full">
                          <div className="flex items-center gap-2 mb-1.5 text-[11px] text-neutral-500">
                            <span className="font-semibold text-neutral-900 flex items-center gap-1">
                              <span>{activeModelObj.icon}</span>
                              <span>{message.model ? AVAILABLE_MODELS.find(m => m.id === message.model)?.name || message.model : activeModelObj.name}</span>
                            </span>
                            <span>·</span>
                            <span>{message.timestamp}</span>
                            {!isCurrentlyTyping && displayContent && (
                              <button
                                onClick={() => handleCopy(message.id, displayContent)}
                                className="ml-1 hover:text-neutral-900 transition-colors"
                              >
                                {copiedId === message.id ? "Copied" : "Copy"}
                              </button>
                            )}
                          </div>

                          <div className="prose prose-sm max-w-none text-neutral-800">
                            <MarkdownRenderer content={displayContent} isTyping={isCurrentlyTyping} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Thinking / Streaming Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-800 typing-dot" />
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-800 typing-dot" />
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-800 typing-dot" />
                    </div>
                    <span>Thinking...</span>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-neutral-300 bg-neutral-100 p-3 text-xs text-neutral-800">
                    <div className="flex items-center justify-between font-medium">
                      <span>Notice</span>
                      <button onClick={() => setError(null)} className="underline text-neutral-600">
                        Dismiss
                      </button>
                    </div>
                    <p className="mt-1">{error}</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* Monochromatic Bottom Input Bar */}
        <footer className="border-t border-neutral-200/80 bg-white p-3 sm:p-4">
          <div className="mx-auto max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2 rounded-xl border border-neutral-300 bg-[#fafafa] p-2 focus-within:border-neutral-900 focus-within:bg-white transition-all shadow-xs"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a thought, task, or question..."
                maxLength={15000}
                disabled={isLoading}
                className="w-full resize-none bg-transparent px-2.5 py-1 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:opacity-50 max-h-36 overflow-y-auto"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-neutral-100 hover:bg-neutral-800 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xs"
                aria-label="Send"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <div className="mt-2 text-center text-[11px] text-neutral-400">
              Chat can make mistakes. Consider checking important info.
            </div>
          </div>
        </footer>
      </div>

      {/* Auth Modal (Monochromatic) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-sm font-semibold text-neutral-900">
                {authMode === "login" ? "Sign in" : "Create account"}
              </span>
              <button
                onClick={() => setAuthModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex rounded-lg bg-neutral-100 p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`flex-1 rounded-md py-1.5 font-medium transition-all ${
                  authMode === "login" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
                className={`flex-1 rounded-md py-1.5 font-medium transition-all ${
                  authMode === "register" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                }`}
              >
                Register
              </button>
            </div>

            {authError && (
              <div className="mt-2.5 rounded-lg bg-neutral-100 p-2 text-xs text-neutral-800 border border-neutral-300">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="mt-3 space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                  {authMode === "login" ? "Username or email" : "Username"}
                </label>
                <input
                  type="text"
                  required
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  placeholder={authMode === "login" ? "Username or email" : "Choose username"}
                  className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              {authMode === "register" && (
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="Password"
                  className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-2 rounded-lg bg-neutral-900 py-2 text-xs font-medium text-neutral-100 hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {authLoading ? "..." : authMode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <div className="mt-3 pt-2.5 border-t border-neutral-200 text-center">
              <button
                onClick={() => setAuthModalOpen(false)}
                className="text-xs text-neutral-500 hover:text-neutral-900 underline"
              >
                Continue as guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
