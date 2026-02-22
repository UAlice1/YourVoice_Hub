import { TEAL } from "../../constants/styles";

export default function HeroIllustration() {
  return (
    <div style={{ width: "100%", background: "linear-gradient(135deg, #fff8e7 0%, #e8f8f5 40%, #d4f0ff 100%)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", minHeight: "340px" }}>
      <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "180px", height: "180px", background: "rgba(255,213,120,0.35)", borderRadius: "50%", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", bottom: "20px", left: "30px", width: "120px", height: "120px", background: "rgba(180,230,255,0.4)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "30px", left: "60px", width: "80px", height: "80px", background: "rgba(200,245,220,0.5)", borderRadius: "50%" }} />
      <svg viewBox="0 0 400 280" width="380" height="270" style={{ position: "relative", zIndex: 2 }}>
        <ellipse cx="200" cy="80" rx="22" ry="22" fill="#f4a261" />
        <path d="M178 130 Q200 110 222 130 L230 200 H170 Z" fill="#4ecdc4" />
        <ellipse cx="120" cy="95" rx="18" ry="18" fill="#e76f51" />
        <path d="M102 138 Q120 122 138 138 L145 190 H95 Z" fill="#ff8fab" />
        <ellipse cx="280" cy="90" rx="20" ry="20" fill="#457b9d" />
        <path d="M260 135 Q280 118 300 135 L308 195 H252 Z" fill="#a8dadc" />
        <ellipse cx="60" cy="110" rx="16" ry="16" fill="#6d6875" />
        <path d="M44 148 Q60 135 76 148 L82 195 H38 Z" fill="#c77dff" />
        <ellipse cx="340" cy="105" rx="17" ry="17" fill="#2d6a4f" />
        <path d="M323 145 Q340 130 357 145 L363 195 H317 Z" fill="#52b788" />
        <ellipse cx="155" cy="115" rx="19" ry="19" fill="#e9c46a" />
        <path d="M136 158 Q155 142 174 158 L181 210 H129 Z" fill="#f4a261" />
        <ellipse cx="248" cy="112" rx="18" ry="18" fill="#264653" />
        <path d="M230 153 Q248 138 266 153 L272 205 H224 Z" fill="#2a9d8f" />
        <line x1="120" y1="130" x2="155" y2="135" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="200" y1="100" x2="155" y2="115" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="200" y1="100" x2="248" y2="112" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="280" y1="110" x2="248" y2="112" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.4" />
        <text x="196" y="85" fontSize="14" textAnchor="middle" fill="white" fontWeight="bold">♥</text>
      </svg>
    </div>
  );
}
