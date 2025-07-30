"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Video, ArrowLeft, CheckCircle2 } from "lucide-react"
import { generateUpcomingDates, generateTimeSlots } from "@/lib/date-utils"
import { useRouter } from "next/navigation"

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

interface AppointmentBookingCalendarProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (date: string, time: string) => void
  midwifeName: string
  serviceName: string
  servicePrice: string
  serviceDuration: string
  isOnline?: boolean
  location?: string
}

export function AppointmentBookingCalendar({
  isOpen,
  onClose,
  onConfirm,
  midwifeName,
  serviceName,
  servicePrice,
  serviceDuration,
  isOnline = false,
  location = "",
}: AppointmentBookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [step, setStep] = useState<"calendar" | "time" | "confirm" | "success">("calendar")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  // Add at the top of the component
  const router = useRouter()

  // Mock availability data - in real app this would come from API
  const mockAvailability = generateUpcomingDates(30).reduce(
    (acc, date) => {
      const dateString = date.toISOString().split("T")[0]
      const dayOfWeek = date.getDay()

      // Skip Sundays
      if (dayOfWeek === 0) {
        acc[dateString] = []
        return acc
      }

      // Generate random available slots (4-12 slots per day)
      const slotCount = Math.floor(Math.random() * 9) + 4
      const allSlots = generateTimeSlots(9, 17, 30)
      const availableSlots = allSlots.slice(0, slotCount)

      acc[dateString] = availableSlots
      return acc
    },
    {} as Record<string, string[]>,
  )

  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setStep("calendar")
      setSelectedDate(null)
      setSelectedTime(null)
      setAvailableSlots([])
    }
  }, [isOpen])

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

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const getDateString = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const hasAvailableSlots = (date: Date) => {
    const dateString = getDateString(date)
    return mockAvailability[dateString]?.length > 0
  }

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date) || !hasAvailableSlots(date)) return

    const dateString = getDateString(date)
    setSelectedDate(dateString)
    setAvailableSlots(mockAvailability[dateString] || [])
    setStep("time")
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep("confirm")
  }

  // Update the handleConfirm function
  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setStep("success")
      setTimeout(() => {
        onConfirm(selectedDate, selectedTime)
        onClose()
        // Redirect to calendar after booking
        router.push("/demo/patient-dashboard?tab=calendar")
      }, 1500)
    }
  }

  const handleBack = () => {
    switch (step) {
      case "time":
        setStep("calendar")
        setSelectedDate(null)
        setAvailableSlots([])
        break
      case "confirm":
        setStep("time")
        setSelectedTime(null)
        break
      case "success":
        // Don't allow going back from success
        break
      default:
        onClose()
    }
  }

  const handleCancel = () => {
    setStep("calendar")
    setSelectedDate(null)
    setSelectedTime(null)
    setAvailableSlots([])
    onClose()
  }

  const days = getDaysInMonth(currentDate)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {step !== "calendar" && step !== "success" && (
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <span>
                {step === "calendar" && "Wybierz datę wizyty"}
                {step === "time" && "Wybierz godzinę"}
                {step === "confirm" && "Potwierdź wizytę"}
                {step === "success" && "Wizyta umówiona!"}
              </span>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Info Header */}
          <Card className="bg-pink-50 border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{serviceName}</h3>
                  <p className="text-gray-600">z {midwifeName}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg text-pink-600">{servicePrice}</div>
                  <div className="text-sm text-gray-600">{serviceDuration}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                {isOnline ? (
                  <>
                    <Video className="w-4 h-4" />
                    <span>Wizyta online</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Step */}
          {step === "calendar" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
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
                      return <div key={index} className="p-2 h-16" />
                    }

                    const hasSlots = hasAvailableSlots(date)
                    const isPast = isPastDate(date)
                    const isCurrentMonthDate = isCurrentMonth(date)
                    const isTodayDate = isToday(date)

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        disabled={isPast || !hasSlots || !isCurrentMonthDate}
                        className={`p-2 h-16 border rounded-lg transition-all duration-200 ${
                          isPast || !hasSlots || !isCurrentMonthDate
                            ? "opacity-50 cursor-not-allowed bg-gray-50"
                            : "cursor-pointer hover:bg-pink-50 hover:border-pink-300 hover:shadow-sm"
                        } ${isTodayDate && isCurrentMonthDate ? "bg-pink-100 border-pink-300" : "border-gray-200"} ${
                          !isCurrentMonthDate ? "opacity-30" : ""
                        }`}
                      >
                        <div
                          className={`text-sm font-medium ${
                            isTodayDate && isCurrentMonthDate ? "text-pink-600" : "text-gray-900"
                          }`}
                        >
                          {date.getDate()}
                        </div>
                        {hasSlots && isCurrentMonthDate && !isPast && (
                          <div className="text-xs text-green-600 mt-1">
                            {mockAvailability[getDateString(date)]?.length} terminów
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-100 border border-pink-300 rounded"></div>
                    <span>Dziś</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
                    <span>Dostępne terminy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded opacity-50"></div>
                    <span>Brak terminów</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Time Selection Step */}
          {step === "time" && selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Dostępne godziny -{" "}
                  {new Date(selectedDate).toLocaleDateString("pl-PL", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className="p-3 border rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors text-center"
                    >
                      <div className="font-medium">{time}</div>
                    </button>
                  ))}
                </div>
                {availableSlots.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Brak dostępnych terminów w tym dniu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Confirmation Step */}
          {step === "confirm" && selectedDate && selectedTime && (
            <Card>
              <CardHeader>
                <CardTitle>Podsumowanie wizyty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Usługa</label>
                      <p className="font-semibold">{serviceName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Położna</label>
                      <p className="font-semibold">{midwifeName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Cena</label>
                      <p className="font-semibold text-pink-600">{servicePrice}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Data</label>
                      <p className="font-semibold">
                        {new Date(selectedDate).toLocaleDateString("pl-PL", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Godzina</label>
                      <p className="font-semibold">{selectedTime}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lokalizacja</label>
                      <p className="font-semibold flex items-center gap-2">
                        {isOnline ? (
                          <>
                            <Video className="w-4 h-4" />
                            Wizyta online
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            {location}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                    Wstecz
                  </Button>
                  <Button onClick={handleConfirm} className="flex-1 bg-pink-500 hover:bg-pink-600">
                    Potwierdź wizytę
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Step */}
          {step === "success" && (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">Wizyta została umówiona!</h3>
                <p className="text-gray-600 mb-4">
                  Twoja wizyta z {midwifeName} została zaplanowana na{" "}
                  {selectedDate && new Date(selectedDate).toLocaleDateString("pl-PL")} o {selectedTime}
                </p>
                <Badge className="bg-green-100 text-green-800">Wizyta zostanie dodana do Twojego kalendarza</Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
