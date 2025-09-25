'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as auth from '@/lib/auth'

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
  demoVideoUrl: string
}

interface VideoContent {
  id: string
  title: string
  description: string
  youtubeUrl: string
  type: 'demo' | 'testimonial' | 'tutorial' | 'company'
  isActive: boolean
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedDate: string
  featuredImage: string
  videoUrl: string
  tags: string[]
  published: boolean
}

interface TeamCode {
  id: string
  code: string
  memberName: string
  role: string
  isActive: boolean
  createdAt: string
  lastUsed?: string
  usageCount: number
}

interface ActivityLog {
  timestamp: string
  memberName: string
  code: string
  action: string
  ipAddress?: string
  userAgent?: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [password, setPassword] = useState('')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ logoPath: '', footerLogoPath: '', demoVideoUrl: '' })
  const [videos, setVideos] = useState<VideoContent[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [teamCodes, setTeamCodes] = useState<TeamCode[]>([])
  const [teamActivity, setTeamActivity] = useState<ActivityLog[]>([])
  const [activeTab, setActiveTab] = useState<'team' | 'logos' | 'videos' | 'blog' | 'team-codes' | 'activity'>('team')
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({})
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({})
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false)

  // Blog Management Functions
  const loadBlogPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      if (response.ok) {
        const data = await response.json()
        setBlogPosts(data)
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error)
    }
  }

  useEffect(() => {
    // Only check authentication after component mounts (client-side only)
    setIsMounted(true)

    const checkAuth = () => {
      if (auth.isAuthenticated()) {
        setIsAuthenticated(true)
        loadTeamMembers()
        loadSiteSettings()
        loadBlogPosts()
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async () => {
    if (auth.authenticate(password)) {
      setIsAuthenticated(true)
      loadTeamMembers()
      loadSiteSettings()
      loadBlogPosts()
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    auth.logout()
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
        const result = await response.json()
        console.log('Team member saved successfully:', result)
        loadTeamMembers()
        setEditingMember(null)
        setNewMember({})
        alert(`Team member ${member.id ? 'updated' : 'added'} successfully!`)
      } else {
        const errorData = await response.json()
        console.error('Failed to save team member:', errorData)
        alert(`Failed to save team member: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to save team member:', error)
      alert(`Failed to save team member: ${error.message}`)
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
          alert('Team member deleted successfully!')
        } else {
          const errorData = await response.json()
          console.error('Failed to delete team member:', errorData)
          alert(`Failed to delete team member: ${errorData.error || response.statusText}`)
        }
      } catch (error) {
        console.error('Failed to delete team member:', error)
        alert(`Failed to delete team member: ${error.message}`)
      }
    }
  }

  if (!isMounted) {
    return <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
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

  const handleBlogImageUpload = async (file: File): Promise<string | null> => {
    setUploadingBlogImage(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/admin/upload-blog-image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        return data.imagePath
      }
    } catch (error) {
      console.error('Failed to upload blog image:', error)
    } finally {
      setUploadingBlogImage(false)
    }
    return null
  }

  const saveBlogPost = async () => {
    if (!newPost.title || !newPost.content || !newPost.excerpt) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const postData = {
        ...newPost,
        publishedDate: newPost.publishedDate || new Date().toISOString(),
        tags: newPost.tags || [],
        published: newPost.published || false
      }

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        await loadBlogPosts()
        setNewPost({})
        alert('Blog post created successfully!')
      }
    } catch (error) {
      console.error('Failed to save blog post:', error)
      alert('Failed to save blog post')
    }
  }

  const updateBlogPost = async () => {
    if (!editingPost) return

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost)
      })

      if (response.ok) {
        await loadBlogPosts()
        setEditingPost(null)
        alert('Blog post updated successfully!')
      }
    } catch (error) {
      console.error('Failed to update blog post:', error)
      alert('Failed to update blog post')
    }
  }

  const deleteBlogPost = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`/api/admin/blog?id=${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadBlogPosts()
          alert('Blog post deleted successfully!')
        }
      } catch (error) {
        console.error('Failed to delete blog post:', error)
        alert('Failed to delete blog post')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/harvester"
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              <span>🗄️</span>
              Product Harvester
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 mb-8 bg-gray-800/30 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('team')}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'team'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Team
          </button>
          <button
            onClick={() => setActiveTab('logos')}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'logos'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Logos
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'videos'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'blog'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Blog
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

        {activeTab === 'videos' && (
          <div className="space-y-8">
            {/* Demo Video Management */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Demo Video</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    YouTube Video URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={siteSettings.demoVideoUrl || ''}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, demoVideoUrl: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    This video will be shown when users click "Watch Demo"
                  </p>
                </div>
                {siteSettings.demoVideoUrl && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <iframe
                        src={siteSettings.demoVideoUrl.replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/admin/settings', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(siteSettings),
                      });
                      if (response.ok) {
                        alert('Demo video saved successfully!');
                      }
                    } catch (error) {
                      console.error('Failed to save demo video:', error);
                    }
                  }}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all"
                >
                  Save Demo Video
                </button>
              </div>
            </div>

            {/* YouTube Channel Integration */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">YouTube Channel</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/@designrite"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    Link to your YouTube channel for marketing purposes
                  </p>
                </div>
              </div>
            </div>

            {/* Video Library Placeholder */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Video Library</h2>
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">🎥</div>
                <p>Video library coming soon!</p>
                <p className="text-sm mt-2">Manage testimonials, tutorials, and promotional videos.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-8">
            {/* Blog Topic Ideas */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">📝 Blog Content Ideas</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { category: "Problem-Focused", color: "red", ideas: [
                    "The 3 AM Email: When Clients Change Everything",
                    "Death by a Thousand Assumptions",
                    "The Compliance Nightmare: FERPA, HIPAA & You",
                    "When Your BOM Becomes Your Enemy"
                  ]},
                  { category: "Solution-Focused", color: "green", ideas: [
                    "5 Signs Your Security Estimate is Dead Wrong",
                    "The AI Advantage: From Days to Minutes",
                    "Compliance Made Simple: Templates That Actually Work",
                    "Virtual Site Walks: The Future is Here"
                  ]},
                  { category: "Industry-Specific", color: "blue", ideas: [
                    "School Security: Beyond the Buzzwords",
                    "Healthcare Security: Patient Privacy First",
                    "Enterprise vs. SMB: Two Different Worlds"
                  ]},
                  { category: "Behind-the-Scenes", color: "purple", ideas: [
                    "Building Design-Rite: A Sales Engineer's Perspective",
                    "Real Talk: 3,000+ Products Later",
                    "Customer Spotlight: From Chaos to Calm"
                  ]},
                  { category: "Actionable Tips", color: "yellow", ideas: [
                    "The Ultimate RFP Response Checklist",
                    "Pricing Intelligence: Reading Between the Lines",
                    "10 Questions Every Security Assessment Must Ask"
                  ]}
                ].map((section) => (
                  <div key={section.category} className={`bg-${section.color}-600/10 border border-${section.color}-600/20 rounded-lg p-4`}>
                    <h3 className={`text-${section.color}-400 font-bold mb-3 text-sm uppercase tracking-wider`}>{section.category}</h3>
                    <ul className="space-y-2">
                      {section.ideas.map((idea, index) => (
                        <li key={index} className="text-gray-300 text-sm leading-relaxed hover:text-white transition-colors cursor-pointer"
                            onClick={() => setNewPost({...newPost, title: idea})}>
                          • {idea}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                <h3 className="text-white font-semibold mb-2">💡 Pro Tips:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• <strong>Frequency:</strong> 2-3 posts/month for consistent engagement</li>
                  <li>• <strong>Length:</strong> 800-1200 words for SEO optimization</li>
                  <li>• <strong>Style:</strong> Keep the emotional, relatable tone from "Tuesday Morning Storm"</li>
                  <li>• <strong>CTAs:</strong> Always include links to Security Estimate and AI Assessment</li>
                </ul>
              </div>
            </div>

            {/* Create New Blog Post */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Create New Blog Post</h2>
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Post Title"
                    value={newPost.title || ''}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    value={newPost.author || ''}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <textarea
                  placeholder="Post Excerpt/Summary"
                  value={newPost.excerpt || ''}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  rows={3}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600 resize-none"
                />
                <textarea
                  placeholder="Post Content (HTML/Markdown supported)"
                  value={newPost.content || ''}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={8}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600 resize-none"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="Video URL (YouTube, etc.)"
                    value={newPost.videoUrl || ''}
                    onChange={(e) => setNewPost({ ...newPost, videoUrl: e.target.value })}
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                  />
                  <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={newPost.tags?.join(', ') || ''}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newPost.published || false}
                      onChange={(e) => setNewPost({ ...newPost, published: e.target.checked })}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600"
                    />
                    <span className="text-white">Publish immediately</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const imagePath = await handleBlogImageUpload(file)
                        if (imagePath) {
                          setNewPost({ ...newPost, featuredImage: imagePath })
                        }
                      }
                    }}
                    className="block text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  {uploadingBlogImage && <span className="text-purple-400">Uploading...</span>}
                </div>
                {newPost.featuredImage && (
                  <div className="flex items-center gap-4">
                    <Image
                      src={newPost.featuredImage}
                      alt="Featured Image"
                      width={100}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <button
                      onClick={() => setNewPost({ ...newPost, featuredImage: '' })}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <button
                  onClick={saveBlogPost}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Create Blog Post
                </button>
              </div>
            </div>

            {/* Existing Blog Posts */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Existing Blog Posts ({blogPosts.length})</h2>
              {blogPosts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-4">📝</div>
                  <p>No blog posts yet. Create your first post above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                          <p className="text-gray-400 text-sm">
                            By {post.author} • {new Date(post.publishedDate).toLocaleDateString()}
                            {post.published ? (
                              <span className="ml-2 inline-block bg-green-600 text-white px-2 py-1 rounded text-xs">Published</span>
                            ) : (
                              <span className="ml-2 inline-block bg-yellow-600 text-white px-2 py-1 rounded text-xs">Draft</span>
                            )}
                          </p>
                          <p className="text-gray-300 text-sm mt-2">{post.excerpt}</p>
                          {post.tags.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {post.tags.map((tag, index) => (
                                <span key={index} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {post.featuredImage && (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            width={80}
                            height={50}
                            className="rounded-lg object-cover ml-4"
                          />
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBlogPost(post.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Edit Blog Post Modal */}
            {editingPost && (
              <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Edit Blog Post</h2>
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Post Title"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                    />
                    <input
                      type="text"
                      placeholder="Author"
                      value={editingPost.author}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <textarea
                    placeholder="Post Excerpt/Summary"
                    value={editingPost.excerpt}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    rows={3}
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600 resize-none"
                  />
                  <textarea
                    placeholder="Post Content"
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    rows={8}
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600 resize-none"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="url"
                      placeholder="Video URL"
                      value={editingPost.videoUrl}
                      onChange={(e) => setEditingPost({ ...editingPost, videoUrl: e.target.value })}
                      className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                    />
                    <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      value={editingPost.tags.join(', ')}
                      onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
                      className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingPost.published}
                        onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600"
                      />
                      <span className="text-white">Published</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={updateBlogPost}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Update Post
                    </button>
                    <button
                      onClick={() => setEditingPost(null)}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}