'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserPermissions {
  // Content Management
  can_manage_team: boolean;
  can_manage_blog: boolean;
  can_manage_videos: boolean;
  can_manage_settings: boolean;

  // User Management
  can_create_users: boolean;
  can_edit_users: boolean;
  can_delete_users: boolean;
  can_assign_permissions: boolean;

  // Data & Analytics
  can_view_activity: boolean;
  can_export_data: boolean;
  can_view_analytics: boolean;

  // System
  can_access_admin_panel: boolean;
  can_manage_integrations: boolean;
}

interface ModulePermissions {
  operations_dashboard: boolean;
  ai_management: boolean;
  data_harvesting: boolean;
  marketing_content: boolean;
  about_us: boolean;
  team_management: boolean;
  logo_management: boolean;
  video_management: boolean;
  blog_management: boolean;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  company: string;
  phone: string;
  status: string;
  access_code: string;
  notes: string;
}

export default function EditUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions>({
    can_manage_team: false,
    can_manage_blog: false,
    can_manage_videos: false,
    can_manage_settings: false,
    can_create_users: false,
    can_edit_users: false,
    can_delete_users: false,
    can_assign_permissions: false,
    can_view_activity: false,
    can_export_data: false,
    can_view_analytics: false,
    can_access_admin_panel: false,
    can_manage_integrations: false,
  });

  const [modulePermissions, setModulePermissions] = useState<ModulePermissions>({
    operations_dashboard: false,
    ai_management: false,
    data_harvesting: false,
    marketing_content: false,
    about_us: false,
    team_management: false,
    logo_management: false,
    video_management: false,
    blog_management: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    if (session?.user?.role !== 'super_admin' && session?.user?.role !== 'admin') {
      router.push('/admin/super');
      return;
    }

    if (userId) {
      fetchUser();
    }
  }, [session, status, userId, router]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/get-user?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');

      const data = await response.json();
      setUser(data.user);
      setPermissions(data.permissions || permissions);
      setModulePermissions(data.modulePermissions || modulePermissions);
    } catch (err: any) {
      setError(err.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (field: keyof User, value: string) => {
    if (user) {
      setUser({ ...user, [field]: value });
    }
  };

  const handlePermissionToggle = (permission: keyof UserPermissions) => {
    setPermissions({ ...permissions, [permission]: !permissions[permission] });
  };

  const handleModuleToggle = (module: keyof ModulePermissions) => {
    setModulePermissions({ ...modulePermissions, [module]: !modulePermissions[module] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, permissions, modulePermissions })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user');
      }

      setSuccess('User updated successfully!');
      setTimeout(() => router.push('/admin/super'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-lg">Loading user...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-lg">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-purple-600/20 px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Edit User</h1>
            <p className="text-gray-400">Modify user details and permissions</p>
          </div>
          <Link
            href="/admin/super"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded">
              {success}
            </div>
          )}

          {/* User Details */}
          <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">User Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => handleUserChange('email', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={user.full_name || ''}
                  onChange={(e) => handleUserChange('full_name', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Role</label>
                <select
                  value={user.role}
                  onChange={(e) => handleUserChange('role', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white"
                  required
                >
                  {session?.user?.role === 'super_admin' && (
                    <>
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                    </>
                  )}
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                  <option value="guest">Guest</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Status</label>
                <select
                  value={user.status}
                  onChange={(e) => handleUserChange('status', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  value={user.company || ''}
                  onChange={(e) => handleUserChange('company', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={user.phone || ''}
                  onChange={(e) => handleUserChange('phone', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Access Code</label>
                <input
                  type="text"
                  value={user.access_code || ''}
                  onChange={(e) => handleUserChange('access_code', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white"
                  placeholder="DR-US-COMPANY-001"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Notes</label>
                <textarea
                  value={user.notes || ''}
                  onChange={(e) => handleUserChange('notes', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white"
                  rows={3}
                  placeholder="Internal notes about this user..."
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Admin Permissions</h2>

            <div className="space-y-6">
              {/* Content Management */}
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Content Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-purple-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_manage_team}
                      onChange={() => handlePermissionToggle('can_manage_team')}
                      className="w-5 h-5 text-purple-600"
                    />
                    <div>
                      <div className="font-medium">Manage Team</div>
                      <div className="text-sm text-gray-400">Edit team members page</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-purple-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_manage_blog}
                      onChange={() => handlePermissionToggle('can_manage_blog')}
                      className="w-5 h-5 text-purple-600"
                    />
                    <div>
                      <div className="font-medium">Manage Blog</div>
                      <div className="text-sm text-gray-400">Create and edit blog posts</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-purple-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_manage_videos}
                      onChange={() => handlePermissionToggle('can_manage_videos')}
                      className="w-5 h-5 text-purple-600"
                    />
                    <div>
                      <div className="font-medium">Manage Videos</div>
                      <div className="text-sm text-gray-400">Upload and manage video content</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-purple-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_manage_settings}
                      onChange={() => handlePermissionToggle('can_manage_settings')}
                      className="w-5 h-5 text-purple-600"
                    />
                    <div>
                      <div className="font-medium">Manage Settings</div>
                      <div className="text-sm text-gray-400">Site settings, logos, etc.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* User Management */}
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">User Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_create_users}
                      onChange={() => handlePermissionToggle('can_create_users')}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div>
                      <div className="font-medium">Create Users</div>
                      <div className="text-sm text-gray-400">Add new users to platform</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_edit_users}
                      onChange={() => handlePermissionToggle('can_edit_users')}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div>
                      <div className="font-medium">Edit Users</div>
                      <div className="text-sm text-gray-400">Modify existing users</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_delete_users}
                      onChange={() => handlePermissionToggle('can_delete_users')}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div>
                      <div className="font-medium">Delete Users</div>
                      <div className="text-sm text-gray-400">Suspend or delete users</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_assign_permissions}
                      onChange={() => handlePermissionToggle('can_assign_permissions')}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div>
                      <div className="font-medium">Assign Permissions</div>
                      <div className="text-sm text-gray-400">Edit permissions for others</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data & Analytics */}
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3">Data & Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-green-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_view_activity}
                      onChange={() => handlePermissionToggle('can_view_activity')}
                      className="w-5 h-5 text-green-600"
                    />
                    <div>
                      <div className="font-medium">View Activity</div>
                      <div className="text-sm text-gray-400">Access activity logs</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-green-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_export_data}
                      onChange={() => handlePermissionToggle('can_export_data')}
                      className="w-5 h-5 text-green-600"
                    />
                    <div>
                      <div className="font-medium">Export Data</div>
                      <div className="text-sm text-gray-400">Download exports and backups</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-green-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_view_analytics}
                      onChange={() => handlePermissionToggle('can_view_analytics')}
                      className="w-5 h-5 text-green-600"
                    />
                    <div>
                      <div className="font-medium">View Analytics</div>
                      <div className="text-sm text-gray-400">Platform usage statistics</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* System */}
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">System Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-yellow-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_access_admin_panel}
                      onChange={() => handlePermissionToggle('can_access_admin_panel')}
                      className="w-5 h-5 text-yellow-600"
                    />
                    <div>
                      <div className="font-medium">Access Admin Panel</div>
                      <div className="text-sm text-gray-400">Can access /admin at all</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-yellow-900/10 p-3 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.can_manage_integrations}
                      onChange={() => handlePermissionToggle('can_manage_integrations')}
                      className="w-5 h-5 text-yellow-600"
                    />
                    <div>
                      <div className="font-medium">Manage Integrations</div>
                      <div className="text-sm text-gray-400">System Surveyor, APIs, etc.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Module Access Control */}
          <div className="bg-[#1A1A1A] border border-orange-600/30 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-orange-400">📋 Admin Module Access</h2>
              <p className="text-gray-400 text-sm mt-1">
                Control which sections of the /admin content management page this user can access
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-orange-900/10 p-3 rounded border border-orange-600/20">
                <input
                  type="checkbox"
                  checked={modulePermissions.operations_dashboard}
                  onChange={() => handleModuleToggle('operations_dashboard')}
                  className="w-5 h-5 text-orange-600"
                />
                <div>
                  <div className="font-medium">📊 Operations Dashboard</div>
                  <div className="text-sm text-gray-400">Main operations view</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-orange-900/10 p-3 rounded border border-orange-600/20">
                <input
                  type="checkbox"
                  checked={modulePermissions.ai_management}
                  onChange={() => handleModuleToggle('ai_management')}
                  className="w-5 h-5 text-orange-600"
                />
                <div>
                  <div className="font-medium">🤖 AI Management</div>
                  <div className="text-sm text-gray-400">AI providers, analytics</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-orange-900/10 p-3 rounded border border-orange-600/20">
                <input
                  type="checkbox"
                  checked={modulePermissions.data_harvesting}
                  onChange={() => handleModuleToggle('data_harvesting')}
                  className="w-5 h-5 text-orange-600"
                />
                <div>
                  <div className="font-medium">🗄️ Data & Harvesting</div>
                  <div className="text-sm text-gray-400">Product harvester, assessments</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-orange-900/10 p-3 rounded border border-orange-600/20">
                <input
                  type="checkbox"
                  checked={modulePermissions.marketing_content}
                  onChange={() => handleModuleToggle('marketing_content')}
                  className="w-5 h-5 text-orange-600"
                />
                <div>
                  <div className="font-medium">📈 Marketing & Content</div>
                  <div className="text-sm text-gray-400">Demos, leads, user journey</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-orange-900/10 p-3 rounded border border-orange-600/20">
                <input
                  type="checkbox"
                  checked={modulePermissions.about_us}
                  onChange={() => handleModuleToggle('about_us')}
                  className="w-5 h-5 text-orange-600"
                />
                <div>
                  <div className="font-medium">ℹ️ About Us</div>
                  <div className="text-sm text-gray-400">Careers, company info</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-orange-900/10 p-3 rounded border border-orange-600/20">
                <input
                  type="checkbox"
                  checked={modulePermissions.team_management}
                  onChange={() => handleModuleToggle('team_management')}
                  className="w-5 h-5 text-orange-600"
                />
                <div>
                  <div className="font-medium">👥 Team Management</div>
                  <div className="text-sm text-gray-400">Edit team members page</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-orange-900/10 p-3 rounded border border-orange-600/20">
                <input
                  type="checkbox"
                  checked={modulePermissions.logo_management}
                  onChange={() => handleModuleToggle('logo_management')}
                  className="w-5 h-5 text-orange-600"
                />
                <div>
                  <div className="font-medium">🎨 Logo Management</div>
                  <div className="text-sm text-gray-400">Header/footer logos</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-orange-900/10 p-3 rounded border border-orange-600/20">
                <input
                  type="checkbox"
                  checked={modulePermissions.video_management}
                  onChange={() => handleModuleToggle('video_management')}
                  className="w-5 h-5 text-orange-600"
                />
                <div>
                  <div className="font-medium">🎥 Video Management</div>
                  <div className="text-sm text-gray-400">Demo videos, YouTube</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-orange-900/10 p-3 rounded border border-orange-600/20">
                <input
                  type="checkbox"
                  checked={modulePermissions.blog_management}
                  onChange={() => handleModuleToggle('blog_management')}
                  className="w-5 h-5 text-orange-600"
                />
                <div>
                  <div className="font-medium">📝 Blog Management</div>
                  <div className="text-sm text-gray-400">Create/edit blog posts</div>
                </div>
              </label>
            </div>

            <div className="mt-4 p-4 bg-orange-900/10 rounded border border-orange-600/20">
              <p className="text-sm text-gray-300">
                <strong>💡 Tip:</strong> Module permissions only affect the /admin content management page.
                For blog-only access, enable "Blog Management" and disable all others.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/super"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
