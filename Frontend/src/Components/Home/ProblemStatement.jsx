import { useState, useEffect, useRef } from "react";

const problems = [
  {
    icon: "🧠",
    stat: "1 in 5",
    label: "Rwandans live with a mental health condition",
    detail: "Yet fewer than 1% ever receive professional care.",
    color: "#4ecdc4",
  },
  {
    icon: "💔",
    stat: "56%",
    label: "of women have experienced gender-based violence",
    detail: "Most suffer in silence due to fear and shame.",
    color: "#ff8fab",
  },
  {
    icon: "🌿",
    stat: "8M+",
    label: "Rwandans in rural areas lack access to support",
    detail: "Distance and cost make services unreachable for millions.",
    color: "#52b788",
  },
  {
    icon: "🤐",
    stat: "9 in 10",
    label: "Survivors never report abuse due to stigma",
    detail: "Cultural stigma silences those who need help the most.",
    color: "#f4a261",
  },
  {
    icon: "♿",
    stat: "450K+",
    label: "People with disabilities have no inclusive support",
    detail: "Existing services rarely accommodate impairments.",
    color: "#c77dff",
  },
];

const words = ["alone.", "unheard.", "afraid.", "invisible.", "silenced."];
const wordColors = ["#4ecdc4", "#ff8fab", "#f4a261", "#c77dff", "#52b788"];

function useCountUp(target, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(num);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

function StatCard({ problem, index, active }) {
  const [hovered, setHovered] = useState(false);
  const num = useCountUp(problem.stat, 1800, active);
  const raw = problem.stat.replace(/[^0-9.]/g, "");
  const prefix = problem.stat.match(/^[^0-9]*/)?.[0] || "";
  const suffix = problem.stat.match(/[^0-9.]+$/)?.[0] || "";
  const displayStat = isNaN(parseFloat(raw))
    ? problem.stat
    : `${prefix}${num}${suffix}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? problem.color : "#fff",
        border: `2px solid ${hovered ? problem.color : "#eff2f7"}`,
        borderRadius: "18px",
        padding: "24px 22px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        opacity: active ? 1 : 0,
        transform: active
          ? hovered ? "translateX(6px)" : "translateX(0)"
          : "translateX(40px)",
        transition: `opacity 0.6s ease ${index * 0.1}s,
                     transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s,
                     background 0.25s ease, border 0.25s ease`,
        boxShadow: hovered
          ? `0 12px 40px ${problem.color}50`
          : "0 2px 12px rgba(0,0,0,0.05)",
        cursor: "default",
      }}
    >
      {/* Icon box */}
      <div style={{
        width: 56, height: 56, borderRadius: "16px", flexShrink: 0,
        background: hovered ? "rgba(255,255,255,0.25)" : `${problem.color}15`,
        border: `2px solid ${hovered ? "rgba(255,255,255,0.5)" : `${problem.color}30`}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, transition: "all 0.25s ease",
      }}>
        {problem.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "clamp(26px, 3vw, 34px)",
          fontWeight: 800,
          color: hovered ? "#fff" : problem.color,
          lineHeight: 1,
          marginBottom: 5,
          transition: "color 0.25s ease",
          letterSpacing: "-0.01em",
        }}>
          {displayStat}
        </div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 13, fontWeight: 600,
          color: hovered ? "rgba(255,255,255,0.95)" : "#1a2332",
          marginBottom: 3, lineHeight: 1.4,
          transition: "color 0.25s ease",
        }}>
          {problem.label}
        </div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 12, fontWeight: 400,
          color: hovered ? "rgba(255,255,255,0.75)" : "#8896a5",
          lineHeight: 1.6,
          transition: "color 0.25s ease",
        }}>
          {problem.detail}
        </div>
      </div>

      {/* Arrow indicator */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: hovered ? "rgba(255,255,255,0.2)" : `${problem.color}10`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14,
        color: hovered ? "#fff" : problem.color,
        transition: "all 0.25s ease",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
      }}>
        →
      </div>
    </div>
  );
}

