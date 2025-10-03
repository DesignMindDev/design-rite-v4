'use client';

import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  permissions: {
    can_view_revenue: boolean;
    can_view_quick_stats: boolean;
    can_view_user_list: boolean;
    can_view_recent_activity: boolean;
    can_export_data: boolean;
    can_view_analytics: boolean;
    can_manage_team: boolean;
    can_manage_blog: boolean;
    can_manage_videos: boolean;
    can_create_users: boolean;
    can_edit_users: boolean;
    can_delete_users: boolean;
  };
}

export default function PermissionsManagement() {
  const auth = useSupabaseAuth();
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    // Only super_admin can access this page
    if (auth.user?.role !== 'super_admin') {
      router.push('/admin/super');
      return;
    }

    fetchAdmins();
  }, [auth.isAuthenticated, auth.isLoading, auth.user, router]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/get-admins');
      if (!response.ok) throw new Error('Failed to fetch admins');

      const data = await response.json();
      setAdmins(data.admins);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permission: keyof AdminUser['permissions']) => {
    if (!selectedAdmin) return;

    setSelectedAdmin({
      ...selectedAdmin,
      permissions: {
        ...selectedAdmin.permissions,
        [permission]: !selectedAdmin.permissions[permission],
      },
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedAdmin) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/update-permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedAdmin.id,
          permissions: selectedAdmin.permissions,
        }),
      });

      if (!response.ok) throw new Error('Failed to update permissions');

      alert('Permissions updated successfully!');
      fetchAdmins();
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Failed to update permissions:', error);
      alert('Failed to update permissions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-purple-600/20 px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Permissions Management</h1>
            <p className="text-gray-400">Control what each admin role can see on the dashboard</p>
          </div>
          <Link
            href="/admin/super"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin List */}
          <div>
            <h2 className="text-xl font-bold mb-4">Admin Users</h2>
            <div className="space-y-2">
              {admins.map((admin) => (
                <button
                  key={admin.id}
                  onClick={() => setSelectedAdmin(admin)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedAdmin?.id === admin.id
                      ? 'bg-purple-900/30 border-purple-500'
                      : 'bg-[#1A1A1A] border-purple-600/30 hover:border-purple-500/50'
                  }`}
                >
                  <div className="font-semibold">{admin.full_name}</div>
                  <div className="text-sm text-gray-400">{admin.email}</div>
                  <div className="text-xs text-purple-400 mt-1">{admin.role}</div>
                </button>
              ))}

              {admins.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No admin users found
                </div>
              )}
            </div>
          </div>

          {/* Permission Editor */}
          <div>
            {selectedAdmin ? (
              <>
                <h2 className="text-xl font-bold mb-4">
                  Permissions for {selectedAdmin.full_name}
                </h2>
                <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-6">
                  <div className="space-y-6">
                    {/* Dashboard Visibility */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-purple-400">Dashboard Sections</h3>
                      <div className="space-y-2">
                        <PermissionToggle
                          label="Revenue Data"
                          description="View revenue metrics and financial data"
                          enabled={selectedAdmin.permissions.can_view_revenue}
                          onChange={() => handlePermissionToggle('can_view_revenue')}
                        />
                        <PermissionToggle
                          label="Quick Stats"
                          description="View dashboard quick stats cards"
                          enabled={selectedAdmin.permissions.can_view_quick_stats}
                          onChange={() => handlePermissionToggle('can_view_quick_stats')}
                        />
                        <PermissionToggle
                          label="User List"
                          description="View and manage user table"
                          enabled={selectedAdmin.permissions.can_view_user_list}
                          onChange={() => handlePermissionToggle('can_view_user_list')}
                        />
                        <PermissionToggle
                          label="Recent Activity"
                          description="View recent activity logs"
                          enabled={selectedAdmin.permissions.can_view_recent_activity}
                          onChange={() => handlePermissionToggle('can_view_recent_activity')}
                        />
                      </div>
                    </div>

                    {/* Data & Analytics */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-purple-400">Data & Analytics</h3>
                      <div className="space-y-2">
                        <PermissionToggle
                          label="Export Data"
                          description="Export users, activity, and reports"
                          enabled={selectedAdmin.permissions.can_export_data}
                          onChange={() => handlePermissionToggle('can_export_data')}
                        />
                        <PermissionToggle
                          label="View Analytics"
                          description="Access analytics dashboards"
                          enabled={selectedAdmin.permissions.can_view_analytics}
                          onChange={() => handlePermissionToggle('can_view_analytics')}
                        />
                      </div>
                    </div>

                    {/* Content Management */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-purple-400">Content Management</h3>
                      <div className="space-y-2">
                        <PermissionToggle
                          label="Manage Team"
                          description="Edit team member profiles"
                          enabled={selectedAdmin.permissions.can_manage_team}
                          onChange={() => handlePermissionToggle('can_manage_team')}
                        />
                        <PermissionToggle
                          label="Manage Blog"
                          description="Create and edit blog posts"
                          enabled={selectedAdmin.permissions.can_manage_blog}
                          onChange={() => handlePermissionToggle('can_manage_blog')}
                        />
                        <PermissionToggle
                          label="Manage Videos"
                          description="Upload and manage videos"
                          enabled={selectedAdmin.permissions.can_manage_videos}
                          onChange={() => handlePermissionToggle('can_manage_videos')}
                        />
                      </div>
                    </div>

                    {/* User Management */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-purple-400">User Management</h3>
                      <div className="space-y-2">
                        <PermissionToggle
                          label="Create Users"
                          description="Create new user accounts"
                          enabled={selectedAdmin.permissions.can_create_users}
                          onChange={() => handlePermissionToggle('can_create_users')}
                        />
                        <PermissionToggle
                          label="Edit Users"
                          description="Modify user information"
                          enabled={selectedAdmin.permissions.can_edit_users}
                          onChange={() => handlePermissionToggle('can_edit_users')}
                        />
                        <PermissionToggle
                          label="Delete Users"
                          description="Delete user accounts"
                          enabled={selectedAdmin.permissions.can_delete_users}
                          onChange={() => handlePermissionToggle('can_delete_users')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-6 pt-6 border-t border-purple-600/30">
                    <button
                      onClick={handleSavePermissions}
                      disabled={saving}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded transition-colors font-semibold"
                    >
                      {saving ? 'Saving...' : 'Save Permissions'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-12 text-center">
                <div className="text-gray-500 text-lg">
                  Select an admin user to manage their permissions
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PermissionToggle({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <button
        onClick={onChange}
        className={`ml-4 w-12 h-6 rounded-full transition-colors relative ${
          enabled ? 'bg-green-600' : 'bg-gray-600'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
            enabled ? 'left-6' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
