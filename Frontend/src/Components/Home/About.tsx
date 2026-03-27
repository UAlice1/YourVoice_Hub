// src/Components/Home/About.tsx

import aliceImg    from "../../assets/images/alice.png";
import gitegoImg   from "../../assets/images/gitego.png";
import florenceImg from "../../assets/images/florence.png";
import judsonImg   from "../../assets/images/judson.png";

const PRIMARY = "#0f4c75";     // Deep teal
const ACCENT  = "#f4c95d";     // Warm gold
const DARK    = "#0a1628";

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
  { value: "100K+", label: "Projected Users" },
  { value: "10+",   label: "NGO Partners" },
  { value: "80%",   label: "AI Coverage" },
  { value: "24/7",  label: "Availability" },
];

const features = [
  { icon: "", title: "AI Guidance", body: "Virtual psychologist covering ~80% of initial user needs with culturally sensitive NLP support." },
  { icon: "", title: "Secure Case Submission", body: "Submit text, audio, photos, or documents confidentially with end-to-end encryption." },
  { icon: "", title: "Direct Referral System", body: "Automatically routes urgent cases to Isange One Stop Center and trusted NGO partners." },
  { icon: "", title: "Inclusive Access", body: "Designed for persons with disabilities, rural communities, and low-literacy users across Rwanda." },
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
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .about * { box-sizing: border-box; margin: 0; padding: 0; }
        .about { font-family: 'Inter', sans-serif; }

        .about-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.25em;
          text-transform: uppercase; color: ${PRIMARY};
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
        }
        .about-label::before {
          content: ''; width: 28px; height: 2px; background: ${ACCENT};
        }

        .about-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(36px, 5vw, 58px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        /* HERO */
        .about-hero {
          background: ${DARK};
          padding: 120px 40px 100px;
          position: relative;
          overflow: hidden;
        }
        .about-hero::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, ${ACCENT}, ${PRIMARY});
        }
        .about-hero-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1.1fr 1fr; gap: 80px; align-items: center;
        }
        @media (max-width: 900px) { .about-hero-inner { grid-template-columns: 1fr; gap: 60px; } }

        .about-hero-h1 {
          color: white; margin-bottom: 24px;
        }
        .about-hero-h1 em { color: ${ACCENT}; font-style: italic; }

        .about-hero-sub {
          font-size: 16px; color: #a0b8d0; line-height: 1.85; max-width: 520px;
        }

        .about-stack {
          display: flex; flex-wrap: wrap; gap: 10px; margin: 40px 0;
        }
        .about-stack-pill {
          padding: 6px 16px; border-radius: 999px;
          font-size: 12px; background: rgba(255,255,255,0.08);
          color: #a0b8d0; border: 1px solid rgba(255,255,255,0.1);
        }

        .about-hero-stats {
          display: flex; gap: 40px; flex-wrap: wrap;
        }
        .about-stat-val {
          font-family: 'Sora', sans-serif;
          font-size: 32px; font-weight: 800; color: ${ACCENT};
        }
        .about-stat-lbl {
          font-size: 11px; font-weight: 600; color: #6b8aa8; text-transform: uppercase;
        }

        /* MISSION & VISION - Inspired by HubSpot */
        .about-mv {
          background: #f8fafd;
          padding: 120px 40px;
        }
        .about-mv-inner {
          max-width: 1200px; margin: 0 auto;
        }
        .about-mv-header {
          text-align: center; margin-bottom: 80px;
        }
        .about-mv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .about-mv-grid { grid-template-columns: 1fr; gap: 50px; }
        }

        .about-mv-image {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(10,22,40,0.12);
        }
        .about-mv-image img {
          width: 100%; height: auto; display: block;
        }

        .about-mv-content h3 {
          font-family: 'Sora', sans-serif;
          font-size: 28px; font-weight: 700; color: ${DARK};
          margin-bottom: 20px;
        }
        .about-mv-content p {
          font-size: 16px; line-height: 1.85; color: #475569;
        }

        /* TEAM - Kept as you liked */
        .about-team {
          background: white;
          padding: 120px 40px;
        }
        .about-team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) { .about-team-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .about-team-grid { grid-template-columns: 1fr; } }

        .about-team-card {
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px 20px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .about-team-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(15,76,117,0.1);
          border-color: ${PRIMARY};
        }
        .about-team-avatar {
          width: 110px; height: 110px;
          border-radius: 50%;
          margin: 0 auto 20px;
          overflow: hidden;
          border: 3px solid ${ACCENT};
        }
        .about-team-avatar img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .about-team-name {
          font-weight: 700; font-size: 15.5px; color: ${DARK};
        }
        .about-team-role {
          font-size: 11px; font-weight: 600; color: ${PRIMARY};
          margin: 6px 0 14px;
        }
        .about-team-bio {
          font-size: 13px; color: #64748b; line-height: 1.7;
        }
      `}</style>

      <div className="about">

        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero-inner">
            <div>
              <div className="about-label">RWANDA'S DIGITAL SUPPORT PLATFORM</div>
              <h1 className="about-title about-hero-h1">
                YourVoice HUB —<br />
                where <em>every voice</em> is heard
              </h1>
              <p className="about-hero-sub">
                Connecting Rwandans facing mental health challenges and gender-based violence 
                with AI guidance, secure reporting, and direct help from trusted partners.
              </p>

              <div className="about-stack">
                {stack.map((item) => (
                  <span key={item} className="about-stack-pill">{item}</span>
                ))}
              </div>

              <div className="about-hero-stats">
                {impact.map((item) => (
                  <div key={item.label}>
                    <div className="about-stat-val">{item.value}</div>
                    <div className="about-stat-lbl">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-hero-cards">
              {features.map((f) => (
                <div key={f.title} style={{
                  display: "flex", gap: "16px", padding: "20px",
                  background: "rgba(255,255,255,0.05)", borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <div style={{ fontSize: "24px" }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "white", marginBottom: "6px" }}>{f.title}</div>
                    <div style={{ fontSize: "14px", color: "#94a3b8" }}>{f.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MISSION & VISION - New Clean Layout */}
        <section className="about-mv">
          <div className="about-mv-inner">
            <div className="about-mv-header">
              <div className="about-label" style={{ justifyContent: "center" }}>OUR PURPOSE</div>
              <h2 className="about-title" style={{ color: DARK, textAlign: "center" }}>
                Building a Rwanda where no one suffers alone
              </h2>
            </div>

            <div className="about-mv-grid">
              {/* Mission */}
              <div>
                <div className="about-mv-image">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Our Mission" 
                  />
                </div>
              </div>
              <div className="about-mv-content">
                <h3>Our Mission</h3>
                <p>
                  To create a safe, accessible, and culturally sensitive platform that provides 
                  immediate AI-powered mental health guidance, confidential reporting for gender-based 
                  violence, and direct connection to professional help and NGOs — for every Rwandan, 
                  no matter where they live or what challenges they face.
                </p>
              </div>

              {/* Vision */}
              <div className="about-mv-content">
                <h3>Our Vision</h3>
                <p>
                  A Rwanda where mental health stigma is broken, every survivor of violence feels safe 
                  to speak up, and people with disabilities or living in rural areas have equal access 
                  to compassionate care. We believe technology should bring hope, dignity, and real support 
                  to those who need it most.
                </p>
              </div>
              <div>
                <div className="about-mv-image">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Our Vision" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM - Unchanged (you liked it) */}
        <section className="about-team">
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center", marginBottom: "70px" }}>
            <div className="about-label" style={{ justifyContent: "center" }}>THE TEAM</div>
            <h2 className="about-title" style={{ color: DARK }}>
              Meet Our Team
            </h2>
            <p style={{ maxWidth: "480px", margin: "20px auto 0", color: "#64748b", fontSize: "15px" }}>
              Four passionate Rwandan students united by one goal: making mental health and abuse support accessible to everyone.
            </p>
          </div>

          <div className="about-team-grid">
            {team.map((member) => (
              <div key={member.name} className="about-team-card">
                <div className="about-team-avatar">
                  <img src={member.photo} alt={member.name} />
                </div>
                <div className="about-team-name">{member.name}</div>
                <div className="about-team-role">{member.role}</div>
                <div className="about-team-bio">{member.bio}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}