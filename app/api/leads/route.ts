import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ickwrbdpuorzdpzqbqpf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja3dyYmRwdW9yemRwenFicXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk1MDc4MywiZXhwIjoyMDY2NTI2NzgzfQ.LGGTBZF3ADOZv7cW7rEGzUi_0JluWf59yw2jWLuOJHo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    // Get all waitlist subscribers
    const { data: subscribers, error } = await supabase
      .from('waitlist_subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Get today's date
    const today = new Date().toDateString();
    
    // Calculate statistics
    const stats = {
      total: subscribers?.length || 0,
      todayCount: 0,
      thisWeekCount: 0,
      byRole: {} as Record<string, number>,
      byCompany: {} as Record<string, number>,
      recentSignups: [] as any[]
    };
    
    // Process each subscriber
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    subscribers?.forEach(sub => {
      const createdDate = new Date(sub.created_at);
      
      // Count today's signups
      if (createdDate.toDateString() === today) {
        stats.todayCount++;
      }
      
      // Count this week's signups
      if (createdDate >= oneWeekAgo) {
        stats.thisWeekCount++;
      }
      
      // Count by role
      const role = sub.role || 'unspecified';
      stats.byRole[role] = (stats.byRole[role] || 0) + 1;
      
      // Count by company
      if (sub.company_name) {
        stats.byCompany[sub.company_name] = (stats.byCompany[sub.company_name] || 0) + 1;
      }
    });
    
    // Get recent signups (last 10)
    stats.recentSignups = subscribers?.slice(0, 10).map(s => ({
      email: s.email,
      company: s.company_name,
      role: s.role,
      date: new Date(s.created_at).toLocaleString(),
      source: s.source_page
    })) || [];
    
    // Create HTML dashboard with proper encoding
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Design-Rite Lead Dashboard</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            min-height: 100vh;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          h1 {
            font-size: 2.5rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .emoji {
            font-size: 2rem;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.2s;
          }
          
          .stat-card:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.15);
          }
          
          .stat-number {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .section-title {
            font-size: 1.8rem;
            margin: 2rem 0 1rem 0;
            font-weight: 600;
          }
          
          table {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          th {
            background: rgba(255, 255, 255, 0.15);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 1px;
          }
          
          tbody tr:hover {
            background: rgba(255, 255, 255, 0.05);
          }
          
          tbody tr:last-child td {
            border-bottom: none;
          }
          
          .refresh-btn {
            background: white;
            color: #667eea;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .refresh-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
          
          .empty-state {
            text-align: center;
            padding: 3rem;
            opacity: 0.7;
          }
          
          .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            background: rgba(255, 255, 255, 0.2);
            font-size: 0.85rem;
            font-weight: 500;
          }
          
          .updated-time {
            opacity: 0.7;
            font-size: 0.9rem;
            margin-top: 2rem;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>
              <span class="emoji">📊</span>
              Design-Rite Lead Dashboard
            </h1>
            <button class="refresh-btn" onclick="location.reload()">
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${stats.total}</div>
              <div class="stat-label">Total Leads</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.todayCount}</div>
              <div class="stat-label">Today's Signups</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.thisWeekCount}</div>
              <div class="stat-label">This Week</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${Object.keys(stats.byCompany).length}</div>
              <div class="stat-label">Companies</div>
            </div>
          </div>
          
          <h2 class="section-title">Recent Signups</h2>
          ${stats.recentSignups.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                ${stats.recentSignups.map(s => `
                  <tr>
                    <td>${s.email}</td>
                    <td>${s.company || '<span class="badge">Not specified</span>'}</td>
                    <td>${s.role ? s.role.replace(/_/g, ' ') : '<span class="badge">Not specified</span>'}</td>
                    <td>${s.date}</td>
                    <td><span class="badge">${s.source || 'direct'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <div class="empty-state">
              <p>No signups yet. Share your signup forms to start collecting leads!</p>
            </div>
          `}
          
          ${Object.keys(stats.byRole).length > 0 ? `
            <h2 class="section-title">Lead Distribution by Role</h2>
            <div class="stats-grid">
              ${Object.entries(stats.byRole).map(([role, count]) => `
                <div class="stat-card">
                  <div class="stat-number">${count}</div>
                  <div class="stat-label">${role.replace(/_/g, ' ')}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="updated-time">
            Last updated: ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to load dashboard',
      message: error.message
    }, { status: 500 });
  }
}