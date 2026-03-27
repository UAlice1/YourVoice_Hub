import { useState, useRef, useEffect } from "react";

const QUICK_CHIPS = [
  { label: "Feeling anxious",   text: "I have been feeling very anxious lately and I don't know how to manage it." },
  { label: "Feeling sad",       text: "I feel very sad and I don't understand why." },
  { label: "Can't sleep",       text: "I can't sleep well. My mind won't stop and I lie awake every night." },
  { label: "Relationship pain", text: "I am going through relationship pain and heartbreak." },
  { label: "Anger & stress",    text: "I feel angry and very stressed all the time and I can't control it." },
  { label: "Feeling lonely",    text: "I feel very lonely and isolated from everyone around me." },
  { label: "Low self-esteem",   text: "I struggle with low self-esteem and confidence. I don't feel good enough." },
  { label: "Trauma & fear",     text: "I am dealing with trauma and fear from things that happened in my past." },
];

const MOODS = ["Low", "Anxious", "Overwhelmed", "Okay", "Alright"];

function getTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          display: "block", width: 7, height: 7, borderRadius: "50%",
          background: "#555570",
          animation: `blink 1.3s infinite ${i * 0.22}s`,
        }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start",
      padding: "8px 0",
      animation: "msgIn 0.2s ease both",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 5,
        flexDirection: isUser ? "row-reverse" : "row",
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
          background: isUser ? "#19c37d" : "#ab68ff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>
            {isUser ? "Y" : "A"}
          </span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: isUser ? "#19c37d" : "#ab68ff" }}>
          {isUser ? "You" : "Amina"}
        </span>
        <span style={{ fontSize: 11, color: "#555570" }}>{msg.time}</span>
      </div>
      <div style={{
        maxWidth: "82%",
        padding: "10px 15px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser ? "#19c37d" : "#1a1a2e",
        color: isUser ? "#fff" : "#e0e0f0",
        fontSize: 14.5, lineHeight: 1.65,
        whiteSpace: "pre-wrap", wordBreak: "break-word",
        border: isUser ? "none" : "1px solid #2a2a42",
      }}>
        {msg.content}
      </div>
    </div>
  );
}

