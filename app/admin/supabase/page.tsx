'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Database,
  Activity,
  Bell,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  TrendingUp
} from 'lucide-react'

interface DatabaseMetrics {
  totalUsers: number
  totalSubscriptions: number
  todaySignups: number
  activeUsers: number
}

interface RecentActivity {
  id: string
  action: string
  user_email: string
  created_at: string
  metadata?: any
}

export default function SupabaseManagementPage() {
  const [metrics, setMetrics] = useState<DatabaseMetrics | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const supabase = createClientComponentClient()

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      // Get total users from auth.users
      const { count: totalUsers } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact', head: true })

      // Get total subscriptions
      const { count: totalSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })

      // Get today's signups
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: todaySignups } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      // Get active users (logged in within last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { count: activeUsers } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact', head: true })
        .gte('last_sign_in_at', sevenDaysAgo.toISOString())

      setMetrics({
        totalUsers: totalUsers || 0,
        totalSubscriptions: totalSubscriptions || 0,
        todaySignups: todaySignups || 0,
        activeUsers: activeUsers || 0
      })

      // Get recent activity logs
      const { data: activity } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      setRecentActivity(activity || [])
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]
  const dashboardUrl = `https://supabase.com/dashboard/project/${projectRef}`

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Supabase Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Database health, monitoring, and configuration
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(dashboardUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Dashboard
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Last updated: {lastRefresh.toLocaleTimeString()}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : metrics?.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All registered accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : metrics?.activeUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Logged in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Signups</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : metrics?.todaySignups.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              New users today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : metrics?.totalSubscriptions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pre-Launch Alerts */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Pre-Launch Checklist</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-1">
            <div>☐ Enable Point-in-Time Recovery (PITR) in Settings → Database → Backups</div>
            <div>☐ Set up database webhooks for new user signups</div>
            <div>☐ Configure Slack notifications for critical events</div>
            <div>☐ Test backup/restore process in staging</div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Jump to important Supabase features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open(`${dashboardUrl}/database/tables`, '_blank')}
            >
              <Database className="h-4 w-4 mr-2" />
              Database Tables
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open(`${dashboardUrl}/auth/users`, '_blank')}
            >
              <Activity className="h-4 w-4 mr-2" />
              Auth Users
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open(`${dashboardUrl}/logs/explorer`, '_blank')}
            >
              <Clock className="h-4 w-4 mr-2" />
              Logs Explorer
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open(`${dashboardUrl}/database/webhooks`, '_blank')}
            >
              <Bell className="h-4 w-4 mr-2" />
              Configure Webhooks
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open(`${dashboardUrl}/settings/database`, '_blank')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Database Settings (PITR)
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Last 10 admin actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading activity...
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No activity logs found
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between p-2 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.user_email}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Management Features</CardTitle>
          <CardDescription>
            Additional Supabase capabilities to configure
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Point-in-Time Recovery
            </h3>
            <p className="text-sm text-muted-foreground">
              Restore database to any second within last 7 days. Critical for production.
            </p>
            <Badge variant="destructive">Not Enabled</Badge>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Database Webhooks
            </h3>
            <p className="text-sm text-muted-foreground">
              Get notified on Slack/email for signups, subscriptions, demos.
            </p>
            <Badge variant="secondary">Configuration Needed</Badge>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Realtime Subscriptions
            </h3>
            <p className="text-sm text-muted-foreground">
              Live updates for admin dashboards without polling.
            </p>
            <Badge>Available</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Link */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Complete Setup Guide</AlertTitle>
        <AlertDescription>
          See <code>SUPABASE_MANAGEMENT_SETUP.md</code> in the project root for detailed configuration instructions.
        </AlertDescription>
      </Alert>
    </div>
  )
}
