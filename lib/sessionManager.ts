/**
 * Session and Project Management System
 * Integrates with existing Supabase tables: ai_sessions, projects, user_profiles
 * Tracks users, projects, and connects all related work
 */

import { supabase } from './supabase';

interface UserSession {
  userId: string;
  userType: 'authenticated' | 'guest';
  email?: string;
  company?: string;
  name?: string;
  supabaseUserId?: string; // Link to Supabase auth user
  createdAt: string;
  lastActive: string;
}

interface ProjectSession {
  projectId: string;
  userId: string;
  projectName: string;
  facilitySize?: number;
  facilityType?: string;
  estimatedCost?: number;
  systems?: string[];
  status: 'active' | 'completed' | 'abandoned';
  phases: ProjectPhase[];
  supabaseProjectId?: number; // Link to projects table
  createdAt: string;
  updatedAt: string;
}

interface ProjectPhase {
  phaseId: string;
  phaseName: string;
  tool: 'quick-estimate' | 'ai-assistant' | 'ai-assessment' | 'contact-form';
  data: any;
  aiSessionId?: number; // Link to ai_sessions table
  completedAt: string;
}

class SessionManager {
  private readonly USER_KEY = 'design_rite_user';
  private readonly PROJECT_KEY = 'design_rite_project';
  private readonly PROJECTS_KEY = 'design_rite_projects';

