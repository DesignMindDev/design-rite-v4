'use client';

import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowRight, Camera, Network, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SystemSurveyorUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/system-surveyor/upload-excel', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadResult(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleProceedToAI = () => {
    if (!uploadResult) return;

    // Store the imported data in sessionStorage for AI Assistant
    sessionStorage.setItem('systemSurveyorImport', JSON.stringify(uploadResult));

    // Navigate to AI Assistant with import flag
    router.push('/ai-assistant?source=system-surveyor&imported=true');
  };

  return (
    <div className="min-h-screen dr-bg-gradient dr-pattern">
      <div className="dr-container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <FileSpreadsheet className="w-12 h-12 text-dr-accent" />
            <h1 className="text-4xl font-bold dr-text-gradient">
              System Surveyor Import
            </h1>
          </div>
          <p className="text-xl text-dr-text-secondary max-w-2xl mx-auto">
            Upload your System Surveyor Excel export to instantly generate a professional security estimate
          </p>
        </div>

        {/* Upload Card */}
        <div className="max-w-3xl mx-auto">
          <div className="dr-card p-8">
            {!uploadResult ? (
              <>
                {/* File Upload Area */}
                <div className="mb-8">
                  <label
                    htmlFor="file-upload"
                    className={`
                      flex flex-col items-center justify-center
                      border-2 border-dashed rounded-lg p-12
                      cursor-pointer transition-all
                      ${file ? 'border-dr-accent bg-dr-accent/5' : 'border-dr-border hover:border-dr-accent/50'}
                    `}
                  >
                    <Upload className={`w-16 h-16 mb-4 ${file ? 'text-dr-accent' : 'text-dr-text-secondary'}`} />
                    <p className="text-lg font-semibold mb-2">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-dr-text-secondary">
                      System Surveyor Excel export (.xlsx, .xls)
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-400">Upload Failed</p>
                      <p className="text-sm text-dr-text-secondary">{error}</p>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="dr-btn-primary w-full"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload & Process
                    </>
                  )}
                </button>

                {/* Info Box */}
                <div className="mt-8 p-6 bg-dr-accent/5 border border-dr-accent/20 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-dr-accent" />
                    What we'll extract:
                  </h3>
                  <ul className="space-y-2 text-sm text-dr-text-secondary">
                    <li>✓ Site information and survey details</li>
                    <li>✓ Camera locations and specifications</li>
                    <li>✓ Network equipment inventory</li>
                    <li>✓ Infrastructure and cabling</li>
                    <li>✓ Installation labor hours</li>
                    <li>✓ Access control devices</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Upload Success - Show Summary */}
                <div className="text-center mb-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Import Successful!</h2>
                  <p className="text-dr-text-secondary">
                    Processed {uploadResult.rawDataCount} rows from {uploadResult.siteInfo.siteName}
                  </p>
                </div>

                {/* Site Info */}
                <div className="mb-6 p-4 bg-dr-surface rounded-lg border border-dr-border">
                  <h3 className="font-semibold mb-2">Site Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-dr-text-secondary">Name:</span> {uploadResult.siteInfo.siteName}</p>
                    <p><span className="text-dr-text-secondary">Address:</span> {uploadResult.siteInfo.address}</p>
                    <p><span className="text-dr-text-secondary">Survey:</span> {uploadResult.siteInfo.surveyName}</p>
                  </div>
                </div>

                {/* Equipment Summary */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="dr-card p-4 text-center">
                    <Camera className="w-8 h-8 text-dr-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold">{uploadResult.equipment.cameras.length}</div>
                    <div className="text-sm text-dr-text-secondary">Cameras</div>
                  </div>
                  <div className="dr-card p-4 text-center">
                    <Network className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{uploadResult.equipment.network.length}</div>
                    <div className="text-sm text-dr-text-secondary">Network</div>
                  </div>
                  <div className="dr-card p-4 text-center">
                    <Wrench className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{uploadResult.totals.totalInstallHours}h</div>
                    <div className="text-sm text-dr-text-secondary">Labor</div>
                  </div>
                </div>

                {/* Totals */}
                <div className="mb-8 p-6 bg-gradient-to-r from-dr-accent/10 to-dr-primary/10 rounded-lg border border-dr-accent/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-dr-text-secondary mb-1">Total Equipment</div>
                      <div className="text-2xl font-bold">{uploadResult.totals.totalItems} items</div>
                    </div>
                    <div>
                      <div className="text-sm text-dr-text-secondary mb-1">Est. Labor Cost</div>
                      <div className="text-2xl font-bold">
                        ${uploadResult.totals.estimatedLaborCost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={handleProceedToAI}
                  className="dr-btn-primary w-full"
                >
                  Continue to AI Assistant
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Upload Another */}
                <button
                  onClick={() => {
                    setFile(null);
                    setUploadResult(null);
                    setError(null);
                  }}
                  className="dr-btn-secondary w-full mt-4"
                >
                  Upload Another File
                </button>
              </>
            )}
          </div>

          {/* Partnership Info */}
          <div className="mt-8 text-center text-sm text-dr-text-secondary">
            <p>
              Powered by <span className="text-dr-accent font-semibold">System Surveyor</span> integration
            </p>
            <p className="mt-2">
              Professional field surveys meet AI-powered proposals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