export default function ProblemStatement() {
  const [active, setActive] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [fadeWord, setFadeWord] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setFadeWord(false);
      setTimeout(() => { setWordIndex((i) => (i + 1) % words.length); setFadeWord(true); }, 350);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');

        .ps *, .ps *::before, .ps *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ps {
          font-family: 'Sora', sans-serif;
          background: #ffffff;
          width: 100%;
          padding: 100px 32px 100px;
          position: relative;
          overflow: hidden;
        }

        /* Rainbow top connector */
        .ps-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 5px;
          background: linear-gradient(90deg, #4ecdc4, #52b788, #f4a261, #ff8fab, #c77dff, #4ecdc4);
          background-size: 300% 100%;
          animation: ps-shimmer 5s linear infinite;
        }
        @keyframes ps-shimmer { to { background-position: 300% 0%; } }

        /* Subtle dot grid */
        .ps-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(#dde3ed 1.5px, transparent 1.5px);
          background-size: 28px 28px;
          opacity: 0.6;
        }

        /* Colored blob accents */
        .ps-blob {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
        }

        .ps-wrap {
          max-width: 1200px; margin: 0 auto;
          position: relative; z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: start;
        }
        @media (max-width: 920px) {
          .ps-wrap { grid-template-columns: 1fr; gap: 60px; }
        }

        /* ─── LEFT ─── */
        .ps-left {}

        .ps-tag {
          display: inline-flex; align-items: center; gap: 10px;
          background: #fff2f5;
          border: 1.5px solid #ffcdd8;
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #ff8fab;
          margin-bottom: 28px;
          opacity: 0; transform: translateY(12px);
          transition: all 0.5s ease 0.1s;
        }
        .ps-tag.on { opacity: 1; transform: translateY(0); }
        .ps-tag-dot { width: 7px; height: 7px; border-radius: 50%; background: #ff8fab; }

        .ps-h2 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(34px, 4vw, 54px);
          font-weight: 800;
          line-height: 1.12;
          color: #0d1b2a;
          margin-bottom: 22px;
          letter-spacing: -0.02em;
          opacity: 0; transform: translateY(18px);
          transition: all 0.75s cubic-bezier(0.16,1,0.3,1) 0.2s;
        }
        .ps-h2.on { opacity: 1; transform: translateY(0); }

        .ps-word {
          display: inline-block;
          font-style: italic; font-weight: 800;
          transition: opacity 0.3s ease, transform 0.3s ease, color 0.3s ease;
        }
        .ps-word.fade { opacity: 0; transform: translateY(8px); }
        .ps-word.show { opacity: 1; transform: translateY(0); }

        .ps-body {
          font-size: 16px; font-weight: 400;
          color: #4a5568; line-height: 1.85;
          margin-bottom: 36px;
          opacity: 0; transform: translateY(12px);
          transition: all 0.7s ease 0.35s;
        }
        .ps-body.on { opacity: 1; transform: translateY(0); }

        /* Color strip */
        .ps-strip {
          display: flex; gap: 0; border-radius: 100px;
          overflow: hidden; width: 200px; height: 6px;
          margin-bottom: 36px;
          opacity: 0; transition: opacity 0.5s ease 0.5s;
        }
        .ps-strip.on { opacity: 1; }
        .ps-strip-seg { flex: 1; }

        /* Quote */
        .ps-q {
          background: linear-gradient(135deg, #fffbf5, #fff5f0);
          border-left: 5px solid #f4a261;
          border-radius: 0 20px 20px 0;
          padding: 24px 28px;
          margin-bottom: 40px;
          opacity: 0; transform: translateY(14px);
          transition: all 0.7s ease 0.6s;
        }
        .ps-q.on { opacity: 1; transform: translateY(0); }
        .ps-q-text {
          font-family: 'Sora', sans-serif;
          font-size: 15px; font-style: italic; font-weight: 400;
          color: #334155; line-height: 1.8; margin-bottom: 12px;
        }
        .ps-q-attr {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase; color: #f4a261;
        }

        /* Buttons */
        .ps-actions {
          display: flex; gap: 14px; flex-wrap: wrap; align-items: center;
          opacity: 0; transform: translateY(12px);
          transition: all 0.7s ease 0.75s;
        }
        .ps-actions.on { opacity: 1; transform: translateY(0); }
        .ps-btn {
          padding: 15px 38px; border-radius: 100px;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: 0.02em;
          color: #fff;
          background: linear-gradient(135deg, #4ecdc4, #2a9d8f);
          border: none; cursor: pointer;
          box-shadow: 0 6px 24px rgba(78,205,196,0.4);
          transition: all 0.3s ease;
        }
        .ps-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(78,205,196,0.55); }
        .ps-link {
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 600; color: #94a3b8;
          cursor: pointer; transition: color 0.2s;
          text-decoration: none;
          display: flex; align-items: center; gap: 6px;
        }
        .ps-link:hover { color: #4ecdc4; }

        /* ─── RIGHT ─── */
        .ps-right {
          display: flex; flex-direction: column; gap: 14px;
          opacity: 0; transform: translateX(24px);
          transition: all 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s;
        }
        .ps-right.on { opacity: 1; transform: translateX(0); }

        .ps-right-hd {
          font-family: 'Sora', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #b0bcc8; margin-bottom: 6px;
          display: flex; align-items: center; gap: 12px;
        }
        .ps-right-hd-line { flex: 1; height: 1.5px; background: #eff2f7; }

        @media (max-width: 640px) {
          .ps { padding: 72px 20px; }
        }
      `}</style>

      <section className="ps" ref={ref}>
        <div className="ps-bar" />
        <div className="ps-dots" />
        <div className="ps-blob" style={{ width: 400, height: 400, background: "rgba(78,205,196,0.08)", top: -80, right: -60 }} />
        <div className="ps-blob" style={{ width: 350, height: 350, background: "rgba(244,162,97,0.07)", bottom: -60, left: 100 }} />
        <div className="ps-blob" style={{ width: 250, height: 250, background: "rgba(199,125,255,0.05)", top: "50%", left: "45%" }} />

        <div className="ps-wrap">

          {/* ── LEFT ── */}
          <div className="ps-left">

            <div className={`ps-tag ${active ? "on" : ""}`}>
              <div className="ps-tag-dot" />
              The Reality We Face
            </div>

            <h2 className={`ps-h2 ${active ? "on" : ""}`}>
              Too many people
              <br />suffer{" "}
              <span className={`ps-word ${fadeWord ? "show" : "fade"}`} style={{ color: wordColors[wordIndex] }}>
                {words[wordIndex]}
              </span>
            </h2>

            <p className={`ps-body ${active ? "on" : ""}`}>
              In Rwanda, the barriers to mental health and abuse support go far beyond
              distance. They are rooted in culture, stigma, and systemic neglect.
              Millions are left without a voice — and without hope.
              <br /><br />
              <strong style={{ color: "#0d1b2a", fontWeight: 700 }}>YourVoice HUB</strong> is here to change that.
            </p>

            {/* Brand color strip */}
            <div className={`ps-strip ${active ? "on" : ""}`}>
              {["#4ecdc4", "#ff8fab", "#f4a261", "#c77dff", "#52b788"].map((c) => (
                <div key={c} className="ps-strip-seg" style={{ background: c }} />
              ))}
            </div>

            <div className={`ps-q ${active ? "on" : ""}`}>
              <p className="ps-q-text">
                "Behind every statistic is a mother who stayed silent, a child with nowhere
                to turn, a survivor who never knew help existed."
              </p>
              <cite className="ps-q-attr">— YourVoice HUB · Digital Social Innovators</cite>
            </div>

            <div className={`ps-actions ${active ? "on" : ""}`}>
              <button className="ps-btn">Get Support Now</button>
              <a className="ps-link">Learn how it works →</a>
            </div>

          </div>

          {/* ── RIGHT ── */}
          <div className={`ps-right ${active ? "on" : ""}`}>
            <div className="ps-right-hd">
              Key Statistics
              <div className="ps-right-hd-line" />
            </div>

            {problems.map((p, i) => (
              <StatCard key={p.label} problem={p} index={i} active={active} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}