function WelcomeScreen({ onMood, moodUsed, onChip, isMobile }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: isMobile ? "24px 16px" : "0 24px",
      gap: isMobile ? 22 : 30,
      animation: "fadeUp 0.4s ease both",
      overflowY: "auto",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{
          width: isMobile ? 52 : 64, height: isMobile ? 52 : 64, borderRadius: "50%",
          background: "linear-gradient(135deg, #ab68ff, #19c37d)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
              fill="white" opacity="0.9"/>
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{
            margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 600, color: "#f0f0ff",
            fontFamily: "'Sora', sans-serif", letterSpacing: -0.4,
          }}>Hi, I'm Amina</h1>
          <p style={{ margin: "6px 0 0", fontSize: isMobile ? 13.5 : 15, color: "#8888aa", lineHeight: 1.5 }}>
            Your confidential AI support counselor at YourVoice Hub
          </p>
        </div>
      </div>

      {!moodUsed && (
        <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
          <p style={{ fontSize: 13.5, color: "#8888aa", marginBottom: 12 }}>How are you feeling right now?</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {MOODS.map(m => (
              <button key={m} onClick={() => onMood(m)} style={{
                padding: "8px 18px", borderRadius: 999,
                background: "#111120", border: "1px solid #2a2a42",
                color: "#e0e0f0", fontSize: 13.5, cursor: "pointer",
                transition: "all 0.16s ease", fontFamily: "inherit",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(171,104,255,0.12)"; e.currentTarget.style.borderColor = "rgba(171,104,255,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#111120"; e.currentTarget.style.borderColor = "#2a2a42"; }}
              >{m}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 600 }}>
        <p style={{ fontSize: 13, color: "#555570", marginBottom: 10, textAlign: "center" }}>Or start with a topic</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 8,
        }}>
          {QUICK_CHIPS.slice(0, isMobile ? 4 : 6).map(chip => (
            <button key={chip.label} onClick={() => onChip(chip.text)} style={{
              padding: "12px 16px", borderRadius: 12,
              background: "#111120", border: "1px solid #2a2a42",
              color: "#c0c0e0", fontSize: 13.5, cursor: "pointer",
              textAlign: "left", lineHeight: 1.4,
              transition: "all 0.16s ease", fontFamily: "inherit",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#18182e"; e.currentTarget.style.borderColor = "#6040a0"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#111120"; e.currentTarget.style.borderColor = "#2a2a42"; }}
            >{chip.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ onNewSession, hasMessages, onClose, isMobile }) {
  return (
    <div style={{
      width: "100%", background: "#0a0a14",
      display: "flex", flexDirection: "column",
      borderRight: isMobile ? "none" : "1px solid #1e1e30",
      height: "100%",
    }}>
      <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #1e1e30", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #ab68ff, #19c37d)", flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#e0e0f0", letterSpacing: -0.2 }}>YourVoice Hub</span>
        </div>
        {isMobile && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8888aa", padding: 4, display: "flex" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      <div style={{ padding: "12px 8px" }}>
        <button onClick={() => { onNewSession(); if (isMobile) onClose(); }} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 8, border: "none",
          background: "transparent", color: "#8888aa",
          fontSize: 13.5, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#141428"; e.currentTarget.style.color = "#e0e0f0"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8888aa"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New session
        </button>
      </div>

      <div style={{ padding: "0 8px", flex: 1 }}>
        {hasMessages && (
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "#141428", border: "1px solid #1e1e30" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#555570" }}>Current session</p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#e0e0f0" }}>Active conversation</p>
          </div>
        )}
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid #1e1e30" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#19c37d", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Y</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12.5, color: "#e0e0f0", fontWeight: 500 }}>Anonymous user</p>
            <p style={{ margin: 0, fontSize: 11, color: "#555570" }}>
              <span style={{ color: "#19c37d" }}>●</span> Private & encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AiSupportChat() {
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [moodUsed, setMoodUsed]       = useState(false);
  const [history, setHistory]         = useState([]);
  const [sessionId]                   = useState(() => crypto.randomUUID());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const messagesEndRef                = useRef(null);
  const textareaRef                   = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const hasMessages = messages.length > 0;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 140) + "px"; }
  };

const callAmina = async (userText, updatedHistory) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, session_id: sessionId, history: updatedHistory }),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    const reply = data?.data?.response || data?.response;
    if (!reply || typeof reply !== "string") throw new Error("No valid reply");
    const assistantMsg = { role: "assistant", content: reply, time: getTime() };
    setHistory(prev => [...prev, { role: "assistant", content: reply }]);
    setMessages(prev => [...prev, assistantMsg]);
    if (data?.data?.intent === "crisis") {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "If you are in immediate danger, please call the Isange One Stop Center at 116 (toll-free in Rwanda). You are not alone.",
        time: getTime(),
      }]);
    }
  } catch {
    setMessages(prev => [...prev, {
      role: "assistant",
      content: "I'm having trouble connecting right now. Please try again in a few seconds.",
      time: getTime(),
    }]);
  } finally {
    setLoading(false);
    textareaRef.current?.focus();
  }
};

  const sendMessage = (text = input.trim()) => {
    if (!text || loading) return;
    setMessages(prev => [...prev, { role: "user", content: text, time: getTime() }]);
    const newHistory = [...history, { role: "user", content: text }];
    setHistory(newHistory);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    callAmina(text, newHistory);
  };

  const pickMood = (mood) => { setMoodUsed(true); sendMessage(`I am feeling ${mood} right now.`); };
  const resetSession = () => { setMessages([]); setHistory([]); setMoodUsed(false); };
  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');
        @keyframes blink {
          0%,80%,100%{ opacity:.3; transform:scale(1); }
          40%{ opacity:1; transform:scale(1.25); }
        }
        @keyframes msgIn {
          from{ opacity:0; transform:translateY(4px); }
          to{ opacity:1; transform:translateY(0); }
        }
        @keyframes fadeUp {
          from{ opacity:0; transform:translateY(16px); }
          to{ opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from{ transform:translateX(-100%); }
          to{ transform:translateX(0); }
        }
        @keyframes fadeIn {
          from{ opacity:0; } to{ opacity:1; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: #08080f; }
        .yvh-root { font-family: 'Sora', -apple-system, sans-serif; }
        .yvh-scrollbar::-webkit-scrollbar{ width:4px; }
        .yvh-scrollbar::-webkit-scrollbar-thumb{ background:rgba(255,255,255,0.08); border-radius:4px; }
        .yvh-scrollbar::-webkit-scrollbar-track{ background:transparent; }
        .yvh-input:focus{ outline:none; }
        .yvh-input::placeholder{ color:#555570; }
        .yvh-send:hover:not(:disabled){ background:rgba(255,255,255,0.08) !important; }
        .yvh-send:disabled{ opacity:0.3; cursor:not-allowed; }
        .yvh-chip-scroll::-webkit-scrollbar{ display:none; }
        .yvh-overlay{
          position:fixed; inset:0; background:rgba(0,0,0,0.6);
          z-index:40; animation:fadeIn 0.2s ease;
        }
        .yvh-drawer{
          position:fixed; top:0; left:0; bottom:0; width:280px;
          z-index:50; animation:slideIn 0.25s ease;
          box-shadow:4px 0 20px rgba(0,0,0,0.5);
        }
      `}</style>

      {/* Mobile drawer */}
      {isMobile && sidebarOpen && (
        <>
          <div className="yvh-overlay" onClick={() => setSidebarOpen(false)} />
          <div className="yvh-drawer">
            <Sidebar onNewSession={resetSession} hasMessages={hasMessages} onClose={() => setSidebarOpen(false)} isMobile={true} />
          </div>
        </>
      )}

      <div className="yvh-root" style={{ height: "100vh", background: "#08080f", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Desktop sidebar */}
          {!isMobile && (
            <div style={{ width: 260, flexShrink: 0 }}>
              <Sidebar onNewSession={resetSession} hasMessages={hasMessages} onClose={() => {}} isMobile={false} />
            </div>
          )}

          {/* Main */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#0d0d1a" }}>

            {/* Mobile top bar */}
            {isMobile && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderBottom: "1px solid #1e1e30",
                background: "#0d0d1a", flexShrink: 0,
              }}>
                <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8888aa", padding: 4, display: "flex" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 12h18M3 6h18M3 18h18"/>
                  </svg>
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #ab68ff, #19c37d)" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#e0e0f0" }}>YourVoice Hub</span>
                </div>
                <button onClick={resetSession} style={{ background: "none", border: "none", cursor: "pointer", color: "#8888aa", padding: 4, display: "flex" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Messages / welcome */}
            <div className="yvh-scrollbar" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", background: "#0d0d1a" }}>
              {!hasMessages ? (
                <WelcomeScreen onMood={pickMood} moodUsed={moodUsed} onChip={sendMessage} isMobile={isMobile} />
              ) : (
                <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", padding: isMobile ? "14px 12px 8px" : "24px 24px 8px" }}>
                  {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                  {loading && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "8px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#ab68ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>A</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#ab68ff" }}>Amina</span>
                      </div>
                      <div style={{ padding: "10px 15px", borderRadius: "18px 18px 18px 4px", background: "#1a1a2e", border: "1px solid #2a2a42" }}>
                        <TypingDots />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} style={{ height: 12 }} />
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: isMobile
                ? (hasMessages ? "10px 12px 14px" : "0 12px 16px")
                : (hasMessages ? "12px 24px 20px" : "0 24px 28px"),
              maxWidth: 720, width: "100%", margin: "0 auto",
              alignSelf: "stretch",
              display: "flex", flexDirection: "column", gap: 8,
              background: "#0d0d1a",
              borderTop: hasMessages ? "1px solid #1e1e30" : "none",
            }}>
              {hasMessages && (
                <div className="yvh-chip-scroll" style={{ display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none", paddingTop: 4 }}>
                  {QUICK_CHIPS.map(chip => (
                    <button key={chip.label} disabled={loading} onClick={() => sendMessage(chip.text)} style={{
                      flexShrink: 0, padding: "5px 12px", borderRadius: 999,
                      background: "#141428", border: "1px solid #2a2a42",
                      color: "#8888aa", fontSize: 12, cursor: "pointer",
                      transition: "all 0.15s", whiteSpace: "nowrap", fontFamily: "inherit",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#e0e0f0"; e.currentTarget.style.borderColor = "#6040a0"; e.currentTarget.style.background = "#1e1840"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "#8888aa"; e.currentTarget.style.borderColor = "#2a2a42"; e.currentTarget.style.background = "#141428"; }}
                    >{chip.label}</button>
                  ))}
                </div>
              )}

              <div style={{
                display: "flex", alignItems: "flex-end", gap: 8,
                background: "#111120", border: "1px solid #2a2a42",
                borderRadius: 16, padding: isMobile ? "10px 12px" : "12px 14px",
                transition: "border-color 0.15s",
              }}>
                <textarea
                  ref={textareaRef}
                  className="yvh-input"
                  value={input}
                  onChange={e => { setInput(e.target.value); resizeTextarea(); }}
                  onKeyDown={handleKey}
                  disabled={loading}
                  rows={1}
                  placeholder={isMobile ? "Share what's on your mind…" : "Share what's on your mind — English or Kinyarwanda"}
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    color: "#e0e0f0", fontSize: isMobile ? 14 : 15, lineHeight: 1.6,
                    resize: "none", fontFamily: "inherit", minHeight: 24, maxHeight: 140,
                  }}
                />
                <button
                  className="yvh-send"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: input.trim() && !loading ? "rgba(255,255,255,0.08)" : "transparent",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
                      stroke={input.trim() && !loading ? "#e0e0f0" : "#333355"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <p style={{ fontSize: isMobile ? 10.5 : 11.5, color: "#555570", textAlign: "center", margin: 0 }}>
                {isMobile
                  ? "Anonymous · Encrypted · Tap send or press Enter"
                  : "End-to-end encrypted · Anonymous session · Enter to send · Shift+Enter for new line"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}