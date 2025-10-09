import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const RENDER_API_TOKEN = process.env.RENDER_API_TOKEN || 'rnd_RXJST45Fkvff4PsRoym6WturD17c'
const RENDER_API_URL = 'https://api.render.com/v1'

interface RenderService {
  id: string
  name: string
  type: string
  repo: string
  branch: string
  serviceDetails?: any
  suspended?: string
  updatedAt: string
  createdAt: string
}

interface RenderDeploy {
  id: string
  status: string
  createdAt: string
  updatedAt: string
  finishedAt?: string
  commit?: {
    id: string
    message: string
    createdAt: string
  }
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all services
    const servicesResponse = await fetch(`${RENDER_API_URL}/services?limit=20`, {
      headers: {
        'Authorization': `Bearer ${RENDER_API_TOKEN}`,
        'Accept': 'application/json'
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    })

    if (!servicesResponse.ok) {
      console.error('Render API error:', await servicesResponse.text())
      return NextResponse.json(
        { error: 'Failed to fetch services from Render API', services: [] },
        { status: servicesResponse.status }
      )
    }

    const servicesData = await servicesResponse.json()
    const services: RenderService[] = servicesData[0]?.service ? servicesData : []

    // Fetch latest deploy for each service
    const servicesWithDeploys = await Promise.all(
      services.map(async (service) => {
        try {
          const deployResponse = await fetch(
            `${RENDER_API_URL}/services/${service.id}/deploys?limit=1`,
            {
              headers: {
                'Authorization': `Bearer ${RENDER_API_TOKEN}`,
                'Accept': 'application/json'
              },
              next: { revalidate: 30 }
            }
          )

          if (deployResponse.ok) {
            const deployData = await deployResponse.json()
            const latestDeploy: RenderDeploy | undefined = deployData[0]?.deploy

            return {
              ...service,
              latestDeploy: latestDeploy ? {
                id: latestDeploy.id,
                status: latestDeploy.status,
                createdAt: latestDeploy.createdAt,
                updatedAt: latestDeploy.updatedAt,
                finishedAt: latestDeploy.finishedAt,
                commitId: latestDeploy.commit?.id,
                commitMessage: latestDeploy.commit?.message,
                commitUrl: latestDeploy.commit?.id ?
                  `https://github.com/${service.repo}/commit/${latestDeploy.commit.id}` :
                  undefined
              } : undefined
            }
          }

          return service
        } catch (error) {
          console.error(`Failed to fetch deploy for service ${service.name}:`, error)
          return service
        }
      })
    )

    return NextResponse.json({
      services: servicesWithDeploys,
      count: servicesWithDeploys.length,
      lastUpdated: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Error fetching Render services:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error', services: [] },
      { status: 500 }
    )
  }
}
