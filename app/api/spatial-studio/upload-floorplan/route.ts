import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('floorplan') as File;
    const projectName = formData.get('projectName') as string;
    const customerId = formData.get('customerId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No floor plan file provided' },
        { status: 400 }
      );
    }

    console.log(`Processing floor plan: ${file.name}, size: ${file.size} bytes`);

    // Step 1: Upload original file to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('spatial-floorplans')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('File uploaded to Supabase:', uploadData.path);

    // Step 2: Convert to base64 for GPT-4 Vision
    let imageBuffer = Buffer.from(fileBuffer);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = file.type || 'image/png';

    console.log('Analyzing floor plan with GPT-4 Vision...');

    // Step 3: Analyze floor plan with GPT-4 Vision
    const visionResponse = await openai.chat.completions.create({
      model: 'gpt-4o', // Using GPT-4o for vision
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this floor plan and identify:
1. All walls (return as line segments with coordinates in pixels from top-left)
2. All doors (return as points with type: entry/interior)
3. All windows (return as points)
4. Room dimensions (if scale is visible)
5. Estimated square footage

Return as JSON with this structure:
{
  "walls": [{"start": [x1, y1], "end": [x2, y2]}],
  "doors": [{"position": [x, y], "type": "entry"}],
  "windows": [{"position": [x, y]}],
  "dimensions": {"width": 50, "height": 40, "unit": "feet"},
  "sqft": 2000,
  "rooms": [{"name": "Living Room", "center": [x, y]}]
}

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
    });

    console.log('GPT-4 Vision response received');

    // Parse analysis result
    let analysisResult;
    try {
      const responseText = visionResponse.choices[0].message.content || '{}';
      // Remove markdown code blocks if present
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanJson);
      console.log('Analysis parsed successfully:', Object.keys(analysisResult));
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw response:', visionResponse.choices[0].message.content);
      // Fallback to simple structure
      analysisResult = {
        walls: [],
        doors: [],
        windows: [],
        dimensions: { width: 50, height: 40, unit: 'feet' },
        sqft: 2000
      };
    }

    // Step 4: Generate 3D model data
    const threejsModel = {
      walls: analysisResult.walls || [],
      doors: analysisResult.doors || [],
      windows: analysisResult.windows || [],
      rooms: analysisResult.rooms || [],
      height: 10, // Default ceiling height in feet
    };

    console.log('Generated 3D model with', threejsModel.walls.length, 'walls');

    // Step 5: Save to database
    const { data: projectData, error: dbError } = await supabase
      .from('spatial_projects')
      .insert({
        customer_id: customerId || 'demo',
        project_name: projectName || 'Untitled Project',
        floorplan_url: uploadData.path,
        threejs_model: threejsModel,
        dimensions: analysisResult.dimensions || {},
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Project saved to database:', projectData.id);

    return NextResponse.json({
      success: true,
      projectId: projectData.id,
      model: threejsModel,
      dimensions: analysisResult.dimensions || {},
      analysis: analysisResult
    });

  } catch (error) {
    console.error('Floor plan upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process floor plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: 'Spatial Studio - Floor Plan Upload',
    status: 'healthy',
    openai_configured: !!process.env.OPENAI_API_KEY,
    supabase_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    timestamp: new Date().toISOString()
  });
}
