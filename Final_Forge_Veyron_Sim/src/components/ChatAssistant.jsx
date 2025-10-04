// src/components/ChatAssistant.jsx
import React, { useState, useEffect, useRef } from "react";

export default function ChatAssistant() {
 const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", text: "You are a helpful SemPilot for the Forge & Veyron Currency Simulators." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const panelRef = useRef(null);
  const scrollerRef = useRef(null);

  function playNotification() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);

      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
      o.start(now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      o.stop(now + 0.19);

      setTimeout(() => {
        if (ctx.state !== "closed") ctx.close().catch(() => {});
      }, 1000);
    } catch (e) {}
  }

  useEffect(() => {
    if (!open) return;
    setUnreadCount(0);
    const hasAssistant = messages.some((m) => m.role === "SemPilot");
    if (!hasAssistant) {
      setMessages((prev) => [...prev, { role:"SemPilot", text: "Hello — how can I help you?" }]);
    }
    setTimeout(() => {
      if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }, 80);
  }, [open]); // eslint-disable-line

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages]);

  function toggleOpen() {
    setOpen((v) => !v);
    if (!open) setUnreadCount(0);
  }
function clearChat() {
  // Preserve a top-level system message if present (so assistant behavior stays)
  setMessages(prev => {
    if (!Array.isArray(prev) || prev.length === 0) return [];
    const systemMsg = prev.find(m => m.role === 'system' || m.role === 'System');
    return systemMsg ? [systemMsg] : [];
  });

  setInput("");         // clear input textarea
  setUnreadCount(0);    // reset unread badge
  setLoading(false);    // cancel loading state if any
}
  function extractReplyText(replyObj) {
    if (!replyObj) return "";
    if (typeof replyObj === "string") return replyObj;
    const c = replyObj.content ?? replyObj;
    if (Array.isArray(c) && c.length > 0) {
      const first = c[0];
      if (first?.text) return first.text;
      if (first?.parts && Array.isArray(first.parts)) return first.parts.join("");
      if (typeof first === "string") return first;
    }
    if (c?.parts && Array.isArray(c.parts)) return c.parts.join("");
    if (replyObj?.text) return replyObj.text;
    try {
      return JSON.stringify(replyObj);
    } catch (e) {
      return String(replyObj);
    }
  }

  async function send() {
  const trimmed = input.trim();
  if (!trimmed) return;

  // New user message object (shape your server expects)
  const userMsg = { role: "user", text: trimmed };

  // Build payload messages array from current messages + new user message
  // This avoids using an undefined variable like `all`
  const payloadMessages = Array.isArray(messages) ? [...messages, userMsg] : [userMsg];

  // Optimistically show the user's message in UI
  setMessages(prev => [...(Array.isArray(prev) ? prev : []), userMsg]);
  setInput("");
  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: payloadMessages }),
    });

    // Robust parse: if JSON content-type parse JSON, else read text and try parse
    const ct = res.headers.get("content-type") || "";
    let data = null;
    if (ct.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      try { data = text ? JSON.parse(text) : null; }
      catch (e) { data = { errorText: text || `Non-JSON response (status ${res.status})` }; }
    }

    if (!res.ok) {
      const errMsg = data?.error?.message || data?.errorText || `Server error ${res.status}`;
      setMessages(prev => [...(Array.isArray(prev) ? prev : []), { role: "assistant", text: `Error: ${errMsg}` }]);
      // notify if closed
      if (!open) {
        setUnreadCount(c => c + 1);
        if (soundEnabled) playNotification();
      }
    } else {
      // success — your server returns { reply: ... } so handle both shapes
      let replyObj = data?.reply ?? data;
      // extractReplyText should exist in your component (used earlier). If not, fallback:
      const replyText = (typeof extractReplyText === "function") ? (extractReplyText(replyObj) || "No reply") : (
        typeof replyObj === "string" ? replyObj : (replyObj?.content?.[0]?.text ?? JSON.stringify(replyObj))
      );

      const assistantMsg = { role: "SemPilot", text: replyText };

      if (!open) {
        setUnreadCount(c => c + 1);
        if (soundEnabled) playNotification();
      }

      setMessages(prev => [...(Array.isArray(prev) ? prev : []), assistantMsg]);
    }
  } catch (err) {
    // network or parsing error fallback
    if (!open) {
      setUnreadCount(c => c + 1);
      if (soundEnabled) playNotification();
    }
    setMessages(prev => [...(Array.isArray(prev) ? prev : []), { role: "SemPilot", text: "Network or parsing error: " + err.message }]);
  } finally {
    setLoading(false);
  }
}

  function onKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <div className="chat-toggle-wrapper">
        <button
          aria-label={open ? "Close chat" : "Open chat"}
          className={`chat-toggle ${open ? "open" : ""} ${unreadCount > 0 ? "unread" : ""} ${loading ? "typing" : ""}`}
          onClick={toggleOpen}
          title={open ? "Close SemPilot" : "Ask the SemPilot"}
        >
  <svg width="48" height="48" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden role="img">
  <defs>
    <linearGradient id="robotBodyWarm" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stopColor="#ff7aa2" />
      <stop offset="100%" stopColor="#ff9a4b" />
    </linearGradient>
    <linearGradient id="visorWarm" x1="0" x2="1">
      <stop offset="0%" stopColor="#ffd7e6" stopOpacity="0.98" />
      <stop offset="60%" stopColor="#ffb0a0" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#ff7a4b" stopOpacity="0.7" />
    </linearGradient>
    <radialGradient id="eyeGlowWarm" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stopColor="#fff6ee" stopOpacity="0.98" />
      <stop offset="60%" stopColor="#ffd3c1" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#ff8a6b" stopOpacity="0.35" />
    </radialGradient>
    <filter id="drop" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#3a0f12" floodOpacity="0.18"/>
    </filter>
  </defs>

  {/* antenna */}
  <g transform="translate(48,10)">
    <line x1="0" y1="0" x2="0" y2="-8" stroke="#ffd24d" strokeWidth="2" strokeLinecap="round" />
    <circle cx="0" cy="-10" r="2.5" fill="#ffd24d" stroke="#f0c84a" strokeWidth="0.6" />
  </g>

  {/* body card with subtle bevel */}
  <g transform="translate(12,18)" filter="url(#drop)">
    {/* main rounded torso using warm gradient */}
    <rect x="6" y="6" rx="12" ry="12" width="72" height="60" fill="url(#robotBodyWarm)" />

    {/* side connectors */}
    <rect x="0" y="20" rx="8" ry="8" width="12" height="20" fill="#2b0a12" />
    <rect x="84" y="20" rx="8" ry="8" width="12" height="20" fill="#2b0a12" />

    {/* visor - polished glass feel */}
    <rect x="20" y="12" rx="10" ry="10" width="56" height="28" fill="url(#visorWarm)" opacity="0.98" />
    <rect x="22" y="14" rx="6" ry="6" width="24" height="6" fill="rgba(255,255,255,0.07)" />

    {/* subtle mouth/vent */}
    <rect x="28" y="36" rx="3" ry="3" width="40" height="4" fill="#2a0810" />

    {/* status dots with warm accents */}
    <circle cx="40" cy="48" r="3" fill="#ffd34d" />
    <circle cx="52" cy="48" r="3" fill="#ffb07a" />
  </g>

  {/* eyes: more rounded, warmer glow */}
  <g transform="translate(32,32)">
    <ellipse className="robot-eye left-eye" cx="8" cy="-2" rx="6" ry="5.2" fill="url(#eyeGlowWarm)" />
    <ellipse className="robot-eye right-eye" cx="32" cy="-2" rx="6" ry="5.2" fill="url(#eyeGlowWarm)" />
    <circle className="robot-eye-pupil left-pupil" cx="8" cy="-2" r="2.2" fill="#2b0b10" />
    <circle className="robot-eye-pupil right-pupil" cx="32" cy="-2" r="2.2" fill="#2b0b10" />
  </g>

  {/* slight smile stroke for friendly/professional look */}
  <path d="M30 34 C36 28, 60 28, 66 34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeLinecap="round" />
