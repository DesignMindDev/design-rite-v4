/**
 * Johnson Criteria Detection Range Calculator
 *
 * Calculates thermal camera detection, recognition, and identification ranges
 * based on the Johnson Criteria standard used by FLIR and other thermal manufacturers.
 *
 * Johnson Criteria:
 * - Detection: 3.6 pixels × 1 pixel (you can see something is there)
 * - Recognition: 14.4 pixels × 4 pixels (you can see it's a person)
 * - Identification: 28.8 pixels × 8 pixels (you can see person holding rifle)
 */

export interface ThermalCameraSpecs {
  lensEFL: number; // Effective Focal Length in mm
  pixelPitch: number; // in micrometers (μm)
  horizRes: number; // horizontal resolution (e.g., 640, 320, 1024)
  model?: string; // camera model name
}

export interface DetectionRanges {
  detection: number; // meters
  recognition: number; // meters
  identification: number; // meters
  detectionFeet: number;
  recognitionFeet: number;
  identificationFeet: number;
  coverageArea?: number; // square feet (for perimeter applications)
}

export interface TargetDetectionRanges {
  human: DetectionRanges;
  vehicle: DetectionRanges;
}

// Johnson Criteria constants
const JOHNSON_CRITERIA = {
  detection: 3.6, // pixels by 1 pixel
  recognition: 14.4, // pixels by 4 pixels
  identification: 28.8, // pixels by 8 pixels
} as const;

// Standard target dimensions (meters)
const TARGET_DIMENSIONS = {
  human: {
    height: 1.8, // 6 feet
    width: 0.75, // 2.5 feet (shoulder width)
  },
  vehicle: {
    height: 2.5, // 8.2 feet (standard vehicle)
    width: 2.0, // 6.6 feet
  },
} as const;

/**
 * Calculate detection range based on Johnson Criteria
 * Formula: Range = (target_height × lens_efl × horiz_res) / (pixels_required × pixel_pitch)
 */
function calculateRange(
  targetHeight: number,
  lensEFL: number,
  horizRes: number,
  pixelPitch: number,
  pixelsRequired: number
): number {
  return Math.floor(
    (targetHeight * lensEFL * horizRes) / (pixelsRequired * pixelPitch)
  );
}

/**
 * Convert meters to feet
 */
function metersToFeet(meters: number): number {
  return Math.round(meters * 3.28084);
}

/**
 * Calculate coverage area in square feet for perimeter applications
 * Assumes camera covers a semi-circular area at detection range
 */
function calculateCoverageArea(detectionRange: number): number {
  const radiusFeet = metersToFeet(detectionRange);
  // Semi-circle area = (π × r²) / 2
  return Math.round((Math.PI * radiusFeet * radiusFeet) / 2);
}

/**
 * Calculate detection ranges for a specific target type
 */
export function calculateDetectionRanges(
  specs: ThermalCameraSpecs,
  targetType: 'human' | 'vehicle' = 'human'
): DetectionRanges {
  const targetHeight = TARGET_DIMENSIONS[targetType].height;
  const { lensEFL, pixelPitch, horizRes } = specs;

  const detection = calculateRange(
    targetHeight,
    lensEFL,
    horizRes,
    pixelPitch,
    JOHNSON_CRITERIA.detection
  );

  const recognition = calculateRange(
    targetHeight,
    lensEFL,
    horizRes,
    pixelPitch,
    JOHNSON_CRITERIA.recognition
  );

  const identification = calculateRange(
    targetHeight,
    lensEFL,
    horizRes,
    pixelPitch,
    JOHNSON_CRITERIA.identification
  );

  return {
    detection,
    recognition,
    identification,
    detectionFeet: metersToFeet(detection),
    recognitionFeet: metersToFeet(recognition),
    identificationFeet: metersToFeet(identification),
    coverageArea: calculateCoverageArea(detection),
  };
}

/**
 * Calculate detection ranges for both human and vehicle targets
 */
export function calculateAllDetectionRanges(
  specs: ThermalCameraSpecs
): TargetDetectionRanges {
  return {
    human: calculateDetectionRanges(specs, 'human'),
    vehicle: calculateDetectionRanges(specs, 'vehicle'),
  };
}

/**
 * Format detection range for display
 */
