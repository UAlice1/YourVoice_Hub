// src/Components/Home/About.tsx

import aliceImg    from "../../assets/images/alice.png";
import gitegoImg   from "../../assets/images/gitego.png";
import florenceImg from "../../assets/images/florence.png";
import judsonImg   from "../../assets/images/judson.png";

const PRIMARY   = "#2dd4bf";   // teal accent — single accent color
const DARK      = "#0a1628";   // rich navy dark
const DARK2     = "#0f1f38";   // slightly lighter navy


const team = [
  {
    name: "Alice Umubyeyi",
    role: "Team Leader & Product Strategist",
    bio: "Passionate about leveraging technology to solve social challenges. Alice drives the vision and partnerships behind YourVoice HUB.",
    initials: "AU",
    photo: aliceImg,
  },
  {
    name: "Faycal Gitego",
    role: "Full Stack Developer",
    bio: "Architect of the platform's backend and AI integration. Faycal ensures every feature is secure, scalable, and reliable.",
    initials: "FG",
    photo: gitegoImg,
  },
  {
    name: "Florence Kubwimana",
    role: "UI/UX Designer",
    bio: "Florence crafts every pixel with empathy — designing inclusive, accessible experiences for all users regardless of ability.",
    initials: "FK",
    photo: florenceImg,
  },
  {
    name: "Judson Mutabazi",
    role: "AI & Data Engineer",
    bio: "Building the NLP models that power AI guidance. Judson ensures the AI responds with care, accuracy, and cultural sensitivity.",
    initials: "JM",
    photo: judsonImg,
  },
];

const impact = [
  { value: "100K+", label: "Projected Users"  },
  { value: "10+",   label: "NGO Partners"     },
  { value: "80%",   label: "AI Coverage"      },
  { value: "24/7",  label: "Availability"     },
];

const features = [
  {
    icon: "🤖",
    title: "AI Guidance",
    body: "Virtual psychologist covering ~80% of initial user needs with NLP-powered mental health support.",
  },
  {
    icon: "🔒",
    title: "Secure Case Submission",
    body: "Submit text, audio, photos, or documents confidentially with end-to-end encryption.",
  },
  {
    icon: "🏥",
    title: "Direct Referral System",
    body: "Automatically routes urgent cases to Isange One Stop Center and NGO partners for timely intervention.",
  },
  {
    icon: "♿",
    title: "Inclusive Access",
    body: "Designed for persons with disabilities, rural communities, and low-literacy users across Rwanda.",
  },
];

