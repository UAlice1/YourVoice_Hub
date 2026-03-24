import { useState } from "react";
import { casesAPI } from "../../services/Api";

export default function SubmitCase() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type: "",
    description: "",
    is_anonymous: false,
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (fileList: FileList | null) => {
    if (!fileList) return;
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  };

  const handleSubmit = async () => {
    if (!formData.type || !formData.description) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = new FormData();
      data.append("type", formData.type);
      data.append("description", formData.description);
      data.append("is_anonymous", String(formData.is_anonymous));

      files.forEach((file) => data.append("files", file));

      await casesAPI.submitCase(data);

      setStep(3);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Secure Case Submission
          </h1>
          <p className="mt-3 text-gray-600">
            End-to-end encrypted. Only assigned case workers can access your case.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {[1, 2, 3].map((s, index) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                  step === s
                    ? "bg-teal-600 text-white scale-110 shadow-md"
                    : step > s
                    ? "bg-teal-100 text-teal-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>

              {index < 2 && (
                <div
                  className={`w-16 h-1 mx-3 transition-all duration-300 ${
                    step > s ? "bg-teal-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border p-8 transition-all duration-300">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-fade">
              <h2 className="text-xl font-semibold mb-6">
                Case Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type of Incident *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400"
                  >
                    <option value="">Select type</option>
                    <option value="mental_health">Mental Health</option>
                    <option value="abuse">Abuse</option>
                    <option value="gbv">GBV</option>
                    <option value="trauma">Trauma</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400"
                    placeholder="Describe what happened..."
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_anonymous}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_anonymous: e.target.checked,
                      })
                    }
                  />
                  Submit anonymously
                </label>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-fade">
              <h2 className="text-xl font-semibold mb-6">
                Upload Evidence (Optional)
              </h2>

              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
                className="mb-4"
              />

              {files.length > 0 && (
                <div className="mb-4 text-sm text-gray-600">
                  {files.length} file(s) selected
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="border px-6 py-2 rounded-lg"
                >
                  Back
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Securely"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="text-center py-10 animate-fade">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-semibold">
                Case Submitted Successfully
              </h2>
              <p className="text-gray-600 mt-2">
                Your case has been received and is being reviewed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        .animate-fade {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}