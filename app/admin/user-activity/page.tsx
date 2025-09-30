'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Activity, Users, MapPin, DollarSign, Clock, BarChart3, RefreshCw, Filter, Eye, MessageSquare } from 'lucide-react'

interface UserJourney {
  userId: string
  userType: 'guest' | 'authenticated'
  email?: string
  company?: string
  entryPoint: string
  currentTool: string
  journeySteps: JourneyStep[]
  totalValue?: number
  status: 'active' | 'completed' | 'abandoned'
  lastActivity: string
  duration: number
}

interface JourneyStep {
  stepId: string
  tool: string
  action: string
  timestamp: string
  data: any
  duration?: number
}

interface SupabaseActivity {
  id: number
  session_id: string
  user_id?: string
  guest_id?: string
  tool_used: string
  session_data: any
  status: string
  created_at: string
  updated_at: string
}

export default function UserActivityAdminPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activities, setActivities] = useState<SupabaseActivity[]>([])
  const [journeys, setJourneys] = useState<UserJourney[]>([])
  const [selectedJourney, setSelectedJourney] = useState<UserJourney | null>(null)
  const [filter, setFilter] = useState('all') // all, active, completed, abandoned
  const [timeFilter, setTimeFilter] = useState('today') // today, week, month, all
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJourneys: 0,
    completedJourneys: 0,
    abandonedJourneys: 0,
    avgJourneyLength: 0,
    totalValue: 0,
    topEntryPoint: '',
    conversionRate: 0
  })

  useEffect(() => {
    loadUserActivity()
  }, [timeFilter, filter])

  const loadUserActivity = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get date filter
      const dateFilter = getDateFilter()

      // Load from Supabase ai_sessions table
      let query = supabase
        .from('ai_sessions')
        .select('*')
        .order('created_at', { ascending: false })

      if (dateFilter) {
        query = query.gte('created_at', dateFilter)
      }

      const { data: supabaseData, error: supabaseError } = await query

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        setError(`Supabase error: ${supabaseError.message}`)
      } else {
        console.log('📊 Loaded Supabase activities:', supabaseData?.length || 0)
        setActivities(supabaseData || [])
      }

      // Also load local session data for comprehensive view
      const localJourneys = loadLocalJourneys()
      const combinedJourneys = combineSupabaseAndLocal(supabaseData || [], localJourneys)

      setJourneys(combinedJourneys)
      calculateStats(combinedJourneys)

    } catch (error) {
      console.error('Error loading user activity:', error)
      setError(`Failed to load user activity: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getDateFilter = () => {
    const now = new Date()
    switch (timeFilter) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return weekAgo.toISOString()
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return monthAgo.toISOString()
      default:
        return null
    }
  }

  const loadLocalJourneys = (): UserJourney[] => {
    // This would aggregate local session data
    // For now, return empty array - real implementation would parse localStorage
    return []
  }

  const combineSupabaseAndLocal = (supabaseData: SupabaseActivity[], localJourneys: UserJourney[]): UserJourney[] => {
    const journeyMap = new Map<string, UserJourney>()

    // Process Supabase activities
    supabaseData.forEach(activity => {
      const userId = activity.user_id || activity.guest_id || 'unknown'
      const sessionId = activity.session_id

      if (!journeyMap.has(userId)) {
        journeyMap.set(userId, {
          userId,
          userType: activity.user_id ? 'authenticated' : 'guest',
          email: activity.session_data?.email,
          company: activity.session_data?.company,
          entryPoint: activity.session_data?.entry_point || activity.tool_used,
          currentTool: activity.tool_used,
          journeySteps: [],
          totalValue: activity.session_data?.estimatedCost,
          status: activity.status as any || 'active',
          lastActivity: activity.updated_at || activity.created_at,
          duration: 0
        })
      }

      const journey = journeyMap.get(userId)!
      journey.journeySteps.push({
        stepId: `${activity.id}`,
        tool: activity.tool_used,
        action: activity.session_data?.action || 'session_activity',
        timestamp: activity.created_at,
        data: activity.session_data
      })

      // Update journey info
      if (new Date(activity.created_at) > new Date(journey.lastActivity)) {
        journey.lastActivity = activity.created_at
        journey.currentTool = activity.tool_used
      }
    })

    return Array.from(journeyMap.values())
      .filter(journey => {
        if (filter === 'all') return true
        return journey.status === filter
      })
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
  }

  const calculateStats = (journeys: UserJourney[]) => {
    const completed = journeys.filter(j => j.status === 'completed')
    const active = journeys.filter(j => j.status === 'active')
    const abandoned = journeys.filter(j => j.status === 'abandoned')

    const totalValue = journeys.reduce((sum, j) => sum + (j.totalValue || 0), 0)
    const avgLength = journeys.length > 0
      ? journeys.reduce((sum, j) => sum + j.journeySteps.length, 0) / journeys.length
      : 0

    const entryPoints = journeys.map(j => j.entryPoint)
    const topEntryPoint = entryPoints.length > 0
      ? entryPoints.reduce((a, b, i, arr) =>
          arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        )
      : 'None'

    const conversionRate = journeys.length > 0
      ? (completed.length / journeys.length) * 100
      : 0

    setStats({
      totalUsers: journeys.length,
      activeJourneys: active.length,
      completedJourneys: completed.length,
      abandonedJourneys: abandoned.length,
      avgJourneyLength: Math.round(avgLength * 10) / 10,
      totalValue,
      topEntryPoint,
      conversionRate: Math.round(conversionRate * 10) / 10
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10'
      case 'active': return 'text-blue-400 bg-blue-400/10'
      case 'abandoned': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'security-estimate': return '📊'
      case 'ai-discovery': return '🔍'
      case 'ai-assistant': return '🤖'
      case 'estimate-options': return '🎯'
      default: return '📋'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Activity Dashboard</h1>
          <p className="text-gray-400">
            Track user journeys across security estimation tools with real-time Supabase integration
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Journeys</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="abandoned">Abandoned</option>
          </select>

          <button
            onClick={loadUserActivity}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Journeys</p>
                <p className="text-2xl font-bold text-blue-400">{stats.activeJourneys}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-400">{stats.conversionRate}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-purple-400">
                  ${stats.totalValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading user activity...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Journeys List */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">User Journeys ({journeys.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {journeys.map((journey, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedJourney(journey)}
                    className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">
                          {journey.email || journey.company || `User ${journey.userId.slice(-6)}`}
                        </p>
                        <p className="text-sm text-gray-400">
                          {getToolIcon(journey.currentTool)} {journey.currentTool}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(journey.status)}`}>
                        {journey.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{journey.journeySteps.length} steps</span>
                      <span>{journey.totalValue ? `$${journey.totalValue.toLocaleString()}` : 'No value'}</span>
                      <span>{new Date(journey.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {journeys.length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    No user journeys found for the selected filters
                  </p>
                )}
              </div>
            </div>

            {/* Journey Details */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Journey Details</h2>
              {selectedJourney ? (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">User Information</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>ID:</strong> {selectedJourney.userId}</p>
                      <p><strong>Type:</strong> {selectedJourney.userType}</p>
                      {selectedJourney.email && <p><strong>Email:</strong> {selectedJourney.email}</p>}
                      {selectedJourney.company && <p><strong>Company:</strong> {selectedJourney.company}</p>}
                      <p><strong>Entry Point:</strong> {selectedJourney.entryPoint}</p>
                      <p><strong>Status:</strong>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedJourney.status)}`}>
                          {selectedJourney.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Journey Steps ({selectedJourney.journeySteps.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedJourney.journeySteps.map((step, index) => (
                        <div key={index} className="border-l-4 border-purple-500 pl-3 py-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-semibold">
                                {getToolIcon(step.tool)} {step.action}
                              </p>
                              <p className="text-xs text-gray-400">{step.tool}</p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(step.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {step.data && (
                            <details className="mt-2">
                              <summary className="text-xs cursor-pointer text-gray-400">View Data</summary>
                              <pre className="text-xs text-gray-300 mt-1 overflow-x-auto">
                                {JSON.stringify(step.data, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  Select a user journey to view details
                </p>
              )}
            </div>
          </div>
        )}

        {/* Raw Supabase Data Debug */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Raw Supabase Data ({activities.length} records)</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activities.slice(0, 10).map((activity, index) => (
              <div key={index} className="bg-gray-700 rounded p-3 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p><strong>Tool:</strong> {activity.tool_used}</p>
                    <p><strong>Session:</strong> {activity.session_id}</p>
                    <p><strong>User:</strong> {activity.user_id || activity.guest_id || 'Unknown'}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </div>
                {activity.session_data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-gray-400">View Session Data</summary>
                    <pre className="text-xs text-gray-300 mt-1 overflow-x-auto">
                      {JSON.stringify(activity.session_data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                No Supabase activities found. This could indicate:
                <br />• Session tracking not being called
                <br />• Supabase connection issues
                <br />• No user activity in selected time range
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}