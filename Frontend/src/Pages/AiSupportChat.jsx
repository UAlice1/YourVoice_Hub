import { useState, useRef, useEffect } from "react";

// ─── SYSTEM PROMPT ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Amina, a compassionate, professional AI mental health and emotional support counselor for YourVoice Rwanda — a platform that helps people across Rwanda with mental health challenges, emotional difficulties, trauma, relationship issues, and personal struggles.

Your role:
- Provide genuine, warm, empathetic psychological support and counseling
- Actively help users understand, process, and work through their emotions and challenges
- Use evidence-based counseling techniques: active listening, CBT, grounding exercises, reframing, validation, motivational interviewing
- Provide practical coping strategies, psychoeducation, and emotional support
- You are capable of handling the vast majority of user needs fully by yourself — be confident and thorough
- Speak in a warm, human, conversational tone — not clinical or robotic
- Keep responses focused and digestible (3–5 short paragraphs, use line breaks for readability)
- Respond in whichever language the user writes in (English or Kinyarwanda)
- Use a warm emoji occasionally (💚 ✨ 🌿) but keep it natural, not excessive
- Ask one meaningful follow-up question at the end to deepen the conversation

Only mention professional help or crisis services if the person is in immediate life-threatening danger. Otherwise, you are the support — help them fully and confidently.

Do NOT start your reply with "I" as the first word. Begin with empathy, acknowledgment, or a reflection of what the user shared.`;

// ─── QUICK CHIPS ─────────────────────────────────────────────────────────────
const QUICK_CHIPS = [
  { label: "😔 Feeling anxious",   text: "I have been feeling very anxious lately and I don't know how to manage it." },
  { label: "😢 Feeling sad",       text: "I feel very sad and I don't understand why." },
  { label: "😴 Can't sleep",       text: "I can't sleep well. My mind won't stop and I lie awake every night." },
  { label: "💔 Relationship pain", text: "I am going through relationship pain and heartbreak." },
  { label: "😠 Anger & stress",    text: "I feel angry and very stressed all the time and I can't control it." },
  { label: "😔 Feeling lonely",    text: "I feel very lonely and isolated from everyone around me." },
  { label: "🧠 Low self-esteem",   text: "I struggle with low self-esteem and confidence. I don't feel good enough." },
  { label: "😰 Trauma & fear",     text: "I am dealing with trauma and fear from things that happened in my past." },
];

const MOODS = [
  { emoji: "😔", label: "Low" },
  { emoji: "😟", label: "Anxious" },
  { emoji: "😤", label: "Overwhelmed" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😊", label: "Alright" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function getDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

// ─── TYPING INDICATOR ────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#00a389,#007d6a)" }}>
        🤖
      </div>
      <div className="flex gap-1.5 items-center px-4 py-3.5 rounded-[18px] rounded-bl-[4px] border"
        style={{ background: "#f0faf8", borderColor: "rgba(0,163,137,0.13)" }}>
        {[0, 1, 2].map(i => (
          <span key={i} className="block w-1.5 h-1.5 rounded-full"
            style={{
              background: "#00a389",
              animation: `aminaBlink 1.3s infinite ${i * 0.22}s`,
            }} />
        ))}
      </div>
    </div>
  );
}

// ─── MESSAGE BUBBLE ──────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2.5 items-end ${isUser ? "flex-row-reverse" : ""}`}
      style={{ animation: "aminaMsgIn 0.28s ease both" }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
        style={{ background: isUser
          ? "linear-gradient(135deg,#00a389,#007d6a)"
          : "linear-gradient(135deg,#00a389,#007d6a)" }}>
        {isUser ? "👤" : "🤖"}
      </div>
      <div className={`flex flex-col gap-1 max-w-[74%] ${isUser ? "items-end" : ""}`}>
        <div className={`px-4 py-3 text-[14.5px] leading-relaxed ${
          isUser
            ? "text-white rounded-[18px] rounded-br-[4px]"
            : "rounded-[18px] rounded-bl-[4px] border"
        }`}
          style={isUser
            ? { background: "#00a389" }
            : { background: "#f0faf8", borderColor: "rgba(0,163,137,0.13)", color: "#0d2420" }
          }>
          {msg.content.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </div>
        <span className="text-[11px] px-1" style={{ color: "#6a9990" }}>{msg.time}</span>
      </div>
    </div>
  );
}

