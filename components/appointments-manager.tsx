"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Video, Plus, ExternalLink, XCircle } from "lucide-react"
import { dataManager, type Appointment } from "@/lib/data-manager"
import { formatDate } from "@/lib/date-utils"

export function AppointmentsManager() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("upcoming")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAppointments()

    // Listen for appointment updates from other components
    const handleAppointmentUpdate = (event: CustomEvent) => {
      console.log("Appointments manager received update:", event.detail)
      loadAppointments()
    }

    window.addEventListener("mymidwife:appointmentsUpdated", handleAppointmentUpdate as EventListener)

    return () => {
      window.removeEventListener("mymidwife:appointmentsUpdated", handleAppointmentUpdate as EventListener)
    }
  }, [])

  const loadAppointments = () => {
    setIsLoading(true)
    try {
      const allAppointments = dataManager.getAppointments()
      setAppointments(allAppointments)
      console.log("Loaded appointments:", allAppointments.length)
    } catch (error) {
      console.error("Error loading appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredAppointments = () => {
    const now = new Date()
    switch (activeTab) {
      case "upcoming":
        return appointments.filter((apt) => new Date(apt.date) >= now && apt.status === "scheduled")
      case "past":
        return appointments.filter((apt) => new Date(apt.date) < now || apt.status === "completed")
      case "all":
        return appointments
      default:
        return appointments
    }
  }

  const handleJoinMeeting = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowJoinDialog(true)
  }

  const handleCancelAppointment = (appointmentId: string) => {
    dataManager.updateAppointment(appointmentId, { status: "cancelled" })
    loadAppointments()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-green-100 text-green-800">Zaplanowana</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Zakończona</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Anulowana</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Zarządzanie wizytami</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ładowanie wizyt...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Zarządzanie wizytami</h1>
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Umów wizytę
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Umów nową wizytę</DialogTitle>
            </DialogHeader>
            <BookingForm
              onSuccess={() => {
                setShowBookingDialog(false)
                loadAppointments()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          {
            key: "upcoming",
            label: "Nadchodzące",
            count: appointments.filter((apt) => new Date(apt.date) >= new Date() && apt.status === "scheduled").length,
          },
          {
            key: "past",
            label: "Przeszłe",
            count: appointments.filter((apt) => new Date(apt.date) < new Date() || apt.status === "completed").length,
          },
          { key: "all", label: "Wszystkie", count: appointments.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.key ? "bg-white text-pink-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {getFilteredAppointments().length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak wizyt</h3>
              <p className="text-gray-600 mb-4">
                {activeTab === "upcoming" ? "Nie masz zaplanowanych wizyt" : "Brak wizyt w tej kategorii"}
              </p>
              {activeTab === "upcoming" && (
                <Button onClick={() => setShowBookingDialog(true)} className="bg-pink-500 hover:bg-pink-600">
                  Umów pierwszą wizytę
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          getFilteredAppointments().map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={appointment.midwifeAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{appointment.midwifeName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{appointment.midwifeName}</h3>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <p className="text-gray-600 mb-2">{appointment.type}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(new Date(appointment.date))}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {appointment.isOnline ? (
                            <>
                              <Video className="w-4 h-4" />
                              <span>Online</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4" />
                              <span>{appointment.location}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {appointment.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{appointment.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {appointment.status === "scheduled" && (
                      <>
                        {appointment.isOnline && appointment.meetingLink && (
                          <Button
                            size="sm"
                            onClick={() => handleJoinMeeting(appointment)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Dołącz
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleCancelAppointment(appointment.id)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Anuluj
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Join Meeting Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Dołącz do wizyty online</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <Video className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Wizyta z {selectedAppointment?.midwifeName}</h3>
              <p className="text-gray-600 mb-4">{selectedAppointment?.type}</p>
              <p className="text-sm text-gray-500 mb-6">Kliknij poniższy przycisk, aby dołączyć do rozmowy wideo</p>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={() => {
                  if (selectedAppointment?.meetingLink) {
                    window.open(selectedAppointment.meetingLink, "_blank")
                  }
                  setShowJoinDialog(false)
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Dołącz do rozmowy
              </Button>
              <Button variant="outline" onClick={() => setShowJoinDialog(false)}>
                Anuluj
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">Link zostanie otwarty w nowej karcie przeglądarki</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Replace the existing BookingForm component with this updated version
function BookingForm({ onSuccess }: { onSuccess: () => void }) {
  return (
    <div className="text-center py-8">
      <Calendar className="w-16 h-16 text-pink-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Znajdź położną</h3>
      <p className="text-gray-600 mb-6">Przejdź do wyszukiwarki, aby znaleźć i umówić wizytę u wybranej położnej</p>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            window.location.href = "/search"
            onSuccess()
          }}
          className="flex-1 bg-pink-500 hover:bg-pink-600"
        >
          Przejdź do wyszukiwarki
        </Button>
      </div>
    </div>
  )
}
