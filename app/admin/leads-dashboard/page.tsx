'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, TrendingUp, Award, Activity, Mail, Phone, Building, Calendar, ExternalLink, MessageSquare, Target, Clock, MapPin, RefreshCw, ArrowLeft, Filter, TrendingDown } from 'lucide-react'
import MetricCard from '../../components/dashboard/MetricCard'
import TimeSeriesChart from '../../components/dashboard/TimeSeriesChart'
import FunnelChart from '../../components/dashboard/FunnelChart'

interface Lead {
  id: string
  email: string
  name: string | null
  company: string | null
  phone: string | null
  title: string | null
  lead_source: string | null
  lead_score: number
  lead_grade: string
  lead_status: string
  page_views: number
  session_count: number
  quotes_generated: number
  used_quick_estimate: boolean
  used_ai_assessment: boolean
  used_system_surveyor: boolean
  demo_booked: boolean
  demo_completed: boolean
  trial_started: boolean
  converted_to_customer: boolean
  first_visit_at: string
  last_activity_at: string
  created_at: string
}

interface WebActivity {
  id: string
  event_type: string
  event_category: string | null
  event_action: string | null
  event_label: string | null
  page_url: string | null
  page_title: string | null
  tool_name: string | null
  tool_data: any
  created_at: string
}

interface LeadNote {
  id: string
  note: string
  note_type: string
  created_by: string
  created_at: string
}

interface DashboardStats {
  total: number
  by_status: Record<string, number>
  by_grade: Record<string, number>
  average_score: number
  trial_started: number
  customers: number
  new_this_week: number
  new_this_month: number
}

interface ConversionFunnelData {
  stage: string
  count: number
  percentage: number
  dropoff: number
}

interface LeadSourcePerformance {
  source: string
  leads: number
  avgScore: number
  conversionRate: number
  customers: number
}

interface JourneyMetrics {
  avgTimeToConversion: number
  avgPageViewsToConversion: number
  avgSessionsToConversion: number
  mostCommonFirstPage: string
  mostCommonConversionPath: string[]
}

interface TimeSeriesData {
  date: string
  newLeads: number
  qualifiedLeads: number
  trials: number
  conversions: number
}

