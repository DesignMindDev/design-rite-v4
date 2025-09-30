'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import UnifiedNavigation from '../components/UnifiedNavigation';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      content: [
        {
          title: 'Welcome to Design-Rite',
          content: `
Design-Rite is an AI-powered security design platform that transforms the way security professionals create assessments, proposals, and documentation. Our platform reduces what typically takes days or weeks into minutes.

**Key Benefits:**
• Generate professional security assessments in minutes, not days
• Access live pricing data for 3,000+ security products
• Create compliance-ready documentation (FERPA, HIPAA, CJIS)
• Professional BOMs and implementation timelines
• Built by security engineers for security professionals
          `
        },
        {
          title: 'Quick Start Guide',
          content: `
**Step 1: Choose Your Starting Point**
Visit /estimate-options to select between:
• **Quick Security Estimate** (5 minutes) - Fast assessment with basic recommendations
• **AI Discovery Assistant** (15-20 minutes) - Comprehensive analysis with detailed documentation

**Step 2: Provide Project Details**
Enter basic information about your facility:
• Building type and square footage
• Security concerns and requirements
• Compliance needs (if applicable)
• Budget considerations

**Step 3: Review & Refine**
• Review AI-generated recommendations
• Customize equipment selections
• Adjust pricing and specifications
• Generate professional proposals

**Step 4: Export & Implement**
• Download PDF proposals and BOMs
• Share with clients or stakeholders
• Use implementation timelines for project planning
          `
        }
      ]
    },
    {
      id: 'security-tools',
      title: 'Security Assessment Tools',
      icon: '🛡️',
      content: [
        {
          title: 'Quick Security Estimate',
          content: `
**Purpose:** Generate fast, accurate security cost estimates for initial client conversations.

**Best Used For:**
• Initial client meetings and discovery calls
• Budget planning and proposal preparation
• Quick feasibility assessments
• Lead qualification

**How to Use:**
1. Navigate to /estimate-options and select "Quick Security Estimate"
2. Enter basic facility information (type, size, location)
3. Select primary security concerns from predefined options
4. Choose compliance requirements if applicable
5. Review instant cost estimate with breakdown
6. Option to "Refine Estimate" for more detailed analysis

**Key Features:**
• 5-minute completion time
• Instant cost calculations based on live pricing data
• Industry-standard equipment recommendations
• Compliance consideration flags
• Professional summary for client presentation

**Output:** Basic cost estimate with equipment categories and pricing ranges
          `
        },
        {
          title: 'AI Discovery Assistant',
          content: `
**Purpose:** Comprehensive security assessment with detailed analysis and professional documentation.

**Best Used For:**
• Detailed project planning and design
• Comprehensive security audits
• Complex multi-phase installations
• Compliance-critical environments

**How to Use:**
1. Select "AI Discovery Assistant" from /estimate-options
2. Complete structured assessment questionnaire:
   - Facility details and layout considerations
   - Current security infrastructure
   - Specific threats and vulnerabilities
   - Operational requirements
   - Compliance and regulatory needs
3. Review comprehensive AI analysis
4. Customize recommendations as needed
5. Generate detailed proposal documentation

**Key Features:**
• Comprehensive threat analysis
• Detailed equipment specifications
• Implementation timelines and phases
• Compliance documentation generation
• Professional proposal formatting
• Integration recommendations

**Output:** Full security design document with BOMs, timelines, and implementation plans
          `
        },
        {
          title: 'AI Assistant (Refinement)',
          content: `
**Purpose:** Refine and enhance existing security estimates with additional analysis and customization.

**Best Used For:**
• Enhancing quick estimates with more detail
• Customizing recommendations for specific requirements
• Adding compliance documentation to existing assessments
• Preparing client-ready proposals from initial estimates

**How to Access:**
• From Quick Security Estimate: Click "Refine Estimate"
• Direct access: /ai-assistant
• Receives data from previous assessment tools automatically

**Key Features:**
• Builds upon existing assessment data
• Advanced customization options
• Professional document generation
• Compliance report integration
• Cost optimization recommendations
• Implementation timeline creation

**Integration:** Seamlessly continues from Quick Security Estimate with all data preserved
          `
        }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance & Standards',
      icon: '📋',
      content: [
        {
          title: 'Supported Compliance Frameworks',
          content: `
Design-Rite automatically incorporates compliance considerations into all security assessments.

**FERPA (Educational)**
• Student privacy protection requirements
• Campus security design considerations
• K-12 and higher education specific guidelines
• Video surveillance positioning and retention policies

**HIPAA (Healthcare)**
• Patient privacy and data protection
• Medical facility security requirements
• Access control for sensitive areas
• Video surveillance compliance in healthcare settings

**CJIS (Criminal Justice)**
• Law enforcement facility security standards
• Evidence handling and storage requirements
• Access control for secure areas
• Physical security for sensitive information

**General Security Frameworks**
• NIST Cybersecurity Framework physical security components
• SOC 2 physical access controls
• ISO 27001 physical security requirements
• Local building codes and fire safety integration
          `
        },
        {
          title: 'Compliance Tools',
          content: `
**Compliance Analyzer**
Access: /compliance-analyst
• Automated compliance gap analysis
• Regulatory requirement mapping
• Documentation generation for audits
• Compliance timeline and implementation planning

**Quick Compliance Checks**
Access: /compliance-check
• FERPA compliance assessment for educational facilities
• HIPAA compliance review for healthcare environments
• Basic security framework alignment verification

**Security Framework Guidance**
Access: /compliance/general-security
• NIST Framework implementation guidance
• SOC 2 physical security controls
• ISO 27001 physical security requirements
• Best practices for multi-framework compliance
          `
        }
      ]
    },
    {
      id: 'platform-features',
      title: 'Platform Features',
      icon: '⚙️',
      content: [
        {
          title: 'Proposal Generator',
          content: `
**Professional Proposals**
Access: /professional-proposals

**Features:**
• Branded proposal templates
• Executive summary generation
• Detailed technical specifications
• Cost breakdowns and ROI analysis
• Implementation timelines
• Terms and conditions integration

**Customization Options:**
• Company branding and logos
• Custom pricing structures
• Specific equipment preferences
• Regional compliance requirements
• Client-specific language and terminology

**Output Formats:**
• PDF proposals for client presentation
• Excel BOMs for procurement
• Implementation schedules
• Compliance documentation packages
          `
        },
        {
          title: 'Pricing Intelligence',
          content: `
**Live Pricing Data**
Access: /pricing-intelligence

**Database Coverage:**
• 3,000+ security products with live pricing
• Major manufacturer product lines
• Regional pricing variations
• Volume discount calculations
• Installation cost estimates

**Price Optimization:**
• Alternative product recommendations
• Cost-benefit analysis for equipment choices
• Budget optimization suggestions
• ROI calculations for security investments

**Market Intelligence:**
• Pricing trends and market analysis
• New product introductions
• Competitive analysis tools
• Cost benchmarking against industry standards
          `
        },
        {
          title: 'White Label Solutions',
          content: `
**Partner Integration**
Access: /white-label

**Customization Options:**
• Complete branding customization
• Custom domain integration
• Branded email communications
• Company-specific workflows
• Custom compliance requirements

**Enterprise Features:**
• Multi-user account management
• Role-based access controls
• Custom reporting and analytics
• API integration capabilities
• Advanced administrative controls

**Implementation Support:**
• Technical integration assistance
• Training and onboarding programs
• Ongoing support and maintenance
• Custom feature development options
          `
        }
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: '💡',
      content: [
        {
          title: 'Assessment Workflow Optimization',
          content: `
**Recommended Workflow for Client Projects:**

**Initial Client Meeting:**
1. Use Quick Security Estimate for initial budget discussion
2. Gather basic facility information during the meeting
3. Generate instant estimate to guide conversation
4. Identify key concerns and requirements

**Detailed Proposal Development:**
1. Use AI Discovery Assistant for comprehensive analysis
2. Complete detailed assessment questionnaire
3. Review and customize AI recommendations
4. Generate professional proposal documentation

**Client Presentation:**
1. Present executive summary first
2. Review security recommendations and rationale
3. Discuss implementation timeline and phases
4. Address compliance requirements and documentation

**Project Implementation:**
1. Use implementation timeline from assessment
2. Track progress against recommended phases
3. Document any modifications or changes
4. Generate final compliance documentation
          `
        },
        {
          title: 'Data Input Best Practices',
          content: `
**Facility Information:**
• Be as specific as possible with building details
• Include any existing security infrastructure
• Note any physical constraints or limitations
• Specify high-value or sensitive areas

**Security Requirements:**
• Prioritize threats based on actual risk assessment
• Consider both internal and external threat vectors
• Include operational requirements (24/7 monitoring, etc.)
• Specify any integration requirements with existing systems

**Compliance Considerations:**
• Identify all applicable regulatory requirements
• Note any industry-specific standards
• Include local building codes and restrictions
• Consider future compliance requirements

**Budget and Timeline:**
• Provide realistic budget ranges
• Include any phasing or timeline constraints
• Consider maintenance and ongoing costs
• Factor in training and operational requirements
          `
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: '🔧',
      content: [
        {
          title: 'Common Issues and Solutions',
          content: `
**Assessment Not Loading:**
• Check internet connection
• Clear browser cache and cookies
• Try a different browser or incognito mode
• Ensure JavaScript is enabled

**Missing Recommendations:**
• Verify all required fields are completed
• Check that facility type is correctly selected
• Ensure security concerns are properly specified
• Try refreshing the assessment

**Pricing Information Issues:**
• Pricing data updates in real-time
• Regional variations may affect pricing
• Volume discounts may not be reflected in initial estimates
• Contact support for custom pricing requirements

**Export/Download Problems:**
• Ensure pop-ups are allowed for the site
• Check download folder for PDF files
• Try right-clicking and "Save As" for downloads
• Clear browser downloads if stuck

**Session/Login Issues:**
• Guest sessions persist for returning users
• Clear browser data if experiencing login problems
• Check email for magic link if using email authentication
• Contact support if account access issues persist
          `
        },
        {
          title: 'Getting Additional Help',
          content: `
**Support Channels:**

**Live Chat Support**
• Available during business hours
• Immediate assistance for urgent issues
• Technical support and platform guidance
• Account and billing questions

**Email Support**
• Detailed technical assistance
• Non-urgent questions and requests
• Feature requests and feedback
• Account management issues

**Documentation and Resources**
• Comprehensive user guides
• Video tutorials and walkthroughs
• Best practices and case studies
• Regular platform updates and announcements

**Training and Onboarding**
• New user orientation sessions
• Advanced feature training
• Best practices workshops
• Custom training for enterprise clients

**Contact Information:**
• Support: support@design-rite.com
• Sales: sales@design-rite.com
• General: info@design-rite.com
• Emergency: Available through platform chat
          `
        }
      ]
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.some(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={index} className="font-bold text-purple-300 mt-4 mb-2">{line.slice(2, -2)}</h4>;
      }
      if (line.startsWith('• ')) {
        return <li key={index} className="ml-4 mb-1 text-gray-300">{line.slice(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-gray-300 mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      <UnifiedNavigation />

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent"></div>
        <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Documentation & Guides
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Master Design-Rite
          </h1>
          <p className="text-xl text-gray-400 mb-16 leading-relaxed max-w-4xl mx-auto">
            Comprehensive guides, tutorials, and best practices for getting the most out of our AI-powered security design platform.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/60 border border-purple-600/20 rounded-xl py-4 px-6 text-white placeholder-gray-400 focus:outline-none focus:border-purple-600/50 text-lg"
            />
            <div className="absolute right-4 top-4 text-gray-400 text-xl">🔍</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <h3 className="text-lg font-bold text-white mb-4">Documentation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-600/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {filteredSections.map((section) => (
              <div key={section.id} className={activeSection === section.id ? 'block' : 'hidden'}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-3xl">{section.icon}</div>
                  <h2 className="text-3xl font-black text-white">{section.title}</h2>
                </div>

                <div className="space-y-8">
                  {section.content.map((item, index) => (
                    <div key={index} className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8">
                      <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                      <div className="prose prose-invert max-w-none">
                        {formatContent(item.content)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-black text-center mb-12 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
            Quick Access
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/estimate-options" className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-white mb-2">Start Assessment</h3>
              <p className="text-gray-400 text-sm">Begin your security estimate</p>
            </Link>

            <Link href="/support" className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-lg font-bold text-white mb-2">Get Support</h3>
              <p className="text-gray-400 text-sm">Contact our support team</p>
            </Link>

            <Link href="/pricing" className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">View Pricing</h3>
              <p className="text-gray-400 text-sm">Explore our plans</p>
            </Link>

            <Link href="/contact" className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="text-lg font-bold text-white mb-2">Contact Sales</h3>
              <p className="text-gray-400 text-sm">Speak with our team</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}