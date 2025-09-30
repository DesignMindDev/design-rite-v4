'use client'

import { useState, useEffect } from 'react'
import { sessionManager } from '../../../lib/sessionManager'

export default function SessionDebugPage() {
  const [sessionSummary, setSessionSummary] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [supabaseProjects, setSupabaseProjects] = useState<any[]>([])

  useEffect(() => {
    loadSessionData()
  }, [])

  const loadSessionData = async () => {
    const summary = sessionManager.getSessionSummary()
    const localProjects = sessionManager.getUserProjects()
    const remoteProjects = await sessionManager.getSupabaseProjects()

    setSessionSummary(summary)
    setProjects(localProjects)
    setSupabaseProjects(remoteProjects)
  }

  const createTestProject = () => {
    const user = sessionManager.getOrCreateUser({
      email: 'test@example.com',
      name: 'Test User',
      company: 'Test Company'
    })

    const project = sessionManager.createOrUpdateProject({
      projectName: 'Test Security Project',
      facilitySize: 25000,
      facilityType: 'Office Building',
      estimatedCost: 125000,
      systems: ['surveillance', 'accessControl'],
      phase: {
        tool: 'quick-estimate',
        data: { test: true }
      }
    })

    console.log('Created test project:', project)
    loadSessionData()
  }

  const clearSessions = () => {
    sessionManager.clearAllSessions()
    loadSessionData()
  }

  const syncToSupabase = async () => {
    if (sessionSummary?.user && sessionSummary?.project) {
      await sessionManager.syncToSupabase(sessionSummary.user, sessionSummary.project)
      loadSessionData()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session & Project Debug Panel</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Session */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Current Session</h2>
            {sessionSummary?.user ? (
              <div className="space-y-2 text-sm">
                <p><strong>User ID:</strong> {sessionSummary.user.userId}</p>
                <p><strong>Type:</strong> {sessionSummary.user.userType}</p>
                <p><strong>Email:</strong> {sessionSummary.user.email || 'N/A'}</p>
                <p><strong>Company:</strong> {sessionSummary.user.company || 'N/A'}</p>
                <p><strong>Created:</strong> {new Date(sessionSummary.user.createdAt).toLocaleString()}</p>
                <p><strong>Last Active:</strong> {new Date(sessionSummary.user.lastActive).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-gray-400">No active session</p>
            )}
          </div>

          {/* Current Project */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Current Project</h2>
            {sessionSummary?.project ? (
              <div className="space-y-2 text-sm">
                <p><strong>Project ID:</strong> {sessionSummary.project.projectId}</p>
                <p><strong>Name:</strong> {sessionSummary.project.projectName}</p>
                <p><strong>Facility Size:</strong> {sessionSummary.project.facilitySize?.toLocaleString()} sq ft</p>
                <p><strong>Estimated Cost:</strong> ${sessionSummary.project.estimatedCost?.toLocaleString()}</p>
                <p><strong>Systems:</strong> {sessionSummary.project.systems?.join(', ')}</p>
                <p><strong>Status:</strong> {sessionSummary.project.status}</p>
                <p><strong>Phases:</strong> {sessionSummary.project.phases?.length}</p>
                <p><strong>Supabase ID:</strong> {sessionSummary.project.supabaseProjectId || 'Not synced'}</p>
              </div>
            ) : (
              <p className="text-gray-400">No active project</p>
            )}
          </div>

          {/* Local Projects */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Local Projects ({projects.length})</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {projects.map((project, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <p className="font-semibold">{project.projectName}</p>
                  <p className="text-sm text-gray-300">
                    {project.facilitySize ? `${project.facilitySize.toLocaleString()} sq ft` : 'Size unknown'}
                    {project.estimatedCost ? ` • $${project.estimatedCost.toLocaleString()}` : ''}
                  </p>
                  <p className="text-xs text-gray-400">
                    {project.phases?.length} phases • {project.status}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Supabase Projects */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Supabase Projects ({supabaseProjects.length})</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {supabaseProjects.map((project, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <p className="font-semibold">{project.name}</p>
                  <p className="text-sm text-gray-300">
                    ID: {project.id} • {project.facility_size ? `${project.facility_size.toLocaleString()} sq ft` : 'Size unknown'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {supabaseProjects.length === 0 && (
                <p className="text-gray-400 text-sm">No projects in Supabase (requires authentication)</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={createTestProject}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Create Test Project
          </button>
          <button
            onClick={syncToSupabase}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Sync to Supabase
          </button>
          <button
            onClick={loadSessionData}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Refresh Data
          </button>
          <button
            onClick={clearSessions}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Clear All Sessions
          </button>
        </div>

        {/* User Journey Tracking */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">User Journey Analysis</h2>
          {sessionSummary?.project?.phases && sessionSummary.project.phases.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-300 mb-4">
                <strong>Journey Progress:</strong> {sessionSummary.project.phases.length} phases completed
              </div>
              {sessionSummary.project.phases.map((phase: any, index: number) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4 py-2 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-purple-300">{phase.phaseName}</h4>
                      <p className="text-sm text-gray-400">Tool: {phase.tool}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(phase.completedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-xs bg-purple-600 px-2 py-1 rounded">
                      Step {index + 1}
                    </div>
                  </div>
                  {phase.data && (
                    <div className="mt-2">
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-400 hover:text-white">
                          View Data
                        </summary>
                        <pre className="mt-2 text-gray-300 bg-gray-900 p-2 rounded overflow-x-auto">
                          {JSON.stringify(phase.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No user journey data available</p>
          )}
        </div>

        {/* Admin Analytics Summary */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Admin Analytics Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-green-400">Entry Point</h3>
              <p className="text-sm text-gray-300">
                {sessionSummary?.project?.phases?.[0]?.data?.entry_point || 'Unknown'}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400">Journey Length</h3>
              <p className="text-sm text-gray-300">
                {sessionSummary?.project?.phases?.length || 0} phases
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-purple-400">Completion Status</h3>
              <p className="text-sm text-gray-300">
                {sessionSummary?.project?.status || 'Active'}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-400">Tools Used</h3>
              <p className="text-sm text-gray-300">
                {sessionSummary?.project?.phases ?
                  [...new Set(sessionSummary.project.phases.map((p: any) => p.tool))].join(', ') :
                  'None'
                }
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-pink-400">Estimated Value</h3>
              <p className="text-sm text-gray-300">
                {sessionSummary?.project?.estimatedCost ?
                  `$${sessionSummary.project.estimatedCost.toLocaleString()}` :
                  'Not calculated'
                }
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-cyan-400">User Type</h3>
              <p className="text-sm text-gray-300">
                {sessionSummary?.user?.userType || 'Unknown'}
                {sessionSummary?.user?.email && ` (${sessionSummary.user.email})`}
              </p>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Debug Info</h2>
          <pre className="text-xs text-gray-300 overflow-x-auto">
            {JSON.stringify({
              sessionSummary,
              localProjects: projects.length,
              supabaseProjects: supabaseProjects.length
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}