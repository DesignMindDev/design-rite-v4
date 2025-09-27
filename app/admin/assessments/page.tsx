'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Calendar, Clock, User, Building, DollarSign, Eye, FileText, RefreshCw } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Assessment {
  id: string;
  company_name: string;
  facility_type: string;
  square_footage: number;
  current_security: string;
  security_concerns: string;
  budget: string;
  timeline: string;
  contact_info: any;
  assessment_content: string;
  technical_specifications: string;
  status: string;
  ai_model_used: string;
  processing_time_ms: number;
  created_at: string;
  updated_at: string;
}

export default function AssessmentsAdminPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (err) {
      console.error('Error loading assessments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesFilter = filter === 'all' || assessment.status === filter;
    const matchesSearch =
      assessment.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.facility_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.contact_info?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: string | number) => {
    if (typeof amount === 'number') return `$${amount.toLocaleString()}`;
    if (typeof amount === 'string' && amount.includes('$')) return amount;
    return amount;
  };

  const formatProcessingTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Assessment Dashboard</h1>
              <p className="text-gray-400">Monitor and analyze security assessments</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadAssessments}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/admin"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Assessments</p>
                <p className="text-2xl font-bold">{assessments.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed Today</p>
                <p className="text-2xl font-bold">
                  {assessments.filter(a =>
                    new Date(a.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Processing Time</p>
                <p className="text-2xl font-bold">
                  {assessments.length > 0
                    ? formatProcessingTime(
                        assessments.reduce((sum, a) => sum + (a.processing_time_ms || 0), 0) / assessments.length
                      )
                    : '0ms'
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold">
                  {assessments.length > 0
                    ? `${Math.round((assessments.filter(a => a.status === 'completed').length / assessments.length) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
              <User className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by company, facility type, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Assessment List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3">Loading assessments...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={loadAssessments}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No assessments found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters.' : 'Assessments will appear here when users complete them.'}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Facility</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredAssessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{assessment.company_name}</div>
                          <div className="text-sm text-gray-400">{assessment.contact_info?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{assessment.facility_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-white">
                          <Building className="w-4 h-4 mr-1 text-gray-400" />
                          {assessment.square_footage?.toLocaleString()} sq ft
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-white">
                          <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                          {formatCurrency(assessment.budget)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assessment.status)}`}>
                          {assessment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedAssessment(assessment)}
                          className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Assessment Details</h2>
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                    <p className="text-white">{selectedAssessment.company_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Facility Type</label>
                    <p className="text-white">{selectedAssessment.facility_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Square Footage</label>
                    <p className="text-white">{selectedAssessment.square_footage?.toLocaleString()} sq ft</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Budget</label>
                    <p className="text-white">{formatCurrency(selectedAssessment.budget)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Timeline</label>
                    <p className="text-white">{selectedAssessment.timeline}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">AI Model</label>
                    <p className="text-white">{selectedAssessment.ai_model_used}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Processing Time</label>
                    <p className="text-white">{formatProcessingTime(selectedAssessment.processing_time_ms)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAssessment.status)}`}>
                      {selectedAssessment.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedAssessment.security_concerns && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Security Concerns</label>
                  <p className="text-white bg-gray-700 p-3 rounded">{selectedAssessment.security_concerns}</p>
                </div>
              )}

              {selectedAssessment.current_security && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Current Security</label>
                  <p className="text-white bg-gray-700 p-3 rounded">{selectedAssessment.current_security}</p>
                </div>
              )}

              {selectedAssessment.assessment_content && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Assessment Content</label>
                  <div className="bg-gray-700 p-4 rounded max-h-96 overflow-y-auto">
                    <pre className="text-white text-sm whitespace-pre-wrap">{selectedAssessment.assessment_content}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}