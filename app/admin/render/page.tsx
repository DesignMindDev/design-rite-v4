'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  RefreshCw,
  Globe,
  Loader2,
  XCircle
} from 'lucide-react'

interface RenderService {
  id: string
  name: string
  type: string
  repo: string
  branch: string
  serviceDetails?: {
    env: string
    buildCommand?: string
    startCommand?: string
    url?: string
  }
  suspended?: string
  updatedAt: string
  createdAt: string
}

interface RenderDeploy {
  id: string
  status: string
  createdAt: string
  updatedAt: string
  finishedAt?: string
  commitId?: string
  commitMessage?: string
  commitUrl?: string
}

interface ServiceWithDeploy extends RenderService {
  latestDeploy?: RenderDeploy
  loading?: boolean
}

export default function RenderServicesPage() {
  const [services, setServices] = useState<ServiceWithDeploy[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/render/services')

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`)
      }

      const data = await response.json()
      setServices(data.services || [])
      setLastRefresh(new Date())
    } catch (err: any) {
      console.error('Error fetching Render services:', err)
      setError(err.message || 'Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchServices, 60000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (deploy?: RenderDeploy) => {
    if (!deploy) {
      return <Badge variant="secondary">Unknown</Badge>
    }

    switch (deploy.status) {
      case 'live':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Live
          </Badge>
        )
      case 'build_in_progress':
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Building
          </Badge>
        )
      case 'update_in_progress':
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Deploying
          </Badge>
        )
      case 'build_failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Build Failed
          </Badge>
        )
      case 'canceled':
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Canceled
          </Badge>
        )
      default:
        return <Badge variant="outline">{deploy.status}</Badge>
    }
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'web_service':
        return <Globe className="h-5 w-5" />
      case 'background_worker':
        return <Activity className="h-5 w-5" />
      default:
        return <Server className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const liveServices = services.filter(s => s.latestDeploy?.status === 'live').length
  const buildingServices = services.filter(s =>
    s.latestDeploy?.status === 'build_in_progress' ||
    s.latestDeploy?.status === 'update_in_progress'
  ).length
  const failedServices = services.filter(s => s.latestDeploy?.status === 'build_failed').length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Server className="h-8 w-8" />
            Render Services
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor deployment status and service health
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchServices}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://dashboard.render.com', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Render Dashboard
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refresh every 60s
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : services.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all environments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Live Services</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? '...' : liveServices}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Running successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Deploying</CardTitle>
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? '...' : buildingServices}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Failed Builds</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loading ? '...' : failedServices}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Services</h2>

        {loading && services.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Server className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No services found</p>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getServiceIcon(service.type)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {service.name}
                        {getStatusBadge(service.latestDeploy)}
                      </CardTitle>
                      <CardDescription className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono bg-muted px-2 py-0.5 rounded">
                            {service.type.replace('_', ' ')}
                          </span>
                          {service.branch && (
                            <span className="font-mono bg-muted px-2 py-0.5 rounded">
                              {service.branch}
                            </span>
                          )}
                        </div>
                        {service.latestDeploy?.commitMessage && (
                          <div className="text-xs mt-2">
                            Latest: {service.latestDeploy.commitMessage}
                          </div>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {service.serviceDetails?.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(service.serviceDetails?.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://dashboard.render.com/web/${service.id}`, '_blank')}
                    >
                      <Server className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">Environment</div>
                    <div className="font-medium">
                      {service.serviceDetails?.env || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Last Deploy</div>
                    <div className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.latestDeploy ? formatDate(service.latestDeploy.updatedAt) : 'Never'}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Repository</div>
                    <div className="font-medium truncate">
                      {service.repo || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Created</div>
                    <div className="font-medium">
                      {formatDate(service.createdAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
