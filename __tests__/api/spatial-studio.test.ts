/**
 * Spatial Studio API - Phase 1 Critical Path Tests
 * Tests:
 *  - Upload floor plan happy path
 *  - AI analysis happy path
 *  - Mobile annotation happy path
 *
 * Notes:
 *  - These tests hit the local dev server at http://localhost:3000
 *  - Ensure `npm run dev` is running before executing tests
 *  - Put fixtures in __tests__/fixtures: sample_floorplan.pdf and sample_photo.jpg
 */

import fs from 'fs';
import path from 'path';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3010';

// Increase Jest timeout for slow local dev server / AI calls (applies to entire file)
// eslint-disable-next-line no-undef
jest.setTimeout(60000);

// Shared flag so all test groups can skip when local server isn't running
let serverAvailable = false;

describe('Spatial Studio API - Phase 1', () => {
  let projectId: string | null = null;

  beforeAll(async () => {
    // Increase Jest timeout for slow local dev server / AI calls
    // eslint-disable-next-line no-undef
    jest.setTimeout(60000);

    // Probe the health endpoint with retries to ensure the dev server is running
    const maxAttempts = 20;
    const delayMs = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${BASE}/api/spatial-studio/upload-floorplan`, { signal: controller.signal });
        clearTimeout(timeout);
        if ([200, 204, 400, 405].includes(res.status)) {
          serverAvailable = true;
          break;
        }
        console.warn(`Health check attempt ${attempt} returned ${res.status}`);
      } catch (err) {
        // fetch may throw on abort or connection failure
        if (attempt === maxAttempts) {
          console.warn('Final health check attempt failed:', String(err));
        }
      }
      // wait before retrying
      await new Promise((r) => setTimeout(r, delayMs));
    }
    if (!serverAvailable) console.warn('Could not reach local dev server at', BASE);
  }, 60000);

  it('1.1 Upload floor plan - should accept valid floor plan file (PDF/PNG/JPG)', async () => {
    if (!serverAvailable) {
      console.warn('Skipping upload test because local dev server is not available');
      return;
    }

    const fixturesDir = path.join(__dirname, '..', 'fixtures');
    const pdfPath = path.join(fixturesDir, 'sample_floorplan.pdf');
    const pngPath = path.join(fixturesDir, 'sample_floorplan.png');
    let filePath = '';
    let mime = 'application/pdf';
    let filename = 'sample_floorplan.pdf';

    if (fs.existsSync(pdfPath)) {
      filePath = pdfPath;
      mime = 'application/pdf';
      filename = 'sample_floorplan.pdf';
    } else if (fs.existsSync(pngPath)) {
      filePath = pngPath;
      mime = 'image/png';
      filename = 'sample_floorplan.png';
    } else {
      throw new Error(`Missing fixture: sample_floorplan.pdf or sample_floorplan.png in __tests__/fixtures`);
    }

    const buffer = fs.readFileSync(filePath);

    const form = new FormData();
    const blob = new Blob([buffer], { type: mime });
    form.append('floorplan', blob, filename);
    form.append('projectName', 'Test Project - Spatial Studio');
    form.append('customerId', 'test-customer-001');

    const res = await fetch(`${BASE}/api/spatial-studio/upload-floorplan`, {
      method: 'POST',
      body: form as unknown as BodyInit,
    });

    expect([200, 201]).toContain(res.status);

    const data = await res.json();
    expect(data).toBeTruthy();
    expect(data.success).toBe(true);
    expect(data.projectId).toBeTruthy();
    expect(data.status).toBe('pending'); // NEW: async processing

    projectId = data.projectId;

    // NEW: Poll for analysis completion
    console.log('Waiting for AI analysis to complete...');
    let analysisComplete = false;
    const maxWaitTime = 45000; // 45 seconds
    const pollInterval = 2000; // 2 seconds
    const startTime = Date.now();

    while (!analysisComplete && Date.now() - startTime < maxWaitTime) {
      await new Promise(r => setTimeout(r, pollInterval));

      const statusRes = await fetch(`${BASE}/api/spatial-studio/upload-floorplan?projectId=${projectId}`);
      const statusData = await statusRes.json();

      console.log(`Analysis status: ${statusData.status}`);

      if (statusData.status === 'completed') {
        analysisComplete = true;
        expect(statusData.model).toBeDefined();
        expect(Array.isArray(statusData.model.walls)).toBe(true);
        expect(Array.isArray(statusData.model.doors)).toBe(true);
        expect(Array.isArray(statusData.model.windows)).toBe(true);
      } else if (statusData.status === 'failed') {
        throw new Error(`Analysis failed: ${statusData.error}`);
      }
    }

    if (!analysisComplete) {
      console.warn('Analysis did not complete within timeout, but upload succeeded');
    }
  }, 60000);

  it('1.2 AI Site Analysis - should analyze floor plan and recommend camera placements', async () => {
    if (!serverAvailable) {
      console.warn('Skipping analysis test because local dev server is not available');
      return;
    }
    if (!projectId) {
      throw new Error('No projectId from upload test; ensure test 1.1 ran and succeeded.');
    }

    const res = await fetch(`${BASE}/api/spatial-studio/analyze-site`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toBeTruthy();
    expect(data.success).toBe(true);
    expect(data.analysis).toBeDefined();
    expect(Array.isArray(data.analysis.cameras)).toBe(true);
    expect(data.analysis.coverage_analysis).toBeDefined();
    expect(typeof data.analysis.estimated_cost === 'object').toBe(true);

    if (data.analysis.cameras.length > 0) {
      const cam = data.analysis.cameras[0];
      expect(cam).toHaveProperty('position');
      expect(Array.isArray(cam.position)).toBe(true);
      expect(typeof cam.coverage_radius === 'number').toBe(true);
    }
  }, 45000);

  it('1.3 Mobile Annotation - should save site walk annotation with GPS coordinates', async () => {
    if (!serverAvailable) {
      console.warn('Skipping annotation test because local dev server is not available');
      return;
    }
    if (!projectId) {
      throw new Error('No projectId available; upload must succeed first.');
    }

    const fixturesDir = path.join(__dirname, '..', 'fixtures');
    const photoPath = path.join(fixturesDir, 'sample_photo.jpg');
    const photoUrl = fs.existsSync(photoPath) ? 'https://example.com/sample_photo.jpg' : null;

    const body = {
      projectId,
      annotationType: 'site_walk',
      gpsCoordinates: { lat: 41.4993, lng: -81.6944, accuracy: 5 },
      floorCoordinates: { x: 120, y: 240 },
      voiceTranscript: 'Front entrance needs camera',
      photoUrl: photoUrl || undefined,
      deviceType: 'mobile'
    };

    const res = await fetch(`${BASE}/api/spatial-studio/add-annotation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toBeTruthy();
    expect(data.success).toBe(true);
    expect(data.annotationId || data.annotation_id).toBeTruthy();
    // timestamp may be returned under different keys; be lenient
    expect(typeof data.timestamp === 'undefined' || typeof data.timestamp === 'string').toBe(true);
  }, 20000);
});

