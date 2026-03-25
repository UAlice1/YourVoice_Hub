import React, { useEffect, useMemo, useState } from "react";
import { casesAPI } from "../services/Api";

// ──────────────────────────────────────────────────────────────────────────────
// Config / Constants
// ──────────────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;
const CASE_TYPES = ["gbv", "abuse", "trauma", "mental_health", "other"];
const CASE_STATUSES = ["pending", "in-progress", "resolved", "closed"]; // used in table Actions only
const DEBUG = false; // set to true to see payload logs in DevTools

// ──────────────────────────────────────────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────────────────────────────────────────
const priorityBadge = (p) => {
  const map = {
    urgent: "bg-red-100 text-red-700 border border-red-200",
    high: "bg-orange-100 text-orange-700 border border-orange-200",
    medium: "bg-blue-100 text-blue-700 border border-blue-200",
    low: "bg-gray-100 text-gray-700 border border-gray-200",
  };
  return map[(p || "").toLowerCase()] || map.medium;
};

const statusBadge = (s) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-200 text-gray-700",
  };
  return map[(s || "").toLowerCase()] || map.pending;
};

const formatType = (t) => (t || "").toString().replaceAll("_", " ").toUpperCase();
const formatStatus = (s) => (s || "pending").toString().replace("-", " ");

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const isTrueish = (v) => v === 1 || v === true || v === "1";

// Robustly extract arrays: supports [], {data:[]}, {cases:[]}, {items:[]}, {result:{...}}
const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.cases)) return payload.cases;
  if (Array.isArray(payload?.items)) return payload.items;
  if (payload?.result) return extractList(payload.result);
  return [];
};

// Robustly extract a single object: supports {..}, {data:{..}}, {case:{..}}, {result:{..}}
const extractItem = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  if (payload.data && typeof payload.data === "object") return payload.data;
  if (payload.case && typeof payload.case === "object") return payload.case;
  if (payload.result && typeof payload.result === "object") return extractItem(payload.result);
  return payload;
};

