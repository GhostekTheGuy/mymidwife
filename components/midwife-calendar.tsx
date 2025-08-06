"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle, User, MapPin, Video, CalendarRange } from 'lucide-react'
import { generateTimeSlots, formatDate, isToday, isPastDate } from "@/lib/date-utils"
import { midwifeDataManager, type MidwifeAvailability } from "@/lib/midwife-data-manager"
import { useIsMobile } from "@/hooks/use-mobile"

const MONTHS = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
]

const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nie"]

// Definicja typów usług i ich czasów trwania (w slotach po 30 min)
const serviceTypes: Record<string, { duration: number; description: string }> = {
  "Kontrola prenatalna": { duration: 2, description: "60 min" },
  "Kontrola przedporodowa": { duration: 2, description: "60 min" },
  "Badanie CTG": { duration: 1, description: "30 min" },
  "Ostatnia wizyta przedporodowa": { duration: 3, description: "90 min" },
  "USG dopplerowskie": { duration: 2, description: "60 min" },
  "USG morfologiczne": { duration: 3, description: "90 min" },
  "Pierwsza wizyta prenatalna": { duration: 3, description: "90 min" },
  "Badanie kompletne": { duration: 3, description: "90 min" },
  "Wizyta anulowana": { duration: 1, description: "30 min" },
}

// Funkcja do parsowania godziny
const parseTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

