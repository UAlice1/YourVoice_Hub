// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="15" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </svg>
);

const MedicalIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const NGOIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const partners = [
    { name: "Isange One Stop Center", icon: <BuildingIcon /> },
    { name: "Rwanda Biomedical Center", icon: <MedicalIcon /> },
    { name: "Digital Social Innovators", icon: <NGOIcon /> },
  ];

  const footerLinks = {
    SERVICES: ["AI Guidance", "Secure Reporting", "Resources"],
    SUPPORT: ["Emergency Contacts", "NGO Partners", "Privacy Policy"],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Partners Band */}
      <div className="border-b border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-gray-700 font-semibold text-lg mb-5">
            Trusted by Partners Across Rwanda
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {partners.map(({ name, icon }) => (
              <div
                key={name}
                className="flex items-center gap-2 text-gray-500 hover:text-teal-600 transition-colors cursor-pointer"
              >
                <span className="text-gray-400">{icon}</span>
                <span className="text-sm font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HeartIcon className="w-5 h-5 text-teal-500" />
              <span className="font-bold text-gray-800">
                YourVoice<span className="text-teal-500">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A safe, AI-powered inclusive support platform connecting you with mental health guidance and professional help.
            </p>
          </div>

          {/* Services & Support */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-teal-500 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">CONTACT</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <PhoneIcon />
                <span>Helpline: 182 (Emergency)</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MailIcon />
                <span>support@yourvoice.rw</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPinIcon />
                <span>Kigali, Rwanda</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © 2026 Digital Social Innovators. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
