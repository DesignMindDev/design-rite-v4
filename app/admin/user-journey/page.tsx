'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users, TrendingUp, Clock, Target, RefreshCw, ArrowLeft,
  Activity, Award, BarChart3, GitBranch, Layers
} from 'lucide-react'
import MetricCard from '../../components/dashboard/MetricCard'
import TimeSeriesChart from '../../components/dashboard/TimeSeriesChart'

interface AttributionData {
  channel: string
  firstTouch: number
  lastTouch: number
  assisted: number
  conversions: number
}

interface CohortData {
  cohort: string
  leads: number
  trials: number
  customers: number
  retentionRate: number
}

interface LifecycleStage {
  stage: string
  count: number
  avgDays: number
  conversionRate: number
}

interface UserJourney {
  userId: string
  email: string
  touchpoints: Array<{
    timestamp: string
    channel: string
    action: string
    page: string
  }>
  firstTouch: string
  lastTouch: string
  totalTouchpoints: number
  daysInJourney: number
  converted: boolean
}

interface AnalyticsData {
  attributionData: AttributionData[]
  cohortData: CohortData[]
  lifecycleStages: LifecycleStage[]
  sampleJourneys: UserJourney[]
  retentionCurve: Array<{ day: number; retained: number; percentage: number }>
  avgJourneyMetrics: {
    avgDaysToConversion: number
    avgTouchpointsToConversion: number
    avgLeadScore: number
    totalLeads: number
    convertedLeads: number
    overallConversionRate: number
  }
}

