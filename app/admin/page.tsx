'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface TeamMember {
  id: string
  name: string
  role: string
  description: string
  imagePath: string
  initials: string
  href?: string
}

interface SiteSettings {
  logoPath: string
  footerLogoPath: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ logoPath: '', footerLogoPath: '' })
  const [activeTab, setActiveTab] = useState<'team' | 'logos'>('team')
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({})
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
      loadTeamMembers()
      loadSiteSettings()
    }
  }, [])

  const handleLogin = async () => {
    if (password === 'designrite2025admin') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'authenticated')
      loadTeamMembers()
      loadSiteSettings()
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
  }

  const loadTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/team')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      }
    } catch (error) {
      console.error('Failed to load team members:', error)
    }
  }

  const loadSiteSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSiteSettings(data)
      }
    } catch (error) {
      console.error('Failed to load site settings:', error)
    }
  }

  const handlePhotoUpload = async (file: File, memberId?: string) => {
    setUploadingPhoto(true)
    const formData = new FormData()
    formData.append('photo', file)
    if (memberId) formData.append('memberId', memberId)

    try {
      const response = await fetch('/api/admin/upload-photo', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        if (memberId) {
          setTeamMembers(prev => prev.map(member =>
            member.id === memberId
              ? { ...member, imagePath: data.imagePath }
              : member
          ))
        }
        return data.imagePath
      }
    } catch (error) {
      console.error('Failed to upload photo:', error)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleLogoUpload = async (file: File, type: 'header' | 'footer') => {
    setUploadingLogo(true)
    const formData = new FormData()
    formData.append('logo', file)
    formData.append('type', type)

    try {
      const response = await fetch('/api/admin/upload-logo', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setSiteSettings(prev => ({
          ...prev,
          [type === 'header' ? 'logoPath' : 'footerLogoPath']: data.logoPath
        }))
      }
    } catch (error) {
      console.error('Failed to upload logo:', error)
    } finally {
      setUploadingLogo(false)
    }
  }

  const saveTeamMember = async (member: TeamMember) => {
    try {
      const response = await fetch('/api/admin/team', {
        method: member.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      })

      if (response.ok) {
        loadTeamMembers()
        setEditingMember(null)
        setNewMember({})
      }
    } catch (error) {
      console.error('Failed to save team member:', error)
    }
  }

  const deleteTeamMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        const response = await fetch(`/api/admin/team/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          loadTeamMembers()
        }
      } catch (error) {
        console.error('Failed to delete team member:', error)
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 max-w-md w-full mx-4">
          <h1 className="text-3xl font-black text-white mb-6 text-center">Admin Login</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 bg-gray-800/30 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'team'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Team Management
          </button>
          <button
            onClick={() => setActiveTab('logos')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'logos'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Logo Management
          </button>
        </div>

        {activeTab === 'team' && (
          <div className="space-y-8">
            {/* Add New Member */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Add New Team Member</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newMember.name || ''}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={newMember.role || ''}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                />
                <input
                  type="text"
                  placeholder="Initials"
                  value={newMember.initials || ''}
                  onChange={(e) => setNewMember(prev => ({ ...prev, initials: e.target.value }))}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                />
                <input
                  type="url"
                  placeholder="Website URL (optional)"
                  value={newMember.href || ''}
                  onChange={(e) => setNewMember(prev => ({ ...prev, href: e.target.value }))}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                />
                <textarea
                  placeholder="Description"
                  value={newMember.description || ''}
                  onChange={(e) => setNewMember(prev => ({ ...prev, description: e.target.value }))}
                  className="md:col-span-2 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600 h-24 resize-none"
                />
                <div className="md:col-span-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const imagePath = await handlePhotoUpload(file)
                        if (imagePath) {
                          setNewMember(prev => ({ ...prev, imagePath }))
                        }
                      }
                    }}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                </div>
                <button
                  onClick={() => saveTeamMember({
                    ...newMember,
                    id: Date.now().toString(),
                    imagePath: newMember.imagePath || `/team/placeholder.jpg`
                  } as TeamMember)}
                  disabled={!newMember.name || !newMember.role}
                  className="md:col-span-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Team Member
                </button>
              </div>
            </div>

            {/* Existing Team Members */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Current Team Members</h2>
              <div className="grid gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      {member.imagePath ? (
                        <Image
                          src={member.imagePath}
                          alt={member.name}
                          width={64}
                          height={64}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold">
                          {member.initials}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-purple-400">{member.role}</p>
                      <p className="text-gray-400 text-sm">{member.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            await handlePhotoUpload(file, member.id)
                          }
                        }}
                        className="hidden"
                        id={`photo-${member.id}`}
                      />
                      <label
                        htmlFor={`photo-${member.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        Upload Photo
                      </label>
                      <button
                        onClick={() => deleteTeamMember(member.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logos' && (
          <div className="space-y-8">
            {/* Header Logo */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Header Logo</h2>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-gray-700/50 rounded-lg flex items-center justify-center">
                  {siteSettings.logoPath ? (
                    <Image
                      src={siteSettings.logoPath}
                      alt="Header Logo"
                      width={128}
                      height={128}
                      className="rounded-lg object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">No Logo</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleLogoUpload(file, 'header')
                    }}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  <p className="text-gray-400 text-sm mt-2">Recommended: 200x50px, PNG format</p>
                </div>
              </div>
            </div>

            {/* Footer Logo */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Footer Logo</h2>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-gray-700/50 rounded-lg flex items-center justify-center">
                  {siteSettings.footerLogoPath ? (
                    <Image
                      src={siteSettings.footerLogoPath}
                      alt="Footer Logo"
                      width={128}
                      height={128}
                      className="rounded-lg object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">No Logo</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleLogoUpload(file, 'footer')
                    }}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  <p className="text-gray-400 text-sm mt-2">Recommended: 100x25px, PNG format</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}