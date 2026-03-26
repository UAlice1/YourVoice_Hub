import React, { useEffect, useMemo, useState } from 'react';
import { ngoAPI } from '../../services/Api';

const COLORS = ['#14b8a6', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e', '#06b6d4'];

// Helpers
const extractArray = (obj, key) => {
  if (!obj) return [];
  if (Array.isArray(obj[key])) return obj[key];
  if (Array.isArray(obj?.data?.[key])) return obj.data[key];
  if (Array.isArray(obj?.result?.[key])) return obj.result[key];
  return [];
};
const lastNMonthsLabels = (n = 7, locale = 'en-GB') => {
  const now = new Date();
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(d.toLocaleString(locale, { month: 'short' }));
  }
  return out;
};
const toShortMonth = (m) => {
  if (!m) return '';
  if (/^\d{4}-\d{2}$/.test(m)) {
    const [y, mm] = m.split('-').map(Number);
    const d = new Date(y, mm - 1, 1);
    return d.toLocaleString('en-GB', { month: 'short' });
  }
  return String(m).slice(0, 3);
};

// Simple SVG Bar Chart
const BarChart = ({ data, color = '#14b8a6', height = 220 }) => {
  const max = Math.max(1, ...data.map(d => d.value || 0));
  const barW = 28;
  const gap = 20;
  const leftPad = 24;
  const bottomPad = 30;
  const width = leftPad + data.length * (barW + gap);
  const chartHeight = height - bottomPad;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet">
      <line x1="0" y1={chartHeight} x2={width} y2={chartHeight} stroke="#e5e7eb" />
      {data.map((d, i) => {
        const h = Math.round(((d.value || 0) / max) * (chartHeight - 10));
        const x = leftPad + i * (barW + gap);
        const y = chartHeight - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx="4" fill={color} />
            <text x={x + barW / 2} y={height - 10} textAnchor="middle" fontSize="10" fill="#6b7280">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Simple SVG Donut Chart
const DonutChart = ({ series, size = 220, strokeW = 18 }) => {
  const total = Math.max(1, series.reduce((acc, s) => acc + (s.value || 0), 0));
  const radius = (size - strokeW) / 2;
  const center = size / 2;
  let acc = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeW} />
      {series.map((s, i) => {
        const val = (s.value || 0) / total;
        const circ = 2 * Math.PI * radius;
        const dash = val * circ;
        const gap = circ - dash;
        const rotation = (acc / total) * 360;
        acc += s.value || 0;
        return (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={s.color || COLORS[i % COLORS.length]}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(-90 ${center} ${center}) rotate(${rotation} ${center} ${center})`}
            strokeLinecap="butt"
          />
        );
      })}
      <text x={center} y={center} textAnchor="middle" dominantBaseline="central" fontSize="14" fill="#111827">
        {Math.max(0, series.reduce((a, s) => a + (s.value || 0), 0))}
      </text>
    </svg>
  );
};

const Legend = ({ items }) => (
  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
    {items.map((it, i) => (
      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
        <span className="w-3 h-3 rounded" style={{ background: it.color }} />
        <span className="truncate">{it.label}</span>
        <span className="ml-auto text-gray-500">{it.value}</span>
      </div>
    ))}
  </div>
);

export default function NGOReports() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [data, setData] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await ngoAPI.getReports();
      setData(res?.data?.reports || res?.data || null);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const barData = useMemo(() => {
    const monthly = extractArray(data || {}, 'monthly_cases') || extractArray(data || {}, 'trends');
    if (monthly.length > 0) {
      return monthly.slice(-7).map(m => ({
        label: m.label ? String(m.label).slice(0, 3) : toShortMonth(m.month),
        value: Number(m.count || 0),
      }));
    }
    return lastNMonthsLabels(7).map(l => ({ label: l, value: 0 }));
  }, [data]);

  const donutSeries = useMemo(() => {
    const types = extractArray(data || {}, 'cases_by_type');
    if (types.length > 0) {
      return types.map((t, i) => ({
        label: t.type || t.label || 'Other',
        value: Number(t.count || 0),
        color: COLORS[i % COLORS.length],
      }));
    }
    return [];
  }, [data]);

  const totalCases = data?.summary?.total_cases ?? 0;

  // ✅ Export CSV with token in headers
  const handleExportCsv = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const url = `${API_BASE}/ngo/reports/csv`;

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Failed to export CSV (${res.status})`);
      }

      const blob = await res.blob();
      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = `ngo-reports-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(dlUrl);
    } catch (err) {
      alert(err.message || 'Export failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-green-100">
      {/* Header with Export button */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-500 text-sm mt-1">Visualizing impact and case trends.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center px-3 py-2 rounded-md border border-green-300 text-sm text-white bg-green-700 hover:bg-green-400"
              title="Download CSV"
            >
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-52 bg-gray-200 rounded" />
                  <div className="h-4 w-72 bg-gray-200 rounded" />
                  <div className="h-48 w-full bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && err && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
            {err}
          </div>
        )}

        {!loading && !err && (
          <>
            {/* KPI strip */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{totalCases}</p>
                <p className="text-xs text-gray-500 mt-1">Cumulative to date</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <p className="text-sm text-gray-600">Statuses</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {extractArray(data || {}, 'cases_by_status').map((s, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="capitalize">{String(s.status || '').replace('_', ' ')}</span>
                      <span className="text-gray-500">{s.count}</span>
                    </li>
                  ))}
                  {extractArray(data || {}, 'cases_by_status').length === 0 && (
                    <li className="text-gray-400">No status data</li>
                  )}
                </ul>
              </div>
              <div className="bg-gray-100 border border-gray-100 rounded-xl p-5">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-base text-gray-900 mt-1">
                  {data?.updated_at ? new Date(data.updated_at).toLocaleString('en-GB') : '—'}
                </p>
                <p className="text-xs text-gray-500 mt-1">From the report</p>
              </div>
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-base font-semibold text-gray-800">Case Trends (Last 7 Months)</h3>
                <p className="text-xs text-gray-500 mb-4">Monthly case counts over the last seven months.</p>
                <div className="overflow-x-auto">
                  <BarChart data={barData} color="#14b8a6" height={230} />
                </div>
                {barData.every(d => d.value === 0) && (
                  <p className="mt-3 text-xs text-gray-500">No time series data available.</p>
                )}
              </div>

              {/* Donut */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-base font-semibold text-gray-800">Case Distribution by Type</h3>
                <p className="text-xs text-gray-500 mb-4">Share of cases by reported type.</p>
                {donutSeries.length > 0 ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <DonutChart series={donutSeries} />
                    <div className="flex-1 min-w-[220px]">
                      <Legend items={donutSeries} />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No type distribution data.</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}