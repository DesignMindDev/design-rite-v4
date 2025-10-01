import { NextRequest, NextResponse } from 'next/server';
import { mapAllEquipment, generateAIContext } from '@/lib/system-surveyor-mapper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/system-surveyor/upload-excel
 *
 * Handles System Surveyor Excel export uploads (.xlsx)
 * Parses equipment, infrastructure, and site data
 * Maps to Design-Rite product catalog recommendations
 * Returns transformed data ready for Design-Rite AI Assessment
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dynamic import xlsx to avoid bundling issues
    const XLSX = await import('xlsx');

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Extract site information
    const siteInfo = extractSiteInfo(data);

    // Extract and categorize equipment
    const equipment = extractEquipment(data);

    // Calculate totals
    const totals = calculateTotals(equipment);

    // Map equipment to Design-Rite product recommendations
    const mappings = mapAllEquipment(equipment);

    // Generate AI context string for assessment
    const aiContext = generateAIContext(mappings, siteInfo);

    // Return transformed data
    return NextResponse.json({
      success: true,
      data: {
        source: 'system-surveyor-excel',
        siteInfo,
        equipment,
        totals,
        mappings,
        aiContext,
        rawDataCount: data.length,
        fileName: file.name,
        importedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing System Surveyor Excel:', error);
    return NextResponse.json(
      {
        error: 'Failed to process Excel file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Extract site information from System Surveyor export
 */
function extractSiteInfo(data: any[]): any {
  const info: any = {};

  data.forEach(row => {
    const label = row['1176427'];
    const value = row['1758642037'];

    if (label === 'Name' && value && !info.siteName) {
      info.siteName = value;
    } else if (label === 'Address' && value) {
      info.address = value;
    } else if (label === 'Name' && value && value.includes('Low Voltage')) {
      info.surveyName = value;
    } else if (label === 'Report Exported by' && value) {
      info.exportedBy = value;
    } else if (label === 'Report Export date' && value) {
      info.exportDate = value;
    }
  });

  return info;
}

/**
 * Extract and categorize equipment from System Surveyor export
 */
function extractEquipment(data: any[]): any {
  const categories = {
    cameras: [] as any[],
    infrastructure: [] as any[],
    network: [] as any[],
    accessControl: [] as any[],
    communications: [] as any[],
    audioVisual: [] as any[],
    other: [] as any[]
  };

  data.forEach(row => {
    const systemType = row['1176427'];
    const elementName = row['__EMPTY_2'];

    // Skip header rows and non-equipment rows
    if (!systemType || !elementName || systemType === 'System Type') {
      return;
    }

    const equipment = {
      id: row['141'] || 'N/A',
      name: elementName,
      systemType: systemType,
      status: row['138'] || 'N/A',
      manufacturer: row['271'] || '',
      model: row['305'] || '',
      quantity: parseInt(row['531']) || 1,
      price: parseFloat(row['532']) || 0,
      installHours: parseFloat(row['533']) || 0,
      location: row['255'] || '',
      notes: row['165'] || '',
      serialNumber: row['460'] || '',
      ipAddress: row['266'] || '',
      username: row['276'] || '',
      password: row['462'] || ''
    };

    // Categorize based on element name and system type
    const nameLower = elementName.toLowerCase();

    if (nameLower.includes('camera') || systemType === 'Video Surveillance') {
      categories.cameras.push(equipment);
    } else if (nameLower.includes('cable path') || nameLower.includes('patch panel')) {
      categories.infrastructure.push(equipment);
    } else if (nameLower.includes('switch') || nameLower.includes('router') ||
               nameLower.includes('network') || nameLower.includes('wireless access point')) {
      categories.network.push(equipment);
    } else if (nameLower.includes('reader') || nameLower.includes('door') ||
               nameLower.includes('lock') || nameLower.includes('access')) {
      categories.accessControl.push(equipment);
    } else if (systemType === 'Communications' || nameLower.includes('telephone') ||
               nameLower.includes('speaker')) {
      categories.communications.push(equipment);
    } else if (systemType === 'Audio Visual' || nameLower.includes('monitor') ||
               nameLower.includes('display')) {
      categories.audioVisual.push(equipment);
    } else {
      categories.other.push(equipment);
    }
  });

  return categories;
}

/**
 * Calculate totals across all equipment categories
 */
function calculateTotals(equipment: any): any {
  let totalItems = 0;
  let totalCost = 0;
  let totalInstallHours = 0;
  let totalCameras = 0;

  Object.values(equipment).forEach((category: any) => {
    category.forEach((item: any) => {
      totalItems += item.quantity || 1;
      totalCost += (item.price || 0) * (item.quantity || 1);
      totalInstallHours += (item.installHours || 0) * (item.quantity || 1);

      if (category === equipment.cameras) {
        totalCameras += item.quantity || 1;
      }
    });
  });

  return {
    totalItems,
    totalCost,
    totalInstallHours,
    totalCameras,
    estimatedLaborCost: totalInstallHours * 85 // $85/hr average labor rate
  };
}
