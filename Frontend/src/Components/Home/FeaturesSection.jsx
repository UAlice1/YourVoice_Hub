import { FONT, SERIF, TEAL, DARK, MUTED } from "../../constants/styles";
import { FEATURES } from "../../constants/data";

export default function FeaturesSection() {
  return (
    <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 80px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
      {FEATURES.map((f, i) => (
        <div key={i} style={{ background: "white", borderRadius: "16px", padding: "32px 28px", border: "1px solid #e8f2f0", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", transition: "transform 0.25s, box-shadow 0.25s", animation: `fadeInUp 0.6s ease ${0.1 * i}s both` }}
          onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: f.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "16px" }}>{f.icon}</div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: DARK, margin: "0 0 10px", fontFamily: SERIF }}>{f.title}</h3>
          <p style={{ fontSize: "13px", color: MUTED, lineHeight: 1.65, margin: 0, fontFamily: FONT }}>{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
