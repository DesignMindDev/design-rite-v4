'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AdminAccessLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  user_email: string;
  path_accessed: string;
  permission_checked: string | null;
  access_allowed: boolean;
  ip_address: string | null;
  user_agent: string | null;
  method: string;
  details: any;
}

export default function ActivityLogViewer() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<AdminAccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'allowed' | 'denied'>('all');
  const [searchEmail, setSearchEmail] = useState('');

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
      fetchActivityLogs();
    }
  }, [session, status, router]);

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch('/api/admin/activity-logs');
      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    // Apply access filter
    if (filter === 'allowed' && !log.access_allowed) return false;
    if (filter === 'denied' && log.access_allowed) return false;

    // Apply email search
    if (searchEmail && !log.user_email.toLowerCase().includes(searchEmail.toLowerCase())) {
      return false;
    }

    return true;
  });

  const formatPermission = (permission: string | null) => {
    if (!permission) return 'N/A';
    return permission
      .replace('can_', '')
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-lg">Loading activity logs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-purple-600/20 px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Activity Logs</h1>
            <p className="text-gray-400">
              Track all admin panel access attempts and permission checks
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/super"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-6">
        <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Filter by Status</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded transition-colors ${
                    filter === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  All ({logs.length})
                </button>
                <button
                  onClick={() => setFilter('allowed')}
                  className={`px-4 py-2 rounded transition-colors ${
                    filter === 'allowed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Allowed ({logs.filter((l) => l.access_allowed).length})
                </button>
                <button
                  onClick={() => setFilter('denied')}
                  className={`px-4 py-2 rounded transition-colors ${
                    filter === 'denied'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Denied ({logs.filter((l) => !l.access_allowed).length})
                </button>
              </div>
            </div>

            <div className="flex-1">
              <label className="text-sm text-gray-400 block mb-2">Search by Email</label>
              <input
                type="text"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Activity Logs Table */}
        <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-900/20">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Timestamp</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">User</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Path</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Permission</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Method</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t border-purple-600/10 hover:bg-purple-900/10 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{log.user_name}</div>
                        <div className="text-xs text-gray-400">{log.user_email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                        {log.path_accessed}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatPermission(log.permission_checked)}
                      </td>
                      <td className="px-6 py-4">
                        {log.access_allowed ? (
                          <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                            ✓ Allowed
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                            ✗ Denied
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{log.method}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {log.ip_address || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">{logs.length}</div>
            <div className="text-gray-400 text-sm">Total Access Attempts</div>
          </div>
          <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {logs.filter((l) => l.access_allowed).length}
            </div>
            <div className="text-gray-400 text-sm">Successful Access</div>
          </div>
          <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">
              {logs.filter((l) => !l.access_allowed).length}
            </div>
            <div className="text-gray-400 text-sm">Denied Access</div>
          </div>
        </div>
      </div>
    </div>
  );
}
