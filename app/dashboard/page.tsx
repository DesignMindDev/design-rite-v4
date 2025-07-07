"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [user] = useState({
    name: "Demo User",
    company: "Demo Security Company",
    subscriptionTier: "trial",
    trialAssessmentsRemaining: 2,
  })

  const [assessments] = useState([
    {
      id: 1,
      companyName: "ABC Manufacturing",
      facilityType: "Manufacturing",
      status: "completed",
      createdAt: "2024-01-15",
      value: "$25,000",
    },
    {
      id: 2,
      companyName: "XYZ Retail Store",
      facilityType: "Retail",
      status: "completed",
      createdAt: "2024-01-14",
      value: "$15,000",
    },
    {
      id: 3,
      companyName: "Tech Startup Office",
      facilityType: "Office",
      status: "pending",
      createdAt: "2024-01-13",
      value: "$12,000",
    },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">Design-Rite™</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" size="sm">
                Settings
              </Button>
              <Button variant="ghost" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">{user.company}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-purple-600">{assessments.length}</div>
                <div className="ml-2 text-sm text-gray-600">Total Assessments</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-green-600">
                  {assessments.filter((a) => a.status === "completed").length}
                </div>
                <div className="ml-2 text-sm text-gray-600">Completed</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-blue-600">$52,000</div>
                <div className="ml-2 text-sm text-gray-600">Total Value</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-orange-600">{user.trialAssessmentsRemaining}</div>
                <div className="ml-2 text-sm text-gray-600">Trial Remaining</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trial Banner */}
        {user.subscriptionTier === "trial" && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-orange-900">
                    Trial Account - {user.trialAssessmentsRemaining} assessments remaining
                  </h3>
                  <p className="text-orange-700">
                    Upgrade to Professional for unlimited assessments and advanced features.
                  </p>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700">Upgrade Now</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-medium mb-2">New Assessment</h3>
              <p className="text-gray-600 mb-4">Start a new AI-powered security assessment</p>
              <Button className="w-full">Create Assessment</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium mb-2">View Reports</h3>
              <p className="text-gray-600 mb-4">Access your completed assessments</p>
              <Button variant="outline" className="w-full bg-transparent">
                View All
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-lg font-medium mb-2">Settings</h3>
              <p className="text-gray-600 mb-4">Manage your account and preferences</p>
              <Button variant="outline" className="w-full bg-transparent">
                Configure
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{assessment.companyName}</h4>
                    <p className="text-sm text-gray-600">
                      {assessment.facilityType} • {assessment.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">{assessment.value}</div>
                      <Badge variant={assessment.status === "completed" ? "default" : "secondary"}>
                        {assessment.status}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
