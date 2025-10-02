'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Upload, FileText, File, Trash2, Eye, Download, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Document {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  processing_status?: string;
}

export default function DocumentsPage() {
  const auth = useSupabaseAuth();
  const supabase = createClientComponentClient();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user documents
  const fetchDocuments = useCallback(async () => {
    if (!auth.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', auth.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, [auth.user?.id, supabase]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Handle file upload
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !auth.user?.id) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Validate file
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, TXT, and DOCX files are supported');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress('Uploading file...');

    try {
      // Upload to storage
      const filePath = `${auth.user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadProgress('Processing document...');

      // Extract text (simplified - in production, use proper OCR/parser)
      const text = await file.text();

      // Insert into database
      const { error: dbError } = await supabase
        .from('user_documents')
        .insert({
          user_id: auth.user.id,
          filename: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type,
          extracted_text: text
        });

      if (dbError) throw dbError;

      setUploadProgress('Document uploaded successfully!');
      setTimeout(() => {
        setUploadProgress(null);
        fetchDocuments();
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete document
  const handleDelete = async (doc: Document) => {
    if (!confirm(`Delete "${doc.filename}"?`)) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.file_path]);

      if (storageError) console.error('Storage delete error:', storageError);

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      fetchDocuments();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete document');
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, text: 'Processed', color: 'text-emerald-400 bg-emerald-900/30' };
      case 'processing':
        return { icon: Loader2, text: 'Processing', color: 'text-blue-400 bg-blue-900/30 animate-pulse' };
      case 'failed':
        return { icon: AlertCircle, text: 'Failed', color: 'text-red-400 bg-red-900/30' };
      default:
        return { icon: Clock, text: 'Pending', color: 'text-yellow-400 bg-yellow-900/30' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Library</h1>
          <p className="text-gray-600">Upload and manage your security documents for AI analysis</p>
        </div>
        <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{documents.length}</span> documents
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 transition-all
          ${isDragging
            ? 'border-purple-600 bg-purple-50'
            : 'border-gray-300 hover:border-purple-600 bg-white'
          }
        `}
      >
        <div className="text-center">
          <div className={`
            w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all
            ${isDragging ? 'bg-purple-600 scale-110' : 'bg-purple-100'}
          `}>
            <Upload className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-purple-600'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {isDragging ? 'Drop file here' : 'Upload Documents'}
          </h3>
          <p className="text-gray-600 mb-6">
            Drag and drop or click to select files
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.txt,.docx"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all cursor-pointer font-semibold text-white shadow-md"
          >
            <FileText className="w-5 h-5" />
            Select File
          </label>
          <p className="text-xs text-gray-400 mt-4">
            Supports PDF, TXT, DOCX • Max 10MB
          </p>
        </div>

        {/* Upload Progress */}
        {uploadProgress && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-900 font-medium">{uploadProgress}</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium mb-1">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Documents List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => {
            const status = getStatusBadge(doc.processing_status);
            const StatusIcon = status.icon;

            return (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-600 hover:shadow-md transition-all group"
              >
                {/* File Icon */}
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate mb-1">{doc.filename}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{formatFileSize(doc.file_size)}</span>
                    <span>•</span>
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">{status.text}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900">
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