const stack = [
  "React.js Frontend",
  "Java Spring Boot",
  "Python NLP / AI",
  "PostgreSQL",
  "JWT + Encryption",
  "AWS Hosted",
];

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        .ab *, .ab *::before, .ab *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .ab { font-family: 'DM Sans', sans-serif; color: #0a1628; }

        /* ─── Shared utilities ─── */
        .ab-label {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: ${PRIMARY};
          margin-bottom: 18px;
        }
        .ab-label::before {
          content: ''; display: block;
          width: 24px; height: 2px;
          background: ${PRIMARY};
          border-radius: 2px;
        }

        .ab-section-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(30px, 4vw, 50px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        /* ─── HERO ─── */
        .ab-hero {
          background: ${DARK};
          padding: 100px 32px 90px;
          position: relative;
          overflow: hidden;
        }
        .ab-hero-noise {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        .ab-hero-glow {
          position: absolute; border-radius: 50%;
          background: ${PRIMARY};
          filter: blur(140px);
          opacity: 0.07;
          pointer-events: none;
        }

        /* top accent line */
        .ab-hero::after {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent, ${PRIMARY}, transparent);
        }

        .ab-hero-inner {
          position: relative; z-index: 2;
          max-width: 1160px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 64px; align-items: center;
        }
        @media (max-width: 860px) {
          .ab-hero-inner { grid-template-columns: 1fr; gap: 48px; }
        }

        .ab-hero-h1 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(36px, 5vw, 62px);
          font-weight: 800;
          color: #f1f5f9;
          line-height: 1.08;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .ab-hero-h1 em { font-style: italic; color: ${PRIMARY}; }

        .ab-hero-sub {
          font-size: 15px; font-weight: 300;
          color: #7a91ac; line-height: 1.9;
          margin-bottom: 32px;
          max-width: 480px;
        }

        /* stack pills */
        .ab-stack { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 40px; }
        .ab-stack-pill {
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 11px; font-weight: 500;
          color: #9eb8c9;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          transition: border-color 0.2s, color 0.2s;
        }
        .ab-stack-pill:hover { border-color: ${PRIMARY}55; color: ${PRIMARY}; }

        /* stats row */
        .ab-hero-stats { display: flex; flex-wrap: wrap; gap: 0; }
        .ab-stat { display: flex; flex-direction: column; padding-right: 28px; }
        .ab-stat + .ab-stat { padding-left: 28px; border-left: 1px solid rgba(255,255,255,0.08); }
        .ab-stat-val {
          font-family: 'Sora', sans-serif;
          font-size: 30px; font-weight: 800;
          color: ${PRIMARY}; line-height: 1;
          letter-spacing: -0.02em;
        }
        .ab-stat-lbl {
          font-size: 10px; font-weight: 500;
          color: #3d5a72;
          margin-top: 4px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* right: feature cards */
        .ab-hero-cards { display: flex; flex-direction: column; gap: 12px; }
        .ab-hero-card {
          display: flex; gap: 16px; align-items: flex-start;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px 22px;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
          cursor: default;
        }
        .ab-hero-card:hover {
          border-color: ${PRIMARY}30;
          background: rgba(45,212,191,0.04);
          transform: translateX(4px);
        }
        .ab-hero-card-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: rgba(45,212,191,0.08);
          border: 1px solid rgba(45,212,191,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .ab-hero-card-title {
          font-family: 'Sora', sans-serif;
          font-size: 13.5px; font-weight: 700;
          color: #e2eaf2; margin-bottom: 4px;
        }
        .ab-hero-card-body {
          font-size: 12px; font-weight: 300;
          color: #4d6678; line-height: 1.7;
        }

        /* ─── STORY ─── */
        .ab-story { background: #f7f9fc; padding: 110px 32px; }
        .ab-story-inner {
          max-width: 1160px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        @media (max-width: 860px) { .ab-story-inner { grid-template-columns: 1fr; gap: 48px; } }

        /* stat grid */
        .ab-story-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ab-story-stat {
          border-radius: 20px;
          border: 1.5px solid #e8edf3;
          background: #fff;
          padding: 32px 24px;
          text-align: center;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .ab-story-stat:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(10,22,40,0.08);
          border-color: ${PRIMARY}50;
        }
        .ab-story-stat-val {
          font-family: 'Sora', sans-serif;
          font-size: clamp(34px, 4vw, 46px);
          font-weight: 800;
          color: ${DARK}; line-height: 1;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
        }
        .ab-story-stat-val span { color: ${PRIMARY}; }
        .ab-story-stat-lbl {
          font-size: 11px; font-weight: 600;
          color: #9baab8;
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        .ab-story-h2 { color: ${DARK}; margin-bottom: 22px; }
        .ab-story-h2 em { font-style: italic; color: ${PRIMARY}; }
        .ab-story-p {
          font-size: 15px; color: #5a6e82;
          line-height: 1.9; margin-bottom: 16px;
        }
        .ab-story-p strong { font-weight: 600; color: ${DARK}; }

        /* ─── MISSION & VISION ─── */
        .ab-mv { background: ${DARK}; padding: 110px 32px; position: relative; overflow: hidden; }
        .ab-mv::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(45,212,191,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,212,191,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .ab-mv-inner {
          max-width: 1160px; margin: 0 auto;
          position: relative; z-index: 2;
        }
        .ab-mv-top { text-align: center; margin-bottom: 60px; }
        .ab-mv-h2 { color: #f1f5f9; margin-bottom: 12px; }
        .ab-mv-sub { font-size: 15px; font-weight: 300; color: #3d5a72; line-height: 1.8; }

        .ab-mv-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 700px) { .ab-mv-cards { grid-template-columns: 1fr; } }

        .ab-mv-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 48px 44px;
          position: relative; overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .ab-mv-card:hover { border-color: ${PRIMARY}30; transform: translateY(-3px); }
        .ab-mv-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, ${PRIMARY}, transparent);
        }
        .ab-mv-card-emoji {
          font-size: 28px; margin-bottom: 22px; display: block;
        }
        .ab-mv-card-type {
          font-family: 'Sora', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: ${PRIMARY}; margin-bottom: 10px;
        }
        .ab-mv-card-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(16px, 2vw, 21px);
          font-weight: 800; color: #f1f5f9;
          line-height: 1.25; margin-bottom: 18px;
          letter-spacing: -0.015em;
        }
        .ab-mv-card-divider {
          height: 1px; border: none;
          background: rgba(255,255,255,0.06);
          margin-bottom: 18px;
        }
        .ab-mv-card-p {
          font-size: 14px; font-weight: 300;
          color: #4d6678; line-height: 1.9;
        }

        /* ─── TEAM ─── */
        .ab-team { background: #fff; padding: 110px 32px; }
        .ab-team-inner { max-width: 1160px; margin: 0 auto; }
        .ab-team-top { text-align: center; margin-bottom: 64px; }
        .ab-team-h2 { color: ${DARK}; margin-bottom: 14px; }
        .ab-team-h2 em { font-style: italic; color: ${PRIMARY}; }
        .ab-team-sub {
          font-size: 15px; font-weight: 400;
          color: #64778a; line-height: 1.8;
          max-width: 440px; margin: 0 auto;
        }

        .ab-team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) { .ab-team-grid { grid-template-columns: 1fr 1fr; gap: 16px; } }
        @media (max-width: 520px) { .ab-team-grid { grid-template-columns: 1fr; } }

        .ab-team-card {
          border-radius: 22px;
          border: 1.5px solid #edf0f5;
          background: #fafbfd;
          padding: 36px 20px 28px;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .ab-team-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 24px 56px rgba(10,22,40,0.1);
          border-color: ${PRIMARY}40;
        }

        .ab-team-avatar {
          width: 108px; height: 108px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 20px;
          border: 3px solid ${PRIMARY}40;
          display: flex; align-items: center; justify-content: center;
          background: ${DARK};
          flex-shrink: 0;
        }
        .ab-team-avatar img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          border-radius: 50%; display: block;
        }
        .ab-team-initials {
          font-family: 'Sora', sans-serif;
          font-size: 28px; font-weight: 800;
          color: ${PRIMARY};
        }

        .ab-team-name {
          font-family: 'Sora', sans-serif;
          font-size: 15px; font-weight: 700;
          color: ${DARK}; margin-bottom: 5px;
          letter-spacing: -0.01em;
        }
        .ab-team-role {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: ${PRIMARY}; margin-bottom: 14px;
        }
        .ab-team-sep {
          width: 30px; height: 2px;
          background: ${PRIMARY}50;
          border-radius: 2px;
          margin: 0 auto 14px;
        }
        .ab-team-bio {
          font-size: 12.5px; font-weight: 400;
          color: #6b7f92; line-height: 1.75;
        }

        /* responsive tweaks */
        @media (max-width: 640px) {
          .ab-hero, .ab-story, .ab-mv, .ab-team { padding-left: 20px; padding-right: 20px; }
          .ab-mv-card { padding: 36px 28px; }
        }
      `}</style>

      <div className="ab">

        {/* ══ HERO ══ */}
        <section className="ab-hero">
          <div className="ab-hero-noise" />
          <div className="ab-hero-glow" style={{ width: 600, height: 600, top: -200, left: "5%"  }} />
          <div className="ab-hero-glow" style={{ width: 400, height: 400, bottom: -100, right: "0%" }} />

          <div className="ab-hero-inner">
            {/* Left */}
            <div>
              <div className="ab-label">AI-Powered Inclusive Support Platform</div>
              <h1 className="ab-hero-h1">
                YourVoice HUB —<br />
                where <em>every voice</em><br />
                is heard &amp; helped.
              </h1>
              <p className="ab-hero-sub">
                A web platform connecting individuals facing mental health challenges and
                gender-based violence in Rwanda with AI guidance, secure reporting, and
                direct referral to NGOs — breaking barriers of stigma, distance, and disability.
              </p>

              <div className="ab-stack">
                {stack.map((s) => (
                  <span key={s} className="ab-stack-pill">{s}</span>
                ))}
              </div>

              <div className="ab-hero-stats">
                {impact.map((m) => (
                  <div key={m.label} className="ab-stat">
                    <span className="ab-stat-val">{m.value}</span>
                    <span className="ab-stat-lbl">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="ab-hero-cards">
              {features.map((f) => (
                <div key={f.title} className="ab-hero-card">
                  <div className="ab-hero-card-icon">{f.icon}</div>
                  <div>
                    <div className="ab-hero-card-title">{f.title}</div>
                    <div className="ab-hero-card-body">{f.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STORY ══ */}
        <section className="ab-story">
          <div className="ab-story-inner">
            {/* Stats grid */}
            <div className="ab-story-stats">
              {impact.map((m) => (
                <div key={m.label} className="ab-story-stat">
                  <div className="ab-story-stat-val">
                    <span>{m.value}</span>
                  </div>
                  <div className="ab-story-stat-lbl">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Text */}
            <div>
              <div className="ab-label">Our Story</div>
              <h2 className="ab-section-title ab-story-h2">
                We saw the gap.<br />We decided to <em>fill it.</em>
              </h2>
              <p className="ab-story-p">
                In Rwanda, mental health challenges and gender-based violence are widespread, yet access to
                professional support is limited — especially in rural areas. Survivors face stigma, distance
                barriers, and lack of <strong>confidential channels to seek help.</strong>
              </p>
              <p className="ab-story-p">
                Services like Isange One Stop Center provide critical support, but many individuals cannot
                reach them or hesitate to report abuse due to fear. Rural communities and people with
                disabilities are often completely underserved.
              </p>
              <p className="ab-story-p">
                <strong>YourVoice HUB was built to close that gap.</strong> Four students, one mission —
                AI guidance, secure reporting, and direct NGO connection for every Rwandan,
                regardless of location, ability, or background.
              </p>
            </div>
          </div>
        </section>

        {/* ══ MISSION & VISION ══ */}
        <section className="ab-mv">
          <div className="ab-mv-inner">
            <div className="ab-mv-top">
              <div className="ab-label" style={{ justifyContent: "center" }}>Mission &amp; Vision</div>
              <h2 className="ab-section-title ab-mv-h2">What we stand for</h2>
              <p className="ab-mv-sub">Two guiding principles. One shared purpose.</p>
            </div>
            <div className="ab-mv-cards">
              <div className="ab-mv-card">
                <span className="ab-mv-card-emoji">🎯</span>
                <div className="ab-mv-card-type">Our Mission</div>
                <div className="ab-mv-card-title">
                  Make mental health support accessible to every Rwandan
                </div>
                <hr className="ab-mv-card-divider" />
                <p className="ab-mv-card-p">
                  To provide a safe, AI-powered digital platform offering immediate mental health guidance,
                  secure abuse reporting, and direct connection to NGOs and professionals — for every
                  individual, regardless of location, income, language, or ability.
                </p>
              </div>
              <div className="ab-mv-card">
                <span className="ab-mv-card-emoji">🌅</span>
                <div className="ab-mv-card-type">Our Vision</div>
                <div className="ab-mv-card-title">
                  A Rwanda where no one suffers in silence
                </div>
                <hr className="ab-mv-card-divider" />
                <p className="ab-mv-card-p">
                  We envision a Rwanda — and ultimately an Africa — where mental health stigma is
                  dismantled, every survivor finds support, and technology serves humanity's most
                  vulnerable with dignity, privacy, and care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TEAM ══ */}
        <section className="ab-team">
          <div className="ab-team-inner">
            <div className="ab-team-top">
              <div className="ab-label" style={{ justifyContent: "center" }}>The Team</div>
              <h2 className="ab-section-title ab-team-h2">
                The people behind the <em>platform</em>
              </h2>
              <p className="ab-team-sub">
                Four passionate Rwandan students from Digital Social Innovators —
                united by one goal: to make mental health support accessible to everyone.
              </p>
            </div>
            <div className="ab-team-grid">
              {team.map((m) => (
                <div key={m.name} className="ab-team-card">
                  <div className="ab-team-avatar">
                    <img
                      src={m.photo}
                      alt={m.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fb = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fb) fb.style.display = "flex";
                      }}
                    />
                    <div className="ab-team-initials" style={{ display: "none" }}>
                      {m.initials}
                    </div>
                  </div>
                  <div className="ab-team-name">{m.name}</div>
                  <div className="ab-team-role">{m.role}</div>
                  <div className="ab-team-sep" />
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