export function formatDetectionRange(meters: number, feet: number): string {
  return `${meters.toLocaleString()}m (${feet.toLocaleString()}ft)`;
}

/**
 * Get human-readable description of detection capability
 */
export function getDetectionDescription(level: 'detection' | 'recognition' | 'identification'): string {
  const descriptions = {
    detection: 'You can see something is there',
    recognition: 'You can see that it\'s a person',
    identification: 'You can see person holding a weapon',
  };
  return descriptions[level];
}

/**
 * Calculate recommended number of cameras for perimeter coverage
 */
export function calculateCamerasNeeded(
  perimeterFeet: number,
  detectionRangeFeet: number,
  overlapPercentage: number = 20 // 20% overlap recommended
): {
  cameras: number;
  coveragePerCamera: number;
  totalCoverage: number;
} {
  // Each camera covers diameter (2 × radius) with overlap
  const effectiveCoveragePerCamera = detectionRangeFeet * 2 * (1 - overlapPercentage / 100);
  const cameras = Math.ceil(perimeterFeet / effectiveCoveragePerCamera);

  return {
    cameras,
    coveragePerCamera: Math.round(effectiveCoveragePerCamera),
    totalCoverage: cameras * effectiveCoveragePerCamera,
  };
}

/**
 * Get recommended lens for target detection distance
 * Reverse calculation: given desired range, find required lens EFL
 */
export function getRecommendedLens(
  desiredRangeMeters: number,
  pixelPitch: number,
  horizRes: number,
  targetType: 'human' | 'vehicle' = 'human',
  detectionLevel: 'detection' | 'recognition' | 'identification' = 'detection'
): {
  recommendedEFL: number;
  availableLenses: number[]; // Common FLIR lens options
  closestLens: number;
} {
  const targetHeight = TARGET_DIMENSIONS[targetType].height;
  const pixelsRequired = JOHNSON_CRITERIA[detectionLevel];

  // Reverse formula: lens_efl = (Range × pixels_required × pixel_pitch) / (target_height × horiz_res)
  const recommendedEFL = Math.round(
    (desiredRangeMeters * pixelsRequired * pixelPitch) / (targetHeight * horizRes)
  );

  // Common FLIR thermal lens options
  const availableLenses = [7.5, 9, 13, 18, 19, 25, 35, 50, 60, 65, 75, 100, 105];

  // Find closest available lens
  const closestLens = availableLenses.reduce((prev, curr) =>
    Math.abs(curr - recommendedEFL) < Math.abs(prev - recommendedEFL) ? curr : prev
  );

  return {
    recommendedEFL,
    availableLenses,
    closestLens,
  };
}

/**
 * Compare thermal vs visible camera performance
 */
export function compareThermalVsVisible(
  thermalSpecs: ThermalCameraSpecs,
  visibleCameraCount: number = 1,
  irIlluminatorRange: number = 50 // meters
): {
  thermal: TargetDetectionRanges;
  visibleNightRange: number;
  thermalAdvantage: string;
} {
  const thermal = calculateAllDetectionRanges(thermalSpecs);

  return {
    thermal,
    visibleNightRange: irIlluminatorRange,
    thermalAdvantage:
      thermal.human.detection > irIlluminatorRange * 2
        ? `${Math.round((thermal.human.detection / irIlluminatorRange) * 100)}% better night detection`
        : 'Similar performance',
  };
}

/**
 * Calculate cost per meter of coverage
 */
export function calculateCostPerMeterCoverage(
  cameraPrice: number,
  detectionRangeMeters: number
): {
  costPerMeter: number;
  costPerFoot: number;
  totalCoverageArea: number;
} {
  const coverageArea = calculateCoverageArea(detectionRangeMeters);
  const coverageAreaMeters = coverageArea / 10.764; // sq ft to sq meters

  return {
    costPerMeter: Math.round(cameraPrice / detectionRangeMeters),
    costPerFoot: Math.round(cameraPrice / metersToFeet(detectionRangeMeters)),
    totalCoverageArea: Math.round(coverageAreaMeters),
  };
}

/**
 * FLIR product line detection ranges (pre-calculated from spec sheets)
 * This data comes from the FLIR Thermal Security Camera Range Data PDF
 */
