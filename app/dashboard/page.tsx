"use client"

import { useEffect, useState } from "react"
import { PatientDashboard } from "@/components/patient-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Heart, Stethoscope } from "lucide-react"
import NavigationBar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DemoBanner } from "@/components/demo-banner"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const { user, switchAccount, getDemoAccountType } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie panelu...</p>
        </div>
      </div>
    )
  }

  // If user is guest, show account selection
  if (getDemoAccountType === "guest") {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <NavigationBar />
          <div className="pt-20 flex items-center justify-center min-h-[calc(100vh-80px)]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>Wybierz typ konta demo</CardTitle>
                <CardDescription>Aby uzyskać pełny dostęp do panelu, wybierz typ konta do eksploracji</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => {
                    switchAccount("patient")
                    window.location.reload()
                  }}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Panel Pacjentki
                </Button>
                <Button
                  onClick={() => {
                    switchAccount("midwife")
                    window.location.reload()
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Panel Położnej
                </Button>
                <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Powrót do strony głównej
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <DemoBanner />
          <PatientDashboard />
        </div>
      </div>
      <Footer />
    </div>
  )
}
