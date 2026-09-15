"use client";

import React, { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { chatbot } from "../services/chatbotService";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      content:
        "Hello! I'm your AI assistant for resume and career advice. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();

    setLoading(true);
    setError("");

    const newMessage = {
      id: Date.now(),
      role: "user",
      content: userInput,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const res = await chatbot({
        message: userInput,
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "ai",
            content: res.data.response,
          },
        ]);
      } else {
        setError(res.data.message || "Failed to get response");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">

        {/* Chat Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                AI Chatbot
              </h2>

              <p className="text-sm text-slate-500">
                Get resume and career advice from our AI assistant
              </p>
            </div>

            <div>
              <span className="text-slate-400 text-xs">
                Privacy: No data stored
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-800 rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Messages */}
          <div
            className="h-96 overflow-y-auto space-y-4 pr-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg max-w-2xl ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-100 text-blue-800"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {msg.role === "user" ? (
                  /* USER MESSAGE */
                  <p className="break-words whitespace-pre-wrap">
                    {msg.content}
                  </p>
                ) : (
                  /* AI MESSAGE - MARKDOWN RENDERER */
                  <div className="break-words prose prose-slate max-w-none">

                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold mt-2 mb-3">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="text-lg font-bold mt-3 mb-2">
                            {children}
                          </h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="text-base font-bold mt-3 mb-2">
                            {children}
                          </h3>
                        ),

                        p: ({ children }) => (
                          <p className="mb-3 leading-6">
                            {children}
                          </p>
                        ),

                        strong: ({ children }) => (
                          <strong className="font-bold text-slate-900">
                            {children}
                          </strong>
                        ),

                        ul: ({ children }) => (
                          <ul className="list-disc pl-6 mb-3 space-y-1">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="list-decimal pl-6 mb-3 space-y-1">
                            {children}
                          </ol>
                        ),

                        li: ({ children }) => (
                          <li className="leading-6">
                            {children}
                          </li>
                        ),

                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-slate-300 pl-4 italic my-3">
                            {children}
                          </blockquote>
                        ),

                        code: ({ inline, children }) =>
                          inline ? (
                            <code className="bg-slate-200 px-1.5 py-0.5 rounded text-sm">
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-slate-900 text-white p-4 rounded-lg overflow-x-auto my-3">
                              <code>{children}</code>
                            </pre>
                          ),

                        table: ({ children }) => (
                          <div className="overflow-x-auto my-4">
                            <table className="min-w-full border border-slate-300 text-sm">
                              {children}
                            </table>
                          </div>
                        ),

                        th: ({ children }) => (
                          <th className="border border-slate-300 px-3 py-2 bg-slate-200 font-bold text-left">
                            {children}
                          </th>
                        ),

                        td: ({ children }) => (
                          <td className="border border-slate-300 px-3 py-2">
                            {children}
                          </td>
                        ),

                        hr: () => (
                          <hr className="my-4 border-slate-300" />
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>

                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="bg-slate-100 text-slate-600 rounded-lg p-4 max-w-fit">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  </div>

                  <span className="text-sm">
                    AI is thinking...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex gap-3">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question about resumes, careers, ATS, or skills..."
              className="flex-1 rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}