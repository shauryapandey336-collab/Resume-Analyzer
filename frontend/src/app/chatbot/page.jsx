"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";

import {
  MessageCircle,
  Mic,
  Headphones,
  Settings,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { chatbot } from "../services/chatbotService";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      content: "Hello! I'm your AI assistant for resume and career advice. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    const newMessage = {
      id: Date.now(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    try {
      const res = await chatbot({ message: input });
      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "ai", content: res.data.response },
        ]);
      } else {
        setError(res.data.message || "Failed to get response");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">AI Chatbot</h2>
              <p className="text-sm text-slate-500">
                Get resume and career advice from our AI assistant
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">Privacy: No data stored</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-800 rounded px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="h-96 overflow-y-auto space-y-4" style={{ scrollBehavior: "smooth" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg max-w-lg ${msg.role === "user" ? "ml-auto bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-800"}`}
              >
                <p className="break-words">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question about resumes, careers, ATS, or skills..."
              className="flex-1 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}