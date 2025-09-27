// Creative Studio API Client
// Provides typed interface for Creative Studio Supabase operations

const API_BASE = '/api/creative-studio'

// Types
export interface Project {
  id: string
  name: string
  description?: string
  type: string
  status: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

export interface ChatMessage {
  id: string
  projectId: string
  role: 'user' | 'assistant'
  content: string
  provider?: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface Design {
  id: string
  projectId: string
  name: string
  drawings: any[]
  activeLayers: string[]
  canvasDimensions: { width: number; height: number }
  createdAt: string
  updatedAt: string
  version: number
  isActive: boolean
  metadata?: Record<string, any>
}

// API Client Class
export class CreativeStudioAPI {
  // Project Operations
  static async getProjects(params?: {
    type?: string
    status?: string
    limit?: number
  }): Promise<{ projects: Project[]; total: number }> {
    const searchParams = new URLSearchParams()
    if (params?.type) searchParams.set('type', params.type)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const response = await fetch(`${API_BASE}/projects?${searchParams}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`)
    }
    return response.json()
  }

  static async createProject(data: {
    name: string
    description?: string
    type?: string
  }): Promise<{ project: Project }> {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`)
    }
    return response.json()
  }

  static async updateProject(id: string, data: {
    name?: string
    description?: string
    status?: string
    metadata?: Record<string, any>
  }): Promise<{ project: Project }> {
    const response = await fetch(`${API_BASE}/projects?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Failed to update project: ${response.statusText}`)
    }
    return response.json()
  }

  static async deleteProject(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/projects?id=${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.statusText}`)
    }
  }

  // Chat Operations
  static async getChatMessages(projectId: string, params?: {
    limit?: number
    offset?: number
  }): Promise<{ messages: ChatMessage[]; total: number; hasMore: boolean }> {
    const searchParams = new URLSearchParams({ projectId })
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())

    const response = await fetch(`${API_BASE}/chat?${searchParams}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch chat messages: ${response.statusText}`)
    }
    return response.json()
  }

  static async createChatMessage(data: {
    projectId: string
    role: 'user' | 'assistant'
    content: string
    provider?: string
  }): Promise<{ message: ChatMessage }> {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Failed to create chat message: ${response.statusText}`)
    }
    return response.json()
  }

  static async clearChatHistory(projectId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/chat?projectId=${projectId}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`Failed to clear chat history: ${response.statusText}`)
    }
  }

  static async deleteChatMessage(projectId: string, messageId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/chat?projectId=${projectId}&messageId=${messageId}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`Failed to delete chat message: ${response.statusText}`)
    }
  }

  // Design Operations
  static async getDesigns(projectId: string, params?: {
    includeInactive?: boolean
  }): Promise<{ designs: Design[]; total: number }> {
    const searchParams = new URLSearchParams({ projectId })
    if (params?.includeInactive) searchParams.set('includeInactive', 'true')

    const response = await fetch(`${API_BASE}/designs?${searchParams}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch designs: ${response.statusText}`)
    }
    return response.json()
  }

  static async getDesign(designId: string): Promise<{ design: Design }> {
    const response = await fetch(`${API_BASE}/designs?designId=${designId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch design: ${response.statusText}`)
    }
    return response.json()
  }

  static async createDesign(data: {
    projectId: string
    name: string
    drawings?: any[]
    activeLayers?: string[]
    canvasDimensions?: { width: number; height: number }
  }): Promise<{ design: Design }> {
    const response = await fetch(`${API_BASE}/designs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Failed to create design: ${response.statusText}`)
    }
    return response.json()
  }

  static async updateDesign(designId: string, data: {
    name?: string
    drawings?: any[]
    activeLayers?: string[]
    canvasDimensions?: { width: number; height: number }
  }): Promise<{ design: Design }> {
    const response = await fetch(`${API_BASE}/designs?designId=${designId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Failed to update design: ${response.statusText}`)
    }
    return response.json()
  }

  static async deleteDesign(designId: string, softDelete = false): Promise<void> {
    const searchParams = new URLSearchParams({ designId })
    if (softDelete) searchParams.set('softDelete', 'true')

    const response = await fetch(`${API_BASE}/designs?${searchParams}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`Failed to delete design: ${response.statusText}`)
    }
  }

  // Auto-save utility
  static async autoSaveDesign(designId: string, drawings: any[], activeLayers: string[]): Promise<void> {
    try {
      await this.updateDesign(designId, {
        drawings,
        activeLayers
      })
    } catch (error) {
      console.warn('Auto-save failed:', error)
      // Don't throw - auto-save failures shouldn't break the UI
    }
  }

  // Get default project (creates one if none exists)
  static async getDefaultProject(): Promise<Project> {
    try {
      const { projects } = await this.getProjects({ type: 'creative-studio', limit: 1 })

      if (projects.length > 0) {
        return projects[0]
      }

      // Create default project
      const { project } = await this.createProject({
        name: 'Creative Studio Workspace',
        description: 'Default workspace for creative studio activities',
        type: 'creative-studio'
      })

      return project
    } catch (error) {
      console.error('Failed to get/create default project:', error)
      throw error
    }
  }
}