import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const SupportIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CaseIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const NGOIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");

  const navLinks = [
    { label: "Home", icon: <HomeIcon /> },
    { label: "Dashboard", icon: <DashboardIcon /> },
    { label: "AI Support", icon: <SupportIcon /> },
    { label: "Submit Case", icon: <CaseIcon /> },
    { label: "NGO Portal", icon: <NGOIcon /> },
  ];

  return (
    <nav style={{ backgroundColor: "#f0fafa" }} className="sticky top-0 z-50 shadow-sm border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <HeartIcon className="w-6 h-6 text-teal-500" />
            <span className="font-bold text-gray-800 text-lg tracking-tight">
              YourVoice<span className="text-teal-500">Hub</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active === label
                    ? "text-teal-600 bg-teal-50"
                    : "text-gray-500 hover:text-teal-600 hover:bg-teal-50"
                }`}
              >
                <span className={active === label ? "text-teal-500" : "text-gray-400"}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button className="text-sm font-medium text-gray-600 hover:text-teal-600 px-3 py-2 rounded-full transition-colors">
              Login
            </button>
            <button
              className="text-sm font-semibold text-white px-4 py-2 rounded-full transition-all duration-200 hover:opacity-90 shadow-sm"
              style={{ background: "linear-gradient(135deg, #14b8a6, #0891b2)" }}
            >
              Register
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-500 hover:text-teal-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ backgroundColor: "#f0fafa" }} className="md:hidden border-t border-teal-100 px-4 pb-4 pt-2">
          {navLinks.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => { setActive(label); setMenuOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors ${
                active === label
                  ? "text-teal-600 bg-teal-50"
                  : "text-gray-500 hover:text-teal-600 hover:bg-teal-50"
              }`}
            >
              <span className={active === label ? "text-teal-500" : "text-gray-400"}>{icon}</span>
              {label}
            </button>
          ))}
          <div className="flex gap-2 mt-3">
            <button className="flex-1 text-sm font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-full hover:border-teal-400 transition-colors">
              Login
            </button>
            <button
              className="flex-1 text-sm font-semibold text-white px-3 py-2 rounded-full hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg, #14b8a6, #0891b2)" }}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
