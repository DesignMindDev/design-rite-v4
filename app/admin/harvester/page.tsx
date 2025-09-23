'use client'

import { useState, useEffect } from 'react'
import { Database, TrendingUp, Package, RefreshCw, DollarSign, AlertCircle, CheckCircle, Activity, BarChart3, Search, Filter, ExternalLink, Eye, MessageSquare, Play } from 'lucide-react'

interface HarvesterStats {
  totalProducts: number
  productsWithPricing: number
  pricingCoverage: number
  manufacturerCounts: Record<string, number>
  recentPriceChanges: any[]
  socialIntelligence: {
    redditPosts: number
    youtubeVideos: number
    recentReddit: any[]
    recentYoutube: any[]
  }
  lastUpdated: string
}

interface Product {
  id: string
  manufacturer: string
  model: string
  name: string
  category: string
  msrp: number
  dealer_cost: number
  map_price: number
  street_price: number
  in_stock: boolean
  discontinued: boolean
  price_updated_at: string
  created_at: string
}

export default function HarvesterDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<HarvesterStats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [redditPosts, setRedditPosts] = useState<any[]>([])
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedManufacturer, setSelectedManufacturer] = useState('')
  const [selectedSubreddit, setSelectedSubreddit] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Simple authentication
  const handleAuth = () => {
    if (password === 'design-rite-admin-2024') {
      setIsAuthenticated(true)
    } else {
      alert('Invalid password')
    }
  }

  // Load overview data
  const loadOverview = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/harvester?view=overview')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to load overview:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load products data
  const loadProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '25'
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedManufacturer) params.append('manufacturer', selectedManufacturer)

      const response = await fetch(`/api/admin/harvester?view=products&${params}`)
      const data = await response.json()
      if (data.success) {
        setProducts(data.data.products)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load Reddit data
  const loadRedditPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '25'
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedSubreddit) params.append('subreddit', selectedSubreddit)

      const response = await fetch(`/api/admin/harvester?view=reddit&${params}`)
      const data = await response.json()
      if (data.success) {
        setRedditPosts(data.data.posts)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Failed to load Reddit posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load YouTube data
  const loadYouTubeVideos = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '25'
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedChannel) params.append('channel', selectedChannel)

      const response = await fetch(`/api/admin/harvester?view=youtube&${params}`)
      const data = await response.json()
      if (data.success) {
        setYoutubeVideos(data.data.videos)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Failed to load YouTube videos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Trigger harvest
  const triggerHarvest = async (manufacturer?: string) => {
    try {
      const response = await fetch('/api/admin/harvester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'trigger_harvest',
          manufacturer
        })
      })
      const data = await response.json()
      alert(data.message)
      if (data.success) loadOverview()
    } catch (error) {
      console.error('Failed to trigger harvest:', error)
      alert('Failed to trigger harvest')
    }
  }

  useEffect(() => {
    if (isAuthenticated && activeTab === 'overview') {
      loadOverview()
    }
  }, [isAuthenticated, activeTab])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'products') {
      loadProducts()
    } else if (isAuthenticated && activeTab === 'reddit') {
      loadRedditPosts()
    } else if (isAuthenticated && activeTab === 'youtube') {
      loadYouTubeVideos()
    }
  }, [isAuthenticated, activeTab, page, searchTerm, selectedManufacturer, selectedSubreddit, selectedChannel])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen dr-bg-charcoal dr-text-pearl flex items-center justify-center">
        <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Database className="w-12 h-12 dr-text-violet mx-auto mb-4" />
            <h1 className="dr-heading-lg dr-text-pearl mb-2">Harvester Dashboard</h1>
            <p className="text-gray-300">Enter admin password to access</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
              placeholder="Admin Password"
            />
            <button
              onClick={handleAuth}
              className="w-full dr-bg-violet dr-text-pearl py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 dr-text-violet" />
            <h1 className="dr-heading-lg dr-text-pearl">Product Harvester Dashboard</h1>
          </div>
          <p className="text-gray-300">Monitor your web harvesting operations and product database</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'reddit', label: 'Reddit Posts', icon: MessageSquare },
            { id: 'youtube', label: 'YouTube Videos', icon: Play },
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            { id: 'operations', label: 'Operations', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setPage(1)
                setSearchTerm('')
                setSelectedManufacturer('')
                setSelectedSubreddit('')
                setSelectedChannel('')
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'dr-bg-violet dr-text-pearl'
                  : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700/40'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 dr-text-violet animate-spin" />
              </div>
            ) : stats ? (
              <>
                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="w-6 h-6 dr-text-violet" />
                      <h3 className="font-semibold dr-text-pearl">Total Products</h3>
                    </div>
                    <div className="text-3xl font-bold dr-text-pearl">{stats.totalProducts.toLocaleString()}</div>
                  </div>

                  <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-6 h-6 dr-text-violet" />
                      <h3 className="font-semibold dr-text-pearl">With Pricing</h3>
                    </div>
                    <div className="text-3xl font-bold dr-text-pearl">{stats.productsWithPricing.toLocaleString()}</div>
                  </div>

                  <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-6 h-6 dr-text-violet" />
                      <h3 className="font-semibold dr-text-pearl">Coverage</h3>
                    </div>
                    <div className="text-3xl font-bold dr-text-pearl">{stats.pricingCoverage}%</div>
                  </div>

                  <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <h3 className="font-semibold dr-text-pearl">Status</h3>
                    </div>
                    <div className="text-xl font-bold text-green-400">Active</div>
                  </div>
                </div>

                {/* Social Media Intelligence Section */}
                {stats.socialIntelligence && (
                  <>
                    <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
                      <h3 className="font-bold dr-text-pearl mb-4">Social Media Intelligence</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Reddit Stats */}
                        <div className="bg-gray-700/40 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">R</span>
                            </div>
                            <h4 className="font-semibold dr-text-pearl">Reddit Discussions</h4>
                          </div>
                          <div className="text-2xl font-bold dr-text-pearl mb-2">
                            {stats.socialIntelligence.redditPosts}
                          </div>
                          <div className="text-sm text-gray-400">Security discussions captured</div>
                        </div>

                        {/* YouTube Stats */}
                        <div className="bg-gray-700/40 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">Y</span>
                            </div>
                            <h4 className="font-semibold dr-text-pearl">YouTube Videos</h4>
                          </div>
                          <div className="text-2xl font-bold dr-text-pearl mb-2">
                            {stats.socialIntelligence.youtubeVideos}
                          </div>
                          <div className="text-sm text-gray-400">Product videos & reviews</div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Social Activity */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Recent Reddit Posts */}
                      <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
                        <h3 className="font-bold dr-text-pearl mb-4">Latest Reddit Discussions</h3>
                        <div className="space-y-3">
                          {stats.socialIntelligence.recentReddit?.slice(0, 3).map((post, index) => (
                            <div key={index} className="p-3 bg-gray-700/40 rounded-lg">
                              <div className="font-semibold dr-text-pearl text-sm mb-1">
                                r/{post.subreddit}
                              </div>
                              <div className="text-gray-300 text-sm mb-2 truncate">
                                {post.title}
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-orange-400">
                                  {post.score} upvotes
                                </span>
                                <span className="text-gray-400">
                                  {post.keywords_found}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent YouTube Videos */}
                      <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
                        <h3 className="font-bold dr-text-pearl mb-4">Latest YouTube Videos</h3>
                        <div className="space-y-3">
                          {stats.socialIntelligence.recentYoutube?.slice(0, 3).map((video, index) => (
                            <div key={index} className="p-3 bg-gray-700/40 rounded-lg">
                              <div className="font-semibold dr-text-pearl text-sm mb-1">
                                {video.channel_title}
                              </div>
                              <div className="text-gray-300 text-sm mb-2 truncate">
                                {video.title}
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-red-400">
                                  {video.view_count ? `${video.view_count.toLocaleString()} views` : 'No view data'}
                                </span>
                                <span className="text-gray-400">
                                  Video
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Manufacturer Distribution */}
                <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
                  <h3 className="font-bold dr-text-pearl mb-4">Products by Manufacturer</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(stats.manufacturerCounts)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 12)
                      .map(([manufacturer, count]) => (
                        <div key={manufacturer} className="flex justify-between items-center p-3 bg-gray-700/40 rounded-lg">
                          <span className="text-gray-300">{manufacturer}</span>
                          <span className="font-semibold dr-text-violet">{count.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recent Price Changes */}
                <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
                  <h3 className="font-bold dr-text-pearl mb-4">Recent Price Changes</h3>
                  <div className="space-y-3">
                    {stats.recentPriceChanges.slice(0, 5).map((change, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-700/40 rounded-lg">
                        <div>
                          <div className="font-semibold dr-text-pearl">
                            {change.products?.manufacturer} {change.products?.model}
                          </div>
                          <div className="text-sm text-gray-400">{change.price_type}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${change.percent_change > 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {change.percent_change > 0 ? '+' : ''}{change.percent_change}%
                          </div>
                          <div className="text-sm text-gray-400">
                            ${change.old_price} → ${change.new_price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
                  <h3 className="font-bold dr-text-pearl mb-4">Harvest Operations</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={() => triggerHarvest()}
                      className="dr-bg-violet dr-text-pearl p-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <RefreshCw className="w-5 h-5 mx-auto mb-2" />
                      Harvest All
                    </button>
                    <button
                      onClick={() => triggerHarvest('Hanwha')}
                      className="bg-blue-600 dr-text-pearl p-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Package className="w-5 h-5 mx-auto mb-2" />
                      Hanwha Only
                    </button>
                    <button
                      onClick={() => triggerHarvest('Axis')}
                      className="bg-green-600 dr-text-pearl p-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Package className="w-5 h-5 mx-auto mb-2" />
                      Axis Only
                    </button>
                    <button
                      onClick={() => loadOverview()}
                      className="bg-gray-600 dr-text-pearl p-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <RefreshCw className="w-5 h-5 mx-auto mb-2" />
                      Refresh Data
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No data available. Click "Refresh Data" to load harvester statistics.
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                      placeholder="Search products by model, name, or category..."
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <select
                    value={selectedManufacturer}
                    onChange={(e) => setSelectedManufacturer(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl focus:outline-none focus:dr-border-violet"
                  >
                    <option value="">All Manufacturers</option>
                    {stats && Object.keys(stats.manufacturerCounts).sort().map(manufacturer => (
                      <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/40">
                    <tr>
                      <th className="text-left p-4 font-semibold dr-text-pearl">Product</th>
                      <th className="text-left p-4 font-semibold dr-text-pearl">Category</th>
                      <th className="text-right p-4 font-semibold dr-text-pearl">MSRP</th>
                      <th className="text-right p-4 font-semibold dr-text-pearl">Dealer Cost</th>
                      <th className="text-right p-4 font-semibold dr-text-pearl">Margin %</th>
                      <th className="text-center p-4 font-semibold dr-text-pearl">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const margin = product.msrp && product.dealer_cost ?
                        ((product.msrp - product.dealer_cost) / product.msrp * 100) : 0

                      return (
                        <tr key={product.id} className="border-t border-gray-600/30 hover:bg-gray-700/20">
                          <td className="p-4">
                            <div>
                              <div className="font-semibold dr-text-pearl">{product.manufacturer}</div>
                              <div className="text-sm text-gray-300">{product.model}</div>
                              <div className="text-xs text-gray-400 truncate max-w-xs">{product.name}</div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{product.category || 'N/A'}</td>
                          <td className="p-4 text-right">
                            {product.msrp ? (
                              <span className="font-semibold dr-text-pearl">${product.msrp.toLocaleString()}</span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {product.dealer_cost ? (
                              <span className="font-semibold text-green-400">${product.dealer_cost.toLocaleString()}</span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {margin > 0 ? (
                              <span className={`font-semibold ${margin > 30 ? 'text-green-400' : margin > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {margin.toFixed(1)}%
                              </span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              {product.in_stock ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-400" />
                              )}
                              {product.discontinued && (
                                <AlertCircle className="w-5 h-5 text-orange-400" />
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-600/30 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reddit Posts Tab */}
        {activeTab === 'reddit' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                      placeholder="Search Reddit posts by title, content, or keywords..."
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <select
                    value={selectedSubreddit}
                    onChange={(e) => setSelectedSubreddit(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl focus:outline-none focus:dr-border-violet"
                  >
                    <option value="">All Subreddits</option>
                    <option value="SecurityCameras">r/SecurityCameras</option>
                    <option value="homedefense">r/homedefense</option>
                    <option value="CommercialAV">r/CommercialAV</option>
                    <option value="videosurveillance">r/videosurveillance</option>
                    <option value="CCTV">r/CCTV</option>
                    <option value="networking">r/networking</option>
                    <option value="sysadmin">r/sysadmin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reddit Posts Table */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/40">
                    <tr>
                      <th className="text-left p-4 font-semibold dr-text-pearl">Post</th>
                      <th className="text-left p-4 font-semibold dr-text-pearl">Subreddit</th>
                      <th className="text-right p-4 font-semibold dr-text-pearl">Score</th>
                      <th className="text-center p-4 font-semibold dr-text-pearl">Keywords</th>
                      <th className="text-center p-4 font-semibold dr-text-pearl">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redditPosts.map((post) => (
                      <tr key={post.id} className="border-t border-gray-600/30 hover:bg-gray-700/20">
                        <td className="p-4">
                          <div>
                            <div className="font-semibold dr-text-pearl mb-1">{post.title}</div>
                            <div className="text-sm text-gray-300">u/{post.author}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(post.created_date).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm">
                            r/{post.subreddit}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="text-lg font-bold dr-text-pearl">{post.score}</div>
                          <div className="text-xs text-gray-400">{post.num_comments} comments</div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="text-sm text-gray-300 max-w-xs truncate">
                            {post.keywords_found || 'None'}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 dr-bg-violet hover:bg-purple-600 rounded-lg transition-colors"
                              title="View on Reddit"
                            >
                              <ExternalLink className="w-4 h-4 dr-text-pearl" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-600/30 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* YouTube Videos Tab */}
        {activeTab === 'youtube' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                      placeholder="Search YouTube videos by title, description, or channel..."
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl focus:outline-none focus:dr-border-violet"
                  >
                    <option value="">All Channels</option>
                    <option value="Best Buys Reviewed">Best Buys Reviewed</option>
                    <option value="Axis Technical Support Videos">Axis Technical Support</option>
                    <option value="SK Enterprises">SK Enterprises</option>
                    <option value="Bosch Security and Safety Systems">Bosch Security</option>
                  </select>
                </div>
              </div>
            </div>

            {/* YouTube Videos Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeVideos.map((video) => (
                <div key={video.id} className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={video.thumbnail_url || `https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-80" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold dr-text-pearl mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="text-sm text-gray-300 mb-2">{video.channel_title}</div>

                    <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                      <span>{video.view_count ? `${video.view_count.toLocaleString()} views` : 'No view data'}</span>
                      {video.published_at && (
                        <span>{new Date(video.published_at).toLocaleDateString()}</span>
                      )}
                    </div>

                    {video.search_term && (
                      <div className="text-xs text-violet-300 mb-3">
                        Found via: {video.search_term}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 dr-bg-violet hover:bg-purple-600 dr-text-pearl py-2 px-3 rounded-lg text-center text-sm font-medium transition-colors"
                      >
                        Watch on YouTube
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {(activeTab === 'pricing' || activeTab === 'operations') && (
          <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-12 text-center">
            <Activity className="w-16 h-16 dr-text-violet mx-auto mb-4 opacity-50" />
            <h3 className="dr-subheading dr-text-pearl mb-2">Coming Soon</h3>
            <p className="text-gray-400">
              {activeTab === 'pricing' ? 'Advanced pricing analytics and trends' : 'Detailed harvest operations and scheduling'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}