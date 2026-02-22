// src/Pages/AboutPage.jsx

const brandColors = ["#4ecdc4", "#ff8fab", "#f4a261", "#c77dff", "#52b788"];

const team = [
  {
    name: "Alice Umubyeyi",
    role: "Team Leader & Product Strategist",
    bio: "Passionate about leveraging technology to solve social challenges. Alice drives the vision and partnerships behind YourVoice HUB.",
    color: "#4ecdc4",
    initials: "AU",
  },
  {
    name: "Faycal Gitego",
    role: "Full Stack Developer",
    bio: "Architect of the platform's backend and AI integration. Faycal ensures every feature is secure, scalable, and reliable.",
    color: "#f4a261",
    initials: "FG",
  },
  {
    name: "Florence Kubwimana",
    role: "UI/UX Designer",
    bio: "Florence crafts every pixel with empathy — designing inclusive, accessible experiences for all users regardless of ability.",
    color: "#ff8fab",
    initials: "FK",
  },
  {
    name: "Judson Mutabazi",
    role: "AI & Data Engineer",
    bio: "Building the NLP models that power AI guidance. Judson ensures the AI responds with care, accuracy, and cultural sensitivity.",
    color: "#c77dff",
    initials: "JM",
  },
];

const impact = [
  { value: "100K+", label: "Projected Users",  color: "#4ecdc4" },
  { value: "10+",   label: "NGO Partners",     color: "#ff8fab" },
  { value: "80%",   label: "AI Coverage",      color: "#f4a261" },
  { value: "24/7",  label: "Availability",     color: "#c77dff" },
];

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');

        .ab *, .ab *::before, .ab *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .ab { font-family: 'Sora', sans-serif; }

        /* ── Shared tag pill ── */
        .ab-tag {
          display: inline-flex; align-items: center; gap: 8px;
          border-radius: 100px; padding: 7px 18px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          margin-bottom: 22px;
        }
        .ab-tag-dot { width: 6px; height: 6px; border-radius: 50%; }

        @keyframes ab-shimmer { to { background-position: 300% 0; } }
        @keyframes ab-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(78,205,196,0.5); }
          50%      { box-shadow: 0 0 0 5px rgba(78,205,196,0); }
        }

        /* ════════════════════════════════
           1. HERO — dark
        ════════════════════════════════ */
        .ab-hero {
          background: #060e10;
          padding: 130px 32px 110px;
          position: relative; overflow: hidden;
          text-align: center;
        }
        .ab-hero-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #4ecdc4,#52b788,#f4a261,#ff8fab,#c77dff,#4ecdc4);
          background-size: 300% 100%;
          animation: ab-shimmer 5s linear infinite;
        }
        .ab-hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(78,205,196,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78,205,196,0.03) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .ab-hero-glow {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
        }
        .ab-hero-inner {
          max-width: 780px; margin: 0 auto; position: relative; z-index: 2;
        }
        .ab-hero-tag {
          background: rgba(78,205,196,0.08);
          border: 1px solid rgba(78,205,196,0.25); color: #4ecdc4;
        }
        .ab-hero-tag .ab-tag-dot {
          background: #4ecdc4;
          animation: ab-pulse 2s ease-in-out infinite;
        }
        .ab-hero-h1 {
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 800; color: #f1f5f9;
          line-height: 1.08; letter-spacing: -0.025em;
          margin-bottom: 22px;
        }
        .ab-hero-h1 span {
          color: transparent;
          -webkit-text-stroke: 1.5px #4ecdc4;
          font-style: italic;
        }
        .ab-hero-sub {
          font-size: clamp(15px, 1.8vw, 18px);
          font-weight: 300; color: #64748b; line-height: 1.85;
          max-width: 580px; margin: 0 auto 40px;
        }
        .ab-hero-strip {
          display: flex; justify-content: center;
          border-radius: 100px; overflow: hidden;
          width: 160px; height: 5px; margin: 0 auto;
        }
        .ab-hero-strip-seg { flex: 1; }

        /* ════════════════════════════════
           2. STORY + NUMBERS — white, two-column
        ════════════════════════════════ */
        .ab-story {
          background: #ffffff;
          padding: 100px 32px;
        }
        .ab-story-inner {
          max-width: 1160px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        @media (max-width: 860px) {
          .ab-story-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        /* Left: impact numbers mini-grid */
        .ab-story-numbers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .ab-story-stat {
          background: #f8fafb;
          border: 2px solid #eff2f7;
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
        }
        .ab-story-stat:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.07);
          border-color: transparent;
        }
        .ab-story-stat-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          border-radius: 20px 20px 0 0;
        }
        .ab-story-stat-val {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 800;
          line-height: 1;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .ab-story-stat-lbl {
          font-size: 12px;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Right: story text */
        .ab-story-text {}
        .ab-story-tag {
          background: #fff2f5;
          border: 1.5px solid #ffcdd8; color: #ff8fab;
        }
        .ab-story-tag .ab-tag-dot { background: #ff8fab; }
        .ab-story-h2 {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 800; color: #0d1b2a;
          line-height: 1.12; letter-spacing: -0.02em;
          margin-bottom: 24px;
        }
        .ab-story-h2 em { font-style: italic; color: #ff8fab; }
        .ab-story-p {
          font-size: 15px; font-weight: 300;
          color: #475569; line-height: 1.9;
          margin-bottom: 18px;
        }
        .ab-story-p strong { font-weight: 700; color: #0d1b2a; }

        /* ════════════════════════════════
           3. MISSION & VISION — dark
        ════════════════════════════════ */
        .ab-mv {
          background: #0d1b2a;
          padding: 100px 32px;
          position: relative; overflow: hidden;
        }
        .ab-mv::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(78,205,196,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78,205,196,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .ab-mv-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 2; }
        .ab-mv-top { text-align: center; margin-bottom: 64px; }
        .ab-mv-tag {
          background: rgba(82,183,136,0.1);
          border: 1px solid rgba(82,183,136,0.25); color: #52b788;
        }
        .ab-mv-tag .ab-tag-dot { background: #52b788; }
        .ab-mv-h2 {
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 800; color: #f1f5f9;
          letter-spacing: -0.02em; line-height: 1.1;
          margin-bottom: 12px;
        }
        .ab-mv-h2-sub {
          font-size: 15px; font-weight: 300;
          color: #475569; line-height: 1.8;
        }
        .ab-mv-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }
        @media (max-width: 720px) { .ab-mv-cards { grid-template-columns: 1fr; } }
        .ab-mv-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 52px 48px;
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .ab-mv-card:hover {
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-3px);
        }
        .ab-mv-card-glow {
          position: absolute;
          top: -60px; left: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          opacity: 0.15;
        }
        .ab-mv-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          border-radius: 28px 28px 0 0;
        }
        .ab-mv-card-badge {
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 56px; height: 56px;
          border-radius: 16px;
          font-size: 26px;
          margin-bottom: 28px;
        }
        .ab-mv-card-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .ab-mv-card-title {
          font-size: clamp(18px, 2.2vw, 24px);
          font-weight: 800; color: #f1f5f9;
          letter-spacing: -0.015em;
          line-height: 1.25;
          margin-bottom: 18px;
        }
        .ab-mv-card-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin-bottom: 18px;
          border: none;
        }
        .ab-mv-card-p {
          font-size: 14px; font-weight: 300;
          color: #8094aa;
          line-height: 1.9;
        }

        /* ════════════════════════════════
           4. TEAM — white
        ════════════════════════════════ */
        .ab-team {
          background: #ffffff;
          padding: 100px 32px;
        }
        .ab-team-inner { max-width: 1160px; margin: 0 auto; }
        .ab-team-top { text-align: center; margin-bottom: 56px; }
        .ab-team-tag {
          background: rgba(244,162,97,0.08);
          border: 1px solid rgba(244,162,97,0.25); color: #f4a261;
        }
        .ab-team-tag .ab-tag-dot { background: #f4a261; }
        .ab-team-h2 {
          font-size: clamp(30px, 4vw, 52px);
          font-weight: 800; color: #0d1b2a;
          letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 12px;
        }
        .ab-team-sub {
          font-size: 15px; font-weight: 300;
          color: #64748b; max-width: 500px; margin: 0 auto; line-height: 1.8;
        }
        .ab-team-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
        }
        @media (max-width: 900px) { .ab-team-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 500px) { .ab-team-grid { grid-template-columns: 1fr; } }
        .ab-team-card {
          background: #f8fafb;
          border: 2px solid #eff2f7;
          border-radius: 22px; padding: 32px 24px;
          text-align: center;
          transition: all 0.25s ease;
          position: relative; overflow: hidden;
        }
        .ab-team-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.08);
          border-color: transparent;
        }
        .ab-team-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          border-radius: 22px 22px 0 0; opacity: 0.5;
          transition: opacity 0.25s ease;
        }
        .ab-team-card:hover .ab-team-card-bar { opacity: 1; }
        .ab-team-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 800; color: #fff;
          margin: 0 auto 18px;
        }
        .ab-team-name {
          font-size: 15px; font-weight: 700;
          color: #0d1b2a; margin-bottom: 5px;
        }
        .ab-team-role {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .ab-team-bio {
          font-size: 12px; font-weight: 300;
          color: #64748b; line-height: 1.75;
        }

        /* ════════════════════════════════
           5. IMPACT + CTA — dark
        ════════════════════════════════ */
        .ab-impact {
          background: #060e10;
          padding: 100px 32px;
          position: relative; overflow: hidden;
        }
        .ab-impact-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(78,205,196,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78,205,196,0.025) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .ab-impact-glow {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
        }
        .ab-impact-inner { max-width: 1160px; margin: 0 auto; position: relative; z-index: 2; }
        .ab-impact-top { text-align: center; margin-bottom: 56px; }
        .ab-impact-tag {
          background: rgba(78,205,196,0.07);
          border: 1.5px solid rgba(78,205,196,0.2); color: #4ecdc4;
        }
        .ab-impact-tag .ab-tag-dot { background: #4ecdc4; }
        .ab-impact-h2 {
          font-size: clamp(30px, 4vw, 52px);
          font-weight: 800; color: #f1f5f9;
          letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 14px;
        }
        .ab-impact-sub {
          font-size: 15px; font-weight: 300;
          color: #475569; max-width: 500px; margin: 0 auto; line-height: 1.8;
        }
        .ab-impact-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 20px; margin-bottom: 72px;
        }
        @media (max-width: 800px) { .ab-impact-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 440px) { .ab-impact-grid { grid-template-columns: 1fr; } }
        .ab-impact-card {
          background: rgba(255,255,255,0.03);
          border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 22px; padding: 40px 24px;
          text-align: center; position: relative; overflow: hidden;
          transition: all 0.25s ease;
        }
        .ab-impact-card:hover {
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-4px);
        }
        .ab-impact-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
        }
        .ab-impact-val {
          font-size: clamp(40px, 5vw, 60px);
          font-weight: 800; line-height: 1;
          margin-bottom: 8px; letter-spacing: -0.02em;
        }
        .ab-impact-lbl {
          font-size: 13px; font-weight: 500;
          color: #475569; letter-spacing: 0.04em;
        }

        /* CTA box */
        .ab-cta {
          background: linear-gradient(135deg, #0d1b2a, #162032);
          border: 1.5px solid rgba(78,205,196,0.18);
          border-radius: 28px; padding: 64px 48px;
          text-align: center; max-width: 700px; margin: 0 auto;
          position: relative; overflow: hidden;
        }
        .ab-cta-glow {
          position: absolute; top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 350px; height: 350px; border-radius: 50%;
          background: radial-gradient(circle, rgba(78,205,196,0.1), transparent 70%);
          pointer-events: none;
        }
        .ab-cta-h3 {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800; color: #f1f5f9;
          letter-spacing: -0.02em; line-height: 1.2;
          margin-bottom: 14px; position: relative; z-index: 1;
        }
        .ab-cta-h3 span { color: #4ecdc4; font-style: italic; }
        .ab-cta-p {
          font-size: 15px; font-weight: 300;
          color: #64748b; line-height: 1.8;
          margin-bottom: 36px; position: relative; z-index: 1;
          max-width: 480px; margin-left: auto; margin-right: auto;
        }
        .ab-cta-btns {
          display: flex; gap: 14px; justify-content: center;
          flex-wrap: wrap; position: relative; z-index: 1;
        }
        .ab-btn-primary {
          padding: 15px 42px; border-radius: 100px;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #060e10;
          background: linear-gradient(135deg, #4ecdc4, #2a9d8f);
          border: none; cursor: pointer;
          box-shadow: 0 6px 28px rgba(78,205,196,0.4);
          transition: all 0.3s ease;
        }
        .ab-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(78,205,196,0.55);
        }
        .ab-btn-secondary {
          padding: 14px 38px; border-radius: 100px;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 600;
          color: #4ecdc4; background: transparent;
          border: 1.5px solid rgba(78,205,196,0.3);
          cursor: pointer; transition: all 0.3s ease;
        }
        .ab-btn-secondary:hover {
          border-color: rgba(78,205,196,0.6);
          background: rgba(78,205,196,0.06);
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .ab-hero  { padding: 100px 20px 80px; }
          .ab-story, .ab-mv, .ab-team, .ab-impact { padding: 72px 20px; }
          .ab-cta   { padding: 40px 24px; }
          .ab-mv-card { padding: 36px 28px; }
        }
      `}</style>

      <div className="ab">

        {/* ════ 1. HERO ════ */}
        <section className="ab-hero">
          <div className="ab-hero-bar" />
          <div className="ab-hero-grid" />
          <div className="ab-hero-glow" style={{ width: 500, height: 500, background: "rgba(78,205,196,0.07)", top: -120, left: "50%", transform: "translateX(-50%)" }} />
          <div className="ab-hero-glow" style={{ width: 280, height: 280, background: "rgba(244,162,97,0.05)", bottom: -60, right: -60 }} />

          <div className="ab-hero-inner">
            <div className="ab-tag ab-hero-tag">
              <div className="ab-tag-dot" />
              Who We Are
            </div>
            <h1 className="ab-hero-h1">
              Built with purpose.<br />
              Driven by <span>compassion.</span>
            </h1>
            <p className="ab-hero-sub">
              YourVoice HUB is more than a platform — it's a movement. We are a team
              of young Rwandan innovators committed to making mental health support
              and abuse reporting safe, accessible, and human.
            </p>
            <div className="ab-hero-strip">
              {brandColors.map((c) => (
                <div key={c} className="ab-hero-strip-seg" style={{ background: c }} />
              ))}
            </div>
          </div>
        </section>

        {/* ════ 2. STORY — left: numbers, right: text ════ */}
        <section className="ab-story">
          <div className="ab-story-inner">

            {/* LEFT: Impact Numbers */}
            <div className="ab-story-numbers">
              {impact.map((m) => (
                <div key={m.label} className="ab-story-stat">
                  <div
                    className="ab-story-stat-bar"
                    style={{ background: `linear-gradient(90deg, ${m.color}, transparent)` }}
                  />
                  <div className="ab-story-stat-val" style={{ color: m.color }}>
                    {m.value}
                  </div>
                  <div className="ab-story-stat-lbl">{m.label}</div>
                </div>
              ))}
            </div>

            {/* RIGHT: Story Text */}
            <div className="ab-story-text">
              <div className="ab-tag ab-story-tag">
                <div className="ab-tag-dot" />
                Our Story
              </div>
              <h2 className="ab-story-h2">
                We saw the gap.<br />
                We decided to <em>fill it.</em>
              </h2>
              <p className="ab-story-p">
                Growing up in Rwanda, we witnessed first-hand how mental health struggles
                and gender-based violence destroyed lives — not because help didn't exist,
                but because <strong>people couldn't reach it.</strong>
              </p>
              <p className="ab-story-p">
                The stigma was deafening. Rural communities had no access. Survivors feared
                judgment. People with disabilities were completely forgotten. We asked ourselves:
                what if technology could close this gap?
              </p>
              <p className="ab-story-p">
                <strong>YourVoice HUB was born from that question.</strong> Four students, one mission —
                to ensure that every Rwandan, regardless of location, ability, or background,
                has a safe place to speak, be heard, and get help.
              </p>
            </div>

          </div>
        </section>

        {/* ════ 3. MISSION & VISION ════ */}
        <section className="ab-mv">
          <div className="ab-mv-inner">

            <div className="ab-mv-top">
              <div className="ab-tag ab-mv-tag">
                <div className="ab-tag-dot" />
                Mission &amp; Vision
              </div>
              <h2 className="ab-mv-h2">What we stand for</h2>
              <p className="ab-mv-h2-sub">Two guiding principles. One shared purpose.</p>
            </div>

            <div className="ab-mv-cards">

              {/* Mission Card */}
              <div className="ab-mv-card">
                <div className="ab-mv-card-bar" style={{ background: "linear-gradient(90deg, #4ecdc4, transparent)" }} />
                <div className="ab-mv-card-glow" style={{ background: "#4ecdc4" }} />
                <div className="ab-mv-card-badge" style={{ background: "rgba(78,205,196,0.1)" }}>
                  🎯
                </div>
                <div className="ab-mv-card-label" style={{ color: "#4ecdc4" }}>
                  Our Mission
                  <span style={{ display: "inline-block", height: 1, width: 36, background: "#4ecdc4", opacity: 0.3 }} />
                </div>
                <div className="ab-mv-card-title">
                  Make support accessible to every Rwandan
                </div>
                <hr className="ab-mv-card-divider" />
                <p className="ab-mv-card-p">
                  To provide a safe, AI-powered digital platform that offers immediate mental health
                  guidance, secure abuse reporting, and direct connection to NGOs and professionals —
                  for every individual, regardless of location, income, language, or ability.
                </p>
              </div>

              {/* Vision Card */}
              <div className="ab-mv-card">
                <div className="ab-mv-card-bar" style={{ background: "linear-gradient(90deg, #f4a261, transparent)" }} />
                <div className="ab-mv-card-glow" style={{ background: "#f4a261" }} />
                <div className="ab-mv-card-badge" style={{ background: "rgba(244,162,97,0.1)" }}>
                  🌅
                </div>
                <div className="ab-mv-card-label" style={{ color: "#f4a261" }}>
                  Our Vision
                  <span style={{ display: "inline-block", height: 1, width: 36, background: "#f4a261", opacity: 0.3 }} />
                </div>
                <div className="ab-mv-card-title">
                  A Rwanda where no one suffers in silence
                </div>
                <hr className="ab-mv-card-divider" />
                <p className="ab-mv-card-p">
                  We envision a Rwanda — and ultimately an Africa — where mental health stigma
                  is dismantled, where every survivor finds support, and where technology serves
                  humanity's most vulnerable with dignity and care.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ════ 4. TEAM ════ */}
        <section className="ab-team">
          <div className="ab-team-inner">
            <div className="ab-team-top">
              <div className="ab-tag ab-team-tag">
                <div className="ab-tag-dot" />
                The Team
              </div>
              <h2 className="ab-team-h2">The people behind the platform</h2>
              <p className="ab-team-sub">
                Four passionate Rwandan students from the Digital Social Innovators —
                united by one mission.
              </p>
            </div>

            <div className="ab-team-grid">
              {team.map((m) => (
                <div key={m.name} className="ab-team-card">
                  <div className="ab-team-card-bar" style={{ background: `linear-gradient(90deg, ${m.color}, transparent)` }} />
                  <div className="ab-team-avatar" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}99)` }}>
                    {m.initials}
                  </div>
                  <div className="ab-team-name">{m.name}</div>
                  <div className="ab-team-role" style={{ color: m.color }}>{m.role}</div>
                  <div className="ab-team-bio">{m.bio}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      

      </div>
    </>
  );
}