  /**
   * Generate a unique user ID
   */
  private generateUserId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `usr_${timestamp}_${random}`;
  }

  /**
   * Generate a unique project ID
   */
  private generateProjectId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `proj_${timestamp}_${random}`;
  }

  /**
   * Get or create user session
   */
  getOrCreateUser(userInfo?: Partial<UserSession>): UserSession {
    let user = this.getCurrentUser();

    if (!user) {
      // Create new user session
      user = {
        userId: this.generateUserId(),
        userType: userInfo?.email ? 'authenticated' : 'guest',
        email: userInfo?.email,
        company: userInfo?.company,
        name: userInfo?.name,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      console.log('🆔 Created new user session:', user.userId);
    } else {
      // Update existing user with new info if provided
      if (userInfo) {
        user = {
          ...user,
          ...userInfo,
          userType: userInfo.email ? 'authenticated' : user.userType,
          lastActive: new Date().toISOString()
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    }

    return user;
  }

  /**
   * Get current user session
   */
  getCurrentUser(): UserSession | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  }

  /**
   * Create or update project session
   */
  createOrUpdateProject(projectData: {
    projectName?: string;
    facilitySize?: number;
    facilityType?: string;
    estimatedCost?: number;
    systems?: string[];
    phase: {
      tool: string;
      data: any;
    };
  }): ProjectSession {
    const user = this.getOrCreateUser();
    let project = this.getCurrentProject();

    if (!project) {
      // Create new project
      project = {
        projectId: this.generateProjectId(),
        userId: user.userId,
        projectName: projectData.projectName || `Project ${new Date().toLocaleDateString()}`,
        facilitySize: projectData.facilitySize,
        facilityType: projectData.facilityType,
        estimatedCost: projectData.estimatedCost,
        systems: projectData.systems || [],
        status: 'active',
        phases: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('📁 Created new project:', project.projectId);
    } else {
      // Update existing project
      project = {
        ...project,
        ...projectData,
        updatedAt: new Date().toISOString()
      };
    }

    // Add new phase
    const newPhase: ProjectPhase = {
      phaseId: `phase_${Date.now().toString(36)}`,
      phaseName: this.getPhaseDisplayName(projectData.phase.tool),
      tool: projectData.phase.tool as any,
      data: projectData.phase.data,
      completedAt: new Date().toISOString()
    };

    project.phases.push(newPhase);

    // Save current project
    localStorage.setItem(this.PROJECT_KEY, JSON.stringify(project));

    // Save to project history
    this.saveToProjectHistory(project);

    return project;
  }

  /**
   * Get current active project
   */
  getCurrentProject(): ProjectSession | null {
    try {
      const projectData = localStorage.getItem(this.PROJECT_KEY);
      return projectData ? JSON.parse(projectData) : null;
    } catch (error) {
      console.error('Error getting current project:', error);
      return null;
    }
  }

  /**
   * Save project to history
   */
  private saveToProjectHistory(project: ProjectSession): void {
    try {
      const existingProjects = this.getUserProjects();
      const existingIndex = existingProjects.findIndex(p => p.projectId === project.projectId);

      if (existingIndex >= 0) {
        existingProjects[existingIndex] = project;
      } else {
        existingProjects.push(project);
      }

      localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(existingProjects));
    } catch (error) {
      console.error('Error saving project history:', error);
    }
  }

  /**
   * Get all projects for current user
   */
  getUserProjects(): ProjectSession[] {
    try {
      const projectsData = localStorage.getItem(this.PROJECTS_KEY);
      const allProjects = projectsData ? JSON.parse(projectsData) : [];
      const user = this.getCurrentUser();

      if (!user) return [];

      return allProjects.filter((p: ProjectSession) => p.userId === user.userId);
    } catch (error) {
      console.error('Error getting user projects:', error);
      return [];
    }
  }

  /**
   * Start new project
   */
  startNewProject(): void {
    localStorage.removeItem(this.PROJECT_KEY);
    console.log('🆕 Started new project session');
  }

  /**
   * Get display name for phase
   */
  private getPhaseDisplayName(tool: string): string {
    const phaseNames: Record<string, string> = {
      'quick-estimate': 'Quick Security Estimate',
      'ai-assistant': 'AI Refinement',
      'ai-assessment': 'AI Discovery Assessment',
      'contact-form': 'Contact & Consultation'
    };
    return phaseNames[tool] || tool;
  }

  /**
   * Track user activity
   */
  trackActivity(activity: {
    action: string;
    tool: string;
    data?: any;
  }): void {
    const user = this.getCurrentUser();
    const project = this.getCurrentProject();

    if (!user) return;

    // Update user last active
    user.lastActive = new Date().toISOString();
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    // Log activity for analytics
    console.log('📊 Activity tracked:', {
      userId: user.userId,
      projectId: project?.projectId,
      action: activity.action,
      tool: activity.tool,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get session summary for debugging
   */
  getSessionSummary(): {
    user: UserSession | null;
    project: ProjectSession | null;
    allProjects: number;
  } {
    return {
      user: this.getCurrentUser(),
      project: this.getCurrentProject(),
      allProjects: this.getUserProjects().length
    };
  }

  /**
   * Sync session to Supabase (if user is authenticated)
   */
  async syncToSupabase(user: UserSession, project?: ProjectSession): Promise<void> {
    try {
      // Only sync authenticated users
      if (user.userType !== 'authenticated' || !user.email) return;

      // Check if user exists in Supabase auth
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        user.supabaseUserId = authUser.id;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }

      // Sync project to Supabase if provided
      if (project && authUser) {
        await this.syncProjectToSupabase(project, authUser.id);
      }
    } catch (error) {
      console.error('Error syncing to Supabase:', error);
    }
  }

  /**
   * Sync project to Supabase projects table
   */
  private async syncProjectToSupabase(project: ProjectSession, authUserId: string): Promise<void> {
    try {
      const projectData = {
        name: project.projectName,
        user_id: authUserId,
        facility_size: project.facilitySize,
        facility_type: project.facilityType,
        estimated_cost: project.estimatedCost,
        systems: project.systems,
        status: project.status,
        metadata: {
          localProjectId: project.projectId,
          phases: project.phases
        }
      };

      if (project.supabaseProjectId) {
        // Update existing project
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.supabaseProjectId)
          .select();

        if (!error && data) {
          console.log('📊 Updated project in Supabase:', data[0]?.id);
        }
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select();

        if (!error && data && data.length > 0) {
          project.supabaseProjectId = data[0].id;
          localStorage.setItem(this.PROJECT_KEY, JSON.stringify(project));
          console.log('📊 Created project in Supabase:', data[0].id);
        }
      }
    } catch (error) {
      console.error('Error syncing project to Supabase:', error);
    }
  }

  /**
   * Log AI session to Supabase
   */
  async logAISession(sessionData: {
    tool: string;
    sessionId: string;
    userId: string;
    projectId?: string;
    data: any;
  }): Promise<number | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      const aiSessionData = {
        session_id: sessionData.sessionId,
        user_id: authUser?.id || null,
        guest_id: authUser ? null : sessionData.userId,
        tool_used: sessionData.tool,
        project_context: sessionData.projectId,
        session_data: sessionData.data,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('ai_sessions')
        .insert([aiSessionData])
        .select();

      if (!error && data && data.length > 0) {
        console.log('🤖 Logged AI session to Supabase:', data[0].id);
        return data[0].id;
      }
    } catch (error) {
      console.error('Error logging AI session:', error);
    }
    return null;
  }

  /**
   * Get projects from Supabase for authenticated users
   */
  async getSupabaseProjects(): Promise<any[]> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) return [];

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error getting Supabase projects:', error);
      return [];
    }
  }

  /**
   * Clear all session data (for testing)
   */
  clearAllSessions(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.PROJECT_KEY);
    localStorage.removeItem(this.PROJECTS_KEY);
    console.log('🧹 Cleared all session data');
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();

// Export types for use in components
export type { UserSession, ProjectSession, ProjectPhase };