</svg>


          {unreadCount > 0 && <span className="chat-unread-badge">{unreadCount}</span>}
        </button>
      </div>

      <div ref={panelRef} className={`chat-panel ${open ? "visible" : ""}`} role="dialog" aria-hidden={!open}>
        <div className="chat-header">
          <div className="robot-small" aria-hidden>
           <svg width="26" height="26" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hBodyWarm" x1="0" x2="1">
      <stop offset="0%" stopColor="#ff8fb0" />
      <stop offset="100%" stopColor="#ff9a4b" />
    </linearGradient>
  </defs>

  {/* compact rounded head */}
  <rect x="12" y="18" width="72" height="48" rx="8" fill="url(#hBodyWarm)" />
  {/* small visor */}
  <rect x="26" y="26" width="44" height="14" rx="3" fill="#fff0ea" opacity="0.9" />
</svg>
          </div>
          <div className="chat-title">SimPilot</div>
          <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>

        <div className="chat-body" ref={scrollerRef}>
          {messages.filter(m => m.role !== "system").map((m, i) => (
            <div key={i} className={`chat-msg ${m.role === "user" ? "user" : "SemPilot"}`}>
              <div className="msg-role">{m.role}</div>
              <div className="msg-text">{m.text}</div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Please ask your question"
            rows={3}
          />
          <div className="chat-actions">
           <button onClick={clearChat} className="btn-secondary">Clear</button>
            <button onClick={send} className="btn-primary" disabled={loading}>{loading ? "Thinking..." : "Send"}</button>
          </div>
        </div>
      </div>
    </>
  );
}
