"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, FileText, Heart, Bell, ArrowLeft, Star } from "lucide-react"

// Import date utilities at the top
import { formatDate, formatRelativeTime, addDays } from "@/lib/date-utils"

export default function PatientDemoPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Update upcomingAppointments to use real dates
  const upcomingAppointments = [
    {
      id: 1,
      midwife: "Maria Nowak",
      date: formatDate(addDays(new Date(), 1)),
      time: "10:00",
      type: "Kontrola prenatalna",
      location: "Warszawa, ul. Marszałkowska 1",
    },
    {
      id: 2,
      midwife: "Maria Nowak",
      date: formatDate(addDays(new Date(), 7)),
      time: "14:30",
      type: "Edukacja przedporodowa ( szkoła rodzenia )",
      location: "Online",
    },
  ]

  // Update recentMessages to use real relative times
  const recentMessages = [
    {
      id: 1,
      midwife: "Maria Nowak",
      message: "Jak się czujesz po ostatniej wizycie?",
      time: formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)),
      unread: true,
    },
    {
      id: 2,
      midwife: "Maria Nowak",
      message: "Przesyłam materiały do następnej sesji edukacyjnej",
      time: formatRelativeTime(new Date(Date.now() - 24 * 60 * 60 * 1000)),
      unread: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel Pacjentki</h1>
                <p className="text-sm text-gray-600">Witaj, Maria! (Konto Demo)</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              DEMO
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Następna wizyta</p>
                      <p className="font-semibold">15 stycznia</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tydzień ciąży</p>
                      <p className="font-semibold">24 tydzień</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nowe wiadomości</p>
                      <p className="font-semibold">1 nieprzeczytana</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Nadchodzące wizyty</CardTitle>
                <CardDescription>Twoje zaplanowane spotkania z położnymi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{appointment.midwife}</h3>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                          <p className="text-xs text-gray-500">{appointment.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.date}</p>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Ostatnie wiadomości</CardTitle>
                <CardDescription>Komunikacja z Twoimi położnymi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{message.midwife}</h4>
                          {message.unread && <div className="w-2 h-2 bg-pink-500 rounded-full" />}
                        </div>
                        <p className="text-sm text-gray-600">{message.message}</p>
                        <p className="text-xs text-gray-500">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Śledzenie zdrowia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Samopoczucie dzisiaj</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Poziom energii</span>
                    <Badge variant="secondary">Dobry</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sen (ostatnia noc)</span>
                    <span className="text-sm font-medium">7h 30min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Szybkie akcje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Umów wizytę
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Napisz wiadomość
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Dzienniczek objawów
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Przypomnienia
                </Button>
              </CardContent>
            </Card>

            {/* Demo Info */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Konto Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 mb-3">
                  To jest wersja demonstracyjna panelu pacjentki. Wszystkie dane są przykładowe.
                </p>
                <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600">
                  Utwórz prawdziwe konto
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
