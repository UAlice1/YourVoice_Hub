import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ── Inline SVG Icons ──────────────────────────────────────────────────────────
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const ActivityIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const PendingFileIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
// ─────────────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome + Action Buttons */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Alice'}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Here is your personal support overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
             onClick={() => navigate('/AiSupportChat')}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
              <ChatIcon /> Chat with AI
            </button>
            <button 
              onClick={() => navigate('/submit-case')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors">
              <FileIcon /> New Cases
            </button>
          </div>
        </div>

        {/* ── Stats Cards Row ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">

          {/* Recent Activity */}
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <ActivityIcon />
              Recent Activity
            </div>
            <p className="text-2xl font-bold text-teal-600 mb-1">Active</p>
            <p className="text-xs text-gray-500">Last login: Today at 10:30 AM</p>
          </div>

          {/* Pending Cases */}
          <div 
           onClick={() => navigate('/cases')}
          className="bg-white border border-gray-200 rounded-2xl p-5 hover:bg-gray-50  cursor-pointer">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <PendingFileIcon />
              Pending Cases
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">1 Case</p>
            <p className="text-xs text-gray-500">Submitted on Feb 15, 2026</p>
          </div>

          {/* Appointments */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <CalendarIcon />
              Appointments
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">No Upcoming</p>
            <p className="text-xs text-gray-500">Schedule with a professional</p>
          </div>
        </div>

        {/* ── Bottom Two Columns ── */}
        <div className="grid grid-cols-2 gap-6">

          {/* Recommended for You */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-4">Recommended for You</h2>
            <div className="space-y-3">

              {/* Daily Check-in */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer border-l-4 border-l-teal-500">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border-2 border-teal-400 flex items-center justify-center text-teal-500 flex-shrink-0">
                    <ChatIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Daily Check-in</p>
                    <p className="text-xs text-gray-500">Share how you're feeling today with our AI guide.</p>
                  </div>
                </div>
                <ArrowRight />
              </div>

              {/* Safety Plan */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer border-l-4 border-l-teal-500">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border-2 border-teal-400 flex items-center justify-center text-teal-500 flex-shrink-0">
                    <ShieldIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Safety Plan</p>
                    <p className="text-xs text-gray-500">Review your personal safety resources.</p>
                  </div>
                </div>
                <ArrowRight />
              </div>
            </div>
          </div>

          {/* Your History */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-4">Your History</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">

              {/* Case Row */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="text-gray-400"><FileIcon /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Case #2026–001</p>
                    <p className="text-xs text-gray-500">Under Review by NGO</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  Pending
                </span>
              </div>

              {/* Chat Session Row */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="text-gray-400"><ChatIcon /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Chat Session</p>
                    <p className="text-xs text-gray-500">Feb 14, 2026 • 15 mins</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  Completed
                </span>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;