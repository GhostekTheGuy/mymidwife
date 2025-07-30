"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MessagesSystem } from "@/components/messages-system"
import { ImprovedSymptomDiary } from "@/components/improved-symptom-diary"
import { HealthTools } from "@/components/health-tools"
import { EducationalContent } from "@/components/educational-content"
import {
  Calendar,
  MessageCircle,
  BookOpen,
  Calculator,
  Heart,
  Bell,
  Settings,
  User,
  Menu,
  Home,
  Clock,
  MapPin,
  Phone,
  Video,
  Plus,
  FileText,
  ChevronRight,
  Stethoscope,
  Baby,
  Scale,
  Thermometer,
} from "lucide-react"

interface Appointment {
  id: string
  midwifeName: string
  midwifeAvatar: string
  date: string
  time: string
  type: "consultation" | "checkup" | "emergency"
  status: "upcoming" | "completed" | "cancelled"
  location: string
  notes?: string
}

interface QuickStat {
  label: string
  value: string
  change: string
  trend: "up" | "down" | "stable"
  icon: any
  color: string
}

export function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [unreadMessages, setUnreadMessages] = useState(3)

  useEffect(() => {
    // Mock data for appointments
    setAppointments([
      {
        id: "1",
        midwifeName: "Anna Kowalska",
        midwifeAvatar: "/placeholder.svg?height=40&width=40",
        date: "2024-01-15",
        time: "10:00",
        type: "consultation",
        status: "upcoming",
        location: "Klinika Rodzinna, ul. Kwiatowa 15",
        notes: "Kontrola rutynowa, badania krwi",
      },
      {
        id: "2",
        midwifeName: "Maria Nowak",
        midwifeAvatar: "/placeholder.svg?height=40&width=40",
        date: "2024-01-20",
        time: "14:30",
        type: "checkup",
        status: "upcoming",
        location: "Teleporada",
        notes: "Omówienie wyników badań",
      },
    ])
  }, [])

  const quickStats: QuickStat[] = [
    {
      label: "Tydzień ciąży",
      value: "24",
      change: "+1 tydzień",
      trend: "up",
      icon: Baby,
      color: "text-pink-600",
    },
    {
      label: "Waga",
      value: "68.5 kg",
      change: "+0.5 kg",
      trend: "up",
      icon: Scale,
      color: "text-blue-600",
    },
    {
      label: "Ciśnienie",
      value: "120/80",
      change: "Normalne",
      trend: "stable",
      icon: Heart,
      color: "text-green-600",
    },
    {
      label: "Temperatura",
      value: "36.6°C",
      change: "Normalna",
      trend: "stable",
      icon: Thermometer,
      color: "text-orange-600",
    },
  ]

  const quickActions = [
    {
      label: "Umów wizytę",
      icon: Calendar,
      color: "bg-pink-500 hover:bg-pink-600",
      action: () => setActiveTab("appointments"),
    },
    {
      label: "Napisz wiadomość",
      icon: MessageCircle,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => setActiveTab("messages"),
    },
    {
      label: "Dodaj objawy",
      icon: Plus,
      color: "bg-green-500 hover:bg-green-600",
      action: () => setActiveTab("diary"),
    },
    {
      label: "Narzędzia",
      icon: Calculator,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => setActiveTab("tools"),
    },
  ]

  const navigationItems = [
    { id: "overview", label: "Przegląd", icon: Home },
    { id: "appointments", label: "Wizyty", icon: Calendar },
    { id: "messages", label: "Wiadomości", icon: MessageCircle, badge: unreadMessages },
    { id: "diary", label: "Dziennik", icon: FileText },
    { id: "tools", label: "Narzędzia", icon: Calculator },
    { id: "education", label: "Wiedza", icon: BookOpen },
  ]

  const sidebarItems = [
    { id: "profile", label: "Profil", icon: User },
    { id: "settings", label: "Ustawienia", icon: Settings },
    { id: "notifications", label: "Powiadomienia", icon: Bell },
  ]

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-blue-100 text-blue-800"
      case "checkup":
        return "bg-green-100 text-green-800"
      case "emergency":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAppointmentTypeLabel = (type: string) => {
    switch (type) {
      case "consultation":
        return "Konsultacja"
      case "checkup":
        return "Kontrola"
      case "emergency":
        return "Pilne"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Witaj, Anna! 👋</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Jak się dzisiaj czujesz?</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-pink-600 bg-white px-3 py-2 rounded-full">
            <Baby className="w-4 h-4" />
            <span className="font-medium">24 tydzień ciąży</span>
          </div>
        </div>
      </div>

      {/* Quick Stats - Mobile Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="p-3 sm:p-4">
              <CardContent className="p-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.label}</p>
                    <p className="text-sm sm:text-lg font-semibold">{stat.value}</p>
                    <p className="text-xs text-gray-500 truncate">{stat.change}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions - Mobile 2x2 Grid */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Szybkie akcje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white h-16 sm:h-20 flex flex-col gap-1 sm:gap-2`}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm font-medium">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Nadchodzące wizyty</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("appointments")}>
              <span className="hidden sm:inline">Zobacz wszystkie</span>
              <ChevronRight className="w-4 h-4 sm:ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {appointments.slice(0, 2).map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto sm:mx-0">
                    <AvatarImage src={appointment.midwifeAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {appointment.midwifeName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                      <h3 className="font-semibold text-sm sm:text-base">{appointment.midwifeName}</h3>
                      <Badge className={getAppointmentTypeColor(appointment.type)}>
                        {getAppointmentTypeLabel(appointment.type)}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                          {formatDate(appointment.date)} o {appointment.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">{appointment.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center sm:justify-end">
                    <Button size="sm" variant="outline" className="h-8 px-3 bg-transparent">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Zadzwoń</span>
                    </Button>
                    <Button size="sm" className="bg-pink-500 hover:bg-pink-600 h-8 px-3">
                      <Video className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Video</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Ostatnia aktywność</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Dodano wpis do dziennika</p>
                <p className="text-xs text-gray-600">2 godziny temu</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Nowa wiadomość od położnej</p>
                <p className="text-xs text-gray-600">5 godzin temu</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Zakończono wizytę kontrolną</p>
                <p className="text-xs text-gray-600">1 dzień temu</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAppointments = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Moje wizyty</h2>
          <p className="text-sm sm:text-base text-gray-600">Zarządzaj swoimi wizytami u położnej</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Umów wizytę
        </Button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto sm:mx-0">
                  <AvatarImage src={appointment.midwifeAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {appointment.midwifeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold">{appointment.midwifeName}</h3>
                    <Badge className={getAppointmentTypeColor(appointment.type)}>
                      {getAppointmentTypeLabel(appointment.type)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 sm:col-span-2">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <p className="text-sm text-gray-600 mb-4 text-center sm:text-left">{appointment.notes}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
                    <Phone className="w-4 h-4 mr-2" />
                    Zadzwoń
                  </Button>
                  <Button className="bg-pink-500 hover:bg-pink-600 flex-1 sm:flex-none">
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview()
      case "appointments":
        return renderAppointments()
      case "messages":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Wiadomości</h2>
              <p className="text-sm sm:text-base text-gray-600">Komunikuj się ze swoją położną</p>
            </div>
            <div className="h-[500px] sm:h-[600px]">
              <MessagesSystem />
            </div>
          </div>
        )
      case "diary":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Dziennik objawów</h2>
              <p className="text-sm sm:text-base text-gray-600">Śledź swoje samopoczucie i objawy</p>
            </div>
            <ImprovedSymptomDiary />
          </div>
        )
      case "tools":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Narzędzia zdrowotne</h2>
              <p className="text-sm sm:text-base text-gray-600">Kalkulatory i narzędzia do monitorowania zdrowia</p>
            </div>
            <HealthTools />
          </div>
        )
      case "education":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Centrum edukacyjne</h2>
              <p className="text-sm sm:text-base text-gray-600">Artykuły i poradniki dla przyszłych mam</p>
            </div>
            <EducationalContent />
          </div>
        )
      default:
        return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-50">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto z-50">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MyMidwife</span>
            </div>
          </div>

          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                      activeTab === item.id
                        ? "bg-pink-100 text-pink-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <Badge className="ml-auto bg-pink-500 text-white">{item.badge}</Badge>
                    )}
                  </button>
                )
              })}
            </nav>

            <div className="px-2 space-y-1">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.id}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
                  >
                    <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">MyMidwife</span>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">MyMidwife</span>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.id}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
                    >
                      <IconComponent className="h-5 w-5" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-20 lg:pb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">{renderContent()}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
        <div className="grid grid-cols-6 gap-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors relative ${
                  isActive ? "bg-pink-50 text-pink-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <IconComponent className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium truncate w-full text-center">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
