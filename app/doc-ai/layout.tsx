'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
import { MessageSquare, FileText, Library, CreditCard, Sparkles, ArrowLeft, LogOut } from 'lucide-react';

export default function DocAILayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useSupabaseAuth();

  // Show loading state
  if (auth.isLoading) {
    return (
      <div className="min-h-screen dr-bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-purple-600/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-400" />
          </div>
          <p className="dr-text-pearl text-lg font-medium">Loading Document AI...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen dr-bg-charcoal flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gradient-to-br from-zinc-900 to-zinc-950 border border-purple-600/20 rounded-2xl p-10 text-center shadow-2xl">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 dr-text-violet" />
          </div>
          <h2 className="text-3xl font-bold dr-text-pearl mb-4">Access Required</h2>
          <p className="dr-text-pearl/70 mb-8 leading-relaxed">
            Sign in to unlock Document AI features including intelligent chat, document analysis, and automated report generation.
          </p>
          <Link
            href="/login?redirect=/doc-ai/chat"
            className="inline-flex items-center gap-2 px-8 py-4 dr-bg-violet text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 font-semibold"
          >
            <Sparkles className="w-5 h-5" />
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      href: '/doc-ai/chat',
      label: 'AI Chat',
      icon: MessageSquare,
      description: 'Intelligent conversation',
      gradient: 'from-purple-600 to-blue-600'
    },
    {
      href: '/doc-ai/documents',
      label: 'Documents',
      icon: FileText,
      description: 'Upload & manage',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      href: '/doc-ai/library',
      label: 'Library',
      icon: Library,
      description: 'Generated reports',
      gradient: 'from-cyan-600 to-teal-600'
    },
    {
      href: '/doc-ai/subscription',
      label: 'Subscription',
      icon: CreditCard,
      description: 'Plan & billing',
      gradient: 'from-teal-600 to-emerald-600'
    }
  ];

  const handleSignOut = async () => {
    await auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Document AI
                    </h1>
                    <p className="text-xs text-gray-500">Intelligent Document Assistant</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">Signed in as</span>
                  <span className="text-sm text-gray-900 font-medium truncate max-w-[200px]">
                    {auth.user?.email}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                  auth.user?.subscriptionTier === 'enterprise'
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                    : auth.user?.subscriptionTier === 'pro'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {auth.user?.subscriptionTier}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Premium Tab Navigation */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-px">
          <div className="flex gap-2 overflow-x-auto pb-px scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-3 px-6 py-4 rounded-t-xl transition-all whitespace-nowrap
                    ${isActive
                      ? 'bg-white border-t-2 border-x border-gray-200 border-b-0'
                      : 'hover:bg-gray-50 border-transparent'
                    }
                  `}
                >
                  {isActive && (
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.gradient}`}></div>
                  )}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all
                    ${isActive
                      ? `bg-gradient-to-br ${item.gradient} shadow-md`
                      : 'bg-gray-100 group-hover:bg-gray-200'
                    }
                  `}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-semibold text-sm ${isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {item.label}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>© 2025 Design-Rite. AI-powered document intelligence.</p>
            <div className="flex items-center gap-4">
              <Link href="/support" className="hover:text-gray-700 transition-colors">Support</Link>
              <Link href="/docs" className="hover:text-gray-700 transition-colors">Documentation</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