// ──────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────────────────────────────────────────────
const Cases = () => {
  // Table state
  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [rowsError, setRowsError] = useState(null);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  // Detail panel state
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [caseDetails, setCaseDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  // ── Fetch table data
  const fetchCases = async () => {
    try {
      setLoadingRows(true);
      setRowsError(null);

      const params = { limit: PAGE_SIZE, offset: page * PAGE_SIZE };
      if (status) params.status = status;
      if (type) params.type = type;

      const res = await casesAPI.getUserCases(params);
      if (DEBUG) console.info("[UI] GET /cases payload:", res?.data);

      const list = extractList(res?.data ?? []);
      setRows(list);
      setHasNext(list.length === PAGE_SIZE);
    } catch (e) {
      if (DEBUG) console.error("[UI] GET /cases error:", e);
      setRowsError(e?.response?.data?.message || "Could not load your cases. Please try again later.");
    } finally {
      setLoadingRows(false);
    }
  };

  useEffect(() => {
    fetchCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, type]);

  // ── Fetch details
  const fetchCaseDetails = async (uuid) => {
    if (!uuid) return;
    try {
      setLoadingDetails(true);
      setDetailsError(null);

      const res = await casesAPI.getCaseByUuid(uuid);
      if (DEBUG) console.info("[UI] GET /cases/:uuid payload:", res?.data);

      const item = extractItem(res?.data ?? null);
      setCaseDetails(item || null);
    } catch (e) {
      if (DEBUG) console.error("[UI] GET /cases/:uuid error:", e);
      setDetailsError(e?.response?.data?.message || "Failed to load case details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (!selectedUuid) return;
    fetchCaseDetails(selectedUuid);
  }, [selectedUuid]);

  // ── Actions
  const onSelectRow = (uuid) => {
    setSelectedUuid(uuid);
    setShowMobilePanel(true); // on mobile, open slide-over
  };

  const onUpdateStatus = async (uuid, newStatus) => {
    try {
      await casesAPI.updateCaseStatus(uuid, newStatus);
      // refresh both list & details so UI stays accurate
      fetchCases();
      fetchCaseDetails(uuid);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update status. Please try again.");
    }
  };

  const onDelete = async (uuid) => {
    const ok = window.confirm("Are you sure you want to permanently delete this case?");
    if (!ok) return;
    try {
      await casesAPI.deleteCase(uuid);

      // If we just deleted the selected one, clear panel
      if (uuid === selectedUuid) {
        setSelectedUuid(null);
        setCaseDetails(null);
        setShowMobilePanel(false);
      }

      // If last row on page was deleted, move back one page when possible
      if (rows.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else {
        fetchCases();
      }
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete case. Please try again.");
    }
  };

  const isPrevDisabled = useMemo(() => page === 0 || loadingRows, [page, loadingRows]);
  const isNextDisabled = useMemo(() => !hasNext || loadingRows, [hasNext, loadingRows]);

  // ────────────────────────────────────────────────────────────────────────────
  // UI
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Cases</h1>
            <p className="text-gray-600">All your submitted support requests</p>
          </div>
          <button
            onClick={() => (window.location.href = "/submit-case")}
            className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow"
          >
            + New Case
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left: Table */}
          <div className="lg:col-span-7">
            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(0);
                    }}
                    className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="">All</option>
                    {CASE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      setPage(0);
                    }}
                    className="w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="">All</option>
                    {CASE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setStatus("");
                      setType("");
                      setPage(0);
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900"
                    onClick={fetchCases}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Anonymous
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-100">
                    {/* Loading skeleton */}
                    {loadingRows &&
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={`skeleton-${i}`} className="animate-pulse">
                          <td className="px-4 py-4">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-4 w-64 bg-gray-200 rounded" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-6 w-20 bg-gray-200 rounded-full" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-6 w-24 bg-gray-200 rounded-full" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-4 w-28 bg-gray-200 rounded" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-4 w-16 bg-gray-200 rounded" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-8 w-28 ml-auto bg-gray-200 rounded" />
                          </td>
                        </tr>
                      ))}

                    {/* Error */}
                    {!loadingRows && rowsError && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-red-700 bg-red-50">
                          {rowsError}
                        </td>
                      </tr>
                    )}

                    {/* Empty */}
                    {!loadingRows && !rowsError && rows.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-gray-600">
                          No cases found.
                        </td>
                      </tr>
                    )}

                    {/* Data rows */}
                    {!loadingRows &&
                      !rowsError &&
                      rows.map((c) => (
                        <tr key={c.uuid} className="hover:bg-gray-50">
                          <td
                            className="px-4 py-4 text-sm font-medium text-gray-900 cursor-pointer"
                            onClick={() => onSelectRow(c.uuid)}
                            title="Open details"
                          >
                            {formatType(c.type) || "—"}
                          </td>
                          <td
                            className="px-4 py-4 text-sm text-gray-700 max-w-xl cursor-pointer"
                            onClick={() => onSelectRow(c.uuid)}
                            title={c.description || ""}
                          >
                            <span className="block truncate">
                              {c.description || "(no description)"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityBadge(
                                c.priority
                              )}`}
                            >
                              {c.priority || "medium"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(
                                c.status
                              )}`}
                            >
                              {formatStatus(c.status)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {formatDate(c.date_submitted)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {isTrueish(c.is_anonymous) ? "Yes" : "No"}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => onSelectRow(c.uuid)}
                                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                              >
                                View
                              </button>

                              {/* User-side status update is unusual; leaving your select intact.
                                  If you want this read-only too, replace it with the same badge like in details footer. */}
                              <select
                                value={c.status || "pending"}
                                onChange={(e) => onUpdateStatus(c.uuid, e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:border-gray-400"
                              >
                                {CASE_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s.replace("-", " ")}
                                  </option>
                                ))}
                              </select>

                              <button
                                onClick={() => onDelete(c.uuid)}
                                className="px-3 py-1.5 text-sm rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
                <div className="text-sm text-gray-600">
                  Page <span className="font-medium">{page + 1}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={isPrevDisabled}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className={`px-3 py-1.5 rounded border ${
                      isPrevDisabled
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    disabled={isNextDisabled}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-3 py-1.5 rounded border ${
                      isNextDisabled
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details panel (sticky on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 mt-6 lg:mt-0">
            <CaseDetailsPanel
              uuid={selectedUuid}
              details={caseDetails}
              loading={loadingDetails}
              error={detailsError}
              onCloseMobile={() => setShowMobilePanel(false)}
              showMobile={showMobilePanel}
              // NOTE: read-only status in details footer; keeping prop for compatibility (not used now)
              onUpdateStatus={(newStatus) => selectedUuid && onUpdateStatus(selectedUuid, newStatus)}
              onDelete={() => selectedUuid && onDelete(selectedUuid)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Case Details Panel
// ──────────────────────────────────────────────────────────────────────────────
const CaseDetailsPanel = ({
  uuid,
  details,
  loading,
  error,
  onCloseMobile,
  showMobile,
  // onUpdateStatus, // not used anymore (read-only footer)
  onDelete,
}) => {
  const card = (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {!uuid ? (
        <div className="p-10 text-center text-gray-500">Select a case to view details.</div>
      ) : loading ? (
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-72 bg-gray-200 rounded" />
            <div className="h-4 w-52 bg-gray-200 rounded" />
            <div className="h-24 w-full bg-gray-200 rounded" />
          </div>
        </div>
      ) : error ? (
        <div className="p-6 text-red-700 bg-red-50 rounded-xl">{error}</div>
      ) : !details ? (
        <div className="p-10 text-center text-gray-500">No details found.</div>
      ) : (
        <>
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {details.type ? formatType(details.type) : "CASE"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  UUID: <span className="font-mono">{details.uuid}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(details.uuid)}
                    className="ml-2 text-teal-700 hover:underline"
                    title="Copy UUID"
                  >
                    Copy
                  </button>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityBadge(
                    details.priority
                  )}`}
                >
                  {details.priority || "medium"}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(
                    details.status
                  )}`}
                >
                  {formatStatus(details.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            <section>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {details.description || "(no description)"}
              </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs uppercase tracking-wide text-gray-500">Submitted</h4>
                <p className="text-sm text-gray-800">{formatDateTime(details.date_submitted)}</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wide text-gray-500">Last Updated</h4>
                <p className="text-sm text-gray-800">{formatDateTime(details.updated_at)}</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wide text-gray-500">Submitted By</h4>
                <p className="text-sm text-gray-800">
                  {isTrueish(details.is_anonymous) ? "Anonymous" : details.submitted_by || "—"}
                </p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wide text-gray-500">Anonymous</h4>
                <p className="text-sm text-gray-800">
                  {isTrueish(details.is_anonymous) ? "Yes" : "No"}
                </p>
              </div>
            </section>
          </div>

          {/* Footer actions (READ-ONLY STATUS) */}
          <div className="p-6 border-t flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Status:</span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(
                  details.status
                )}`}
              >
                {formatStatus(details.status)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onDelete}
                className="px-3 py-2 text-sm rounded-md border border-red-300 text-red-700 hover:bg-red-50"
              >
                Delete Case
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Mobile slide-over panel
  return (
    <>
      {/* Desktop: always show card */}
      <div className="hidden lg:block">{card}</div>

      {/* Mobile: slide-over */}
      <div
        className={`lg:hidden fixed inset-0 z-40 ${
          showMobile && uuid ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!showMobile || !uuid}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${
            showMobile && uuid ? "opacity-100" : "opacity-0"
          }`}
          onClick={onCloseMobile}
        />

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform ${
            showMobile && uuid ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-900">Case Details</h3>
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Close"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-[calc(100%-3.25rem)] overflow-y-auto">{card}</div>
        </div>
      </div>
    </>
  );
};

export default Cases;