export default function UserJourneyPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '180d' | '365d'>('90d')
  const [selectedJourney, setSelectedJourney] = useState<UserJourney | null>(null)

  const timeRangeLabels = {
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    '180d': 'Last 6 Months',
    '365d': 'Last Year'
  }

  useEffect(() => {
    fetchData()
  }, [timeRange])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/user-journey?timeRange=${timeRange}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('User journey error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
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
              <GitBranch className="w-8 h-8 text-indigo-600" />
              User Journey Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Complete customer lifecycle visualization and attribution analysis
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2 bg-white rounded-lg border border-gray-300 p-1">
              {(['30d', '90d', '180d', '365d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {timeRangeLabels[range]}
                </button>
              ))}
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 inline mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3">
          <Activity className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-medium text-red-900">Failed to load analytics</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading or Content */}
      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Journey Overview Metrics */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Journey Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard
                title="Total Leads"
                value={data.avgJourneyMetrics.totalLeads}
                icon={<Users className="w-6 h-6" />}
                color="blue"
              />
              <MetricCard
                title="Converted"
                value={data.avgJourneyMetrics.convertedLeads}
                icon={<Target className="w-6 h-6" />}
                color="green"
              />
              <MetricCard
                title="Conversion Rate"
                value={`${data.avgJourneyMetrics.overallConversionRate}%`}
                icon={<TrendingUp className="w-6 h-6" />}
                color={data.avgJourneyMetrics.overallConversionRate > 10 ? 'green' : 'yellow'}
              />
              <MetricCard
                title="Avg Lead Score"
                value={data.avgJourneyMetrics.avgLeadScore}
                icon={<Award className="w-6 h-6" />}
                color="purple"
              />
              <MetricCard
                title="Avg Days to Convert"
                value={data.avgJourneyMetrics.avgDaysToConversion}
                icon={<Clock className="w-6 h-6" />}
                color="blue"
              />
              <MetricCard
                title="Avg Touchpoints"
                value={data.avgJourneyMetrics.avgTouchpointsToConversion}
                icon={<Activity className="w-6 h-6" />}
                color="indigo"
              />
            </div>
          </section>

          {/* Attribution Analysis & Lifecycle Stages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attribution */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Attribution Analysis</h2>
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                <div className="space-y-3">
                  {data.attributionData.map((channel, index) => (
                    <div key={index} className="pb-3 border-b border-gray-200 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{channel.channel}</h3>
                        <span className="text-sm font-medium text-indigo-600">
                          {channel.conversions} conversions
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">First Touch:</span>
                          <span className="ml-2 font-medium text-blue-600">{channel.firstTouch}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Assisted:</span>
                          <span className="ml-2 font-medium text-purple-600">{channel.assisted}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Touch:</span>
                          <span className="ml-2 font-medium text-green-600">{channel.lastTouch}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-1">
                        <div
                          className="bg-blue-500 h-2 rounded-l"
                          style={{ width: `${(channel.firstTouch / (channel.firstTouch + channel.assisted + channel.lastTouch)) * 100}%` }}
                          title="First Touch"
                        ></div>
                        <div
                          className="bg-purple-500 h-2"
                          style={{ width: `${(channel.assisted / (channel.firstTouch + channel.assisted + channel.lastTouch)) * 100}%` }}
                          title="Assisted"
                        ></div>
                        <div
                          className="bg-green-500 h-2 rounded-r"
                          style={{ width: `${(channel.lastTouch / (channel.firstTouch + channel.assisted + channel.lastTouch)) * 100}%` }}
                          title="Last Touch"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Lifecycle Stages */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lifecycle Stages</h2>
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                <div className="space-y-3">
                  {data.lifecycleStages.map((stage, index) => (
                    <div key={index} className="pb-3 border-b border-gray-200 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-600" />
                          {stage.stage}
                        </h3>
                        <span className="text-sm font-medium text-indigo-600">
                          {stage.count} leads
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Avg Days:</span>
                          <span className="ml-2 font-medium">{stage.avgDays} days</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Conversion:</span>
                          <span className="ml-2 font-medium text-green-600">{stage.conversionRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Cohort Analysis */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cohort Analysis</h2>
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cohort</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trials</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retention Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.cohortData.map((cohort, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 font-medium text-gray-900">{cohort.cohort}</td>
                        <td className="px-6 py-4 text-blue-600">{cohort.leads}</td>
                        <td className="px-6 py-4 text-purple-600">{cohort.trials}</td>
                        <td className="px-6 py-4 text-green-600 font-medium">{cohort.customers}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  cohort.retentionRate > 15 ? 'bg-green-500' :
                                  cohort.retentionRate > 8 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(cohort.retentionRate, 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{cohort.retentionRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Retention Curve */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Retention Curve</h2>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {data.retentionCurve.map((point, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">{point.percentage}%</div>
                    <div className="text-sm text-gray-600">Day {point.day}</div>
                    <div className="text-xs text-gray-500">{point.retained} retained</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sample User Journeys */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sample User Journeys</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.sampleJourneys.map((journey, index) => (
                <div
                  key={index}
                  className={`bg-white p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                    journey.converted ? 'border-green-300' : 'border-yellow-300'
                  }`}
                  onClick={() => setSelectedJourney(journey)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span className="font-mono text-sm text-gray-600">{journey.email}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      journey.converted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {journey.converted ? 'Converted' : 'In Progress'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Journey:</span>
                      <span className="ml-2 font-medium">{journey.daysInJourney} days</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Touchpoints:</span>
                      <span className="ml-2 font-medium">{journey.totalTouchpoints}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">First:</span>
                      <span className="ml-2 font-medium text-xs">{new Date(journey.firstTouch).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span>Click to view full journey timeline</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {/* Journey Detail Modal */}
      {selectedJourney && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">User Journey Timeline</h2>
                <button
                  onClick={() => setSelectedJourney(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">{selectedJourney.email}</p>
            </div>
            <div className="p-6">
              <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-500">Journey Duration</div>
                  <div className="font-bold text-lg">{selectedJourney.daysInJourney} days</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-500">Total Touchpoints</div>
                  <div className="font-bold text-lg">{selectedJourney.totalTouchpoints}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-500">Status</div>
                  <div className={`font-bold text-lg ${selectedJourney.converted ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedJourney.converted ? 'Converted' : 'Active'}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Touchpoint Timeline</h3>
                {selectedJourney.touchpoints.map((touchpoint, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                      {index < selectedJourney.touchpoints.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 flex-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(touchpoint.timestamp).toLocaleString()}
                      </div>
                      <div className="font-medium text-gray-900">{touchpoint.action}</div>
                      <div className="text-sm text-gray-600">{touchpoint.page}</div>
                      <div className="text-xs text-indigo-600 mt-1">via {touchpoint.channel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