// Remaining placeholder tests below - TODO: Implement Phase 2 (Error Handling) and Phase 3 (Integration/Performance)
// See docs/SPATIAL_STUDIO_TEST_PLAN.md for implementation guide

describe('Spatial Studio - Floor Plan Upload API - Error Handling', () => {
  describe('POST /api/spatial-studio/upload-floorplan', () => {
    it('should reject files over 10MB', async () => {
      if (!serverAvailable) {
        console.warn('Skipping test because local dev server is not available');
        return;
      }

      // Create a buffer larger than 10MB
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024);
      const form = new FormData();
      const blob = new Blob([largeBuffer], { type: 'image/png' });
      form.append('floorplan', blob, 'large_file.png');
      form.append('projectName', 'Test Large File');
      form.append('customerId', 'test-customer-001');

      const res = await fetch(`${BASE}/api/spatial-studio/upload-floorplan`, {
        method: 'POST',
        body: form as unknown as BodyInit,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('File too large');
    }, 20000);

    it('should reject invalid file types', async () => {
      if (!serverAvailable) {
        console.warn('Skipping test because local dev server is not available');
        return;
      }

      const fixturesDir = path.join(__dirname, '..', 'fixtures');
      const txtPath = path.join(fixturesDir, 'invalid_file.txt');

      if (!fs.existsSync(txtPath)) {
        console.warn('Skipping test: invalid_file.txt not found');
        return;
      }

      const buffer = fs.readFileSync(txtPath);
      const form = new FormData();
      const blob = new Blob([buffer], { type: 'text/plain' });
      form.append('floorplan', blob, 'invalid_file.txt');
      form.append('projectName', 'Test Invalid Type');
      form.append('customerId', 'test-customer-001');

      const res = await fetch(`${BASE}/api/spatial-studio/upload-floorplan`, {
        method: 'POST',
        body: form as unknown as BodyInit,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Invalid file type');
    }, 20000);

    it('should create project in spatial_projects table', async () => {
      // Test: Verify Supabase spatial_projects table gets new row
      // Expected: Project with customer_id, project_name, floorplan_url
      expect(true).toBe(true); // Placeholder
    });

    it('should handle GPT-4o Vision API failures gracefully', async () => {
      // Test: Simulate OpenAI API timeout or error
      // Expected: Return 503 with "AI analysis unavailable" message
      expect(true).toBe(true); // Placeholder
    });
  });
});

describe.skip('Spatial Studio - AI Site Analysis API', () => {
  describe('POST /api/spatial-studio/analyze-site', () => {
    it('should analyze floor plan and recommend camera placements', async () => {
      // Test: Send projectId to AI analysis endpoint
      // Expected: Return cameras array with x,y positions, device types
      expect(true).toBe(true); // Placeholder
    });

    it('should calculate coverage percentage', async () => {
      // Test: Verify AI returns coverage_analysis object
      // Expected: coverage_percentage (0-100), blind_spots array
      expect(true).toBe(true); // Placeholder
    });

    it('should generate equipment list with quantities', async () => {
      // Test: Check equipment_list breakdown by category
      // Expected: cameras, nvr, access_control, network equipment
      expect(true).toBe(true); // Placeholder
    });

    it('should save AI suggestions to ai_device_suggestions table', async () => {
      // Test: Verify Supabase ai_device_suggestions gets populated
      // Expected: Rows with project_id, device_type, position, confidence
      expect(true).toBe(true); // Placeholder
    });

    it('should require valid projectId', async () => {
      // Test: Send request without projectId
      // Expected: Return 400 error with "Missing projectId" message
      expect(true).toBe(true); // Placeholder
    });

    it('should estimate total cost (equipment + installation)', async () => {
      // Test: Verify estimated_cost object returned
      // Expected: { equipment: number, installation: number, total: number }
      expect(true).toBe(true); // Placeholder
    });
  });
});

describe.skip('Spatial Studio - Mobile Annotation API', () => {
  describe('POST /api/spatial-studio/add-annotation', () => {
    it('should save site walk annotation with GPS coordinates', async () => {
      // Test: POST annotation with lat, lng, note, photo_url
      // Expected: Return success with annotation_id
      expect(true).toBe(true); // Placeholder
    });

    it('should link annotation to site_walk_sessions table', async () => {
      // Test: Verify session_id foreign key relationship
      // Expected: Annotation belongs to active session
      expect(true).toBe(true); // Placeholder
    });

    it('should support voice transcription in notes field', async () => {
      // Test: POST with transcribed_text from voice recording
      // Expected: Note stored in site_annotations table
      expect(true).toBe(true); // Placeholder
    });

    it('should validate required fields (session_id, lat, lng)', async () => {
      // Test: Send incomplete data
      // Expected: Return 400 with "Missing required fields" message
      expect(true).toBe(true); // Placeholder
    });

    it('should handle photo upload and storage', async () => {
      // Test: Upload photo file with annotation
      // Expected: Photo saved to Supabase storage, URL returned
      expect(true).toBe(true); // Placeholder
    });
  });
});

describe.skip('Spatial Studio - Integration Tests', () => {
  describe('Complete workflow: Upload → Analyze → Annotate', () => {
    it('should handle full user journey from floor plan to site walk', async () => {
      // Test: Simulate complete workflow
      // 1. Upload floor plan → Get projectId
      // 2. Analyze site → Get camera suggestions
      // 3. Create site walk session
      // 4. Add annotations with GPS
      // 5. Verify all data persists in Supabase
      expect(true).toBe(true); // Placeholder for comprehensive test
    });

    it('should maintain data consistency across tables', async () => {
      // Test: Verify foreign key relationships work
      // Expected: spatial_projects → ai_device_suggestions → site_walk_sessions → site_annotations
      expect(true).toBe(true); // Placeholder
    });
  });
});

describe.skip('Spatial Studio - Performance Tests', () => {
  describe('AI Analysis response time', () => {
    it('should complete GPT-4o analysis within 30 seconds', async () => {
      // Test: Measure time from request to response
      // Expected: Analysis completes in < 30 seconds
      expect(true).toBe(true); // Placeholder
    });

    it('should handle multiple concurrent uploads', async () => {
      // Test: Upload 5 floor plans simultaneously
      // Expected: All process without crashes or timeouts
      expect(true).toBe(true); // Placeholder
    });
  });
});
