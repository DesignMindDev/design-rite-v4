'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface HelpItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url?: string;
  action?: () => void;
}

interface ContextSuggestion {
  icon: string;
  title: string;
  description: string;
  action: () => void;
}

export default function HelpSearchSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<HelpItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [contextSuggestions, setContextSuggestions] = useState<ContextSuggestion[]>([]);
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Help items database
  const helpItems: HelpItem[] = [
    // Security Estimate Help
    {
      id: 'estimate-basics',
      title: 'How to Create Security Estimates',
      description: 'Step-by-step guide to generating accurate security system estimates',
      category: 'Estimation',
      tags: ['estimate', 'pricing', 'security', 'basics'],
      url: '/help/estimation-guide'
    },
    {
      id: 'pricing-data',
      title: 'Understanding Pricing Data',
      description: 'How our real-time pricing system works with 3,000+ products',
      category: 'Estimation',
      tags: ['pricing', 'products', 'database', 'costs'],
      url: '/help/pricing-guide'
    },

    // AI Assessment Help
    {
      id: 'ai-assessment-intro',
      title: 'AI Assessment Overview',
      description: 'Complete guide to using the AI Discovery Assistant',
      category: 'Assessment',
      tags: ['ai', 'assessment', 'discovery', 'comprehensive'],
      url: '/help/ai-assessment'
    },
    {
      id: 'compliance-requirements',
      title: 'Compliance Requirements Guide',
      description: 'FERPA, HIPAA, CJIS compliance for security installations',
      category: 'Compliance',
      tags: ['ferpa', 'hipaa', 'cjis', 'compliance', 'regulations'],
      url: '/help/compliance'
    },

    // Creative Studio Help
    {
      id: 'creative-studio-basics',
      title: 'Creative Studio Getting Started',
      description: 'How to create compelling content with AI assistance',
      category: 'Content',
      tags: ['creative', 'content', 'writing', 'marketing'],
      url: '/help/creative-studio'
    },
    {
      id: 'brand-voice',
      title: 'Tuesday Morning Storm Brand Voice',
      description: 'Understanding and applying Design-Rite\'s unique brand voice',
      category: 'Content',
      tags: ['brand', 'voice', 'messaging', 'tone'],
      url: '/help/brand-voice'
    },

    // Product Database Help
    {
      id: 'product-search',
      title: 'Finding the Right Products',
      description: 'Search techniques for our security product database',
      category: 'Products',
      tags: ['products', 'search', 'cameras', 'access control'],
      url: '/help/product-search'
    },
    {
      id: 'facility-types',
      title: 'Security by Facility Type',
      description: 'Best practices for different facility types and environments',
      category: 'Installation',
      tags: ['facility', 'office', 'warehouse', 'retail', 'education'],
      url: '/help/facility-types'
    },

    // Quick Actions
    {
      id: 'quick-estimate',
      title: 'Start Quick Estimate',
      description: '5-minute estimate for immediate pricing',
      category: 'Quick Actions',
      tags: ['quick', 'estimate', 'fast', 'pricing'],
      action: () => window.location.href = '/security-estimate'
    },
    {
      id: 'ai-discovery',
      title: 'Launch AI Discovery',
      description: 'Comprehensive 15-20 minute security assessment',
      category: 'Quick Actions',
      tags: ['ai', 'discovery', 'assessment', 'comprehensive'],
      action: () => window.location.href = '/ai-assessment'
    },
    {
      id: 'create-content',
      title: 'Create Marketing Content',
      description: 'Generate blog posts, case studies, and social media content',
      category: 'Quick Actions',
      tags: ['content', 'marketing', 'creative', 'generation'],
      action: () => window.location.href = '/admin/creative-studio'
    }
  ];

  // Context-aware suggestions based on current page
  useEffect(() => {
    const suggestions: ContextSuggestion[] = [];

    if (pathname.includes('/security-estimate')) {
      suggestions.push(
        {
          icon: '💡',
          title: 'Pricing Tips',
          description: 'Get accurate estimates faster',
          action: () => setSearchQuery('pricing data')
        },
        {
          icon: '🏢',
          title: 'Facility Guidelines',
          description: 'Security best practices by building type',
          action: () => setSearchQuery('facility types')
        },
        {
          icon: '🚀',
          title: 'Upgrade to AI Assessment',
          description: 'Get comprehensive analysis',
          action: () => window.location.href = '/ai-assessment'
        }
      );
    } else if (pathname.includes('/ai-assessment')) {
      suggestions.push(
        {
          icon: '📋',
          title: 'Compliance Check',
          description: 'Ensure regulatory requirements',
          action: () => setSearchQuery('compliance requirements')
        },
        {
          icon: '🎯',
          title: 'Assessment Tips',
          description: 'Maximize AI assistant effectiveness',
          action: () => setSearchQuery('ai assessment')
        },
        {
          icon: '📊',
          title: 'Quick Estimate',
          description: 'Start with basic pricing',
          action: () => window.location.href = '/security-estimate'
        }
      );
    } else if (pathname.includes('/creative-studio')) {
      suggestions.push(
        {
          icon: '✍️',
          title: 'Brand Voice Guide',
          description: 'Apply Tuesday Morning Storm voice',
          action: () => setSearchQuery('brand voice')
        },
        {
          icon: '🎨',
          title: 'Content Ideas',
          description: 'Get inspiration for your next piece',
          action: () => setSearchQuery('creative studio')
        },
        {
          icon: '📈',
          title: 'Marketing Strategy',
          description: 'Content that converts',
          action: () => setSearchQuery('marketing content')
        }
      );
    } else {
      // Homepage or general navigation
      suggestions.push(
        {
          icon: '⚡',
          title: 'Quick Start',
          description: 'Get your first estimate in 5 minutes',
          action: () => window.location.href = '/estimate-options'
        },
        {
          icon: '🤖',
          title: 'AI Discovery',
          description: 'Comprehensive security assessment',
          action: () => window.location.href = '/ai-assessment'
        },
        {
          icon: '🎯',
          title: 'Find Products',
          description: 'Search our security product database',
          action: () => setSearchQuery('product search')
        }
      );
    }

    setContextSuggestions(suggestions);
  }, [pathname]);

  // Filter help items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = helpItems.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );

    setFilteredItems(filtered);
  }, [searchQuery]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('helpSearchHistory');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search to history
  const saveSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('helpSearchHistory', JSON.stringify(updated));
  };

  // Handle help item click
  const handleItemClick = (item: HelpItem) => {
    saveSearch(searchQuery);

    if (item.action) {
      item.action();
    } else if (item.url) {
      window.open(item.url, '_blank');
    }

    setIsOpen(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open help
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Help Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-purple-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-purple-700 transition-all z-40 group"
        title="Help & Search (Ctrl+K)"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">❓</span>
          <span className="hidden group-hover:block text-sm whitespace-nowrap pr-1">Help</span>
        </div>
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)} />
      )}

      {/* Help Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Help & Search</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-purple-100 text-sm mt-1">Find answers, products, and quick actions</p>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help, products, actions..."
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Results */}
            {searchQuery && filteredItems.length > 0 && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Search Results</h3>
                <div className="space-y-2">
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mt-2">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-gray-400 ml-2">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery && filteredItems.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <p>No results found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try searching for: estimate, assessment, pricing, compliance</p>
              </div>
            )}

            {/* Context Suggestions */}
            {!searchQuery && contextSuggestions.length > 0 && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Suggestions for this page</h3>
                <div className="space-y-2">
                  {contextSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={suggestion.action}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{suggestion.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                          <p className="text-sm text-gray-600">{suggestion.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="p-4 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">Recent Searches</h3>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-gray-400">🕐</span>
                      {search}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {!searchQuery && (
              <div className="p-4 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.location.href = '/estimate-options'}
                    className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left"
                  >
                    🚀 Start New Estimate
                  </button>
                  <button
                    onClick={() => window.location.href = '/admin/creative-studio'}
                    className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left"
                  >
                    ✨ Create Content
                  </button>
                  <button
                    onClick={() => setSearchQuery('compliance')}
                    className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left"
                  >
                    📋 Check Compliance
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
            <p>Press <kbd className="bg-gray-200 px-1 rounded">Ctrl+K</kbd> to open help anywhere</p>
          </div>
        </div>
      </div>
    </>
  );
}