interface AnalyticsData {
  conversionFunnel: ConversionFunnelData[]
  leadSourcePerformance: LeadSourcePerformance[]
  journeyMetrics: JourneyMetrics
  timeSeriesData: TimeSeriesData[]
  topPages: Array<{ page: string; views: number; uniqueVisitors: number }>
  conversionPaths: Array<{ path: string[]; leads: number; conversions: number; conversionRate: number }>
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [leadJourney, setLeadJourney] = useState<{
    lead: Lead
    activities: WebActivity[]
    notes: LeadNote[]
  } | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterGrade, setFilterGrade] = useState<string>('all')
  const [newNote, setNewNote] = useState('')
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d')
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [filterStatus, filterGrade])

  useEffect(() => {
    if (showAnalytics) {
      fetchAnalytics()
    }
  }, [timeRange, showAnalytics])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/leads-analytics?timeRange=${timeRange}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterGrade !== 'all') params.append('grade', filterGrade)

      const response = await fetch(`/api/leads-tracking?${params}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch leads')
      }

      setLeads(data.leads)
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch leads:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const fetchLeadJourney = async (email: string) => {
    try {
      const response = await fetch(`/api/leads-tracking?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch lead journey')
      }

      setLeadJourney(data)
    } catch (error) {
      console.error('Failed to fetch lead journey:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const updateLeadStatus = async (leadId: string, updates: Record<string, any>) => {
    try {
      const response = await fetch('/api/leads-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_lead',
          lead_data: { id: leadId, ...updates }
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to update lead')
      }

      // Refresh leads
      await fetchLeads()

      // Refresh journey if modal is open
      if (selectedLead && selectedLead.id === leadId) {
        await fetchLeadJourney(selectedLead.email)
      }

      alert('Lead updated successfully!')
    } catch (error) {
      console.error('Failed to update lead:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const addNote = async () => {
    if (!selectedLead || !newNote.trim()) return

    try {
      const response = await fetch('/api/leads-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_note',
          lead_data: {
            lead_id: selectedLead.id,
            note: newNote.trim(),
            note_type: 'manual',
            created_by: 'admin'
          }
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to add note')
      }

      setNewNote('')
      await fetchLeadJourney(selectedLead.email)
      alert('Note added successfully!')
    } catch (error) {
      console.error('Failed to add note:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleLeadClick = async (lead: Lead) => {
    setSelectedLead(lead)
    await fetchLeadJourney(lead.email)
  }

  if (loading && leads.length === 0) {
    return (
      <div className="min-h-screen dr-bg-charcoal dr-text-pearl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leads dashboard...</p>
        </div>
      </div>
    )
  }

  const timeRangeLabels = {
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Leads & Web Activity Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track lead journey from first visit to conversion
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showAnalytics
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              {showAnalytics ? 'Hide' : 'Show'} Analytics
            </button>

            {showAnalytics && (
              <div className="flex gap-2 bg-white rounded-lg border border-gray-300 p-1">
                {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      timeRange === range
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {timeRangeLabels[range]}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={fetchLeads}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 inline mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchLeads}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              title="Total Leads"
              value={stats.total}
              color="purple"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="New This Week"
              value={stats.new_this_week}
              color="blue"
            />
            <StatCard
              icon={<Award className="w-6 h-6" />}
              title="Avg Score"
              value={stats.average_score}
              suffix="/100"
              color="yellow"
            />
            <StatCard
              icon={<Target className="w-6 h-6" />}
              title="Customers"
              value={stats.customers}
              color="green"
            />
          </div>
        )}

        {/* Grade Distribution */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <GradeCard grade="A" count={stats.by_grade.A || 0} color="green" />
            <GradeCard grade="B" count={stats.by_grade.B || 0} color="blue" />
            <GradeCard grade="C" count={stats.by_grade.C || 0} color="yellow" />
            <GradeCard grade="D" count={stats.by_grade.D || 0} color="gray" />
          </div>
        )}

        {/* Advanced Analytics Section */}
        {showAnalytics && analytics && (
          <div className="space-y-6 mb-8">
            {/* Journey Metrics */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Journey Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                  title="Avg Time to Conversion"
                  value={`${analytics.journeyMetrics.avgTimeToConversion} days`}
                  icon={<Clock className="w-6 h-6" />}
                  color="blue"
                />
                <MetricCard
                  title="Avg Page Views"
                  value={analytics.journeyMetrics.avgPageViewsToConversion}
                  icon={<Activity className="w-6 h-6" />}
                  color="green"
                  description="Before conversion"
                />
                <MetricCard
                  title="Avg Sessions"
                  value={analytics.journeyMetrics.avgSessionsToConversion}
                  icon={<Target className="w-6 h-6" />}
                  color="purple"
                  description="Before conversion"
                />
                <MetricCard
                  title="Top Entry Page"
                  value={analytics.journeyMetrics.mostCommonFirstPage.split('/').pop() || 'Home'}
                  icon={<MapPin className="w-6 h-6" />}
                  color="yellow"
                  description="Most common first visit"
                />
              </div>
            </section>

            {/* Conversion Funnel */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Conversion Funnel</h2>
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                <FunnelChart stages={analytics.conversionFunnel} />
              </div>
            </section>

            {/* Time Series & Lead Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time Series */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Leads Over Time</h2>
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                  <TimeSeriesChart
                    data={analytics.timeSeriesData}
                    xKey="date"
                    yKeys={['newLeads', 'qualifiedLeads', 'trials', 'conversions']}
                    colors={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']}
                    height={300}
                  />
                  <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span className="text-sm text-gray-600">New Leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                      <span className="text-sm text-gray-600">Qualified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                      <span className="text-sm text-gray-600">Trials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-600 rounded"></div>
                      <span className="text-sm text-gray-600">Conversions</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Lead Source Performance */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Lead Source Performance</h2>
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                  <div className="space-y-3">
                    {analytics.leadSourcePerformance.map((source, index) => (
                      <div key={index} className="pb-3 border-b border-gray-200 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{source.source}</h3>
                          <span className="text-sm font-medium text-blue-600">
                            {source.leads} leads
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Avg Score:</span>
                            <span className="ml-2 font-medium">{source.avgScore}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Conversion:</span>
                            <span className="ml-2 font-medium text-green-600">{source.conversionRate}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Customers:</span>
                            <span className="ml-2 font-medium">{source.customers}</span>
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(source.conversionRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Conversion Paths & Top Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Paths */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Conversion Paths</h2>
                <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {analytics.conversionPaths.map((path, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="px-4 py-3">
                            <div className="text-xs text-gray-600 flex flex-wrap gap-1">
                              {path.path.map((step, i) => (
                                <span key={i}>
                                  {step}
                                  {i < path.path.length - 1 && ' →'}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-900">{path.leads}</td>
                          <td className="px-4 py-3 text-green-600 font-medium">{path.conversions}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              path.conversionRate > 20 ? 'bg-green-100 text-green-800' :
                              path.conversionRate > 10 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {path.conversionRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Top Pages */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Pages</h2>
                <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {analytics.topPages.map((page, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="px-4 py-3 text-gray-900 truncate max-w-xs">
                            {page.page.split('/').pop() || page.page}
                          </td>
                          <td className="px-4 py-3 text-blue-600 font-medium">{page.views}</td>
                          <td className="px-4 py-3 text-gray-600">{page.uniqueVisitors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="demo_scheduled">Demo Scheduled</option>
                <option value="demo_completed">Demo Completed</option>
                <option value="trial">Trial</option>
                <option value="customer">Customer</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Filter by Grade:</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Grades</option>
                <option value="A">A (90-100)</option>
                <option value="B">B (70-89)</option>
                <option value="C">C (50-69)</option>
                <option value="D">D (0-49)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all')
                  setFilterGrade('all')
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Leads ({leads.length})
          </h2>

          {leads.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No leads found with current filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400">Name/Email</th>
                    <th className="text-left p-3 text-gray-400">Company</th>
                    <th className="text-left p-3 text-gray-400">Score</th>
                    <th className="text-left p-3 text-gray-400">Status</th>
                    <th className="text-left p-3 text-gray-400">Activity</th>
                    <th className="text-left p-3 text-gray-400">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr
                      key={lead.id}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer transition-colors"
                      onClick={() => handleLeadClick(lead)}
                    >
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{lead.name || 'Unknown'}</div>
                          <div className="text-xs text-purple-300">{lead.email}</div>
                        </div>
                      </td>
                      <td className="p-3">{lead.company || '-'}</td>
                      <td className="p-3">
                        <ScoreBadge score={lead.lead_score} grade={lead.lead_grade} />
                      </td>
                      <td className="p-3">
                        <StatusBadge status={lead.lead_status} />
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {lead.used_quick_estimate && <span title="Quick Estimate">📊</span>}
                          {lead.used_ai_assessment && <span title="AI Assessment">🤖</span>}
                          {lead.used_system_surveyor && <span title="System Surveyor">📋</span>}
                          {lead.demo_booked && <span title="Demo Booked">📅</span>}
                          {lead.trial_started && <span title="Trial">🚀</span>}
                          {lead.converted_to_customer && <span title="Customer">💰</span>}
                        </div>
                      </td>
                      <td className="p-3 text-xs text-gray-400">
                        {new Date(lead.last_activity_at || lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Lead Journey Modal */}
      {selectedLead && leadJourney && (
        <LeadJourneyModal
          lead={leadJourney.lead}
          activities={leadJourney.activities}
          notes={leadJourney.notes}
          onClose={() => {
            setSelectedLead(null)
            setLeadJourney(null)
          }}
          onUpdateStatus={updateLeadStatus}
          newNote={newNote}
          setNewNote={setNewNote}
          onAddNote={addNote}
        />
      )}
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  suffix = '',
  color = 'purple'
}: {
  icon: React.ReactNode
  title: string
  value: number
  suffix?: string
  color?: string
}) {
  const colorClasses = {
    purple: 'text-purple-400 bg-purple-900/20 border-purple-500/30',
    blue: 'text-blue-400 bg-blue-900/20 border-blue-500/30',
    green: 'text-green-400 bg-green-900/20 border-green-500/30',
    yellow: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
    gray: 'text-gray-400 bg-gray-900/20 border-gray-500/30'
  }

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm text-gray-400">{title}</h3>
      </div>
      <p className="text-2xl font-bold">
        {value}
        {suffix && <span className="text-sm text-gray-400">{suffix}</span>}
      </p>
    </div>
  )
}

function GradeCard({ grade, count, color }: { grade: string; count: number; color: string }) {
  const colorClasses = {
    green: 'bg-green-900/20 border-green-500/30 text-green-400',
    blue: 'bg-blue-900/20 border-blue-500/30 text-blue-400',
    yellow: 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400',
    gray: 'bg-gray-900/20 border-gray-500/30 text-gray-400'
  }

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} border rounded-xl p-4 text-center`}>
      <div className="text-3xl font-bold mb-1">Grade {grade}</div>
      <div className="text-2xl font-semibold">{count}</div>
      <div className="text-xs text-gray-400 mt-1">
        {grade === 'A' && '90-100 pts'}
        {grade === 'B' && '70-89 pts'}
        {grade === 'C' && '50-69 pts'}
        {grade === 'D' && '0-49 pts'}
      </div>
    </div>
  )
}

function ScoreBadge({ score, grade }: { score: number; grade: string }) {
  const getColor = () => {
    if (grade === 'A') return 'bg-green-600 text-white'
    if (grade === 'B') return 'bg-blue-600 text-white'
    if (grade === 'C') return 'bg-yellow-600 text-white'
    return 'bg-gray-600 text-white'
  }

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getColor()}`}>
      {score} ({grade})
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getColor = () => {
    switch (status) {
      case 'new': return 'bg-gray-600'
      case 'contacted': return 'bg-blue-600'
      case 'qualified': return 'bg-purple-600'
      case 'demo_scheduled': return 'bg-indigo-600'
      case 'demo_completed': return 'bg-cyan-600'
      case 'trial': return 'bg-orange-600'
      case 'customer': return 'bg-green-600'
      case 'lost': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getColor()}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

function LeadJourneyModal({
  lead,
  activities,
  notes,
  onClose,
  onUpdateStatus,
  newNote,
  setNewNote,
  onAddNote
}: {
  lead: Lead
  activities: WebActivity[]
  notes: LeadNote[]
  onClose: () => void
  onUpdateStatus: (id: string, updates: Record<string, any>) => void
  newNote: string
  setNewNote: (note: string) => void
  onAddNote: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full my-8">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold dr-text-violet mb-1">{lead.name || 'Unknown'}</h2>
              <p className="text-gray-400">{lead.email}</p>
              {lead.company && <p className="text-sm text-gray-500">{lead.company}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Lead Score & Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Lead Score</div>
              <div className="text-xl font-bold">
                <ScoreBadge score={lead.lead_score} grade={lead.lead_grade} />
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Status</div>
              <div className="mt-1">
                <StatusBadge status={lead.lead_status} />
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Page Views</div>
              <div className="text-xl font-bold">{lead.page_views}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Sessions</div>
              <div className="text-xl font-bold">{lead.session_count}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => onUpdateStatus(lead.id, { lead_status: 'contacted' })}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
            >
              Mark Contacted
            </button>
            <button
              onClick={() => onUpdateStatus(lead.id, { lead_status: 'qualified' })}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
            >
              Mark Qualified
            </button>
            <button
              onClick={() => onUpdateStatus(lead.id, { trial_started: true, lead_status: 'trial' })}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded text-xs transition-colors"
            >
              Started Trial
            </button>
            <button
              onClick={() => onUpdateStatus(lead.id, { converted_to_customer: true, lead_status: 'customer' })}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
            >
              Converted to Customer
            </button>
            <button
              onClick={() => onUpdateStatus(lead.id, { lead_status: 'lost' })}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
            >
              Mark Lost
            </button>
          </div>

          {/* Activity Journey */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activity Journey ({activities.length} events)
            </h3>
            <div className="bg-gray-700/30 rounded-lg p-4 max-h-64 overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No activity recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-3 text-sm">
                      <div className="text-gray-500 text-xs whitespace-nowrap">
                        {new Date(activity.created_at).toLocaleString()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {activity.event_type === 'page_view' && '📄'}
                          {activity.event_type === 'tool_usage' && '🔧'}
                          {activity.event_type === 'quote_generated' && '💼'}
                          {activity.event_type === 'demo_booked' && '📅'}
                          {activity.event_type === 'form_submit' && '📝'}
                          {' '}
                          {activity.event_action || activity.event_type}
                        </div>
                        {activity.page_url && (
                          <div className="text-xs text-gray-500">{activity.page_url}</div>
                        )}
                        {activity.tool_name && (
                          <div className="text-xs text-purple-400">Tool: {activity.tool_name}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Notes ({notes.length})
            </h3>

            {/* Add Note */}
            <div className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this lead..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm min-h-[80px] focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button
                onClick={onAddNote}
                disabled={!newNote.trim()}
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
              >
                Add Note
              </button>
            </div>

            {/* Notes List */}
            <div className="bg-gray-700/30 rounded-lg p-4 max-h-48 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No notes yet</p>
              ) : (
                <div className="space-y-3">
                  {notes.map(note => (
                    <div key={note.id} className="border-b border-gray-700 pb-3 last:border-0">
                      <div className="text-sm">{note.note}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(note.created_at).toLocaleString()} • {note.created_by}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
