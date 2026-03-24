// src/pages/Cases.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { casesAPI } from '../services/Api'; // your api.js file

const Cases = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await casesAPI.getUserCases();
        setCases(response.data || []);
      } catch (err) {
        console.error('Failed to load cases:', err);
        setError(
          err.response?.data?.message ||
          'Could not load your cases. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const getPriorityColor = (priority) => {
    const map = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high:   'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      low:    'bg-gray-100 text-gray-700 border-gray-200',
    };
    return map[priority?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusColor = (status) => {
    const map = {
      pending:     'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved:    'bg-green-100 text-green-800',
      closed:      'bg-gray-100 text-gray-700',
    };
    return map[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Cases</h1>
            <p className="mt-1 text-gray-600">
              All your submitted support requests
            </p>
          </div>
          <button
            onClick={() => navigate('/submit-case')}
            className="inline-flex items-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            + New Case
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && cases.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No cases yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              When you submit a support request, it will appear here.
            </p>
            <button
              onClick={() => navigate('/cases/new')}
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              + Submit New Case
            </button>
          </div>
        )}

        {/* Cases list */}
        {!loading && cases.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            {cases.map((c) => (
              <div
                key={c.uuid}
                onClick={() => navigate(`/cases/${c.uuid}`)}
                className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1.5">
                    <h3 className="text-base font-medium text-gray-900">
                      {c.type?.replace(/_/g, ' ')?.toUpperCase() || 'Support Case'}
                    </h3>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(c.priority)}`}>
                      {c.priority || 'medium'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {c.description || '(no description)'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {c.date_submitted
                        ? new Date(c.date_submitted).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </span>
                    {c.is_anonymous === 1 && (
                      <span className="italic">• Anonymous</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-5 flex-shrink-0">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(c.status)}`}>
                    {c.status ? c.status.replace('-', ' ') : 'pending'}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;