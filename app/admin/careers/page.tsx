'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Application {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  position_applied: string
  department: string
  location_preference: string
  years_experience: string
  current_company: string
  current_role: string
  application_status: string
  linkedin_url: string
  portfolio_url: string
  cover_letter: string
  salary_expectations: string
  available_start_date: string
  referral_source: string
  notes: string
}

export default function CareerAdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPosition, setFilterPosition] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, filterStatus, filterPosition, searchTerm])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/careers/applications')
      const data = await response.json()
      setApplications(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching applications:', error)
      setIsLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.application_status === filterStatus)
    }
    
    if (filterPosition !== 'all') {
      filtered = filtered.filter(app => app.position_applied === filterPosition)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredApplications(filtered)
  }

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/careers/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application_status: status })
      })
      
      if (response.ok) {
        fetchApplications()
        if (selectedApplication?.id === id) {
          setSelectedApplication({...selectedApplication, application_status: status})
        }
      }
    } catch (error) {
      console.error('Error updating application:', error)
    }
  }

  const addNote = async (id: string, note: string) => {
    try {
      const response = await fetch(`/api/careers/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: note })
      })
      
      if (response.ok) {
        fetchApplications()
        if (selectedApplication?.id === id) {
          setSelectedApplication({...selectedApplication, notes: note})
        }
      }
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const exportApplications = () => {
    const csv = [
      ['Name', 'Email', 'Position', 'Experience', 'Status', 'Applied Date'],
      ...filteredApplications.map(app => [
        `${app.first_name} ${app.last_name}`,
        app.email,
        app.position_applied,
        app.years_experience,
        app.application_status,
        new Date(app.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `career-applications-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const statusColors = {
    new: 'bg-blue-600',
    reviewing: 'bg-yellow-600',
    interviewed: 'bg-purple-600',
    offered: 'bg-green-600',
    rejected: 'bg-red-600',
    withdrawn: 'bg-gray-600'
  }

  const positions = [...new Set(applications.map(app => app.position_applied))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      {/* Header */}
      <header className="bg-black/95 border-b border-purple-600/20 py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Career Applications Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage and review job applications</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={exportApplications}
              className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-600/30 transition-all"
            >
              Export CSV
            </button>
            <Link href="/" className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-600/20">
            <div className="text-3xl font-bold text-white">{applications.length}</div>
            <div className="text-gray-400 mt-1">Total Applications</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-600/20">
            <div className="text-3xl font-bold text-blue-400">
              {applications.filter(app => app.application_status === 'new').length}
            </div>
            <div className="text-gray-400 mt-1">New Applications</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-600/20">
            <div className="text-3xl font-bold text-yellow-400">
              {applications.filter(app => app.application_status === 'reviewing').length}
            </div>
            <div className="text-gray-400 mt-1">Under Review</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-600/20">
            <div className="text-3xl font-bold text-green-400">
              {applications.filter(app => app.application_status === 'interviewed').length}
            </div>
            <div className="text-gray-400 mt-1">Interviewed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-600/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name or email..."
                className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="interviewed">Interviewed</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Position</label>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white"
              >
                <option value="all">All Positions</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                  setFilterPosition('all')
                }}
                className="w-full bg-purple-600/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-600/30 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-purple-600/20 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="text-gray-400">Loading applications...</div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400">No applications found</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/50 border-b border-purple-600/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-600/10">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {app.first_name} {app.last_name}
                          </div>
                          <div className="text-sm text-gray-400">{app.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{app.position_applied}</div>
                        <div className="text-xs text-gray-400">{app.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {app.years_experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full text-white ${statusColors[app.application_status as keyof typeof statusColors]}`}>
                          {app.application_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="text-purple-400 hover:text-purple-300 mr-4"
                        >
                          View
                        </button>
                        <select
                          value={app.application_status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          className="bg-black/50 border border-purple-600/30 rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="offered">Offered</option>
                          <option value="rejected">Rejected</option>
                          <option value="withdrawn">Withdrawn</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedApplication(null)} />
            
            <div className="relative bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-600/30 shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold text-white">
                  {selectedApplication.first_name} {selectedApplication.last_name}
                </h2>
                <p className="text-purple-100 mt-1">{selectedApplication.position_applied}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedApplication.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{selectedApplication.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">LinkedIn:</span>
                        {selectedApplication.linkedin_url ? (
                          <a href={selectedApplication.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                            View Profile
                          </a>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Portfolio:</span>
                        {selectedApplication.portfolio_url ? (
                          <a href={selectedApplication.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                            View Portfolio
                          </a>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Professional Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Company:</span>
                        <span className="text-white">{selectedApplication.current_company || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Role:</span>
                        <span className="text-white">{selectedApplication.current_role || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Experience:</span>
                        <span className="text-white">{selectedApplication.years_experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location Preference:</span>
                        <span className="text-white">{selectedApplication.location_preference}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-400 text-sm">Salary Expectations:</span>
                      <p className="text-white mt-1">{selectedApplication.salary_expectations || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Available Start Date:</span>
                      <p className="text-white mt-1">
                        {selectedApplication.available_start_date 
                          ? new Date(selectedApplication.available_start_date).toLocaleDateString()
                          : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Referral Source:</span>
                      <p className="text-white mt-1">{selectedApplication.referral_source || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApplication.cover_letter && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Cover Letter</h3>
                    <div className="bg-black/30 rounded-lg p-4">
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Internal Notes</h3>
                  <textarea
                    value={selectedApplication.notes || ''}
                    onChange={(e) => setSelectedApplication({...selectedApplication, notes: e.target.value})}
                    placeholder="Add notes about this applicant..."
                    className="w-full px-4 py-3 bg-black/50 border border-purple-600/30 rounded-lg text-white"
                    rows={4}
                  />
                  <button
                    onClick={() => addNote(selectedApplication.id, selectedApplication.notes)}
                    className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                  >
                    Save Notes
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-purple-600/20">
                  <select
                    value={selectedApplication.application_status}
                    onChange={(e) => updateApplicationStatus(selectedApplication.id, e.target.value)}
                    className="bg-black/50 border border-purple-600/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                  <button
                    onClick={() => window.location.href = `mailto:${selectedApplication.email}`}
                    className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-600/30 transition-all"
                  >
                    Send Email
                  </button>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="ml-auto bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


