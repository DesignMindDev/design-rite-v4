'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { useRouter } from 'next/navigation'

interface TestRun {
  id: string
  test_suite: string
  status: 'running' | 'completed' | 'failed'
  total_tests: number
  passed_tests: number
  failed_tests: number
  duration_ms: number
  started_at: string
  triggered_by: 'manual' | 'schedule' | 'ci_cd'
}

interface Schedule {
  id: string
  name: string
  test_suite: string
  cron_expression: string
  enabled: boolean
  last_run_at?: string
  next_run_at?: string
}

interface DashboardMetrics {
  totalRuns: number
  successRate: number
  activeSchedules: number
  avgDuration: number
}

export default function TestingDashboard() {
  const auth = useSupabaseAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'runs' | 'schedules'>('overview')
  const [testRuns, setTestRuns] = useState<TestRun[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [selectedSuite, setSelectedSuite] = useState<string>('full')
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/admin/login?callbackUrl=/admin/testing')
      return
    }

    if (auth.isAuthenticated) {
      loadTestRuns()
      loadSchedules()
      loadMetrics()
    }
  }, [auth.isAuthenticated, auth.isLoading, router])

  const API_KEY = 'testing-service-key-12345'
  const HEADERS = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  }

  const loadTestRuns = async () => {
    try {
      const response = await fetch('http://localhost:9600/api/tests/results', {
        headers: HEADERS
      })
      if (response.ok) {
        const data = await response.json()
        setTestRuns(data.slice(0, 10)) // Latest 10 runs
      }
    } catch (error) {
      console.error('Failed to load test runs:', error)
    }
  }

  const loadSchedules = async () => {
    try {
      const response = await fetch('http://localhost:9600/api/schedules', {
        headers: HEADERS
      })
      if (response.ok) {
        const data = await response.json()
        setSchedules(data)
      }
    } catch (error) {
      console.error('Failed to load schedules:', error)
    }
  }

  const loadMetrics = async () => {
    // Calculate metrics from test runs
    try {
      const response = await fetch('http://localhost:9600/api/tests/results', {
        headers: HEADERS
      })
      if (response.ok) {
        const runs = await response.json()
        const completed = runs.filter((r: TestRun) => r.status === 'completed')
        const successRate = completed.length > 0
          ? (completed.reduce((sum: number, r: TestRun) => sum + (r.passed_tests / r.total_tests), 0) / completed.length) * 100
          : 0

        const schedResponse = await fetch('http://localhost:9600/api/schedules', {
          headers: HEADERS
        })
        const scheds = await schedResponse.json()
        const activeScheds = scheds.filter((s: Schedule) => s.enabled).length

        setMetrics({
          totalRuns: runs.length,
          successRate: Math.round(successRate),
          activeSchedules: activeScheds,
          avgDuration: Math.round(completed.reduce((sum: number, r: TestRun) => sum + r.duration_ms, 0) / (completed.length || 1) / 1000)
        })
      }
    } catch (error) {
      console.error('Failed to load metrics:', error)
    }
  }

  const runTests = async () => {
    setIsRunning(true)
    try {
      const response = await fetch('http://localhost:9600/api/tests/run', {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          test_suite: selectedSuite,
          user_id: auth.user?.id,
          context: {}
        })
      })

      if (response.ok) {
        alert('Test run started! Refreshing results...')
        setTimeout(() => {
          loadTestRuns()
          loadMetrics()
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to run tests:', error)
      alert('Failed to start test run. Is the testing service running on port 9600?')
    } finally {
      setIsRunning(false)
    }
  }

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
                Testing Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Automated testing & monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Admin
              </Link>
            </div>
          </div>

          {/* Service Status Banner */}
          <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-600/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <div>
                  <div className="text-sm font-semibold text-green-400">Service Operational</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Testing service running on port 9600 • Database connected • Scheduler active
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="text-center">
                  <div className="text-white font-semibold">{metrics?.totalRuns || 0}</div>
                  <div>Total Runs</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">{metrics?.successRate || 0}%</div>
                  <div>Success</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-semibold">{metrics?.activeSchedules || 0}</div>
                  <div>Schedules</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-gray-800/30 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('runs')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'runs'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Test Runs
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'schedules'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Schedules
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total Runs */}
              <div className="group bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 hover:border-purple-600/40 transition-all cursor-help relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Total Runs</span>
                  <span className="text-2xl">▶</span>
                </div>
                <div className="text-3xl font-bold">{metrics?.totalRuns || 0}</div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 border border-purple-600/40 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="text-sm font-semibold text-purple-400 mb-1">Total Test Runs</div>
                  <div className="text-xs text-gray-300">
                    Total number of test executions across all suites. Includes manual runs, scheduled runs, and CI/CD triggers.
                  </div>
                </div>
              </div>

              {/* Success Rate */}
              <div className="group bg-gray-800/60 backdrop-blur-xl border border-green-600/20 rounded-2xl p-6 hover:border-green-600/40 transition-all cursor-help relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Success Rate</span>
                  <span className="text-2xl">✓</span>
                </div>
                <div className="text-3xl font-bold text-green-400">{metrics?.successRate || 0}%</div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 border border-green-600/40 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="text-sm font-semibold text-green-400 mb-1">Success Rate</div>
                  <div className="text-xs text-gray-300">
                    Percentage of test runs with all tests passing. Calculated as (passed tests / total tests) across all completed runs.
                  </div>
                </div>
              </div>

              {/* Active Schedules */}
              <div className="group bg-gray-800/60 backdrop-blur-xl border border-blue-600/20 rounded-2xl p-6 hover:border-blue-600/40 transition-all cursor-help relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Active Schedules</span>
                  <span className="text-2xl">⏰</span>
                </div>
                <div className="text-3xl font-bold text-blue-400">{metrics?.activeSchedules || 0}</div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 border border-blue-600/40 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="text-sm font-semibold text-blue-400 mb-1">Active Schedules</div>
                  <div className="text-xs text-gray-300">
                    Number of enabled test schedules. These run automatically based on cron expressions (e.g., nightly, weekly).
                  </div>
                </div>
              </div>

              {/* Avg Duration */}
              <div className="group bg-gray-800/60 backdrop-blur-xl border border-orange-600/20 rounded-2xl p-6 hover:border-orange-600/40 transition-all cursor-help relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Avg Duration</span>
                  <span className="text-2xl">⏱</span>
                </div>
                <div className="text-3xl font-bold text-orange-400">{metrics?.avgDuration || 0}s</div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 border border-orange-600/40 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="text-sm font-semibold text-orange-400 mb-1">Average Duration</div>
                  <div className="text-xs text-gray-300">
                    Average time to complete a test suite. Helps identify performance regressions and optimize test execution.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Test Runner */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold">Quick Test Runner</h2>
                <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-xs font-medium">
                  Instant Execution
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Test Suite
                  </label>
                  <select
                    value={selectedSuite}
                    onChange={(e) => setSelectedSuite(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-600 hover:border-purple-600/50 transition-colors"
                  >
                    <option value="stress">🔥 Stress Tests</option>
                    <option value="security">🛡️ Security Tests</option>
                    <option value="ux">✨ UX Tests</option>
                    <option value="admin">⚙️ Admin Tests</option>
                    <option value="full">🚀 Full Suite</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={runTests}
                    disabled={isRunning}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isRunning ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          ▶ Run Tests Now
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 transform translate-y-full group-hover:translate-y-0 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <span>📋</span> Test Suites Overview
                </h3>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li className="flex items-start gap-2 hover:text-gray-300 transition-colors">
                    <span className="text-orange-400 mt-0.5">🔥</span>
                    <div>
                      <strong className="text-white">Stress:</strong> Concurrent requests, rate limiting, large payloads
                      <span className="text-xs text-gray-500 ml-2">(~15 tests)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 hover:text-gray-300 transition-colors">
                    <span className="text-blue-400 mt-0.5">🛡️</span>
                    <div>
                      <strong className="text-white">Security:</strong> SQL injection, XSS, auth bypass, CSRF
                      <span className="text-xs text-gray-500 ml-2">(~20 tests)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 hover:text-gray-300 transition-colors">
                    <span className="text-purple-400 mt-0.5">✨</span>
                    <div>
                      <strong className="text-white">UX:</strong> User workflows, data population, form validation
                      <span className="text-xs text-gray-500 ml-2">(~12 tests)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 hover:text-gray-300 transition-colors">
                    <span className="text-green-400 mt-0.5">⚙️</span>
                    <div>
                      <strong className="text-white">Admin:</strong> Admin panel, permissions, CRUD operations
                      <span className="text-xs text-gray-500 ml-2">(~10 tests)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 hover:text-gray-300 transition-colors">
                    <span className="text-yellow-400 mt-0.5">🚀</span>
                    <div>
                      <strong className="text-white">Full:</strong> All tests combined (recommended for nightly runs)
                      <span className="text-xs text-gray-500 ml-2">(~57 tests, 5-10 min)</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Recent Test Runs */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Test Runs</h2>
                <button
                  onClick={loadTestRuns}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
              {testRuns.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">🧪</div>
                  <p>No test runs yet</p>
                  <p className="text-sm mt-2">Run your first test suite above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testRuns.map((run) => (
                    <div
                      key={run.id}
                      className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-all border border-transparent hover:border-purple-600/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Status Indicator */}
                          <div className={`w-3 h-3 rounded-full ${
                            run.status === 'completed' ? 'bg-green-400' :
                            run.status === 'running' ? 'bg-blue-400 animate-pulse' :
                            'bg-red-400'
                          }`} />

                          {/* Test Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="font-semibold capitalize">{run.test_suite} Tests</div>

                              {/* Status Badge */}
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                run.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                                run.status === 'running' ? 'bg-blue-600/20 text-blue-400' :
                                'bg-red-600/20 text-red-400'
                              }`}>
                                {run.status === 'completed' ? 'Completed' :
                                 run.status === 'running' ? 'Running' : 'Failed'}
                              </span>

                              {/* Trigger Type */}
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600/30 text-gray-400">
                                {run.triggered_by === 'manual' ? '👤 Manual' :
                                 run.triggered_by === 'schedule' ? '⏰ Scheduled' :
                                 '🤖 CI/CD'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {new Date(run.started_at).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Results */}
                        <div className="flex items-center gap-6">
                          {run.status === 'completed' && (
                            <>
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <span className="text-green-400 font-semibold">
                                    ✓ {run.passed_tests}
                                  </span>
                                  {run.failed_tests > 0 && (
                                    <span className="text-red-400 font-semibold">
                                      ✗ {run.failed_tests}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {run.total_tests} total • {Math.round(run.duration_ms / 1000)}s
                                </div>
                              </div>

                              {/* Success Rate Badge */}
                              <div className={`px-3 py-2 rounded-lg text-center ${
                                (run.passed_tests / run.total_tests) === 1
                                  ? 'bg-green-600/20 text-green-400'
                                  : (run.passed_tests / run.total_tests) >= 0.8
                                  ? 'bg-yellow-600/20 text-yellow-400'
                                  : 'bg-red-600/20 text-red-400'
                              }`}>
                                <div className="text-lg font-bold">
                                  {Math.round((run.passed_tests / run.total_tests) * 100)}%
                                </div>
                                <div className="text-xs">Pass Rate</div>
                              </div>
                            </>
                          )}
                          {run.status === 'running' && (
                            <div className="text-blue-400 font-semibold animate-pulse">
                              Running...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Runs Tab */}
        {activeTab === 'runs' && (
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">All Test Runs</h2>
            {/* Full test runs table - to be implemented */}
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">📊</div>
              <p>Full test history coming soon</p>
            </div>
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && (
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">Test Schedules</h2>
            {schedules.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">⏰</div>
                <p>No schedules configured</p>
                <p className="text-sm mt-2">Schedule builder coming soon!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{schedule.name}</div>
                        <div className="text-sm text-gray-400">
                          {schedule.test_suite} • {schedule.cron_expression}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        schedule.enabled
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {schedule.enabled ? 'Active' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
