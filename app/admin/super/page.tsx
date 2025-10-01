'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  activeNow: number;
  quotesToday: number;
  aiSessionsToday: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  company: string;
  status: string;
  last_login: string | null;
  login_count: number;
  created_at: string;
}

interface ActivityLog {
  id: string;
  action: string;
  resource_type: string | null;
  timestamp: string;
  success: boolean;
  user_name: string;
  user_email: string;
  ip_address: string | null;
}

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    if (session?.user?.role !== 'super_admin' && session?.user?.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setStats(data.stats);
      setUsers(data.users);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'admin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'manager':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'user':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'guest':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'suspended':
        return 'bg-red-500/20 text-red-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'deleted':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatActionName = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleExport = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/export?type=${type}`);

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `export_${type}_${Date.now()}`;

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleSuspendUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to suspend ${userEmail}?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/suspend-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to suspend user');
      }

      alert('User suspended successfully');
      fetchDashboardData(); // Refresh the data
    } catch (error) {
      console.error('Suspend failed:', error);
      alert('Failed to suspend user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`⚠️ Are you sure you want to DELETE ${userEmail}?\n\nThis will mark the user as deleted (soft delete).`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      alert('User deleted successfully');
      fetchDashboardData(); // Refresh the data
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-purple-600/20 px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {session?.user?.role === 'super_admin' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
            </h1>
            <p className="text-gray-400">
              Logged in as: {session?.user?.name} ({session?.user?.role})
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
            >
              Back to Platform
            </Link>
            <Link
              href="/admin/login"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-8 py-6">
        <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-purple-400">{stats.totalUsers}</div>
            <div className="text-gray-400">Total Users</div>
          </div>
          <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-400">{stats.activeNow}</div>
            <div className="text-gray-400">Active (24h)</div>
          </div>
          <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-400">{stats.quotesToday}</div>
            <div className="text-gray-400">Quotes Today</div>
          </div>
          <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-400">{stats.aiSessionsToday}</div>
            <div className="text-gray-400">AI Sessions Today</div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">User Management</h2>
          <Link
            href="/admin/super/create-user"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
          >
            + Create New User
          </Link>
        </div>

        <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-900/20">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Email</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Company</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Role</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Last Login</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-purple-600/10 hover:bg-purple-900/10 transition-colors">
                    <td className="px-6 py-4">{user.full_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-gray-400">{user.company || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert('Edit user coming in Phase 3')}
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => alert('Activity viewer coming in Phase 3')}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Activity
                        </button>
                        {user.status === 'active' && (
                          <button
                            onClick={() => handleSuspendUser(user.id, user.email)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            Suspend
                          </button>
                        )}
                        {session?.user?.role === 'super_admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-8 py-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity (Live Feed)</h2>
        <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-6">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b border-purple-600/10 pb-3 last:border-b-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${activity.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {activity.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-white font-medium">{activity.user_name}</span>
                    {' '}
                    <span className="text-gray-400">{formatActionName(activity.action)}</span>
                    {activity.resource_type && (
                      <span className="text-gray-500"> ({activity.resource_type})</span>
                    )}
                  </div>
                  {activity.ip_address && (
                    <div className="text-gray-500 text-xs mt-1">IP: {activity.ip_address}</div>
                  )}
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="text-center text-gray-500 py-8">No recent activity</div>
            )}
          </div>
        </div>
      </div>

      {/* Data Exports */}
      <div className="px-8 py-6 pb-12">
        <h2 className="text-xl font-bold mb-4">Data Exports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleExport('users')}
            className="bg-[#1A1A1A] border border-purple-600/30 hover:border-purple-600/60 rounded-lg p-4 text-left transition-colors"
          >
            <div className="text-lg font-bold">📥 Export All Users</div>
            <div className="text-gray-400 text-sm">CSV format with all user details</div>
          </button>
          <button
            onClick={() => alert('Quote export coming soon!')}
            className="bg-[#1A1A1A] border border-purple-600/30 hover:border-purple-600/60 rounded-lg p-4 text-left transition-colors opacity-50 cursor-not-allowed"
          >
            <div className="text-lg font-bold">📥 Export All Quotes (This Month)</div>
            <div className="text-gray-400 text-sm">Complete quote data and BOMs (Coming soon)</div>
          </button>
          <button
            onClick={() => handleExport('activity')}
            className="bg-[#1A1A1A] border border-purple-600/30 hover:border-purple-600/60 rounded-lg p-4 text-left transition-colors"
          >
            <div className="text-lg font-bold">📥 Export Activity Logs</div>
            <div className="text-gray-400 text-sm">Complete audit trail (last 90 days)</div>
          </button>
          <button
            onClick={() => handleExport('database')}
            className="bg-[#1A1A1A] border border-purple-600/30 hover:border-purple-600/60 rounded-lg p-4 text-left transition-colors"
          >
            <div className="text-lg font-bold">📥 Export Database Backup</div>
            <div className="text-gray-400 text-sm">Full JSON backup of all data (Super Admin only)</div>
          </button>
        </div>
      </div>
    </div>
  );
}
