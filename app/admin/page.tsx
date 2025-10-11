'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { useRouter } from 'next/navigation'

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

interface ModulePermissions {
  operations_dashboard: boolean
  ai_management: boolean
  data_harvesting: boolean
  marketing_content: boolean
  about_us: boolean
  team_management: boolean
  logo_management: boolean
  video_management: boolean
  blog_management: boolean
}

export default function AdminPage() {
  const auth = useSupabaseAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [modulePerms, setModulePerms] = useState<ModulePermissions | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ logoPath: '', footerLogoPath: '', demoVideoUrl: '' })
  const [videos, setVideos] = useState<VideoContent[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [teamCodes, setTeamCodes] = useState<TeamCode[]>([])
  const [teamActivity, setTeamActivity] = useState<ActivityLog[]>([])
  const [spatialMetrics, setSpatialMetrics] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'team' | 'logos' | 'videos' | 'blog' | 'team-codes' | 'activity' | 'spatial-studio' | 'analytics'>('team')
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
    setIsMounted(true)

    // Session sync from portal admin
    const handleSessionSync = async () => {
      const hash = window.location.hash
      if (hash.startsWith('#auth=')) {
        try {
          const authDataString = decodeURIComponent(hash.slice(6))
          const authData = JSON.parse(authDataString)

          // Import supabase client
          const { supabase } = await import('@/lib/supabase')

          // Set session from portal
          await supabase.auth.setSession({
            access_token: authData.access_token,
            refresh_token: authData.refresh_token
          })

          console.log('[Admin Session Sync] Session transferred from portal')

          // Clean up URL
          window.location.hash = ''

          // Reload to re-run auth check with new session
          window.location.reload()
          return true
        } catch (error) {
          console.error('[Admin Session Sync] Error:', error)
        }
      }
      return false
    }

    // Try session sync first
    handleSessionSync().then(synced => {
      if (synced) return // Will reload, don't continue

      // Normal auth flow continues below
    })

    // Wait for auth to finish loading
    if (auth.isLoading) {
      return
    }

    // Redirect if not authenticated
    if (!auth.isAuthenticated) {
      router.push('/login?callbackUrl=/admin')
      return
    }

    // Check if user has permission to access admin content management
    if (auth.user) {
      const role = auth.user.role
      if (!['super_admin', 'admin'].includes(role || '')) {
        router.push('/unauthorized?reason=insufficient_permissions')
        return
      }

      // Fetch user's module permissions
      fetchModulePermissions()

      // Load content management data
      loadTeamMembers()
      loadSiteSettings()
      loadBlogPosts()
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user, router])

  // Load Spatial Studio metrics when Analytics tab is active
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetch('/api/spatial-studio/analytics')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSpatialMetrics(data.metrics)
          }
        })
        .catch(err => console.error('Failed to load Spatial Studio metrics:', err))
    }
  }, [activeTab])

  const fetchModulePermissions = async () => {
    try {
      const response = await fetch(`/api/admin/get-user?userId=${auth.user?.id}`)
      if (response.ok) {
        const data = await response.json()
        const perms = data.modulePermissions

        // Super admins get all permissions by default
        if (auth.user?.role === 'super_admin') {
          setModulePerms({
            operations_dashboard: true,
            ai_management: true,
            data_harvesting: true,
            marketing_content: true,
            about_us: true,
            team_management: true,
            logo_management: true,
            video_management: true,
            blog_management: true,
          })
        } else {
          setModulePerms(perms)
        }
      }
    } catch (error) {
      console.error('Failed to fetch module permissions:', error)
    }
  }

  // Helper function to check if user has access to a module
  const hasModuleAccess = (module: keyof ModulePermissions) => {
    if (!modulePerms) return true // Loading state - show all until permissions load
    if (auth.user?.role === 'super_admin') return true
    return modulePerms[module]
  }

  const handleLogout = () => {
    router.push('/admin/login')
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

  if (!isMounted || auth.isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  if (!auth.isAuthenticated || !['super_admin', 'admin'].includes(auth.user?.role || '')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <h1 className="text-3xl font-black text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need super_admin or admin role to access content management.</p>
          <Link
            href="/admin/login"
            className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  // Blog image upload handler
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
            {/* Operations Dashboard - Featured */}
            {hasModuleAccess('operations_dashboard') && (
              <Link
                href="/admin/operations"
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-600/30 transition-all flex items-center gap-2"
              >
                <span>📊</span>
                Operations Dashboard
              </Link>
            )}

            {/* Analytics Button */}
            <button
              onClick={() => setActiveTab('analytics')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span>📈</span>
              Analytics
            </button>

            {/* AI Tools Dropdown */}
            {hasModuleAccess('ai_management') && (
              <div className="relative group">
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all flex items-center gap-2">
                <span>🤖</span>
                AI Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/admin/ai-providers" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-purple-600/20 transition-colors">
                    <span>🧠</span>
                    <span>AI Providers</span>
                  </Link>
                  <Link href="/admin/ai-assistant" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-purple-600/20 transition-colors">
                    <span>✨</span>
                    <span>AI Assistant Config</span>
                  </Link>
                  <Link href="/admin/chatbot" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-purple-600/20 transition-colors">
                    <span>💬</span>
                    <span>Chatbot Config</span>
                  </Link>
                </div>
              </div>
              </div>
            )}

            {/* Data Tools Dropdown */}
            {hasModuleAccess('data_harvesting') && (
              <div className="relative group">
              <button className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-600/30 transition-all flex items-center gap-2">
                <span>🗄️</span>
                Data Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/admin/harvester" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-cyan-600/20 transition-colors">
                    <span>🔍</span>
                    <span>Product Harvester</span>
                  </Link>
                </div>
              </div>
              </div>
            )}

            {/* Content Tools Dropdown */}
            {hasModuleAccess('marketing_content') && (
              <div className="relative group">
              <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-600/30 transition-all flex items-center gap-2">
                <span>✍️</span>
                Content Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {hasModuleAccess('team_management') && (
                    <button onClick={() => setActiveTab('team')} className="flex items-center gap-3 px-4 py-2 text-white hover:bg-green-600/20 transition-colors w-full text-left">
                      <span>👥</span>
                      <span>Team Management</span>
                    </button>
                  )}
                  <Link href="/admin/creative-studio" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-green-600/20 transition-colors w-full text-left">
                    <span>🎨</span>
                    <span>Creative Studio</span>
                  </Link>
                  <Link href="/admin/spatial-studio-dev" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-green-600/20 transition-colors w-full text-left">
                    <span>🏗️</span>
                    <span>Spatial Studio</span>
                  </Link>
                  <Link href="/integrations/system-surveyor/upload" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-green-600/20 transition-colors w-full text-left">
                    <span>📋</span>
                    <span>System Surveyor</span>
                  </Link>
                  <Link href="/help" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-green-600/20 transition-colors w-full text-left">
                    <span>❓</span>
                    <span>Help</span>
                  </Link>
                  {hasModuleAccess('logo_management') && (
                    <button onClick={() => setActiveTab('logos')} className="flex items-center gap-3 px-4 py-2 text-white hover:bg-green-600/20 transition-colors w-full text-left">
                      <span>🖼️</span>
                      <span>Logo Management</span>
                    </button>
                  )}
                  {hasModuleAccess('video_management') && (
                    <button onClick={() => setActiveTab('videos')} className="flex items-center gap-3 px-4 py-2 text-white hover:bg-green-600/20 transition-colors w-full text-left">
                      <span>🎥</span>
                      <span>Video Management</span>
                    </button>
                  )}
                  <button onClick={() => setActiveTab('blog')} className="flex items-center gap-3 px-4 py-2 text-white hover:bg-green-600/20 transition-colors w-full text-left">
                    <span>📝</span>
                    <span>Blog Posts</span>
                  </button>
                </div>
              </div>
              </div>
            )}

            {/* Business Tools Dropdown */}
            <div className="relative group">
              <button className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-600/30 transition-all flex items-center gap-2">
                <span>💼</span>
                Business Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/admin/subscriptions" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-yellow-600/20 transition-colors">
                    <span>💳</span>
                    <span>Subscriptions</span>
                  </Link>
                  <Link href="/admin/demo-dashboard" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-yellow-600/20 transition-colors">
                    <span>📅</span>
                    <span>Demo Dashboard</span>
                  </Link>
                  <Link href="/admin/supabase" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-yellow-600/20 transition-colors">
                    <span>🗄️</span>
                    <span>Supabase Management</span>
                  </Link>
                  <Link href="/admin/render" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-yellow-600/20 transition-colors">
                    <span>🚀</span>
                    <span>Render Services</span>
                  </Link>
                  <Link href="/admin/ai-health" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-yellow-600/20 transition-colors">
                    <span>🧠</span>
                    <span>AI Provider Health</span>
                  </Link>
                  <Link href="/admin/testing" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-yellow-600/20 transition-colors">
                    <span>🧪</span>
                    <span>Testing Dashboard</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* About Us Dropdown */}
            {hasModuleAccess('about_us') && (
              <div className="relative group">
              <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center gap-2">
                <span>ℹ️</span>
                About Us
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/admin/careers" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-indigo-600/20 transition-colors">
                    <span>💼</span>
                    <span>Careers</span>
                  </Link>
                </div>
              </div>
              </div>
            )}

            {/* Super Admin Button - Only for super_admin role */}
            {auth.user?.role === 'super_admin' && (
              <Link
                href="/admin/super"
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-600/30 transition-all flex items-center gap-2"
              >
                <span>👑</span>
                Super Admin
              </Link>
            )}

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
          {hasModuleAccess('team_management') && (
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
          )}
          {hasModuleAccess('logo_management') && (
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
          )}
          {hasModuleAccess('video_management') && (
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
          )}
          {hasModuleAccess('blog_management') && (
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
          )}
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
                  onChange={(e) => {
                    setNewMember(prev => ({ ...prev, description: e.target.value }))
                    // Auto-resize textarea
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.max(96, e.target.scrollHeight) + 'px'
                  }}
                  className="md:col-span-2 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600 min-h-[96px] resize-none overflow-hidden"
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
                  <div key={member.id} className="bg-gray-700/50 rounded-lg p-4">
                    {editingMember?.id === member.id ? (
                      /* Edit Mode */
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={editingMember.name || ''}
                          onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                          className="px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-purple-600"
                        />
                        <input
                          type="text"
                          placeholder="Role"
                          value={editingMember.role || ''}
                          onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, role: e.target.value }) : null)}
                          className="px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-purple-600"
                        />
                        <input
                          type="text"
                          placeholder="Initials"
                          value={editingMember.initials || ''}
                          onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, initials: e.target.value }) : null)}
                          className="px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-purple-600"
                        />
                        <input
                          type="url"
                          placeholder="Website URL (optional)"
                          value={editingMember.href || ''}
                          onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, href: e.target.value }) : null)}
                          className="px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-purple-600"
                        />
                        <textarea
                          placeholder="Description"
                          value={editingMember.description || ''}
                          onChange={(e) => {
                            setEditingMember(prev => prev ? ({ ...prev, description: e.target.value }) : null)
                            // Auto-resize textarea
                            e.target.style.height = 'auto'
                            e.target.style.height = Math.max(96, e.target.scrollHeight) + 'px'
                          }}
                          className="md:col-span-2 px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-purple-600 min-h-[96px] resize-none overflow-hidden"
                        />
                        <div className="md:col-span-2 flex gap-2">
                          <button
                            onClick={() => {
                              saveTeamMember(editingMember)
                              setEditingMember(null)
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingMember(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="flex items-start gap-4">
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
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold">{member.name}</h3>
                          <p className="text-purple-400">{member.role}</p>
                          <p className="text-gray-400 text-sm mt-1 whitespace-pre-wrap break-words">{member.description}</p>
                          {member.href && (
                            <a
                              href={member.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-block"
                            >
                              🔗 Website
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
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
                            onClick={() => setEditingMember(member)}
                            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTeamMember(member.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span>📈</span>
              Platform Analytics
            </h2>

            {/* Quick Links to Dashboards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <Link href="/admin/demo-dashboard" className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-600/30 rounded-xl p-6 hover:border-purple-500/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-white">Demo Dashboard</span>
                  <span className="text-3xl group-hover:scale-110 transition-transform">📅</span>
                </div>
                <p className="text-gray-400 text-sm">Calendly demo bookings & lead scoring</p>
              </Link>

              <Link href="/admin/leads-dashboard" className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-600/30 rounded-xl p-6 hover:border-green-500/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-white">Leads Dashboard</span>
                  <span className="text-3xl group-hover:scale-110 transition-transform">🎯</span>
                </div>
                <p className="text-gray-400 text-sm">Lead pipeline & engagement</p>
              </Link>

              <Link href="/admin/user-journey" className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-600/30 rounded-xl p-6 hover:border-blue-500/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-white">User Journey</span>
                  <span className="text-3xl group-hover:scale-110 transition-transform">🗺️</span>
                </div>
                <p className="text-gray-400 text-sm">User flow & behavior insights</p>
              </Link>

              <Link href="/admin/spatial-studio-dev" className="bg-gradient-to-br from-pink-600/20 to-pink-900/20 border border-pink-600/30 rounded-xl p-6 hover:border-pink-500/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-white">Spatial Studio</span>
                  <span className="text-3xl group-hover:scale-110 transition-transform">🏗️</span>
                </div>
                <p className="text-gray-400 text-sm">3D floor plan AI analysis</p>
              </Link>

              <Link href="/admin/ai-analytics" className="bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 border border-indigo-600/30 rounded-xl p-6 hover:border-indigo-500/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-white">AI Analytics</span>
                  <span className="text-3xl group-hover:scale-110 transition-transform">🤖</span>
                </div>
                <p className="text-gray-400 text-sm">AI session & usage metrics</p>
              </Link>

              <Link href="/admin/user-activity" className="bg-gradient-to-br from-orange-600/20 to-orange-900/20 border border-orange-600/30 rounded-xl p-6 hover:border-orange-500/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-white">User Activity</span>
                  <span className="text-3xl group-hover:scale-110 transition-transform">👤</span>
                </div>
                <p className="text-gray-400 text-sm">User actions & events log</p>
              </Link>

              <Link href="/admin/assessments" className="bg-gradient-to-br from-teal-600/20 to-teal-900/20 border border-teal-600/30 rounded-xl p-6 hover:border-teal-500/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-white">Assessments</span>
                  <span className="text-3xl group-hover:scale-110 transition-transform">📋</span>
                </div>
                <p className="text-gray-400 text-sm">AI assessment logs</p>
              </Link>

              <Link href="/admin/session-debug" className="bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-600/30 rounded-xl p-6 hover:border-red-500/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-white">Session Debug</span>
                  <span className="text-3xl group-hover:scale-110 transition-transform">🐛</span>
                </div>
                <p className="text-gray-400 text-sm">Session debugging tools</p>
              </Link>
            </div>

            {/* Spatial Studio Analytics */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span>🏗️</span>
                Spatial Studio Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-600/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Total Projects</span>
                    <span className="text-2xl">🏗️</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {spatialMetrics?.totalProjects || 0}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-600/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Success Rate</span>
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {spatialMetrics?.successRate || 0}%
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-600/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Avg Analysis Time</span>
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {spatialMetrics?.avgAnalysisTime || 0}s
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/20 border border-pink-600/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Walls Detected</span>
                    <span className="text-2xl">🧱</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {spatialMetrics?.totalWalls || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}