'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CreateUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user' as 'super_admin' | 'admin' | 'manager' | 'user' | 'guest',
    company: '',
    phone: '',
    access_code: '',
    notes: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    if (session?.user?.role !== 'super_admin' && session?.user?.role !== 'admin') {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate role restrictions for regular admins
      if (session?.user?.role === 'admin' && (formData.role === 'super_admin' || formData.role === 'admin')) {
        setError('Admins can only create User or Manager roles');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setSuccess(`User created successfully! User ID: ${data.userId}`);

      // Reset form
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'user',
        company: '',
        phone: '',
        access_code: '',
        notes: ''
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/admin/super');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (status === 'loading') {
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
            <h1 className="text-2xl font-bold">Create New User</h1>
            <p className="text-gray-400">Add a new user to the platform</p>
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
      <div className="max-w-3xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="bg-[#1A1A1A] border border-purple-600/30 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-bold mb-4">Account Information</h2>

            <div>
              <label className="block text-gray-300 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                required
                disabled={loading}
                minLength={8}
              />
              <p className="text-gray-500 text-sm mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                required
                disabled={loading}
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
              <p className="text-gray-500 text-sm mt-1">
                {session?.user?.role === 'admin' && 'Admins can only create User or Manager roles'}
              </p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Access Code</label>
              <input
                type="text"
                name="access_code"
                value={formData.access_code}
                onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                disabled={loading}
                placeholder="e.g., DR-US-COMPANY-001"
              />
              <p className="text-gray-500 text-sm mt-1">Optional unique access code for this user</p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                disabled={loading}
                rows={3}
                placeholder="Internal notes about this user..."
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating User...' : 'Create User'}
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
