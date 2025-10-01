'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with no SSR to avoid Three.js SSR issues
const FloorPlanViewer3D = dynamic(
  () => import('@/components/spatial-studio/FloorPlanViewer3D'),
  { ssr: false }
);

export default function SpatialStudioPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [floorPlanData, setFloorPlanData] = useState<any>(null);
  const [projectId, setProjectId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('floorplan', uploadedFile);
    formData.append('projectName', `Floor Plan - ${new Date().toLocaleDateString()}`);
    formData.append('customerId', 'demo-customer');

    try {
      console.log('Uploading floor plan:', uploadedFile.name);

      const response = await fetch('/api/spatial-studio/upload-floorplan', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        console.log('Upload successful:', data);
        setFloorPlanData(data.model);
        setProjectId(data.projectId);
      } else {
        console.error('Upload failed:', data);
        setError(data.error || 'Upload failed');
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Spatial Studio
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            AI Creative Studio with 3D Site Intelligence
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Upload floor plan → AI generates 3D model → Plan security design
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-8 border border-purple-600/20">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
            <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
              1
            </span>
            Upload Floor Plan
          </h2>

          <form onSubmit={handleFileUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select floor plan file
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  setUploadedFile(e.target.files?.[0] || null);
                  setError('');
                }}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-600 file:text-white
                  hover:file:bg-purple-700 cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, PNG, JPG (max 10MB)
              </p>
              {uploadedFile && (
                <p className="text-xs text-green-500 mt-2">
                  ✓ {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">⚠️ {error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!uploadedFile || loading}
              className="px-6 py-3 bg-purple-600 rounded-lg font-semibold
                hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors w-full sm:w-auto"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing with AI...
                </span>
              ) : (
                '🚀 Generate 3D Model'
              )}
            </button>
          </form>
        </div>

        {/* 3D Viewer Section */}
        {floorPlanData && (
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-purple-600/20">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                2
              </span>
              View 3D Floor Plan
            </h2>

            <div className="bg-gray-800 rounded-lg p-3 mb-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400">Project ID:</span>
                  <span className="ml-2 text-purple-400 font-mono">{projectId.substring(0, 8)}...</span>
                </div>
                <div>
                  <span className="text-gray-400">Walls Detected:</span>
                  <span className="ml-2 text-green-400">{floorPlanData.walls?.length || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">Doors:</span>
                  <span className="ml-2 text-blue-400">{floorPlanData.doors?.length || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">Windows:</span>
                  <span className="ml-2 text-cyan-400">{floorPlanData.windows?.length || 0}</span>
                </div>
              </div>
            </div>

            <FloorPlanViewer3D floorPlanData={floorPlanData} />

            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-300 mb-2">💡 3D Viewer Controls:</p>
              <ul className="text-xs sm:text-sm text-gray-400 space-y-1">
                <li>🖱️ <strong>Left Click + Drag:</strong> Rotate view</li>
                <li>🔍 <strong>Scroll Wheel:</strong> Zoom in/out</li>
                <li>👆 <strong>Right Click + Drag:</strong> Pan around</li>
                <li>📐 <strong>Grid:</strong> Each square = 1 foot</li>
              </ul>
            </div>

            {/* Next Steps Preview */}
            <div className="mt-6 border-t border-gray-700 pt-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-300">
                🚀 Coming Next (Phase 2):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-800 rounded-lg p-3 border border-purple-600/20">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-semibold text-purple-400">Mobile Capture</div>
                  <div className="text-xs text-gray-500 mt-1">Site walks with GPS + voice annotations</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 border border-pink-600/20">
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-semibold text-pink-400">AI Suggestions</div>
                  <div className="text-xs text-gray-500 mt-1">Optimal camera & sensor placements</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 border border-blue-600/20">
                  <div className="text-2xl mb-2">🕶️</div>
                  <div className="font-semibold text-blue-400">AR Glasses</div>
                  <div className="text-xs text-gray-500 mt-1">Meta Ray-Ban Smart Glasses integration</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        {!floorPlanData && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="text-3xl mb-2">📐</div>
              <h3 className="font-semibold mb-1">AI Floor Plan Analysis</h3>
              <p className="text-xs text-gray-400">GPT-4 Vision detects walls, doors, windows automatically</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-semibold mb-1">Interactive 3D View</h3>
              <p className="text-xs text-gray-400">Rotate, zoom, and explore your floor plan in real-time</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Instant Results</h3>
              <p className="text-xs text-gray-400">From upload to 3D model in seconds</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
