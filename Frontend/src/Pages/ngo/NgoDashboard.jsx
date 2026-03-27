import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoAPI } from '../../services/Api';


const PAGE_SIZE = 10;
const CASE_TYPES = ['gbv', 'abuse', 'trauma', 'mental_health', 'other'];
const PRIORITIES = ['urgent', 'high', 'medium', 'low'];


const ALL_STATUSES = ['new', 'pending', 'in-progress', 'in_progress', 'reviewed', 'resolved', 'closed'];


const DB_STATUSES = ['pending', 'reviewed', 'referred', 'closed'];


const STATUS_LABELS = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  referred: 'In Progress', 
  closed: 'Closed',
};

const DEBUG = false; 

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.cases)) return payload.cases;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.data?.cases)) return payload.data.cases;
  if (Array.isArray(payload?.result?.cases)) return payload.result.cases;
  if (Array.isArray(payload?.result?.data)) return payload.result.data;
  if (payload?.result) return extractList(payload.result);
  return [];
};

const fmtType = (t) => (t || '').replaceAll('_', ' ').toUpperCase();

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const shortCaseId = (uuid) =>
  uuid ? `CS-${new Date().getFullYear()}-${uuid.slice(0, 3).toUpperCase()}` : '—';

const priorityBadge = (p) => {
  const map = {
    urgent: 'bg-red-100 text-red-700 border border-red-200',
    high: 'bg-orange-100 text-orange-700 border border-orange-200',
    medium: 'bg-blue-100 text-blue-700 border border-blue-200',
    low: 'bg-gray-100 text-gray-700 border border-gray-200',
  };
  return map[(p || '').toLowerCase()] || map.medium;
};


const normStatus = (s) =>
  (s || 'pending').toString().replace('_', '-').toLowerCase();


const statusBadge = (sRaw) => {
  const s = normStatus(sRaw);
  const map = {
    new: 'bg-sky-100 text-sky-700',
    pending: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    reviewed: 'bg-purple-100 text-purple-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-200 text-gray-700',
    
    referred: 'bg-blue-100 text-blue-700',
  };
  return map[s] || 'bg-gray-100 text-gray-700';
};


const statusLabel = (sRaw) => {
  const s = normStatus(sRaw);
  const map = {
    pending: 'Pending',
    reviewed: 'Reviewed',
    referred: 'In Progress',
    closed: 'Closed',
   
    'in-progress': 'In Progress',
    resolved: 'Closed',
    new: 'Pending',
  };
  return map[s] || (sRaw ? String(sRaw).replace('_', ' ') : '—');
};


const getNgoDisplayName = (p) => {
  if (!p) return 'NGO Partner Portal';
  return (
    p.display_name ||
    p.org_name ||
    p.organization ||
    p.ngo_name ||
    p.name ||
    p.username ||
    p.email ||
    'NGO Partner'
  );
};