export const FLIR_PRODUCT_RANGES = {
  // F-Series ID (Fixed Thermal with Analytics)
  'F-644-ID': { lensEFL: 13, pixelPitch: 17, horizRes: 640 },
  'F-625-ID': { lensEFL: 25, pixelPitch: 17, horizRes: 640 },
  'F-617-ID': { lensEFL: 35, pixelPitch: 17, horizRes: 640 },
  'F-612-ID': { lensEFL: 50, pixelPitch: 17, horizRes: 640 },
  'F-610-ID': { lensEFL: 65, pixelPitch: 17, horizRes: 640 },
  'F-608-ID': { lensEFL: 75, pixelPitch: 17, horizRes: 640 },
  'F-606-ID': { lensEFL: 100, pixelPitch: 17, horizRes: 640 },

  // FC-ID Series (Fixed Thermal)
  'FC-690': { lensEFL: 7.5, pixelPitch: 17, horizRes: 640 },
  'FC-669': { lensEFL: 9, pixelPitch: 17, horizRes: 640 },
  'FC-644': { lensEFL: 13, pixelPitch: 17, horizRes: 640 },
  'FC-632': { lensEFL: 19, pixelPitch: 17, horizRes: 640 },
  'FC-625': { lensEFL: 25, pixelPitch: 17, horizRes: 640 },
  'FC-617': { lensEFL: 35, pixelPitch: 17, horizRes: 640 },
  'FC-610': { lensEFL: 60, pixelPitch: 17, horizRes: 640 },
  'FC-608': { lensEFL: 75, pixelPitch: 17, horizRes: 640 },

  // FH-ID Series (Multispectral - Thermal + 4K Visible)
  'FH-669': { lensEFL: 9, pixelPitch: 17, horizRes: 640 },
  'FH-644': { lensEFL: 13, pixelPitch: 17, horizRes: 640 },
  'FH-625': { lensEFL: 25, pixelPitch: 17, horizRes: 640 },
  'FH-617': { lensEFL: 35, pixelPitch: 17, horizRes: 640 },
  'FH-612': { lensEFL: 50, pixelPitch: 17, horizRes: 640 },
  'FH-610': { lensEFL: 60, pixelPitch: 17, horizRes: 640 },
  'FH-608': { lensEFL: 75, pixelPitch: 17, horizRes: 640 },

  // PT-Series (Thermal PTZ)
  'PT-644': { lensEFL: 13, pixelPitch: 17, horizRes: 640 },
  'PT-625': { lensEFL: 25, pixelPitch: 17, horizRes: 640 },
  'PT-617': { lensEFL: 35, pixelPitch: 17, horizRes: 640 },
  'PT-612': { lensEFL: 50, pixelPitch: 17, horizRes: 640 },
  'PT-608': { lensEFL: 75, pixelPitch: 17, horizRes: 640 },
  'PT-606Z': { lensEFL: 105, pixelPitch: 17, horizRes: 640 },

  // FB-ID Series (Compact Fixed Thermal)
  'FB-393': { lensEFL: 3.7, pixelPitch: 17, horizRes: 320 },
  'FB-349': { lensEFL: 6.8, pixelPitch: 17, horizRes: 320 },
  'FB-324': { lensEFL: 12.8, pixelPitch: 17, horizRes: 320 },
  'FB-312': { lensEFL: 18, pixelPitch: 12, horizRes: 320 },
  'FB-309': { lensEFL: 24, pixelPitch: 12, horizRes: 320 },
  'FB-695': { lensEFL: 4.9, pixelPitch: 12, horizRes: 640 },
  'FB-650': { lensEFL: 8.7, pixelPitch: 12, horizRes: 640 },
  'FB-632': { lensEFL: 14, pixelPitch: 12, horizRes: 640 },
  'FB-618': { lensEFL: 24, pixelPitch: 12, horizRes: 640 },
} as const;

/**
 * Get pre-calculated ranges for a specific FLIR product
 */
export function getFLIRProductRanges(model: string): TargetDetectionRanges | null {
  const specs = FLIR_PRODUCT_RANGES[model as keyof typeof FLIR_PRODUCT_RANGES];
  if (!specs) return null;

  return calculateAllDetectionRanges({ ...specs, model });
}
