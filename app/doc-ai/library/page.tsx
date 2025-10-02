'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FileText, Download, Eye, Trash2, RefreshCw, Loader2, FileCheck, DollarSign, Calendar, Search, Filter } from 'lucide-react';

interface GeneratedDocument {
  id: string;
  title: string;
  content: string;
  document_type: string;
  document_category: string;
  client_name?: string;
  amount?: number;
  created_at: string;
  file_path?: string;
}

export default function LibraryPage() {
  const auth = useSupabaseAuth();
  const supabase = createClientComponentClient();
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<GeneratedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<GeneratedDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showPreview, setShowPreview] = useState(false);

  // Fetch generated documents
  const fetchDocuments = useCallback(async () => {
    if (!auth.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('user_id', auth.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
      setFilteredDocs(data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setIsLoading(false);
    }
  }, [auth.user?.id, supabase]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filter and search
  useEffect(() => {
    let filtered = documents;

    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.document_type === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDocs(filtered);
  }, [searchQuery, filterType, documents]);

  // Delete document
  const handleDelete = async (doc: GeneratedDocument) => {
    if (!confirm(`Delete "${doc.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('generated_documents')
        .delete()
        .eq('id', doc.id);

      if (error) throw error;
      fetchDocuments();
      if (selectedDoc?.id === doc.id) {
        setSelectedDoc(null);
        setShowPreview(false);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Download document
  const handleDownload = (doc: GeneratedDocument) => {
    const blob = new Blob([doc.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Regenerate document
  const handleRegenerate = async (doc: GeneratedDocument) => {
    try {
      const response = await fetch('/api/doc-ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: doc.document_type,
          title: doc.title
        })
      });

      if (!response.ok) throw new Error('Failed to regenerate');

      fetchDocuments();
    } catch (err) {
      console.error('Regenerate error:', err);
    }
  };

  const getDocTypeInfo = (type: string) => {
    switch (type) {
      case 'security_assessment':
        return { icon: FileCheck, label: 'Security Assessment', color: 'from-purple-600 to-blue-600' };
      case 'proposal':
        return { icon: FileText, label: 'Proposal', color: 'from-blue-600 to-cyan-600' };
      case 'invoice':
        return { icon: DollarSign, label: 'Invoice', color: 'from-emerald-600 to-teal-600' };
      default:
        return { icon: FileText, label: 'Document', color: 'from-gray-600 to-gray-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Library</h1>
          <p className="text-gray-600">Browse and manage AI-generated documents</p>
        </div>
        <button
          onClick={fetchDocuments}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="all">All Types</option>
            <option value="security_assessment">Security Assessments</option>
            <option value="proposal">Proposals</option>
            <option value="invoice">Invoices</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-20 bg-white/30 rounded-2xl border border-purple-600/10">
          <FileText className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
          <p className="text-gray-900/60 mb-2">
            {searchQuery || filterType !== 'all' ? 'No documents match your filters' : 'No documents generated yet'}
          </p>
          {!searchQuery && filterType === 'all' && (
            <p className="text-sm text-gray-900/40">
              Use the AI Chat to generate security assessments and proposals
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => {
            const typeInfo = getDocTypeInfo(doc.document_type);
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={doc.id}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-600/40 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedDoc(doc);
                  setShowPreview(true);
                }}
              >
                {/* Document Type Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${typeInfo.color} rounded-lg mb-4`}>
                  <TypeIcon className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white">{typeInfo.label}</span>
                </div>

                {/* Document Title */}
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {doc.title}
                </h3>

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  {doc.client_name && (
                    <p className="text-sm text-gray-900/60 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {doc.client_name}
                    </p>
                  )}
                  {doc.amount && (
                    <p className="text-sm text-gray-900/60 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      ${doc.amount.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-900/40 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-purple-600/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDoc(doc);
                      setShowPreview(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-600/30 rounded-lg transition-colors text-gray-900 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900/70 hover:text-gray-900"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc);
                    }}
                    className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedDoc && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white border border-gray-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedDoc.title}</h2>
                <p className="text-sm text-gray-900/60">{selectedDoc.client_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedDoc)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-gray-900"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div
                className="prose prose-invert max-w-none text-gray-900"
                dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
