'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function SpatialStudioAdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentAnnotations, setRecentAnnotations] = useState<any[]>([]);
  const [recentSuggestions, setRecentSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Load overall stats
      const { data: projects } = await supabase
        .from('spatial_projects')
        .select('*');

      const { data: annotations } = await supabase
        .from('site_annotations')
        .select('*');

      const { data: suggestions } = await supabase
        .from('ai_device_suggestions')
        .select('*');

      const { data: sessions } = await supabase
        .from('site_walk_sessions')
        .select('*');

      // Calculate stats
      const totalProjects = projects?.length || 0;
      const totalAnnotations = annotations?.length || 0;
      const totalSuggestions = suggestions?.length || 0;
      const activeSessions = sessions?.filter(s => s.status === 'in_progress').length || 0;

      // Get projects from last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentProjectsCount = projects?.filter(p =>
        new Date(p.created_at) > sevenDaysAgo
      ).length || 0;

      // Average confidence score
      const avgConfidence = annotations?.length
        ? (annotations.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / annotations.length).toFixed(2)
        : '0';

      setStats({
        totalProjects,
        totalAnnotations,
        totalSuggestions,
        activeSessions,
        recentProjectsCount,
        avgConfidence
      });

      // Load recent projects
      const { data: recentProjectsData } = await supabase
        .from('spatial_projects')
        .select('*, site_annotations(count)')
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentProjects(recentProjectsData || []);

      // Load recent annotations
      const { data: recentAnnotationsData } = await supabase
        .from('site_annotations')
        .select('*, spatial_projects(project_name, customer_id)')
        .order('timestamp', { ascending: false })
        .limit(10);

      setRecentAnnotations(recentAnnotationsData || []);

      // Load recent AI suggestions
      const { data: recentSuggestionsData } = await supabase
        .from('ai_device_suggestions')
        .select('*, spatial_projects(project_name, customer_id)')
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentSuggestions(recentSuggestionsData || []);

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
              ← Admin
            </Link>
            <span className="text-gray-600">/</span>
            <span>Spatial Studio Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Spatial Studio Analytics
          </h1>
          <p className="text-gray-400 mt-2">3D floor plan projects, annotations, and AI suggestions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-purple-600/30">
            <div className="text-3xl font-bold text-purple-400">{stats?.totalProjects || 0}</div>
            <div className="text-sm text-gray-400 mt-1">Total Projects</div>
            <div className="text-xs text-green-400 mt-2">
              +{stats?.recentProjectsCount || 0} this week
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-purple-600/30">
            <div className="text-3xl font-bold text-blue-400">{stats?.totalAnnotations || 0}</div>
            <div className="text-sm text-gray-400 mt-1">Site Annotations</div>
            <div className="text-xs text-gray-500 mt-2">
              Avg confidence: {stats?.avgConfidence || 0}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-purple-600/30">
            <div className="text-3xl font-bold text-pink-400">{stats?.totalSuggestions || 0}</div>
            <div className="text-sm text-gray-400 mt-1">AI Device Suggestions</div>
            <div className="text-xs text-yellow-400 mt-2">
              {stats?.activeSessions || 0} active sessions
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Projects</h2>
            <Link
              href="/spatial-studio/projects"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-700">
                  <th className="pb-2">Project Name</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Annotations</th>
                  <th className="pb-2">Created</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3">{project.project_name}</td>
                    <td className="py-3">{project.customer_id || '-'}</td>
                    <td className="py-3">
                      {project.site_annotations?.[0]?.count || 0}
                    </td>
                    <td className="py-3">
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/spatial-studio?project=${project.id}`}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        View 3D →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Annotations */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-bold mb-4">Recent Site Annotations</h2>

          <div className="space-y-3">
            {recentAnnotations.map((annotation) => (
              <div
                key={annotation.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-purple-300">
                      {annotation.spatial_projects?.project_name || 'Unknown Project'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {annotation.spatial_projects?.customer_id || 'No customer'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(annotation.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="text-sm text-gray-300 mb-2">
                  Type: <span className="text-blue-400">{annotation.annotation_type}</span>
                </div>

                {annotation.voice_transcript && (
                  <div className="text-sm text-gray-400 italic">
                    "{annotation.voice_transcript.substring(0, 100)}..."
                  </div>
                )}

                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  {annotation.device_type && (
                    <span>📱 {annotation.device_type}</span>
                  )}
                  <span>
                    🎯 Confidence: {((annotation.confidence_score || 0) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI Suggestions */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Recent AI Device Suggestions</h2>

          <div className="space-y-3">
            {recentSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-pink-300">
                      {suggestion.spatial_projects?.project_name || 'Unknown Project'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {suggestion.spatial_projects?.customer_id || 'No customer'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(suggestion.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="text-sm text-gray-300 mb-2">
                  Device: <span className="text-green-400">{suggestion.device_category}</span>
                </div>

                {suggestion.reasoning && (
                  <div className="text-sm text-gray-400 mb-2">
                    💡 {suggestion.reasoning}
                  </div>
                )}

                <div className="flex gap-4 text-xs text-gray-500">
                  {suggestion.coverage_area && (
                    <span>
                      📐 Coverage: {suggestion.coverage_area.radius}ft @ {suggestion.coverage_area.angle}°
                    </span>
                  )}
                  <span>
                    🎯 Confidence: {((suggestion.confidence_score || 0) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
