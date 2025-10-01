'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Site {
  id: string;
  name: string;
  city?: string;
  state?: string;
  survey_count: number;
  modified_at: number;
}

interface Survey {
  id: string;
  title: string;
  label?: string;
  status: string;
  modified_at: number;
}

export default function ImportSurvey() {
  const router = useRouter();
  const [apiToken, setApiToken] = useState('');
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'sites' | 'surveys' | 'importing'>('sites');

  useEffect(() => {
    // Get token from session storage
    const token = sessionStorage.getItem('ss_api_token');
    if (!token) {
      router.push('/integrations/system-surveyor');
      return;
    }
    setApiToken(token);
    loadSites(token);
  }, []);

  const loadSites = async (token: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/system-surveyor/sites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load sites');
      }

      setSites(data.sites);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSelect = async (site: Site) => {
    setSelectedSite(site);
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/system-surveyor/surveys?siteId=${site.id}`,
        {
          headers: {
            'Authorization': `Bearer ${apiToken}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load surveys');
      }

      setSurveys(data.surveys);
      setStep('surveys');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!selectedSurvey || !selectedSite) return;

    setStep('importing');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/system-surveyor/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          surveyId: selectedSurvey.id,
          site: selectedSite
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import survey');
      }

      // Store assessment data and redirect to AI Assessment
      sessionStorage.setItem('imported_assessment_data', JSON.stringify(data.data));
      router.push('/ai-assessment?imported=true');

    } catch (err: any) {
      setError(err.message);
      setStep('surveys');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-purple-950/20 to-[#0A0A0A]">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Import System Surveyor Data
            </h1>
            <p className="text-gray-300">
              {step === 'sites' && 'Select a site to view available surveys'}
              {step === 'surveys' && 'Choose a survey to import into Design-Rite'}
              {step === 'importing' && 'Importing survey data...'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'sites' ? 'text-purple-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 'sites' ? 'border-purple-400 bg-purple-400/20' : 'border-gray-500'}`}>
                1
              </div>
              <span className="text-sm font-medium">Select Site</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-700"></div>
            <div className={`flex items-center gap-2 ${step === 'surveys' || step === 'importing' ? 'text-purple-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 'surveys' || step === 'importing' ? 'border-purple-400 bg-purple-400/20' : 'border-gray-500'}`}>
                2
              </div>
              <span className="text-sm font-medium">Select Survey</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-700"></div>
            <div className={`flex items-center gap-2 ${step === 'importing' ? 'text-purple-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 'importing' ? 'border-purple-400 bg-purple-400/20' : 'border-gray-500'}`}>
                3
              </div>
              <span className="text-sm font-medium">Import</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Sites List */}
          {step === 'sites' && (
            <div className="bg-[#1A1A1A] border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Your Sites</h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                  <p className="text-gray-400 mt-4">Loading sites...</p>
                </div>
              ) : sites.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No sites found</p>
              ) : (
                <div className="grid gap-4">
                  {sites.map((site) => (
                    <button
                      key={site.id}
                      onClick={() => handleSiteSelect(site)}
                      className="p-4 bg-[#0A0A0A] border border-purple-500/20 rounded-lg hover:border-purple-500/50 transition-all text-left"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">{site.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {site.city && site.state && (
                          <span>📍 {site.city}, {site.state}</span>
                        )}
                        <span>📊 {site.survey_count} surveys</span>
                        <span>📅 {new Date(site.modified_at * 1000).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Surveys List */}
          {step === 'surveys' && selectedSite && (
            <div className="bg-[#1A1A1A] border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Surveys for {selectedSite.name}
                </h2>
                <button
                  onClick={() => {
                    setStep('sites');
                    setSelectedSite(null);
                    setSurveys([]);
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  ← Back to Sites
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                  <p className="text-gray-400 mt-4">Loading surveys...</p>
                </div>
              ) : surveys.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No surveys found for this site</p>
              ) : (
                <div className="grid gap-4">
                  {surveys.map((survey) => (
                    <div
                      key={survey.id}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        selectedSurvey?.id === survey.id
                          ? 'bg-purple-900/30 border-purple-500'
                          : 'bg-[#0A0A0A] border-purple-500/20 hover:border-purple-500/50'
                      }`}
                      onClick={() => setSelectedSurvey(survey)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{survey.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            {survey.label && <span>🏷️ {survey.label}</span>}
                            <span>📅 {new Date(survey.modified_at * 1000).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              survey.status === 'open'
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-gray-700 text-gray-400'
                            }`}>
                              {survey.status}
                            </span>
                          </div>
                        </div>
                        {selectedSurvey?.id === survey.id && (
                          <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedSurvey && (
                <button
                  onClick={handleImport}
                  disabled={loading}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all"
                >
                  Import Selected Survey →
                </button>
              )}
            </div>
          )}

          {/* Importing State */}
          {step === 'importing' && (
            <div className="bg-[#1A1A1A] border border-purple-500/30 rounded-xl p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-6"></div>
              <h3 className="text-2xl font-semibold text-white mb-2">Importing Survey Data</h3>
              <p className="text-gray-400">
                Please wait while we transform your System Surveyor data...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}