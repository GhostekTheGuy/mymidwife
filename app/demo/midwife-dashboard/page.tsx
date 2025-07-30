"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MessageCircle, Star, TrendingUp, ArrowLeft, Clock, MapPin } from "lucide-react"

// Import date utilities at the top
import { formatDate, formatRelativeTime } from "@/lib/date-utils"

export default function MidwifeDemoPage() {
  // Update todayAppointments to use real dates
  const todayAppointments = [
    {
      id: 1,
      patient: "Maria K.",
      time: "09:00",
      type: "Kontrola prenatalna",
      status: "confirmed",
      week: "24 tydzień",
    },
    {
      id: 2,
      patient: "Anna W.",
      time: "11:30",
      type: "Pierwsza wizyta",
      status: "confirmed",
      week: "12 tydzień",
    },
    {
      id: 3,
      patient: "Katarzyna M.",
      time: "14:00",
      type: "Konsultacja online",
      status: "pending",
      week: "32 tydzień",
    },
  ]

  // Update recentMessages to use real relative times
  const recentMessages = [
    {
      id: 1,
      patient: "Maria K.",
      message: "Czy mogę przesunąć jutrzejszą wizytę?",
      time: formatRelativeTime(new Date(Date.now() - 30 * 60 * 1000)),
      unread: true,
    },
    {
      id: 2,
      patient: "Anna W.",
      message: "Dziękuję za wczorajszą konsultację",
      time: formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)),
      unread: false,
    },
  ]

  const monthlyStats = {
    totalPatients: 45,
    newPatients: 8,
    completedAppointments: 67,
    rating: 4.9,
  }

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
                <h1 className="text-xl font-bold text-gray-900">Panel Położnej</h1>
                <p className="text-sm text-gray-600">Witaj, Anna Kowalska! (Konto Demo)</p>
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
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pacjentki</p>
                      <p className="font-semibold">{monthlyStats.totalPatients}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nowe w tym miesiącu</p>
                      <p className="font-semibold">+{monthlyStats.newPatients}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Wizyty w miesiącu</p>
                      <p className="font-semibold">{monthlyStats.completedAppointments}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ocena</p>
                      <p className="font-semibold">{monthlyStats.rating}/5.0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Dzisiejszy harmonogram</CardTitle>
                {/* Update the date display in the header */}
                <CardDescription>Twoje wizyty na dziś - {formatDate(new Date())}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{appointment.patient}</h3>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                          <p className="text-xs text-gray-500">{appointment.week}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.time}</p>
                        <Badge
                          variant={appointment.status === "confirmed" ? "default" : "secondary"}
                          className={
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {appointment.status === "confirmed" ? "Potwierdzona" : "Oczekuje"}
                        </Badge>
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
                <CardDescription>Komunikacja z pacjentkami</CardDescription>
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
                          <h4 className="font-medium">{message.patient}</h4>
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
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Twój profil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-pink-600">AK</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Anna Kowalska</h3>
                      <p className="text-sm text-gray-600">Położna</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Warszawa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">4.9/5.0 (127 opinii)</span>
                    </div>
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
                  Zarządzaj kalendarzem
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Lista pacjentek
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Wszystkie wiadomości
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Statystyki
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
                  To jest wersja demonstracyjna panelu położnej. Wszystkie dane są przykładowe.
                </p>
                <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600">
                  Dołącz jako położna
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
