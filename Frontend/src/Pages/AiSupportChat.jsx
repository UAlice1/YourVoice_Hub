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
          background: "#8e8ea0",
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
      gap: 14,
      padding: "18px 0",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      animation: "msgIn 0.2s ease both",
    }}>
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: isUser ? "#19c37d" : "#ab68ff",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginTop: 2,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", letterSpacing: -0.3 }}>
          {isUser ? "Y" : "A"}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13.5, fontWeight: 600, color: isUser ? "#19c37d" : "#ab68ff",
          margin: "0 0 6px", letterSpacing: 0.1,
        }}>
          {isUser ? "You" : "Amina"}
        </p>
        <div style={{
          fontSize: 15, lineHeight: 1.65, color: "#ececf1",
          whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}>
          {msg.content}
        </div>
        <p style={{ fontSize: 11, color: "#565869", margin: "8px 0 0" }}>{msg.time}</p>
      </div>
    </div>
  );
}

function WelcomeScreen({ onMood, moodUsed, onChip }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 24px", gap: 32,
      animation: "fadeUp 0.4s ease both",
    }}>
      {/* Logo mark */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg, #ab68ff, #19c37d)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
              fill="white" opacity="0.9"/>
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{
            margin: 0, fontSize: 26, fontWeight: 600, color: "#ececf1",
            fontFamily: "'Sora', sans-serif", letterSpacing: -0.4,
          }}>
            Hi, I'm Amina
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 15, color: "#8e8ea0", lineHeight: 1.5 }}>
            Your confidential AI support counselor at YourVoice Hub
          </p>
        </div>
      </div>

      {/* Mood picker */}
      {!moodUsed && (
        <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#8e8ea0", marginBottom: 14 }}>How are you feeling right now?</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {MOODS.map(m => (
              <button key={m} onClick={() => onMood(m)} style={{
                padding: "9px 20px", borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#ececf1", fontSize: 14, cursor: "pointer",
                transition: "all 0.16s ease",
                fontFamily: "inherit",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(171,104,255,0.15)";
                  e.currentTarget.style.borderColor = "rgba(171,104,255,0.5)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggestion chips */}
      <div style={{ width: "100%", maxWidth: 600 }}>
        <p style={{ fontSize: 13, color: "#565869", marginBottom: 12, textAlign: "center" }}>
          Or start with a topic
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}>
          {QUICK_CHIPS.slice(0, 6).map(chip => (
            <button key={chip.label} onClick={() => onChip(chip.text)} style={{
              padding: "13px 16px", borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#c5c5d2", fontSize: 13.5, cursor: "pointer",
              textAlign: "left", lineHeight: 1.4,
              transition: "all 0.16s ease",
              fontFamily: "inherit",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AiSupportChat() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [moodUsed, setMoodUsed]   = useState(false);
  const [history, setHistory]     = useState([]);
  const [sessionId]               = useState(() => crypto.randomUUID());
  const messagesEndRef            = useRef(null);
  const textareaRef               = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  const callAmina = async (userText, updatedHistory) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/chat`, {
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
      if (data?.intent === "crisis") {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "If you are in immediate danger, please call the Isange One Stop Center at 116 (toll-free in Rwanda). You are not alone.",
          time: getTime(),
        }]);
      }
    } catch (err) {
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
    const userMsg = { role: "user", content: text, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    const newHistory = [...history, { role: "user", content: text }];
    setHistory(newHistory);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    callAmina(text, newHistory);
  };

  const pickMood = (mood) => {
    setMoodUsed(true);
    sendMessage(`I am feeling ${mood} right now.`);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

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
        * { box-sizing: border-box; }
        body { margin: 0; }
        .yvh-root { font-family: 'Sora', -apple-system, sans-serif; }
        .yvh-scrollbar::-webkit-scrollbar{ width:4px; }
        .yvh-scrollbar::-webkit-scrollbar-thumb{ background:rgba(255,255,255,0.08); border-radius:4px; }
        .yvh-scrollbar::-webkit-scrollbar-track{ background: transparent; }
        .yvh-input:focus{ outline: none; border-color: rgba(255,255,255,0.2) !important; box-shadow: 0 0 0 1px rgba(255,255,255,0.1) !important; }
        .yvh-send:hover:not(:disabled){ background: rgba(255,255,255,0.15) !important; }
        .yvh-send:disabled{ opacity: 0.3; cursor: not-allowed; }
        .yvh-chip-scroll::-webkit-scrollbar{ display:none; }
      `}</style>

      <div className="yvh-root" style={{
        minHeight: "100vh", background: "#212121",
        display: "flex", flexDirection: "column",
      }}>
        {/* Sidebar-like left rail */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Left sidebar */}
          <div style={{
            width: 260, background: "#171717", flexShrink: 0,
            display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.06)",
          }}>
            {/* Logo */}
            <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #ab68ff, #19c37d)",
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#ececf1", letterSpacing: -0.2 }}>
                  YourVoice Hub
                </span>
              </div>
            </div>

            {/* New chat */}
            <div style={{ padding: "12px 8px" }}>
              <button onClick={() => { setMessages([]); setHistory([]); setMoodUsed(false); }} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, border: "none",
                background: "transparent", color: "#8e8ea0",
                fontSize: 13.5, cursor: "pointer", transition: "all 0.15s",
                fontFamily: "inherit",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#ececf1"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8e8ea0"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                New session
              </button>
            </div>

            {/* Active status */}
            <div style={{ padding: "0 8px", flex: 1 }}>
              {hasMessages && (
                <div style={{
                  padding: "8px 12px", borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#565869" }}>Current session</p>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "#ececf1" }}>Active conversation</p>
                </div>
              )}
            </div>

            {/* Bottom info */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "#19c37d",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Y</span>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 12.5, color: "#ececf1", fontWeight: 500 }}>Anonymous user</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#565869" }}>
                    <span style={{ color: "#19c37d" }}>●</span> Private & encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Messages or welcome */}
            <div className="yvh-scrollbar" style={{
              flex: 1, overflowY: "auto",
              display: "flex", flexDirection: "column",
            }}>
              {!hasMessages ? (
                <WelcomeScreen onMood={pickMood} moodUsed={moodUsed} onChip={sendMessage} />
              ) : (
                <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", padding: "24px 24px 8px" }}>
                  {messages.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} />
                  ))}
                  {loading && (
                    <div style={{
                      display: "flex", gap: 14, padding: "18px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: "#ab68ff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 2,
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>A</span>
                      </div>
                      <div style={{ flex: 1, paddingTop: 6 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "#ab68ff", margin: "0 0 10px" }}>Amina</p>
                        <TypingDots />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} style={{ height: 16 }} />
                </div>
              )}
            </div>

            {/* Input area */}
            <div style={{
              padding: hasMessages ? "12px 24px 20px" : "0 24px 28px",
              maxWidth: 720, width: "100%", margin: "0 auto",
              alignSelf: "stretch",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {/* Quick chips when chatting */}
              {hasMessages && (
                <div className="yvh-chip-scroll" style={{
                  display: "flex", gap: 8, overflowX: "auto",
                  scrollbarWidth: "none",
                }}>
                  {QUICK_CHIPS.map(chip => (
                    <button key={chip.label} disabled={loading} onClick={() => sendMessage(chip.text)} style={{
                      flexShrink: 0, padding: "6px 14px", borderRadius: 999,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#8e8ea0", fontSize: 12.5, cursor: "pointer",
                      transition: "all 0.15s", whiteSpace: "nowrap",
                      fontFamily: "inherit",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#ececf1"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "#8e8ea0"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input box */}
              <div style={{
                display: "flex", alignItems: "flex-end", gap: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: "12px 14px",
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
                  placeholder="Share what's on your mind — English or Kinyarwanda"
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    color: "#ececf1", fontSize: 15, lineHeight: 1.6,
                    resize: "none", fontFamily: "inherit",
                    minHeight: 24, maxHeight: 160,
                  }}
                />
                <button
                  className="yvh-send"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: input.trim() && !loading ? "rgba(255,255,255,0.12)" : "transparent",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
                      stroke={input.trim() && !loading ? "#ececf1" : "#565869"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <p style={{ fontSize: 11.5, color: "#565869", textAlign: "center", margin: 0 }}>
                End-to-end encrypted · Anonymous session · Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}