'use client'

import React, { useState } from 'react'

export default function HomePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    facilityType: '',
    securityConcerns: '',
    contactName: '',
    contactEmail: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [assessment, setAssessment] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    if (!formData.companyName || !formData.facilityType || !formData.securityConcerns) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('http://host.docker.internal:8000/api/assessments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          facilityType: formData.facilityType,
          securityConcerns: formData.securityConcerns,
          contactInfo: {
            name: formData.contactName,
            email: formData.contactEmail
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        setAssessment(result.assessment)
      } else {
        alert('Assessment generation failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Connection error. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  if (assessment) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', margin: '0 0 10px 0' }}>
              🛡️ Security Assessment Complete!
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Your comprehensive security assessment for <strong>{assessment.companyName}</strong>
            </p>
          </div>
          
          <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '15px', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
              📋 AI-Generated Security Assessment
            </h3>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6', color: '#444', margin: '0', fontFamily: 'system-ui' }}>
                {assessment.content}
              </pre>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setAssessment(null)
                setFormData({
                  companyName: '',
                  facilityType: '',
                  securityConcerns: '',
                  contactName: '',
                  contactEmail: ''
                })
              }}
              style={{
                flex: '1',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              🔄 New Assessment
            </button>
            <button
              onClick={() => window.print()}
              style={{
                flex: '1',
                background: '#6c757d',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              🖨️ Print Report
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '50px 40px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛡️</div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0 0 15px 0' }}>Design-Rite™</h1>
          <p style={{ fontSize: '1.3rem', opacity: '0.9', margin: '0 0 25px 0' }}>
            AI-Powered Security Assessment Platform
          </p>
          <p style={{ fontSize: '1.1rem', opacity: '0.8', margin: '0' }}>
            Get a comprehensive security assessment for your facility in minutes
          </p>
          <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
            <span>⚡ AI-Powered Analysis</span>
            <span>⏱️ Instant Results</span>
            <span>📄 Professional Reports</span>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '40px' }}>
          <div style={{ display: 'grid', gap: '25px' }}>
            
            {/* Company Information */}
            <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '15px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#333', display: 'flex', alignItems: 'center' }}>
                🏢 Company Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    placeholder="Your Company Name"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
                    Facility Type *
                  </label>
                  <select
                    name="facilityType"
                    value={formData.facilityType}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Facility Type</option>
                    <option value="office">Office Building</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="retail">Retail Store</option>
                    <option value="manufacturing">Manufacturing Plant</option>
                    <option value="healthcare">Healthcare Facility</option>
                    <option value="education">Educational Institution</option>
                    <option value="government">Government Building</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Requirements */}
            <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '15px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#333', display: 'flex', alignItems: 'center' }}>
                🔒 Security Requirements
              </h3>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
                  Security Concerns & Requirements *
                </label>
                <textarea
                  name="securityConcerns"
                  value={formData.securityConcerns}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe your security concerns, requirements, and what you're looking to protect..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '15px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#333', display: 'flex', alignItems: 'center' }}>
                👤 Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    placeholder="Your Name"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: 'center', paddingTop: '20px' }}>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '18px 40px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  gap: '10px',
                  minWidth: '280px'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Generating Assessment...
                  </>
                ) : (
                  <>
                    🛡️ Generate AI Security Assessment
                  </>
                )}
              </button>
              {isLoading && (
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '15px', margin: '15px 0 0 0' }}>
                  Our AI security expert is analyzing your facility... This may take 30-60 seconds.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
