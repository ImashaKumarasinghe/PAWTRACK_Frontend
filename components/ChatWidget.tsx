"use client";

import { useState } from "react";

type Msg = { from: "user" | "bot"; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hi! I’m PawBot 🐾 Ask me about adoption, login, or reporting pets." },
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply || "Sorry, try again." }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Backend is not responding. Please check your server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          background: "#7b4a12",
          color: "white",
          fontSize: 22,
          cursor: "pointer",
          boxShadow: "0 12px 28px rgba(123,74,18,0.35)",
          zIndex: 9999,
        }}
      >
        🐶
      </button>

      {/* Chat Box */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 86,
            width: 320,
            background: "white",
            border: "1px solid rgba(123,74,18,0.2)",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
            zIndex: 9999,
          }}
        >
          <div style={{ padding: 12, background: "#fff8f0", fontWeight: 800, color: "#3a2513" }}>
            PawBot 🐾
          </div>

          <div style={{ height: 260, overflowY: "auto", padding: 12, display: "grid", gap: 10 }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.from === "user" ? "end" : "start",
                  background: m.from === "user" ? "#7b4a12" : "#f6efe6",
                  color: m.from === "user" ? "white" : "#3a2513",
                  padding: "8px 10px",
                  borderRadius: 12,
                  maxWidth: "85%",
                  fontSize: 13,
                  lineHeight: 1.4,
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ fontSize: 12, color: "#6b4a2f" }}>PawBot is typing...</div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
                outline: "none",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button
              onClick={send}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: "#111",
                color: "white",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
