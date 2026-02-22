import { FONT, SERIF, TEAL, DARK } from "../../constants/styles";
import HeroIllustration from "./HeroIllustration";
import FeaturesSection from "./FeaturesSection";
import PartnersSection from "./PartnersSection";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "120px 40px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
        <div style={{ animation: "fadeInUp 0.8s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#e8f8f5", borderRadius: "20px", padding: "6px 14px", marginBottom: "24px" }}>
            <span style={{ color: TEAL, fontSize: "10px" }}>●</span>
            <span style={{ fontSize: "12px", color: TEAL, fontWeight: 600, fontFamily: FONT, letterSpacing: "0.5px" }}>Safe, Confidential, & Inclusive</span>
          </div>
          <h1 style={{ fontSize: "52px", lineHeight: 1.15, fontFamily: SERIF, color: DARK, margin: "0 0 16px", fontWeight: 700 }}>
            You Are Not Alone.{" "}<span style={{ color: TEAL }}>We Are Here To Listen.</span>
          </h1>
          <p style={{ fontSize: "15px", color: "#6a8580", lineHeight: 1.7, fontFamily: FONT, margin: "0 0 36px", maxWidth: "420px" }}>
            YourVoice Hub connects you with immediate AI guidance and professional support, securely report abuse or seek mental health advice without fear.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ background: TEAL, color: "white", border: "none", borderRadius: "10px", padding: "13px 26px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 8px 24px rgba(15,184,160,0.35)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(15,184,160,0.45)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,184,160,0.35)"; }}>
              Get Started <span>→</span>
            </button>
            <button style={{ background: "transparent", color: DARK, border: "2px solid #d0e8e4", borderRadius: "10px", padding: "13px 26px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: FONT, transition: "border-color 0.2s, color 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.color = TEAL; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#d0e8e4"; e.currentTarget.style.color = DARK; }}>
              Try AI Chat
            </button>
          </div>
        </div>
        <div style={{ animation: "fadeInRight 0.9s ease 0.2s both" }}><HeroIllustration /></div>
      </section>

      {/* Features */}
      <FeaturesSection />

      {/* Partners */}
      <PartnersSection />
    </div>
  );
}