const NGODashboard = () => {
  const navigate = useNavigate();

 
  const [ngoProfile, setNgoProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

 
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(null);


  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [rowsError, setRowsError] = useState(null);

 
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  
  const [updatingUuid, setUpdatingUuid] = useState(null);

  
  const [exporting, setExporting] = useState(false);

  
  const fetchNgoProfile = async () => {
    try {
      setLoadingProfile(true);
      let profile = null;

      // Try API first
      try {
        const res = await ngoAPI.getProfile();
        profile = res?.data?.profile || res?.data?.ngo || res?.data || null;
      } catch (e) {
        if (DEBUG) console.warn('[NGO] /ngo/profile failed, will try localStorage.', e?.message);
      }

      // Fallback to localStorage
      if (!profile) {
        const raw = localStorage.getItem('user');
        if (raw) {
          try {
            profile = JSON.parse(raw);
          } catch {
          }
        }
      }

      setNgoProfile(profile);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      setStatsError(null);
      const res = await ngoAPI.getReports();
      if (DEBUG) console.info('[NGO] /ngo/reports payload:', res?.data);
      setStats(res?.data?.reports || res?.data || null);
    } catch (e) {
      setStatsError(e?.response?.data?.message || 'Failed to load reports.');
    } finally {
      setLoadingStats(false);
    }
  };

 
  const fetchCases = async () => {
    try {
      setLoadingRows(true);
      setRowsError(null);

      const params = {
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        page: page + 1, 
      };
      if (status) params.status = status;
      if (type) params.type = type;
      if (priority) params.priority = priority;

      const res = await ngoAPI.getCases(params);
      if (DEBUG) {
        console.info('[NGO] GET /ngo/cases params:', params);
        console.info('[NGO] GET /ngo/cases payload:', res?.data);
      }
      const list = extractList(res?.data);
      setRows(list);
      setHasNext(list.length === PAGE_SIZE);
    } catch (e) {
      setRowsError(e?.response?.data?.message || 'Failed to load cases.');
    } finally {
      setLoadingRows(false);
    }
  };

  useEffect(() => {
    fetchNgoProfile(); 
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCases();
  }, [page, status, type, priority]);

  const ngoDisplayName = useMemo(() => getNgoDisplayName(ngoProfile), [ngoProfile]);

 
  const totalCases = stats?.summary?.total_cases || 0;
  const pendingCases =
    stats?.cases_by_status?.find((s) => normStatus(s.status) === 'pending')?.count || 0;
  const resolvedCases =
    stats?.cases_by_status?.find((s) =>
      ['closed', 'resolved'].includes(normStatus(s.status))
    )?.count || 0;

  
  const onUpdateStatus = async (uuid, newStatusDb) => {
   
    setRows((cur) => cur.map((r) => (r.uuid === uuid ? { ...r, status: newStatusDb } : r)));
    setUpdatingUuid(uuid);

    try {
      await ngoAPI.updateCaseStatus(uuid, { status: newStatusDb });
      
    } catch (e) {
      await fetchCases(); 
      alert(e?.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingUuid(null);
    }
  };

  
  const handleExportCasesCsv = async () => {
    try {
      setExporting(true);

      
      const collected = [];
      const LIMIT = 200;     // per request
      const MAX_PAGES = 200; // safety cap (≈ 40k rows)
      let pageIdx = 0;

      while (pageIdx < MAX_PAGES) {
        const params = {
          limit: LIMIT,
          offset: pageIdx * LIMIT,
          page: pageIdx + 1,
        };
        if (status) params.status = status;
        if (type) params.type = type;
        if (priority) params.priority = priority;

        const res = await ngoAPI.getCases(params);
        const list = extractList(res?.data);
        collected.push(...list);

        if (list.length < LIMIT) break; // last page
        pageIdx += 1;
      }

      if (collected.length === 0) {
        alert('No rows to export for the current filters.');
        return;
      }

      // Build CSV
      const headings = [
        'uuid',
        'type',
        'status',
        'priority',
        'date_submitted',
        'submitted_by',
        'is_anonymous',
        'file_count',
        'notification_count',
      ];

      const csv = [
        headings.join(','),
        ...collected.map((r) => [
          r.uuid ?? '',
          r.type ?? '',
          r.status ?? '',
          r.priority ?? '',
          r.date_submitted ?? '',
          r.submitted_by ?? (r.is_anonymous ? 'Anonymous' : ''),
          (r.is_anonymous === 1 || r.is_anonymous === true || r.is_anonymous === '1') ? '1' : '0',
          (r.file_count ?? 0).toString(),
          (r.notification_count ?? 0).toString(),
        ].map((v) => {
          const s = String(v ?? '');
          const esc = s.replace(/"/g, '""');
          // Quote if it contains comma, quote or newline
          return /[",\n]/.test(esc) ? `"${esc}"` : esc;
        }).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `ngo-cases-${stamp}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[Export CSV] error:', err);
      alert(err?.message || 'Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const isPrevDisabled = useMemo(() => page === 0 || loadingRows, [page, loadingRows]);
  const isNextDisabled = useMemo(() => !hasNext || loadingRows, [hasNext, loadingRows]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            {/* 👇 Replaced static title with NGO username/display name */}
            <h1 className="text-2xl font-semibold text-gray-800">
              {loadingProfile ? '—' : ngoDisplayName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage incoming cases and monitor community impact.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/ngo/reports')}
              className="px-4 py-2 bg-yellow-600 border border-gray-300 rounded-lg text-gray-700 hover:bg-yellow-450 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Reports
            </button>
            {/* Export CSV */}
            <button
              onClick={handleExportCasesCsv}
              disabled={exporting}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border ${
                exporting
                  ? 'bg-green-600 text-white border-green-300 cursor-wait'
                  : 'bg-green-500 text-white border-green-300 hover:bg-green-400'
              }`}
              title="Export filtered cases as CSV"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {exporting ? 'Exporting…' : 'Export Data'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Cases */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Cases</p>
            <p className="text-3xl font-semibold text-gray-900 mb-2">
              {loadingStats ? '—' : totalCases.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              ↑12% from last month
            </p>
          </div>

          {/* Pending Review */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-3xl font-semibold text-orange-500 mb-2">
              {loadingStats ? '—' : pendingCases}
            </p>
            <p className="text-xs text-gray-600">Requires immediate attention</p>
          </div>

          {/* Resolved Cases */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Resolved Cases</p>
            <p className="text-3xl font-semibold text-blue-600 mb-2">
              {loadingStats ? '—' : resolvedCases}
            </p>
            <p className="text-xs text-gray-600">Total successfully closed</p>
          </div>

          {/* Avg Response Time (placeholder) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
            <p className="text-3xl font-semibold text-gray-900 mb-2">4.2 Hrs</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              Improved by 15%
            </p>
          </div>
        </div>

        {/* Recent Case Submissions (Table + Filters) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Case Submissions</h2>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(0); }}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300"
              >
                <option value="">All Statuses</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>

              <select
                value={type}
                onChange={(e) => { setType(e.target.value); setPage(0); }}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300"
              >
                <option value="">All Types</option>
                {CASE_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>
                ))}
              </select>

              <select
                value={priority}
                onChange={(e) => { setPriority(e.target.value); setPage(0); }}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300"
              >
                <option value="">All Priorities</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.toUpperCase()}</option>
                ))}
              </select>

              <button
                onClick={() => { setStatus(''); setType(''); setPriority(''); setPage(0); }}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alerts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {/* Loading skeleton */}
                {loadingRows &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`sk-${i}`} className="animate-pulse">
                      {Array.from({ length: 9 }).map((__, j) => (
                        <td key={`sk-${i}-${j}`} className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))}

                {/* Error */}
                {!loadingRows && rowsError && (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-red-600 bg-red-50">
                      {rowsError}
                    </td>
                  </tr>
                )}

                {/* Empty */}
                {!loadingRows && !rowsError && rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No cases found
                      {DEBUG && (
                        <div className="mt-2 text-xs text-gray-400">
                          Debug: DevTools → Network → <code>/ngo/cases</code> to check payload shape.
                        </div>
                      )}
                    </td>
                  </tr>
                )}

                {/* Rows */}
                {!loadingRows && !rowsError && rows.map((c) => (
                  <tr key={c.uuid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shortCaseId(c.uuid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {fmtType(c.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {fmtDate(c.date_submitted)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityBadge(c.priority)}`}>
                        {(c.priority || 'medium').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusBadge(c.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {statusLabel(c.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {c.submitted_by || (c.is_anonymous ? 'Anonymous' : '—')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 10l4.553 2.276A2 2 0 0121 14.09V18a2 2 0 01-2 2h-1M9 10l-4.553 2.276A2 2 0 003 14.09V18a2 2 0 002 2h1M9 10V5a3 3 0 013-3h0a3 3 0 013 3v5m-6 0h6" />
                        </svg>
                        {c.file_count ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                        (c.notification_count ?? 0) > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2 2 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
                        </svg>
                        {c.notification_count ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {/* Action: update status (DB values only) */}
                        <select
                          value={c.status || 'pending'}
                          onChange={(e) => onUpdateStatus(c.uuid, e.target.value)}
                          disabled={updatingUuid === c.uuid}
                          className={`px-2.5 py-1.5 text-xs rounded-md border ${
                            updatingUuid === c.uuid ? 'opacity-60 cursor-wait' : 'border-gray-300 bg-white'
                          }`}
                          title="Update status"
                        >
                          {DB_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => navigate(`/ngo/cases/${c.uuid}`)}
                          className="text-teal-600 hover:text-teal-700 font-medium"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
            <div className="text-sm text-gray-600">
              Page <span className="font-medium">{page + 1}</span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={isPrevDisabled}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className={`px-3 py-1.5 rounded border ${
                  isPrevDisabled ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                disabled={isNextDisabled}
                onClick={() => setPage((p) => p + 1)}
                className={`px-3 py-1.5 rounded border ${
                  isNextDisabled ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NGODashboard;