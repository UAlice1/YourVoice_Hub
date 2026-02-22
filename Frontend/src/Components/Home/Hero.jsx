import { useEffect, useState, useRef, useCallback } from "react";

const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&q=85&auto=format&fit=crop",
    caption: "Professional Support",
    sub: "Connecting survivors with certified counselors",
  },
  {
    url: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=1600&q=85&auto=format&fit=crop",
    caption: "Community Healing",
    sub: "Safe spaces for every voice to be heard",
  },
  {
    url: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1600&q=85&auto=format&fit=crop",
    caption: "AI-Guided Care",
    sub: "Intelligent support available 24/7",
  },
  {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=85&auto=format&fit=crop",
    caption: "Inclusive Healthcare",
    sub: "Designed for everyone — rural, urban, and beyond",
  },
];

const DURATION = 5000;

function useAnimatedCount(target, suffix = "", delay = 600) {
  const [display, setDisplay] = useState(`0${suffix}`);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / 2200, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.floor(eased * target).toLocaleString() + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, suffix, delay]);
  return display;
}

function StatTile({ icon, countTarget, suffix, label, delay }) {
  const value = useAnimatedCount(countTarget, suffix, delay);
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, textAlign: "center" }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function FloatingBadge({ icon, title, sub, style }) {
  return (
    <div style={{
      position: "absolute",
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 16px", borderRadius: 16,
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.2)",
      boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
      zIndex: 20,
      ...style,
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{title}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{sub}</div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [imgOpacity, setImgOpacity] = useState(1);
  const [imgSrc, setImgSrc] = useState(SLIDES[0].url);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [captionKey, setCaptionKey] = useState(0);
  const progressRef = useRef(null);
  const slideRef = useRef(null);
  const currentRef = useRef(0);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const startProgress = useCallback(() => {
    clearInterval(progressRef.current);
    setProgress(0);
    const start = Date.now();
    progressRef.current = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(progressRef.current);
    }, 40);
  }, []);

  const goTo = useCallback((idx) => {
    if (idx === currentRef.current) return;
    setImgOpacity(0);
    setTimeout(() => {
      currentRef.current = idx;
      setCurrent(idx);
      setImgSrc(SLIDES[idx].url);
      setCaptionKey(k => k + 1);
      setImgOpacity(1);
    }, 500);
    startProgress();
    clearInterval(slideRef.current);
    slideRef.current = setInterval(() => {
      const next = (currentRef.current + 1) % SLIDES.length;
      goTo(next);
    }, DURATION);
  }, [startProgress]);

  useEffect(() => {
    startProgress();
    slideRef.current = setInterval(() => {
      const next = (currentRef.current + 1) % SLIDES.length;
      goTo(next);
    }, DURATION);
    return () => { clearInterval(slideRef.current); clearInterval(progressRef.current); };
  }, []);

  const anim = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  });

  return (
    <section style={{ position: "relative", width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#0a0f14" }}>

      {/* ── Background ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src={imgSrc}
          alt={SLIDES[current].caption}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: imgOpacity,
            transition: "opacity 0.9s ease",
            animation: "kenBurns 8s ease-out forwards",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg,rgba(7,13,20,0.96) 0%,rgba(7,13,20,0.82) 50%,rgba(7,13,20,0.5) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(7,13,20,0.9) 0%,transparent 55%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(13,148,136,0.18) 0%,transparent 60%,rgba(245,158,11,0.07) 100%)" }} />
      </div>

      {/* Orbs */}
      <div style={{ position: "absolute", top: 80, left: 30, width: 420, height: 420, background: "radial-gradient(circle,rgba(13,148,136,0.15),transparent 70%)", borderRadius: "50%", animation: "pulseOrb 5s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 100, right: 60, width: 500, height: 500, background: "radial-gradient(circle,rgba(245,158,11,0.09),transparent 70%)", borderRadius: "50%", animation: "pulseOrb 6s ease-in-out infinite 2s", pointerEvents: "none", zIndex: 0 }} />

      {/* ── Main content ── */}
      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 1280, margin: "0 auto", width: "100%", padding: "120px 48px 48px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 64 }}>

          {/* LEFT */}
          <div style={{ flex: 1, minWidth: "min(100%, 360px)" }}>

            {/* Live badge */}
            <div style={{ ...anim(0), display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 999, marginBottom: 28, background: "rgba(13,148,136,0.15)", border: "1px solid rgba(20,184,166,0.3)" }}>
              <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(52,211,153,0.6)", animation: "ping 1.5s ease-in-out infinite" }} />
                <span style={{ position: "relative", width: 10, height: 10, borderRadius: "50%", background: "#34d399", display: "inline-flex" }} />
              </span>
              <span style={{ color: "#6ee7b7", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Now Live in Rwanda · Secure &amp; Confidential
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ ...anim(150), fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(44px,6vw,80px)", fontWeight: 900, color: "#ffffff", lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: 24 }}>
              Your Voice Hub,<br />
              <span style={{ background: "linear-gradient(90deg,#2dd4bf 0%,#34d399 45%,#fbbf24 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Always Heard.
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{ ...anim(280), fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, maxWidth: 520, marginBottom: 16 }}>
              AI-powered mental health support and gender-based violence reporting — safe, inclusive, and connected to certified professionals across Rwanda.
            </p>

            {/* Slide context label */}
            <div key={captionKey} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, animation: "fadeSlideUp 0.55s ease forwards" }}>
              <div style={{ width: 36, height: 2, background: "#2dd4bf", borderRadius: 2 }} />
              <span style={{ color: "#5eead4", fontSize: 13, fontWeight: 600, fontStyle: "italic" }}>
                {SLIDES[current].caption} — {SLIDES[current].sub}
              </span>
            </div>

            {/* CTAs */}
            <div style={{ ...anim(400), display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 32 }}>
              <a href="/login" style={{
                position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", gap: 10,
                padding: "16px 32px", borderRadius: 16, fontWeight: 700, fontSize: 15, color: "#fff", textDecoration: "none",
                background: "linear-gradient(135deg,#0d9488,#14b8a6)",
                boxShadow: "0 20px 60px rgba(20,184,166,0.4)",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 28px 70px rgba(20,184,166,0.55)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(20,184,166,0.4)"; }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Get Support Now
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>

              <a href="/partners" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "16px 28px", borderRadius: 16, fontWeight: 700, fontSize: 15, color: "#fff", textDecoration: "none",
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)", transition: "transform 0.25s, background 0.25s",
              }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                NGO Partnership
              </a>
            </div>

            {/* Trust */}
            <div style={{ ...anim(550), display: "flex", flexWrap: "wrap", gap: 18 }}>
              {["🔒 End-to-end encrypted", "🤖 AI-guided 24/7", "🏥 Isange OSC referral", "♿ Fully accessible"].map(t => (
                <span key={t} style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* RIGHT — Card */}
          <div style={{ ...anim(300), flexShrink: 0, width: "100%", maxWidth: 340, position: "relative" }}>
          

      
          </div>
        </div>
      </div>

      {/* ── Slide controls ── */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingBottom: 28 }}>
        <div key={captionKey} style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", animation: "fadeSlideUp 0.5s ease forwards" }}>
          {SLIDES[current].caption}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{ height: 3, border: "none", borderRadius: 4, cursor: "pointer", background: "rgba(255,255,255,0.2)", transition: "width 0.35s", width: i === current ? 48 : 18, overflow: "hidden", position: "relative", padding: 0 }}
            >
              {i === current && (
                <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${progress}%`, background: "#2dd4bf", borderRadius: 4, transition: "none" }} />
              )}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 4, opacity: 0.38 }}>
          <span style={{ color: "#fff", fontSize: 10, letterSpacing: "0.18em", fontWeight: 600 }}>SCROLL</span>
          <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.3)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16, background: "#fff", borderRadius: 2, animation: "scrollCue 2.2s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* ── Partners strip ── */}
      <div style={{ position: "relative", zIndex: 10, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "18px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "10px 32px" }}>
          <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>Trusted Partners</span>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.12)" }} />
          {["🏥 Isange One Stop Center", "🧠 Rwanda Mental Health", "🌸 UN Women Rwanda", "💻 Digital Rwanda", "🤝 GBV Alliance"].map(p => (
            <span key={p} style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "color 0.2s" }}
              onMouseOver={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
              onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.38)"}
            >{p}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1.0); }
          to   { transform: scale(1.1); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scrollCue {
          0%   { transform:translateY(-100%); opacity:0; }
          30%  { opacity:1; }
          70%  { opacity:1; }
          100% { transform:translateY(220%); opacity:0; }
        }
        @keyframes ping {
          0%,100%{ transform:scale(1); opacity:.7; }
          50%    { transform:scale(1.6); opacity:0; }
        }
        @keyframes pulseOrb {
          0%,100%{ opacity:.5; transform:scale(1); }
          50%    { opacity:.9; transform:scale(1.06); }
        }
        @media (max-width: 768px) {
          section > div[style*="padding: 120px"] {
            padding: 90px 24px 40px !important;
          }
        }
      `}</style>
    </section>
  );
}