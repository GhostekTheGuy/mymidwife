"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, FileText, MapPin, Video, Plus } from "lucide-react"
import { dataManager, type Appointment, type SymptomEntry } from "@/lib/data-manager"

const MONTHS = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
]

const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nie"]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [symptomEntries, setSymptomEntries] = useState<SymptomEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showDayDetails, setShowDayDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()

    // Listen for appointment updates
    const handleAppointmentUpdate = (event: CustomEvent) => {
      console.log("Calendar received appointment update:", event.detail)
      setAppointments(dataManager.getAppointments())
    }

    // Listen for symptom updates
    const handleSymptomUpdate = (event: CustomEvent) => {
      console.log("Calendar received symptom update:", event.detail)
      setSymptomEntries(dataManager.getSymptomEntries())
    }

    window.addEventListener("mymidwife:appointmentsUpdated", handleAppointmentUpdate as EventListener)
    window.addEventListener("mymidwife:symptomsUpdated", handleSymptomUpdate as EventListener)

    return () => {
      window.removeEventListener("mymidwife:appointmentsUpdated", handleAppointmentUpdate as EventListener)
      window.removeEventListener("mymidwife:symptomsUpdated", handleSymptomUpdate as EventListener)
    }
  }, [])

  const loadData = () => {
    setIsLoading(true)
    try {
      const appointmentData = dataManager.getAppointments()
      const symptomData = dataManager.getSymptomEntries()

      setAppointments(appointmentData)
      setSymptomEntries(symptomData)

      console.log("Calendar loaded data:", {
        appointments: appointmentData.length,
        symptoms: symptomData.length,
      })
    } catch (error) {
      console.error("Error loading calendar data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Adjust for Monday start

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getDateString = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateString = getDateString(date)
    return appointments.filter((apt) => apt.date === dateString)
  }

  const getSymptomEntryForDate = (date: Date) => {
    const dateString = getDateString(date)
    return symptomEntries.find((entry) => entry.date === dateString)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(getDateString(date))
    setShowDayDetails(true)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const days = getDaysInMonth(currentDate)
  const selectedDateObj = selectedDate ? new Date(selectedDate) : null
  const selectedAppointments = selectedDateObj ? getAppointmentsForDate(selectedDateObj) : []
  const selectedSymptomEntry = selectedDateObj ? getSymptomEntryForDate(selectedDateObj) : null

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Kalendarz</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ładowanie kalendarza...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kalendarz</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Dziś
          </Button>
          <Button size="sm" onClick={loadData} className="bg-pink-500 hover:bg-pink-600">
            <Plus className="w-4 h-4 mr-1" />
            Odśwież
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {DAYS.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2 h-24" />
              }

              const dayAppointments = getAppointmentsForDate(date)
              const daySymptomEntry = getSymptomEntryForDate(date)
              const hasEvents = dayAppointments.length > 0 || daySymptomEntry

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`p-2 h-24 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm ${
                    isToday(date) ? "bg-pink-50 border-pink-200 shadow-sm" : "border-gray-200"
                  } ${!isCurrentMonth(date) ? "opacity-50" : ""} ${hasEvents ? "ring-1 ring-blue-200" : ""}`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday(date) ? "text-pink-600" : "text-gray-900"}`}>
                    {date.getDate()}
                  </div>

                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className={`text-xs p-1 rounded truncate transition-colors ${
                          apt.isOnline
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                        title={`${apt.time} - ${apt.type} z ${apt.midwifeName}`}
                      >
                        <div className="flex items-center gap-1">
                          {apt.isOnline ? <Video className="w-2 h-2" /> : <MapPin className="w-2 h-2" />}
                          <span>{apt.time}</span>
                        </div>
                        <div className="truncate">{apt.type}</div>
                      </div>
                    ))}

                    {daySymptomEntry && (
                      <div
                        className="text-xs p-1 bg-purple-100 text-purple-800 rounded truncate hover:bg-purple-200 transition-colors"
                        title="Wpis w dzienniku objawów"
                      >
                        <FileText className="w-3 h-3 inline mr-1" />
                        Dziennik
                      </div>
                    )}

                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">+{dayAppointments.length - 2} więcej</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Details Dialog */}
      <Dialog open={showDayDetails} onOpenChange={setShowDayDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDateObj && (
                <>
                  {selectedDateObj.toLocaleDateString("pl-PL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Appointments */}
            {selectedAppointments.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Wizyty ({selectedAppointments.length})
                </h3>
                <div className="space-y-3">
                  {selectedAppointments.map((apt) => (
                    <div key={apt.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{apt.midwifeName}</h4>
                          <p className="text-sm text-gray-600 mb-2">{apt.type}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {apt.time}
                            </div>
                            <div className="flex items-center gap-1">
                              {apt.isOnline ? (
                                <>
                                  <Video className="w-3 h-3" />
                                  Online
                                </>
                              ) : (
                                <>
                                  <MapPin className="w-3 h-3" />
                                  {apt.location}
                                </>
                              )}
                            </div>
                          </div>
                          {apt.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <strong>Notatki:</strong> {apt.notes}
                            </div>
                          )}
                        </div>
                        <Badge className={apt.isOnline ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                          {apt.status === "scheduled"
                            ? "Zaplanowana"
                            : apt.status === "completed"
                              ? "Zakończona"
                              : apt.status === "cancelled"
                                ? "Anulowana"
                                : apt.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Symptom Entry */}
            {selectedSymptomEntry && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Dziennik objawów
                </h3>
                <div className="p-4 border rounded-lg bg-purple-50">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Nastrój:</span>
                      <span className="ml-2 font-medium">{getMoodLabel(selectedSymptomEntry.symptoms.mood)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Energia:</span>
                      <span className="ml-2 font-medium">{getEnergyLabel(selectedSymptomEntry.symptoms.energy)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Nudności:</span>
                      <span className="ml-2 font-medium">{getNauseaLabel(selectedSymptomEntry.symptoms.nausea)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Apetyt:</span>
                      <span className="ml-2 font-medium">
                        {getAppetiteLabel(selectedSymptomEntry.symptoms.appetite)}
                      </span>
                    </div>
                  </div>

                  {/* Additional metrics */}
                  {(selectedSymptomEntry.symptoms.weight ||
                    selectedSymptomEntry.symptoms.bloodPressure ||
                    selectedSymptomEntry.symptoms.temperature) && (
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3 pt-3 border-t border-purple-200">
                      {selectedSymptomEntry.symptoms.weight && (
                        <div>
                          <span className="text-gray-600">Waga:</span>
                          <span className="ml-2 font-medium">{selectedSymptomEntry.symptoms.weight} kg</span>
                        </div>
                      )}
                      {selectedSymptomEntry.symptoms.bloodPressure && (
                        <div>
                          <span className="text-gray-600">Ciśnienie:</span>
                          <span className="ml-2 font-medium">{selectedSymptomEntry.symptoms.bloodPressure}</span>
                        </div>
                      )}
                      {selectedSymptomEntry.symptoms.temperature && (
                        <div>
                          <span className="text-gray-600">Temperatura:</span>
                          <span className="ml-2 font-medium">{selectedSymptomEntry.symptoms.temperature}°C</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedSymptomEntry.symptoms.notes && (
                    <div className="pt-3 border-t border-purple-200">
                      <span className="text-gray-600 text-sm font-medium">Notatki:</span>
                      <p className="text-sm mt-1">{selectedSymptomEntry.symptoms.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedAppointments.length === 0 && !selectedSymptomEntry && (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Brak wydarzeń w tym dniu</p>
                <p className="text-sm mt-2">Kliknij "Odśwież" aby zaktualizować kalendarz</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper functions for labels
function getMoodLabel(mood: string) {
  const labels = {
    excellent: "Doskonały",
    good: "Dobry",
    fair: "Przeciętny",
    poor: "Słaby",
    terrible: "Okropny",
  }
  return labels[mood as keyof typeof labels] || mood
}

function getEnergyLabel(energy: string) {
  const labels = {
    high: "Wysoka",
    normal: "Normalna",
    low: "Niska",
    "very-low": "Bardzo niska",
  }
  return labels[energy as keyof typeof labels] || energy
}

function getNauseaLabel(nausea: string) {
  const labels = {
    none: "Brak",
    mild: "Łagodne",
    moderate: "Umiarkowane",
    severe: "Silne",
  }
  return labels[nausea as keyof typeof labels] || nausea
}

function getAppetiteLabel(appetite: string) {
  const labels = {
    excellent: "Doskonały",
    good: "Dobry",
    poor: "Słaby",
    none: "Brak",
  }
  return labels[appetite as keyof typeof labels] || appetite
}
