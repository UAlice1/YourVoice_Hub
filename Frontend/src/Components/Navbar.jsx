import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "AI Support", path: "/ai-support" },
    { label: "Submit Case", path: "/submit-case" },
    { label: "NGO Portal", path: "/ngo" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#f0fafa] shadow-sm border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="font-bold text-gray-800 text-lg">
            YourVoice<span className="text-teal-500">Hub</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? "text-teal-600 bg-teal-50"
                  : "text-gray-500 hover:text-teal-600 hover:bg-teal-50"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-teal-600 text-white rounded-full text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-gray-600 hover:text-teal-600 px-3 py-2 rounded-full"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-sm font-semibold text-white px-4 py-2 rounded-full"
                style={{ background: "linear-gradient(135deg, #14b8a6, #0891b2)" }}
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;