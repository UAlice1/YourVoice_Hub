import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ngoAPI } from '../services/Api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await ngoAPI.getReports();
      setReports(response.data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  // Process data for charts
  const monthlyData = reports?.monthly_trend?.map((item) => ({
    month: item.month,
    cases: item.count,
  })) || [];

  const caseTypeData = reports?.cases_by_type?.map((item) => ({
    name: getCaseTypeLabel(item.type),
    value: item.count,
  })) || [];

  const statusData = reports?.cases_by_status?.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    count: item.count,
  })) || [];

  const priorityData = reports?.cases_by_priority?.map((item) => ({
    name: getPriorityLabel(item.priority),
    count: item.count,
  })) || [];

  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  function getCaseTypeLabel(type) {
    const labels = {
      gbv: 'Domestic Violence',
      abuse: 'Emotional Abuse',
      mental_health: 'Mental Health',
      trauma: 'Trauma',
      other: 'Other',
    };
    return labels[type] || type;
  }

  function getPriorityLabel(priority) {
    const labels = {
      urgent: 'Urgent',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    };
    return labels[priority] || priority;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Visualizing impact and case trends.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Total Cases</p>
            <p className="text-3xl font-bold text-gray-900">{reports?.summary?.total_cases || 0}</p>
            <p className="text-xs text-gray-500 mt-1">All reported cases</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Active Users</p>
            <p className="text-3xl font-bold text-blue-600">{reports?.summary?.total_users || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Registered users</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">AI Sessions</p>
            <p className="text-3xl font-bold text-teal-600">{reports?.summary?.total_ai_sessions || 0}</p>
            <p className="text-xs text-gray-500 mt-1">AI guidance interactions</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Last 7 Days</p>
            <p className="text-3xl font-bold text-orange-600">{reports?.summary?.cases_last_7_days || 0}</p>
            <p className="text-xs text-gray-500 mt-1">New cases submitted</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Case Trends */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Case Trends (Last 7 Months)</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }}
                  />
                  <Bar dataKey="cases" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>

          {/* Case Distribution by Type */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Case Distribution by Type</h2>
            {caseTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={caseTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {caseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case Status Distribution */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cases by Status</h2>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>

          {/* Case Priority Distribution */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cases by Priority</h2>
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
