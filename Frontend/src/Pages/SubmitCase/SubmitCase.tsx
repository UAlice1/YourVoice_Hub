// SubmitCase.tsx
import { useState } from 'react';

export default function SubmitCase() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8">

        {/* Hero / Trust banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-5 shadow-sm">
            <svg
              className="w-9 h-9 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Secure Case Submission
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your safety is our top priority.<br className="sm:hidden" />
            All information is <strong className="text-teal-700">end-to-end encrypted</strong> and only accessible to your assigned case worker.
          </p>
        </div>

        {/* Step progress */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4 sm:gap-8">
            {([1, 2, 3] as const).map((s, idx) => (
              <div key={s} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setStep(s)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 border-2 ${
                    step === s
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-110'
                      : 'bg-white text-gray-500 border-gray-300 hover:border-teal-400 hover:text-teal-600'
                  }`}
                  disabled={s > step + 1} // simple forward-only for now
                >
                  {s}
                </button>

                {idx < 2 && (
                  <div
                    className={`w-12 sm:w-20 h-0.5 mx-2 sm:mx-4 transition-colors ${
                      step > s ? 'bg-teal-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/70 overflow-hidden transition-all duration-300">
          {/* Step 1: Case Details */}
          {step === 1 && (
            <div className="p-6 sm:p-8 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Case Information
                </h2>
                <p className="mt-2 text-gray-600">
                  Share as much detail as you feel safe and comfortable providing.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Type of Incident
                    </label>
                    <select className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition">
                      <option value="">Select type</option>
                      <option>Gender-Based Violence</option>
                      <option>Domestic Violence</option>
                      <option>Sexual Assault / Harassment</option>
                      <option>Child Protection Concern</option>
                      <option>Human Trafficking</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Date of Incident
                    </label>
                    <input
                      type="date"
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={7}
                    placeholder="Describe what happened..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none resize-y min-h-[140px] transition"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                  style={{ background: "linear-gradient(135deg, #14b8a6, #0891b2)" }}
                >
                  Continue to Evidence →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Evidence Upload */}
          {step === 2 && (
            <div className="p-6 sm:p-8 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Upload Evidence (Optional)
                </h2>
                <p className="mt-2 text-gray-600">
                  Photos, documents, audio notes — anything that helps tell your story safely.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                {[
                  { icon: '📄', label: 'Document', accept: '.pdf,.doc,.docx' },
                  { icon: '📸', label: 'Photo', accept: 'image/*' },
                  { icon: '🎙️', label: 'Audio', accept: 'audio/*' },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="group flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-500 hover:bg-teal-50/50 cursor-pointer transition-all duration-200"
                  >
                    <span className="text-5xl mb-3 text-gray-500 group-hover:text-teal-600 transition-colors">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700">
                      {item.label}
                    </span>
                    <input type="file" className="hidden" accept={item.accept} />
                  </label>
                ))}
              </div>

              <div className="p-4 bg-teal-50 border border-teal-100 rounded-lg text-sm text-teal-800 flex items-start gap-3">
                <span className="text-xl mt-0.5">🔒</span>
                <p>
                  <strong>End-to-end encrypted.</strong> Only your assigned case worker can access these files.
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button className="px-10 py-3 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200" style={{ background: "linear-gradient(135deg, #14b8a6, #0891b2)" }}>
                  Submit Securely
                </button>
              </div>
            </div>
          )}

          {/* Step 3 placeholder */}
          {step === 3 && (
            <div className="p-8 text-center animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Review & Confirm
              </h2>
              <p className="text-gray-600 mb-8">
                You will see a summary of your submission here before final confirmation.
              </p>
              <div className="text-sm text-gray-500 italic">
                (Review screen coming soon)
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          Made with care in Rwanda • <span className="font-medium">YourVoiceHub</span>
        </div>
      </div>

      {/* Simple fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
}