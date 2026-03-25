import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ngoAPI } from '../../services/Api';
// Put these near the top (after imports)
const API_BASE   = (import.meta.env.VITE_API_URL || '').replace(/\/$/, ''); // e.g. http://localhost:5000/api
const API_ORIGIN = API_BASE.replace(/\/api$/, '');                          // e.g. http://localhost:5000

const buildFileUrl = (f) => {
  // accept a variety of possible keys from your payload
  const raw = f.file_url || f.url || f.file_path || f.path || f.filename;
  if (!raw) return null;

  // normalize Windows backslashes → web slashes
  const normalized = String(raw).replace(/\\/g, '/');

  // absolute URL? return as-is
  if (/^https?:\/\//i.test(normalized)) return normalized;

  // ensure single leading slash
  const rel = normalized.startsWith('/') ? normalized : `/${normalized}`;

  // build from backend origin (not /api)
  return `${API_ORIGIN}${rel}`;
};

const fmtType = (t) => (t || '').toString().replaceAll('_', ' ').toUpperCase();
const fmtDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    : '—';
const priorityBadge = (p) => {
  const map = {
    urgent: 'bg-red-100 text-red-700 border border-red-200',
    high: 'bg-orange-100 text-orange-700 border border-orange-200',
    medium: 'bg-blue-100 text-blue-700 border border-blue-200',
    low: 'bg-gray-100 text-gray-700 border border-gray-200',
  };
  return map[(p || '').toLowerCase()] || map.medium;
};
const statusBadge = (s) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-purple-100 text-purple-800',
    referred: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-200 text-gray-700',
  };
  return map[(s || '').toLowerCase()] || map.pending;
};

const extractItem = (payload) => {
  // Be tolerant: object or {data:{...}} or {case:{...}} shapes
  if (!payload) return null;
  if (payload.data && typeof payload.data === 'object') return payload.data;
  if (payload.case && typeof payload.case === 'object') return payload.case;
  if (payload.result && typeof payload.result === 'object') return extractItem(payload.result);
  return typeof payload === 'object' ? payload : null;
};

export default function NGOCaseDetails() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [item, setItem]       = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res  = await ngoAPI.getCaseById(uuid);
        const data = extractItem(res?.data);
        if (mounted) setItem(data);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load case.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [uuid]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Case Details</h1>
            <p className="text-xs text-gray-500">UUID: <span className="font-mono">{uuid}</span></p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
              <div className="h-24 w-full bg-gray-200 rounded" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && !item && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
            No details found.
          </div>
        )}

        {!loading && !error && item && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header row */}
            <div className="p-6 border-b flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {fmtType(item.type) || 'CASE'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Submitted: <span className="font-medium">{fmtDateTime(item.date_submitted)}</span>
                  {' · '}Last update: <span className="font-medium">{fmtDateTime(item.updated_at)}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityBadge(item.priority)}`}>
                  {item.priority || 'medium'}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(item.status)}`}>
                  {item.status || 'pending'}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {item.description || '(no description)'}
                </p>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-gray-500">Priority</h4>
                  <p className="text-sm text-gray-800">{item.priority || 'medium'}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-gray-500">Status</h4>
                  <p className="text-sm text-gray-800">{item.status || 'pending'}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-gray-500">Submitted By</h4>
                  <p className="text-sm text-gray-800">
                    {item.is_anonymous ? 'Anonymous' : (item.submitted_by || '—')}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-gray-500">UUID</h4>
                  <p className="text-sm text-gray-800 font-mono break-all">{item.uuid}</p>
                </div>
              </section>

              <section>
  <h3 className="text-sm font-semibold text-gray-800 mb-2">Files</h3>
  {Array.isArray(item.files) && item.files.length > 0 ? (
    <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
      {item.files.map((f) => {
        const url = buildFileUrl(f);
        const name = f.original_name || f.file_name || f.file_path || '(file)';
        return (
          <li key={f.id || f.uuid || name} className="flex items-center justify-between px-4 py-2">
            <div className="text-sm text-gray-800">{name}</div>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 text-sm hover:underline"
              >
                Open
              </a>
            ) : (
              <span className="text-gray-400 text-sm">(no url)</span>
            )}
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="text-gray-600 text-sm">(no files)</p>
  )}
</section>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}