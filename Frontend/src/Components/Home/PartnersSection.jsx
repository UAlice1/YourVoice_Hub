import { FONT, TEAL, DARK } from "../../constants/styles.js";
import { PARTNERS } from "../../constants/data";

export default function PartnersSection() {
  return (
    <section style={{ background: "#f7fdfb", borderTop: "1px solid #e4f2ee", borderBottom: "1px solid #e4f2ee", padding: "60px 40px", textAlign: "center" }}>
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: DARK, fontFamily: "'Playfair Display', serif", margin: "0 0 28px" }}>Trusted by Partners Across Rwanda</h2>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
        {PARTNERS.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4a6360", fontFamily: FONT, fontSize: "14px", fontWeight: 500 }}>
            <span style={{ color: TEAL }}>{p.icon}</span>{p.name}
          </div>
        ))}
      </div>
    </section>
  );
}
