import { useEffect, useState, useRef, useCallback } from "react";

const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&q=85&auto=format&fit=crop", 
    caption: "Healing Begins Here",
    sub: "Safe space for every Rwandan voice",
  },
  {
    url: "https://images.unsplash.com/photo-1582213782179-494f3a8c3c3f?w=1600&q=85&auto=format&fit=crop",
    caption: "From Silence to Strength",
    sub: "Supporting survivors with dignity and care",
  },
  {
    url: "https://images.unsplash.com/photo-1559757148-5e995136c87b?w=1600&q=85&auto=format&fit=crop",
    caption: "AI + Human Compassion",
    sub: "Immediate guidance, real professional support",
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=85&auto=format&fit=crop",
    caption: "Together We Rise",
    sub: "Building a Rwanda where no one suffers alone",
  },
];

const DURATION = 6000;

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
    <div style={{
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 16,
      padding: "18px 14px",
      textAlign: "center",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
      <div style={{ color: "#fff", fontWeight: 800, fontSize: 26, lineHeight: 1 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11.5, marginTop: 6, letterSpacing: "0.5px" }}>{label}</div>
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

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

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
    }, 480);
    startProgress();
  }, [startProgress]);

  useEffect(() => {
    startProgress();
    slideRef.current = setInterval(() => {
      const next = (currentRef.current + 1) % SLIDES.length;
      goTo(next);
    }, DURATION);

    return () => {
      clearInterval(slideRef.current);
      clearInterval(progressRef.current);
    };
  }, [goTo]);

  const anim = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(30px)",
    transition: `all 0.9s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
  });

  return (
    <section style={{
      position: "relative",
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: "#0a0f14",
    }}>

      {/* Background Image with Ken Burns */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src={imgSrc}
          alt="Healing and support"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imgOpacity,
            transition: "opacity 1.1s ease",
            animation: "kenBurns 9s ease-out forwards",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(10,15,20,0.92) 0%, rgba(10,15,20,0.75) 45%, rgba(10,15,20,0.55) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(10,15,20,0.95) 85%)" }} />
      </div>

      {/* Soft Orbs */}
      <div style={{
        position: "absolute", top: "15%", left: "8%", width: 480, height: 480,
        background: "radial-gradient(circle, rgba(45,212,191,0.18), transparent 70%)",
        borderRadius: "50%", zIndex: 1, animation: "pulseOrb 14s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "10%", width: 620, height: 620,
        background: "radial-gradient(circle, rgba(244,201,93,0.12), transparent 65%)",
        borderRadius: "50%", zIndex: 1, animation: "pulseOrb 18s ease-in-out infinite 4s",
      }} />

      {/* Main Content */}
      <div style={{
        position: "relative", zIndex: 10, flex: 1,
        display: "flex", flexDirection: "column", justifyContent: "center",
        maxWidth: 1280, margin: "0 auto", width: "100%",
        padding: "0 48px",
      }}>

        <div style={{ maxWidth: 680 }}>

          {/* Live Badge */}
          <div style={{ ...anim(100), display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 9999, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", marginBottom: 32 }}>
            <span style={{ position: "relative", display: "inline-block", width: 9, height: 9 }}>
              <span style={{ position: "absolute", inset: 0, background: "#34d399", borderRadius: "50%", animation: "ping 2s infinite" }} />
              <span style={{ position: "relative", width: 9, height: 9, background: "#34d399", borderRadius: "50%" }} />
            </span>
            <span style={{ color: "#6ee7b7", fontSize: 12, fontWeight: 700, letterSpacing: "1.5px" }}>
              LIVE IN RWANDA • CONFIDENTIAL & FREE
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            ...anim(250),
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(52px, 7vw, 82px)",
            fontWeight: 900,
            lineHeight: 1.05,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            marginBottom: 28,
          }}>
            YourVoice HUB<br />
            <span style={{
              background: "linear-gradient(90deg, #2dd4bf, #34d399, #f4c95d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Where Healing Begins
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ ...anim(400), fontSize: 19, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, maxWidth: 560, marginBottom: 48 }}>
            AI-powered mental health guidance and secure reporting for gender-based violence. 
            Connecting every Rwandan — urban or rural, with or without disability — to real support, 
            safely and with dignity.
          </p>

          {/* CTAs */}
          <div style={{ ...anim(550), display: "flex", flexWrap: "wrap", gap: 16 }}>
            <a href="/get-support" style={{
              padding: "18px 36px",
              borderRadius: 16,
              background: "linear-gradient(135deg, #0f4c75, #2dd4bf)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 20px 50px rgba(15,76,117,0.45)",
              transition: "all 0.3s ease",
            }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 28px 70px rgba(15,76,117,0.6)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(15,76,117,0.45)"; }}
            >
              Get Support Now
              <span style={{ fontSize: 18 }}>→</span>
            </a>

            <a href="#how-it-works" style={{
              padding: "18px 32px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.25)",
              transition: "all 0.3s ease",
            }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
              onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              How It Works
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Slide Indicator + Partners */}
      <div style={{ position: "relative", zIndex: 10, paddingBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                height: 4,
                width: i === current ? 64 : 22,
                background: i === current ? "#2dd4bf" : "rgba(255,255,255,0.25)",
                border: "none",
                borderRadius: 999,
                cursor: "pointer",
                transition: "all 0.4s ease",
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 500, letterSpacing: "1px" }}>
          {SLIDES[current].caption} • {SLIDES[current].sub}
        </div>
      </div>

      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1.02); }
          to   { transform: scale(1.12); }
        }
        @keyframes pulseOrb {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}