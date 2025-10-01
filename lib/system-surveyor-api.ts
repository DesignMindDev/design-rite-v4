// lib/system-surveyor-api.ts
/**
 * System Surveyor API Client
 * Handles all communication with System Surveyor's REST API
 * API Documentation: https://docs.openapi.systemsurveyor.com/
 */

const SS_API_BASE = 'https://openapi.systemsurveyor.com/v3';

// ==================== TYPE DEFINITIONS ====================

export interface SystemSurveyorSite {
  id: string;
  name: string;
  city?: string;
  state?: string;
  zip_code?: string;
  survey_count: number;
  modified_at: number;
  team_id: number;
}

export interface SystemSurveyorSurvey {
  id: string;
  title: string;
  label?: string;
  site: string;
  elements: SystemSurveyorElement[];
  status: 'open' | 'archived';
  created_at: number;
  modified_at: number;
  preview_image?: string;
}

export interface SystemSurveyorElement {
  id: string;
  name: string;
  element_id: number;
  element_profile_id: number;
  systemtype_id: number;
  position: {
    x: number;
    y: number;
  };
  photo_urls?: string[];
  accessories: SystemSurveyorAccessory[];
  attributes: Array<{
    id: string;
    name: string;
    value: string;
  }>;
}

export interface SystemSurveyorAccessory {
  id: string;
  manufacturer: string;
  model: string;
  description: string;
  quantity: number;
  price: number | null;
  labor_hours: number | null;
  row_index: number;
}

export interface DesignRiteAssessmentData {
  projectName: string;
  siteName: string;
  location: string;
  elementCount: number;
  equipmentCounts: Record<string, number>;
  accessories: SystemSurveyorAccessory[];
  totalValue: number;
  totalLaborHours: number;
  surveyDate: string;
  surveyId: string;
  siteId: string;
}

// ==================== API FUNCTIONS ====================

/**
 * Validates System Surveyor API token
 * @param token - JWT token from System Surveyor account
 * @returns boolean - true if token is valid
 */
export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${SS_API_BASE}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}

/**
 * Fetches all sites accessible by the authenticated user
 * @param token - System Surveyor API token
 * @returns Array of sites
 */
export async function getSites(token: string): Promise<SystemSurveyorSite[]> {
  try {
    const response = await fetch(`${SS_API_BASE}/sites?page[size]=100`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sites: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
}

/**
 * Fetches all surveys for a specific site
 * @param token - System Surveyor API token
 * @param siteId - External ID of the site
 * @returns Array of surveys
 */
export async function getSurveys(
  token: string,
  siteId: string
): Promise<SystemSurveyorSurvey[]> {
  try {
    const response = await fetch(
      `${SS_API_BASE}/sites/${siteId}/surveys?page[size]=100&filter[status]=open`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch surveys: ${response.statusText}`);
    }

    const data = await response.json();
    return data.surveys || [];
  } catch (error) {
    console.error('Error fetching surveys:', error);
    throw error;
  }
}

/**
 * Fetches complete survey details with all elements and accessories
 * @param token - System Surveyor API token
 * @param surveyId - External ID of the survey
 * @returns Complete survey object
 */
export async function getSurveyDetails(
  token: string,
  surveyId: string
): Promise<SystemSurveyorSurvey> {
  try {
    const response = await fetch(`${SS_API_BASE}/surveys/${surveyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch survey details: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching survey details:', error);
    throw error;
  }
}

/**
 * Transforms System Surveyor survey data into Design-Rite AI Assessment format
 * This is the key function that bridges the two platforms
 * @param survey - Complete survey from System Surveyor
 * @param site - Site information
 * @returns Transformed data ready for AI Assessment
 */
export function transformToAssessmentData(
  survey: SystemSurveyorSurvey,
  site: SystemSurveyorSite
): DesignRiteAssessmentData {

  // Count equipment by type (e.g., cameras, sensors, etc.)
  const equipmentCounts: Record<string, number> = {};
  const accessories: SystemSurveyorAccessory[] = [];
  let totalLaborHours = 0;

  survey.elements.forEach(element => {
    // Extract equipment type from element name
    // Example: "CAM-001" -> "CAM" (Camera)
    const typeName = element.name.split('-')[0] || 'Other';
    equipmentCounts[typeName] = (equipmentCounts[typeName] || 0) + 1;

    // Collect all accessories
    element.accessories.forEach(acc => {
      accessories.push(acc);
      totalLaborHours += acc.labor_hours || 0;
    });
  });

  // Calculate total project value from accessories
  const totalValue = accessories.reduce((sum, acc) => {
    return sum + ((acc.price || 0) * (acc.quantity || 1));
  }, 0);

  // Build location string
  const location = [site.city, site.state, site.zip_code]
    .filter(Boolean)
    .join(', ');

  return {
    projectName: survey.title,
    siteName: site.name,
    location: location || 'Location not specified',
    elementCount: survey.elements.length,
    equipmentCounts,
    accessories,
    totalValue,
    totalLaborHours,
    surveyDate: new Date(survey.modified_at * 1000).toISOString(),
    surveyId: survey.id,
    siteId: site.id
  };
}

/**
 * Generates a formatted equipment list for proposals
 * @param equipmentCounts - Object with equipment type counts
 * @returns Formatted string list
 */
export function formatEquipmentList(equipmentCounts: Record<string, number>): string {
  return Object.entries(equipmentCounts)
    .map(([type, count]) => `${count}x ${type}`)
    .join(', ');
}

/**
 * Generates Bill of Materials (BOM) from accessories
 * @param accessories - Array of accessories from survey
 * @returns Formatted BOM array
 */
export function generateBOM(accessories: SystemSurveyorAccessory[]) {
  return accessories.map(acc => ({
    description: acc.description,
    manufacturer: acc.manufacturer,
    model: acc.model,
    quantity: acc.quantity,
    unitPrice: acc.price,
    totalPrice: (acc.price || 0) * acc.quantity,
    laborHours: acc.labor_hours || 0
  }));
}

/**
 * Utility: Get total equipment count from survey
 * @param survey - System Surveyor survey object
 * @returns Total number of elements/equipment
 */
export function getTotalEquipmentCount(survey: SystemSurveyorSurvey): number {
  return survey.elements?.length || 0;
}

/**
 * Utility: Get total project cost from accessories
 * @param accessories - Array of accessories from survey
 * @returns Total cost calculation
 */
export function calculateTotalCost(accessories: SystemSurveyorAccessory[]): number {
  return accessories.reduce((sum, acc) => {
    return sum + ((acc.price || 0) * (acc.quantity || 1));
  }, 0);
}

/**
 * Utility: Get total labor hours from accessories
 * @param accessories - Array of accessories from survey
 * @returns Total labor hours
 */
export function calculateTotalLaborHours(accessories: SystemSurveyorAccessory[]): number {
  return accessories.reduce((sum, acc) => {
    return sum + (acc.labor_hours || 0);
  }, 0);
}

/**
 * Utility: Extract unique equipment types from survey
 * @param survey - System Surveyor survey object
 * @returns Array of unique equipment type prefixes
 */
export function getEquipmentTypes(survey: SystemSurveyorSurvey): string[] {
  const types = new Set<string>();
  survey.elements?.forEach(element => {
    const type = element.name.split('-')[0];
    if (type) types.add(type);
  });
  return Array.from(types);
}

/**
 * Utility: Build formatted location string from site data
 * @param site - System Surveyor site object
 * @returns Formatted location string
 */
export function formatLocation(site: SystemSurveyorSite): string {
  return [site.city, site.state, site.zip_code]
    .filter(Boolean)
    .join(', ') || 'Location not specified';
}