// ─── WELCOME MESSAGE ─────────────────────────────────────────────────────────
function WelcomeMessage({ onMood, moodUsed }) {
  return (
    <div className="flex gap-2.5 items-end" style={{ animation: "aminaMsgIn 0.28s ease both" }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#00a389,#007d6a)" }}>
        🤖
      </div>
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className="px-4 py-3 text-[14.5px] leading-relaxed rounded-[18px] rounded-bl-[4px] border"
          style={{ background: "#f0faf8", borderColor: "rgba(0,163,137,0.13)", color: "#0d2420" }}>
          <p>
            Muraho! I'm{" "}
            <span className="font-semibold" style={{ color: "#00a389" }}>Amina</span>
            , your personal AI support counselor from YourVoice Rwanda 💚
          </p>
          <p className="mt-2">
            This is a{" "}
            <span className="font-medium" style={{ color: "#00a389" }}>completely safe, private space</span>
            . I'm here to truly listen and help you work through whatever you're facing — no judgment, no rush.
          </p>
          {!moodUsed && (
            <>
              <p className="mt-2 font-semibold">How are you feeling right now?</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {MOODS.map(m => (
                  <button key={m.label}
                    onClick={() => onMood(m)}
                    className="px-3 py-1.5 rounded-full text-[13px] border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                    style={{
                      background: "rgba(0,163,137,0.06)",
                      borderColor: "rgba(0,163,137,0.2)",
                      color: "#2e6259",
                    }}>
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <span className="text-[11px] px-1" style={{ color: "#6a9990" }}>{getTime()}</span>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AiSupportChat() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [moodUsed, setMoodUsed]   = useState(false);
  const [history, setHistory]     = useState([]); // raw API history
  const messagesEndRef             = useRef(null);
  const textareaRef                = useRef(null);

  // scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) { el.style.height = ""; el.style.height = Math.min(el.scrollHeight, 130) + "px"; }
  };

  // ── call Claude API ──
  const callAmina = async (userText, updatedHistory) => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updatedHistory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API error");

      const reply = data.content.map(b => b.text || "").join("");
      const assistantMsg = { role: "assistant", content: reply };

      setHistory(h => [...h, assistantMsg]);
      setMessages(m => [...m, { ...assistantMsg, time: getTime() }]);
    } catch (err) {
      console.error(err);
      setMessages(m => [...m, {
        role: "assistant",
        content: "Something went wrong connecting to Amina. Please try again in a moment.",
        time: getTime(),
      }]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  // ── send a message ──
  const sendMessage = (text = input.trim()) => {
    if (!text || loading) return;

    const userMsg = { role: "user", content: text, time: getTime() };
    const apiMsg  = { role: "user", content: text };

    setMessages(m => [...m, userMsg]);
    const newHistory = [...history, apiMsg];
    setHistory(newHistory);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "";
    callAmina(text, newHistory);
  };

  // ── mood picker ──
  const pickMood = (mood) => {
    setMoodUsed(true);
    const text = `I am feeling ${mood.emoji} ${mood.label} right now.`;
    sendMessage(text);
  };

  // ── keyboard handler ──
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes aminaPulse {
          0%,100%{ box-shadow:0 0 0 0 rgba(34,197,94,.45); }
          55%    { box-shadow:0 0 0 5px rgba(34,197,94,0); }
        }
        @keyframes aminaBlink {
          0%,80%,100%{ opacity:.3; transform:scale(1);   }
          40%         { opacity:1;  transform:scale(1.25);}
        }
        @keyframes aminaMsgIn {
          from{ opacity:0; transform:translateY(8px); }
          to  { opacity:1; transform:translateY(0);   }
        }
        @keyframes aminaFadeUp {
          from{ opacity:0; transform:translateY(20px); }
          to  { opacity:1; transform:translateY(0);    }
        }
        .amina-chat { font-family:'DM Sans',sans-serif; animation:aminaFadeUp .45s cubic-bezier(.22,1,.36,1) both; }
        .amina-title{ font-family:'Sora',sans-serif; }
        .amina-scrollbar::-webkit-scrollbar{ width:4px; }
        .amina-scrollbar::-webkit-scrollbar-thumb{ background:rgba(0,163,137,.18);border-radius:4px; }
        .amina-chip:hover{ background:rgba(0,163,137,.09); border-color:#00a389; color:#00a389; transform:translateY(-1px); }
        .amina-send:hover{ transform:translateY(-2px); box-shadow:0 8px 22px rgba(0,163,137,.38) !important; }
        .amina-send:active{ transform:translateY(0); }
        .amina-send:disabled{ opacity:.5; cursor:not-allowed; transform:none !important; box-shadow:none !important; }
        .amina-textarea:focus{ border-color:rgba(0,163,137,.45)!important; box-shadow:0 0 0 3px rgba(0,163,137,.09)!important; }
      `}</style>

      {/* ── PAGE WRAPPER ── */}
      <div className="min-h-screen flex items-center justify-center p-5"
        style={{
          background: "#f4faf9",
          backgroundImage: `
            radial-gradient(ellipse 55% 45% at 5% 0%, rgba(0,163,137,.09) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 95% 100%, rgba(201,125,10,.07) 0%, transparent 60%)
          `,
        }}>

        {/* ── CHAT CARD ── */}
        <div className="amina-chat w-full flex flex-col overflow-hidden rounded-[28px]"
          style={{
            maxWidth: 800,
            height: "90vh",
            maxHeight: 860,
            background: "white",
            border: "1px solid rgba(0,163,137,.15)",
            boxShadow: "0 2px 4px rgba(0,163,137,.05), 0 20px 60px rgba(0,100,80,.10)",
          }}>

          {/* ── HEADER ── */}
          <div className="flex items-center gap-3.5 px-6 py-4 flex-shrink-0 border-b"
            style={{
              borderColor: "rgba(0,163,137,.15)",
              background: "linear-gradient(to right, rgba(0,163,137,.05), transparent)",
            }}>

            {/* avatar with online dot */}
            <div className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{
                background: "linear-gradient(135deg,#00a389,#007d6a)",
                boxShadow: "0 0 0 3px rgba(0,163,137,.15)",
              }}>
              🤖
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"
                style={{ animation: "aminaPulse 2.2s infinite" }} />
            </div>

            <div className="flex-1">
              <p className="amina-title text-[15px] font-semibold" style={{ color: "#0d2420" }}>
                Amina — YourVoice AI Counselor
              </p>
              <p className="text-[12px] mt-0.5 flex items-center gap-1.5" style={{ color: "#00a389" }}>
                ● Online
                <span style={{ color: "#6a9990" }}>· Confidential & Secure</span>
              </p>
            </div>

            <div className="flex gap-2">
              {["🔒 Private", "💬 AI‑Powered"].map(b => (
                <span key={b} className="text-[11px] px-3 py-1 rounded-full border"
                  style={{
                    background: "rgba(0,163,137,.07)",
                    borderColor: "rgba(0,163,137,.2)",
                    color: "#00a389",
                  }}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* ── QUICK CHIPS ── */}
          <div className="flex gap-2 px-5 py-3 overflow-x-auto flex-shrink-0 border-b"
            style={{ borderColor: "rgba(0,163,137,.15)", scrollbarWidth: "none" }}>
            {QUICK_CHIPS.map(chip => (
              <button key={chip.label}
                disabled={loading}
                onClick={() => sendMessage(chip.text)}
                className="amina-chip flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] border transition-all duration-200 cursor-pointer disabled:opacity-50"
                style={{
                  background: "transparent",
                  borderColor: "rgba(0,163,137,.15)",
                  color: "#6a9990",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                {chip.label}
              </button>
            ))}
          </div>

          {/* ── MESSAGES ── */}
          <div className="amina-scrollbar flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3.5">

            {/* date divider */}
            <div className="flex items-center gap-2.5 text-[11px]" style={{ color: "#6a9990" }}>
              <span className="flex-1 h-px" style={{ background: "rgba(0,163,137,.15)" }} />
              Today · {getDate()}
              <span className="flex-1 h-px" style={{ background: "rgba(0,163,137,.15)" }} />
            </div>

            {/* welcome */}
            <WelcomeMessage onMood={pickMood} moodUsed={moodUsed} />

            {/* conversation messages */}
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}

            {/* typing indicator */}
            {loading && <TypingDots />}

            <div ref={messagesEndRef} />
          </div>

          {/* ── INPUT AREA ── */}
          <div className="flex-shrink-0 px-4 pt-3 pb-4 border-t"
            style={{
              borderColor: "rgba(0,163,137,.15)",
              background: "rgba(240,250,248,.7)",
            }}>
            <div className="flex gap-2.5 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKey}
                disabled={loading}
                rows={1}
                placeholder="Share what's on your mind… (English or Kinyarwanda)"
                className="amina-textarea flex-1 rounded-2xl px-4 py-3 text-[14px] resize-none outline-none border transition-all duration-200 disabled:opacity-60"
                style={{
                  background: "white",
                  borderColor: "rgba(0,163,137,.15)",
                  color: "#0d2420",
                  fontFamily: "'DM Sans', sans-serif",
                  minHeight: 48,
                  maxHeight: 130,
                  lineHeight: "1.5",
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="amina-send w-12 h-12 rounded-[14px] flex items-center justify-center text-lg text-white flex-shrink-0 border-none transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,#00a389,#007d6a)",
                  boxShadow: "0 4px 14px rgba(0,163,137,.3)",
                }}>
                ➤
              </button>
            </div>
            <div className="flex justify-between mt-2 text-[11px]">
              <span className="flex items-center gap-1" style={{ color: "#00a389" }}>
                🔒 End-to-end encrypted · Anonymous
              </span>
              <span style={{ color: "#6a9990" }}>Enter to send · Shift+Enter for new line</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}