// Funkcja do obliczania końcowego czasu wizyty
const getEndTime = (startTime: string, appointmentType: string) => {
  const duration = serviceTypes[appointmentType]?.duration || 1
  const startMinutes = parseTime(startTime)
  const endMinutes = startMinutes + (duration * 30)
  const hours = Math.floor(endMinutes / 60)
  const minutes = endMinutes % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Funkcja do sprawdzania czy slot czasowy jest zajęty
const isTimeSlotOccupied = (appointments: Appointment[], date: string, time: string, duration: number = 1) => {
  const timeInMinutes = parseTime(time)
  return appointments.some(apt => {
    if (apt.date !== date || apt.status === 'cancelled') return false
    const aptStart = parseTime(apt.time)
    const aptDuration = serviceTypes[apt.type]?.duration || 1
    const aptEnd = aptStart + (aptDuration * 30)
    
    // Sprawdź czy przedziały czasowe się nakładają
    return (timeInMinutes < aptEnd && (timeInMinutes + duration * 30) > aptStart)
  })
}

interface Appointment {
  id: number
  patient: string
  date: string
  time: string
  type: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  week?: string
  phone?: string
  email?: string
  isOnline?: boolean
  location?: string
}

interface AvailabilitySlot {
  id: string
  date: string
  time: string
  isAvailable: boolean
  maxBookings?: number
  currentBookings?: number
}

interface MidwifeCalendarProps {
  appointments: Appointment[]
  midwifeId?: string
  onAppointmentAction?: (appointmentId: number, action: 'confirm' | 'cancel' | 'reschedule') => void
  onAvailabilityChange?: (date: string, time: string, isAvailable: boolean) => void
}

export function MidwifeCalendar({ 
  appointments, 
  midwifeId = '2', // Default to Maria Nowak for demo
  onAppointmentAction,
  onAvailabilityChange 
}: MidwifeCalendarProps) {
  const isMobile = useIsMobile()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false)
  const [showAppointmentsDialog, setShowAppointmentsDialog] = useState(false)
  const [showMultiDayDialog, setShowMultiDayDialog] = useState(false)
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([])
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null)
  const [midwifeAvailability, setMidwifeAvailability] = useState<MidwifeAvailability[]>([])

  // Load availability from data manager
  useEffect(() => {
    const loadAvailability = () => {
      const availability = midwifeDataManager.getAvailability(midwifeId)
      setMidwifeAvailability(availability)
    }
    
    loadAvailability()
    
    // Subscribe to availability changes
    const unsubscribe = midwifeDataManager.subscribeToAvailability(midwifeId, (availability) => {
      setMidwifeAvailability(availability)
    })
    
    return unsubscribe
  }, [midwifeId])

  // React to appointments changes
  useEffect(() => {
    // Force re-render when appointments change
    if (selectedDate) {
      setAvailabilitySlots(generateAvailabilityForDate(selectedDate))
    }
  }, [appointments, selectedDate])

  // Get availability for a specific date
  const getAvailabilityForDate = (date: string) => {
    return midwifeAvailability.filter(slot => slot.date === date)
  }

  // Convert MidwifeAvailability to AvailabilitySlot for UI
  const convertToAvailabilitySlot = (midwifeSlot: MidwifeAvailability): AvailabilitySlot => ({
    id: midwifeSlot.id,
    date: midwifeSlot.date,
    time: midwifeSlot.time,
    isAvailable: midwifeSlot.isAvailable,
    maxBookings: midwifeSlot.maxBookings,
    currentBookings: midwifeSlot.currentBookings
  })

  // Generuj dostępność dla wybranego dnia (fallback)
  const generateAvailabilityForDate = (date: string) => {
    const existingSlots = getAvailabilityForDate(date)
    if (existingSlots.length > 0) {
      return existingSlots.map(convertToAvailabilitySlot)
    }
    
    // Fallback to realistic generation based on confirmed appointments
    const slots = generateTimeSlots(9, 17, 30)
    return slots.map(time => {
      // Sprawdź czy ten slot jest zajęty przez jakąkolwiek potwierdzoną wizytę
      const isOccupied = isTimeSlotOccupied(appointments, date, time, 1)
      
      return {
        id: `${date}-${time}`,
        date,
        time,
        isAvailable: !isOccupied, // Slot dostępny tylko jeśli nie jest zajęty
        maxBookings: 1,
        currentBookings: isOccupied ? 1 : 0
      }
    })
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

  const getDateString = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateString = getDateString(date)
    return appointments.filter(apt => apt.date === dateString)
  }

  const hasAppointments = (date: Date) => {
    return getAppointmentsForDate(date).length > 0
  }

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return
    
    const dateString = getDateString(date)
    setSelectedDate(dateString)
    setAvailabilitySlots(generateAvailabilityForDate(dateString))
    setShowAppointmentsDialog(true)
  }

  const handleAddAvailability = () => {
    if (!selectedDate) return
    setEditingSlot(null)
    setShowAvailabilityDialog(true)
  }

  const handleEditAvailability = (slot: AvailabilitySlot) => {
    setEditingSlot(slot)
    setShowAvailabilityDialog(true)
  }

  const handleSaveAvailability = (slotData: Partial<AvailabilitySlot>) => {
    if (!selectedDate) return

    const slotId = `${selectedDate}-${slotData.time}`
    
    if (editingSlot) {
      // Edytuj istniejący slot
      midwifeDataManager.updateAvailabilitySlot(midwifeId, slotId, {
        isAvailable: slotData.isAvailable ?? editingSlot.isAvailable,
        maxBookings: slotData.maxBookings ?? editingSlot.maxBookings
      })
    } else {
      // Dodaj nowy slot
      const newSlot: MidwifeAvailability = {
        id: slotId,
        midwifeId,
        date: selectedDate,
        time: slotData.time!,
        isAvailable: slotData.isAvailable ?? true,
        maxBookings: slotData.maxBookings ?? 1,
        currentBookings: 0
      }
      midwifeDataManager.setAvailability(midwifeId, [newSlot])
    }

    setShowAvailabilityDialog(false)
    setEditingSlot(null)
  }

  const handleDeleteAvailability = (slotId: string) => {
    midwifeDataManager.deleteAvailabilitySlot(midwifeId, slotId)
  }

  const handleOpenMultiDayDialog = () => {
    setShowMultiDayDialog(true)
  }

  const handleSaveMultiDayAvailability = (
    startDate: string,
    endDate: string,
    selectedDays: number[],
    timeSlots: string[],
    isAvailable: boolean,
    maxBookings: number
  ) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // Sprawdź czy daty są poprawne
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("Nieprawidłowe daty:", startDate, endDate)
      return
    }
    
    // Użyj menedżera danych do ustawienia dostępności
    midwifeDataManager.setMultiDayAvailability(
      midwifeId,
      startDate,
      endDate,
      selectedDays,
      timeSlots,
      isAvailable,
      maxBookings
    )

    setShowMultiDayDialog(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Kalendarz wizyt</h2>
            <p className="text-sm text-gray-600">Zarządzaj swoją dostępnością i harmonogramem</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="bg-pink-500 hover:bg-pink-600 h-10 text-sm"
              onClick={handleAddAvailability}
              disabled={!selectedDate}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isMobile ? "Dodaj dostępność" : "Dodaj dostępność"}
            </Button>
            <Button 
              variant="outline"
              className="border-pink-500 text-pink-600 hover:bg-pink-50 h-10 text-sm"
              onClick={handleOpenMultiDayDialog}
            >
              <CalendarRange className="w-4 h-4 mr-2" />
              {isMobile ? "Kilka dni" : "Kilka dni naraz"}
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className={isMobile ? "p-4 pb-2" : "p-6 pb-4"}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="w-5 h-5" />
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth("prev")}
                className={`${isMobile ? "h-8 w-8 p-0" : "h-9 px-3"}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth("next")}
                className={`${isMobile ? "h-8 w-8 p-0" : "h-9 px-3"}`}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className={isMobile ? "p-4 pt-2" : "p-6 pt-4"}>
          {/* Calendar Grid - Mobile Optimized */}
          <div className={`grid grid-cols-7 ${isMobile ? "gap-0.5 mb-2" : "gap-1 mb-4"}`}>
            {DAYS.map((day) => (
              <div key={day} className={`${isMobile ? "p-1 text-center" : "p-2 text-center"} ${isMobile ? "text-xs" : "text-sm"} font-medium text-gray-500`}>
                {isMobile ? day.substring(0, 1) : day}
              </div>
            ))}
          </div>

          <div className={`grid grid-cols-7 ${isMobile ? "gap-0.5" : "gap-1"}`}>
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className={`${isMobile ? "h-10" : "h-20"}`} />
              }

              const appointments = getAppointmentsForDate(date)
              const hasAppts = hasAppointments(date)
              const isPast = isPastDate(date)
              const isCurrentMonth = date.getMonth() === currentDate.getMonth()
              const isTodayDate = isToday(date)

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={isPast}
                  className={`${isMobile ? "p-1 h-10 min-h-[40px]" : "p-2 h-20"} border rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
                    isPast
                      ? "opacity-50 cursor-not-allowed bg-gray-50"
                      : "cursor-pointer hover:bg-pink-50 hover:border-pink-300 hover:shadow-sm active:bg-pink-100"
                  } ${isTodayDate && isCurrentMonth ? "bg-pink-100 border-pink-300" : "border-gray-200"} ${
                    !isCurrentMonth ? "opacity-30" : ""
                  }`}
                >
                  <div
                    className={`${isMobile ? "text-xs" : "text-sm"} font-medium ${
                      isTodayDate && isCurrentMonth ? "text-pink-600" : "text-gray-900"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  {hasAppts && isCurrentMonth && !isPast && (
                    <div className={`${isMobile ? "text-[10px] leading-none" : "text-xs"} text-blue-600 ${isMobile ? "mt-0.5" : "mt-1"}`}>
                      {isMobile ? `${appointments.length}` : `${appointments.length} wizyt`}
                    </div>
                  )}
                  {isCurrentMonth && !isPast && !hasAppts && (
                    <div className={`${isMobile ? "text-[10px] leading-none" : "text-xs"} text-gray-400 ${isMobile ? "mt-0.5" : "mt-1"}`}>
                      {isMobile ? "•" : "Wolne"}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend - Mobile Optimized */}
          <div className={`${isMobile ? "mt-3" : "mt-4"} flex flex-wrap items-center gap-3 text-xs text-gray-500`}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-pink-100 border border-pink-300 rounded"></div>
              <span>Dziś</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Wizyty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
              <span>Wolne</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Dialog */}
      <Dialog open={showAppointmentsDialog} onOpenChange={setShowAppointmentsDialog}>
        <DialogContent className={`${isMobile ? "max-w-[95vw] max-h-[85vh] m-2" : "max-w-4xl max-h-[90vh]"} overflow-hidden flex flex-col`}>
          <DialogHeader className={isMobile ? "p-4 pb-2" : "p-6 pb-4"}>
            <DialogTitle className={`flex items-center gap-2 ${isMobile ? "text-lg" : "text-xl"}`}>
              <Calendar className="w-5 h-5" />
              {selectedDate && formatDate(new Date(selectedDate), {
                weekday: isMobile ? "short" : "long",
                day: "numeric",
                month: isMobile ? "short" : "long",
                year: "numeric",
              })}
            </DialogTitle>
          </DialogHeader>

          <div className={`flex-1 overflow-y-auto ${isMobile ? "px-4 pb-4" : "px-6 pb-6"}`}>
            <div className="space-y-4">
              {/* Wizyty */}
              <Card>
                <CardHeader className={isMobile ? "p-3" : "p-4"}>
                  <CardTitle className={`flex items-center gap-2 ${isMobile ? "text-base" : "text-lg"}`}>
                    <User className="w-4 h-4" />
                    Wizyty ({selectedDate ? getAppointmentsForDate(new Date(selectedDate)).length : 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className={isMobile ? "p-3 pt-0" : "p-4 pt-0"}>
                  <div className="space-y-3">
                    {selectedDate && getAppointmentsForDate(new Date(selectedDate)).map((appointment) => (
                      <div key={appointment.id} className={`${isMobile ? "p-3" : "p-4"} border rounded-lg bg-white`}>
                        <div className={`flex ${isMobile ? "flex-col gap-2" : "items-start justify-between"} mb-3`}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${getStatusColor(appointment.status)} text-xs`}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1">
                                {appointment.status === 'confirmed' && 'Potwierdzona'}
                                {appointment.status === 'pending' && 'Oczekująca'}
                                {appointment.status === 'completed' && 'Zakończona'}
                                {appointment.status === 'cancelled' && 'Anulowana'}
                              </span>
                            </Badge>
                            {appointment.week && (
                              <Badge variant="outline" className="text-xs">
                                {appointment.week}
                              </Badge>
                            )}
                          </div>
                          <div className={`${isMobile ? "text-left" : "text-right"}`}>
                            <p className="font-medium text-sm">{appointment.time} - {getEndTime(appointment.time, appointment.type)}</p>
                            <p className="text-xs text-gray-500">
                              {serviceTypes[appointment.type]?.description || '30 min'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="font-semibold text-sm">{appointment.patient}</p>
                            <p className="text-sm text-gray-600">{appointment.type}</p>
                          </div>
                          
                          <div className={`flex ${isMobile ? "flex-col gap-1" : "items-center gap-4"} text-xs text-gray-600`}>
                            {appointment.isOnline ? (
                              <div className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                <span>Online</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{appointment.location || 'Gabinet'}</span>
                              </div>
                            )}
                            {appointment.phone && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{appointment.phone}</span>
                              </div>
                            )}
                          </div>

                          {onAppointmentAction && (
                            <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-2 mt-3`}>
                              {appointment.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm"
                                    onClick={() => onAppointmentAction(appointment.id, 'confirm')}
                                    className={`bg-green-500 hover:bg-green-600 text-xs h-8 ${isMobile ? "w-full" : ""}`}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Potwierdź
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onAppointmentAction(appointment.id, 'cancel')}
                                    className={`text-red-600 border-red-300 hover:bg-red-50 text-xs h-8 ${isMobile ? "w-full" : ""}`}
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Anuluj
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => onAppointmentAction(appointment.id, 'reschedule')}
                                className={`text-xs h-8 ${isMobile ? "w-full" : ""}`}
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                Przełóż
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {selectedDate && getAppointmentsForDate(new Date(selectedDate)).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Brak wizyt w tym dniu</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Dostępność */}
              <Card>
                <CardHeader className={isMobile ? "p-3" : "p-4"}>
                  <div className={`flex ${isMobile ? "flex-col gap-2" : "items-center justify-between"}`}>
                    <CardTitle className={`flex items-center gap-2 ${isMobile ? "text-base" : "text-lg"}`}>
                      <Clock className="w-4 h-4" />
                      Dostępność
                    </CardTitle>
                    <Button 
                      size="sm" 
                      onClick={handleAddAvailability} 
                      className={`bg-pink-500 hover:bg-pink-600 text-xs h-8 ${isMobile ? "w-full" : ""}`}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Dodaj dostępność
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className={isMobile ? "p-3 pt-0" : "p-4 pt-0"}>
                  <div className="space-y-3">
                    {availabilitySlots.map((slot) => (
                      <div key={slot.id} className={`flex ${isMobile ? "flex-col gap-2" : "items-center justify-between"} p-3 border rounded-lg bg-white`}>
                        <div className={`flex items-center ${isMobile ? "justify-between" : "gap-3"}`}>
                          <div className="text-center">
                            <p className="font-medium text-sm">{slot.time}</p>
                            <p className="text-xs text-gray-500">
                              {slot.currentBookings}/{slot.maxBookings} rezerwacji
                            </p>
                          </div>
                          <Badge variant={slot.isAvailable ? "default" : "secondary"} className="text-xs">
                            {slot.isAvailable ? "Dostępne" : "Niedostępne"}
                          </Badge>
                        </div>
                        <div className={`flex gap-2 ${isMobile ? "w-full" : ""}`}>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditAvailability(slot)}
                            className={`text-xs h-8 ${isMobile ? "flex-1" : ""}`}
                          >
                            <Edit className="w-3 h-3" />
                            {isMobile && <span className="ml-1">Edytuj</span>}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteAvailability(slot.id)}
                            className={`text-red-600 border-red-300 hover:bg-red-50 text-xs h-8 ${isMobile ? "flex-1" : ""}`}
                          >
                            <Trash2 className="w-3 h-3" />
                            {isMobile && <span className="ml-1">Usuń</span>}
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {availabilitySlots.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Brak ustawionej dostępności</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Availability Dialog */}
      <Dialog open={showAvailabilityDialog} onOpenChange={setShowAvailabilityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSlot ? "Edytuj dostępność" : "Dodaj dostępność"}
            </DialogTitle>
          </DialogHeader>
          
          <AvailabilityForm
            slot={editingSlot}
            onSave={handleSaveAvailability}
            onCancel={() => setShowAvailabilityDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Multi-Day Availability Dialog */}
      <Dialog open={showMultiDayDialog} onOpenChange={setShowMultiDayDialog}>
        <DialogContent className={`${isMobile ? "max-w-[95vw] max-h-[90vh] m-2" : "max-w-2xl max-h-[90vh]"} overflow-hidden flex flex-col`}>
          <DialogHeader className={isMobile ? "p-4 pb-2" : "p-6 pb-4"}>
            <DialogTitle className={isMobile ? "text-lg" : "text-xl"}>Ustaw dostępność dla kilku dni</DialogTitle>
          </DialogHeader>
          
          <div className={`flex-1 overflow-y-auto ${isMobile ? "px-4 pb-4" : "px-6 pb-6"}`}>
            <MultiDayAvailabilityForm
              onSave={handleSaveMultiDayAvailability}
              onCancel={() => setShowMultiDayDialog(false)}
              isMobile={isMobile}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface AvailabilityFormProps {
  slot: AvailabilitySlot | null
  onSave: (data: Partial<AvailabilitySlot>) => void
  onCancel: () => void
}

function AvailabilityForm({ slot, onSave, onCancel }: AvailabilityFormProps) {
  const [time, setTime] = useState(slot?.time || "")
  const [isAvailable, setIsAvailable] = useState(slot?.isAvailable ?? true)
  const [maxBookings, setMaxBookings] = useState(slot?.maxBookings?.toString() || "1")

  const timeSlots = generateTimeSlots(9, 17, 30)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      time,
      isAvailable,
      maxBookings: parseInt(maxBookings)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="time">Godzina</Label>
        <Select value={time} onValueChange={setTime}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz godzinę" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="isAvailable">Status</Label>
        <Select value={isAvailable.toString()} onValueChange={(value) => setIsAvailable(value === "true")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Dostępne</SelectItem>
            <SelectItem value="false">Niedostępne</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="maxBookings">Maksymalna liczba rezerwacji</Label>
        <Input
          id="maxBookings"
          type="number"
          min="1"
          max="10"
          value={maxBookings}
          onChange={(e) => setMaxBookings(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Anuluj
        </Button>
        <Button type="submit" className="flex-1 bg-pink-500 hover:bg-pink-600">
          {slot ? "Zapisz" : "Dodaj"}
        </Button>
      </div>
    </form>
  )
}

interface MultiDayAvailabilityFormProps {
  onSave: (
    startDate: string,
    endDate: string,
    selectedDays: number[],
    timeSlots: string[],
    isAvailable: boolean,
    maxBookings: number
  ) => void
  onCancel: () => void
  isMobile?: boolean
}

function MultiDayAvailabilityForm({ onSave, onCancel, isMobile = false }: MultiDayAvailabilityFormProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4]) // Pon-Pt domyślnie
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [isAvailable, setIsAvailable] = useState(true)
  const [maxBookings, setMaxBookings] = useState("1")

  const timeSlots = generateTimeSlots(9, 17, 30)
  const daysOfWeek = [
    { value: 0, label: "Poniedziałek" },
    { value: 1, label: "Wtorek" },
    { value: 2, label: "Środa" },
    { value: 3, label: "Czwartek" },
    { value: 4, label: "Piątek" },
    { value: 5, label: "Sobota" },
    { value: 6, label: "Niedziela" }
  ]

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    )
  }

  const handleTimeSlotToggle = (time: string) => {
    setSelectedTimeSlots(prev => 
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time].sort()
    )
  }

  const handleSelectAllTimeSlots = () => {
    setSelectedTimeSlots(timeSlots)
  }

  const handleClearAllTimeSlots = () => {
    setSelectedTimeSlots([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!startDate || !endDate || selectedDays.length === 0 || selectedTimeSlots.length === 0) {
      alert("Proszę wypełnić wszystkie wymagane pola")
      return
    }

    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      alert("Proszę wprowadzić poprawne daty")
      return
    }
    
    if (startDateObj > endDateObj) {
      alert("Data początkowa nie może być późniejsza niż data końcowa")
      return
    }

    onSave(
      startDate,
      endDate,
      selectedDays,
      selectedTimeSlots,
      isAvailable,
      parseInt(maxBookings)
    )
  }

  return (
    <form onSubmit={handleSubmit} className={isMobile ? "space-y-3" : "space-y-4"}>
      {/* Zakres dat */}
      <div className={`grid grid-cols-1 ${isMobile ? "" : "md:grid-cols-2"} gap-3`}>
        <div>
          <Label htmlFor="startDate" className="text-sm">Data od</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className={isMobile ? "h-10 text-sm" : "h-8 text-sm"}
          />
        </div>
        <div>
          <Label htmlFor="endDate" className="text-sm">Data do</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className={isMobile ? "h-10 text-sm" : "h-8 text-sm"}
          />
        </div>
      </div>

      {/* Dni tygodnia */}
      <div>
        <Label className="text-sm font-medium">Dni tygodnia</Label>
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-1 mt-1`}>
          {daysOfWeek.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={selectedDays.includes(day.value)}
                onCheckedChange={() => handleDayToggle(day.value)}
                className={isMobile ? "w-4 h-4" : "w-3 h-3"}
              />
              <Label 
                htmlFor={`day-${day.value}`}
                className={`${isMobile ? "text-sm" : "text-xs"} font-normal cursor-pointer`}
              >
                {day.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Godziny */}
      <div>
        <div className={`flex ${isMobile ? "flex-col gap-2" : "items-center justify-between"} mb-1`}>
          <Label className="text-sm font-medium">Godziny dostępności</Label>
          <div className={`flex gap-1 ${isMobile ? "w-full" : ""}`}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAllTimeSlots}
              className={`text-xs px-2 py-1 ${isMobile ? "h-8 flex-1" : "h-7"}`}
            >
              Wszystkie
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearAllTimeSlots}
              className={`text-xs px-2 py-1 ${isMobile ? "h-8 flex-1" : "h-7"}`}
            >
              Wyczyść
            </Button>
          </div>
        </div>
        <div className={`grid ${isMobile ? "grid-cols-3" : "grid-cols-4 sm:grid-cols-6 md:grid-cols-8"} gap-1 ${isMobile ? "max-h-40" : "max-h-32"} overflow-y-auto border rounded-md p-2`}>
          {timeSlots.map((time) => (
            <div key={time} className="flex items-center space-x-1">
              <Checkbox
                id={`time-${time}`}
                checked={selectedTimeSlots.includes(time)}
                onCheckedChange={() => handleTimeSlotToggle(time)}
                className={isMobile ? "w-4 h-4" : "w-3 h-3"}
              />
              <Label 
                htmlFor={`time-${time}`}
                className={`${isMobile ? "text-xs" : "text-xs"} cursor-pointer text-gray-700`}
              >
                {time}
              </Label>
            </div>
          ))}
        </div>
        {selectedTimeSlots.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Wybrano {selectedTimeSlots.length} godzin
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <Label htmlFor="isAvailable" className="text-sm">Status</Label>
        <Select value={isAvailable.toString()} onValueChange={(value) => setIsAvailable(value === "true")}>
          <SelectTrigger className={isMobile ? "h-10 text-sm" : "h-8 text-sm"}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Dostępne</SelectItem>
            <SelectItem value="false">Niedostępne</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Maksymalna liczba rezerwacji */}
      <div>
        <Label htmlFor="maxBookingsMulti" className="text-sm">Maksymalna liczba rezerwacji na slot</Label>
        <Input
          id="maxBookingsMulti"
          type="number"
          min="1"
          max="10"
          value={maxBookings}
          onChange={(e) => setMaxBookings(e.target.value)}
          className={isMobile ? "h-10 text-sm" : "h-8 text-sm"}
        />
      </div>

      {/* Podsumowanie */}
      {startDate && endDate && selectedDays.length > 0 && selectedTimeSlots.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="font-medium mb-1 text-sm">Podsumowanie:</h4>
          <ul className="text-xs space-y-0.5">
            <li>• Okres: {startDate && endDate ? `${formatDate(new Date(startDate))} - ${formatDate(new Date(endDate))}` : "Nie wybrano dat"}</li>
            <li>• Dni: {selectedDays.map(d => daysOfWeek[d].label).join(", ")}</li>
            <li>• Godziny: {selectedTimeSlots.length} slotów czasowych</li>
            <li>• Status: {isAvailable ? "Dostępne" : "Niedostępne"}</li>
          </ul>
        </div>
      )}

      {/* Przyciski */}
      <div className={`flex gap-3 ${isMobile ? "pt-3" : "pt-2"} sticky bottom-0 bg-white`}>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className={`flex-1 ${isMobile ? "h-10 text-sm" : ""}`}
        >
          Anuluj
        </Button>
        <Button 
          type="submit" 
          className={`flex-1 bg-pink-500 hover:bg-pink-600 ${isMobile ? "h-10 text-sm" : ""}`}
        >
          {isMobile ? "Ustaw" : "Ustaw dostępność"}
        </Button>
      </div>
    </form>
  )
}
