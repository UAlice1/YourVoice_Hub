const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const navLinks = {
  Platform: ["AI Guidance", "Secure Reporting", "Case Submission", "NGO Dashboard"],
  Support:  ["Emergency Contacts", "NGO Partners", "Accessibility", "Resources"],
  Legal:    ["Privacy Policy", "Terms of Use", "Data Security"],
};

const brandColors = ["#4ecdc4", "#ff8fab", "#f4a261", "#c77dff", "#52b788"];

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');

        .ft *, .ft *::before, .ft *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ft {
          font-family: 'Sora', sans-serif;
          background: #060e10;
          position: relative;
          overflow: hidden;
        }

        /* Rainbow top bar */
        .ft-bar {
          height: 4px;
          background: linear-gradient(90deg, #4ecdc4, #52b788, #f4a261, #ff8fab, #c77dff, #4ecdc4);
          background-size: 300% 100%;
          animation: ft-shimmer 5s linear infinite;
        }
        @keyframes ft-shimmer { to { background-position: 300% 0; } }

        /* Subtle grid */
        .ft-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(78,205,196,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78,205,196,0.025) 1px, transparent 1px);
          background-size: 44px 44px;
        }

        /* Glow blobs */
        .ft-glow {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
        }

        /* Main content */
        .ft-inner {
          position: relative; z-index: 2;
          max-width: 1160px; margin: 0 auto;
          padding: 60px 32px 40px;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px;
        }
        @media (max-width: 960px)  { .ft-inner { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px)  { .ft-inner { grid-template-columns: 1fr; padding: 48px 20px 32px; } }

        /* Brand */
        .ft-logo {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
        }
        .ft-logo-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: linear-gradient(135deg, #4ecdc4, #2a9d8f);
          display: flex; align-items: center; justify-content: center;
          color: #060e10; flex-shrink: 0;
        }
        .ft-logo-name {
          font-size: 17px; font-weight: 800;
          color: #f1f5f9; letter-spacing: -0.01em;
        }
        .ft-logo-name span { color: #4ecdc4; }

        .ft-desc {
          font-size: 13px; font-weight: 300;
          color: #475569; line-height: 1.8;
          margin-bottom: 28px; max-width: 260px;
        }

        /* Contact */
        .ft-contact {
          display: flex; flex-direction: column; gap: 10px;
        }
        .ft-contact-row {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: #4a5568;
          transition: color 0.2s;
          cursor: default;
        }
        .ft-contact-row:hover { color: #4ecdc4; }
        .ft-contact-icon {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(78,205,196,0.07);
          border: 1px solid rgba(78,205,196,0.12);
          display: flex; align-items: center; justify-content: center;
          color: #4ecdc4; flex-shrink: 0;
        }

        /* Emergency */
        .ft-emergency {
          margin-top: 16px;
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,143,171,0.08);
          border: 1px solid rgba(255,143,171,0.2);
          border-radius: 10px; padding: 9px 14px;
          font-size: 12px; font-weight: 700; color: #ff8fab;
        }
        .ft-em-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #ff8fab;
          animation: ft-pulse 1.8s ease-in-out infinite;
        }
        @keyframes ft-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,143,171,0.5); }
          50%      { box-shadow: 0 0 0 5px rgba(255,143,171,0); }
        }

        /* Nav columns */
        .ft-col-title {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #f1f5f9; margin-bottom: 18px;
        }
        .ft-nav-link {
          display: block;
          font-size: 13px; font-weight: 400;
          color: #475569; text-decoration: none;
          margin-bottom: 11px;
          transition: color 0.2s, padding-left 0.2s;
          cursor: pointer;
        }
        .ft-nav-link:hover { color: #4ecdc4; padding-left: 4px; }

        /* Bottom bar */
        .ft-bottom {
          position: relative; z-index: 2;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 18px 32px;
        }
        .ft-bottom-inner {
          max-width: 1160px; margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 12px;
        }
        .ft-copy {
          font-size: 12px; font-weight: 300; color: #334155;
        }
        .ft-color-strip {
          display: flex; border-radius: 100px;
          overflow: hidden; height: 4px; width: 72px;
        }
        .ft-cs { flex: 1; }

        @media (max-width: 560px) {
          .ft-bottom { padding: 18px 20px; }
          .ft-bottom-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="ft">
        <div className="ft-bar" />
        <div className="ft-grid" />
        <div className="ft-glow" style={{ width: 400, height: 400, background: "rgba(78,205,196,0.05)", top: -120, left: -80 }} />
        <div className="ft-glow" style={{ width: 300, height: 300, background: "rgba(244,162,97,0.04)", bottom: -60, right: -60 }} />

        {/* Main grid */}
        <div className="ft-inner">

          {/* Brand + Contact */}
          <div>
            <div className="ft-logo">
              <div className="ft-logo-icon"><HeartIcon /></div>
              <div className="ft-logo-name">YourVoice<span>HUB</span></div>
            </div>
            <p className="ft-desc">
              A safe, AI-powered inclusive platform connecting individuals with
              mental health guidance and professional support across Rwanda.
            </p>

            <div className="ft-contact">
              <div className="ft-contact-row">
                <div className="ft-contact-icon"><MailIcon /></div>
                support@yourvoicehub.rw
              </div>
              <div className="ft-contact-row">
                <div className="ft-contact-icon"><PhoneIcon /></div>
                +250 788 000 000
              </div>
              <div className="ft-contact-row">
                <div className="ft-contact-icon"><MapPinIcon /></div>
                Kigali, Rwanda
              </div>
            </div>

            <div className="ft-emergency">
              <div className="ft-em-dot" />
              Emergency Helpline: 182
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(navLinks).map(([heading, items]) => (
            <div key={heading}>
              <div className="ft-col-title">{heading}</div>
              {items.map((item) => (
                <a key={item} className="ft-nav-link" href="#">{item}</a>
              ))}
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <div className="ft-bottom-inner">
            <span className="ft-copy">
              © 2026 YourVoice HUB · Digital Social Innovators. All rights reserved.
            </span>
            <div className="ft-color-strip">
              {brandColors.map((c) => (
                <div key={c} className="ft-cs" style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}