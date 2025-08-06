"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Video, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { dataManager, type Appointment } from "@/lib/data-manager"

export function BookingFlowTest() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [testResults, setTestResults] = useState<
    {
      step: string
      status: "pending" | "success" | "error"
      message: string
    }[]
  >([])
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    loadAppointments()

    // Listen for appointment updates
    const handleAppointmentUpdate = (event: CustomEvent) => {
      console.log("Test component received appointment update:", event.detail)
      loadAppointments()
    }

    window.addEventListener("mymidwife:appointmentsUpdated", handleAppointmentUpdate as EventListener)

    return () => {
      window.removeEventListener("mymidwife:appointmentsUpdated", handleAppointmentUpdate as EventListener)
    }
  }, [])

  const loadAppointments = () => {
    try {
      const allAppointments = dataManager.getAppointments()
      setAppointments(allAppointments)
      console.log("Test: Loaded appointments:", allAppointments.length)
    } catch (error) {
      console.error("Test: Error loading appointments:", error)
    }
  }

  const runBookingFlowTest = async () => {
    setIsRunning(true)
    setTestResults([])

    const results: typeof testResults = []

    // Step 1: Test data manager initialization
    results.push({
      step: "1. Inicjalizacja data managera",
      status: "pending",
      message: "Sprawdzanie dostępności funkcji...",
    })
    setTestResults([...results])

    try {
      const generateId = dataManager.generateId()
      if (generateId) {
        results[0] = {
          step: "1. Inicjalizacja data managera",
          status: "success",
          message: `✅ Data manager działa poprawnie (ID: ${generateId.substring(0, 8)}...)`,
        }
      } else {
        throw new Error("generateId nie zwraca wartości")
      }
    } catch (error) {
      results[0] = {
        step: "1. Inicjalizacja data managera",
        status: "error",
        message: `❌ Błąd: ${error}`,
      }
    }
    setTestResults([...results])
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Step 2: Test appointment creation
    results.push({
      step: "2. Tworzenie nowej wizyty",
      status: "pending",
      message: "Dodawanie testowej wizyty...",
    })
    setTestResults([...results])

    try {
      const testAppointment: Appointment = {
        id: dataManager.generateId(),
        midwifeId: "test-midwife-1",
        midwifeName: "Anna Testowa",
        midwifeAvatar: "/images/pregnancy-support.png",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "14:30",
        type: "Test - Konsultacja prenatalna",
        location: "Warszawa, ul. Testowa 123",
        isOnline: false,
        status: "scheduled",
        notes: "Wizyta testowa utworzona przez system testowy",
      }

      const initialCount = dataManager.getAppointments().length
      dataManager.addAppointment(testAppointment)
      const finalCount = dataManager.getAppointments().length

      if (finalCount > initialCount) {
        results[1] = {
          step: "2. Tworzenie nowej wizyty",
          status: "success",
          message: `✅ Wizyta została dodana (${initialCount} → ${finalCount})`,
        }
      } else {
        throw new Error("Liczba wizyt nie zwiększyła się")
      }
    } catch (error) {
      results[1] = {
        step: "2. Tworzenie nowej wizyty",
        status: "error",
        message: `❌ Błąd: ${error}`,
      }
    }
    setTestResults([...results])
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Step 3: Test event dispatching
    results.push({
      step: "3. System powiadomień",
      status: "pending",
      message: "Sprawdzanie propagacji zdarzeń...",
    })
    setTestResults([...results])

    try {
      let eventReceived = false
      const eventHandler = () => {
        eventReceived = true
      }

      window.addEventListener("mymidwife:appointmentsUpdated", eventHandler as EventListener)

      // Create another appointment to trigger event
      const eventTestAppointment: Appointment = {
        id: dataManager.generateId(),
        midwifeId: "test-midwife-2",
        midwifeName: "Maria Eventowa",
        midwifeAvatar: "/images/pregnancy-support.png",
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "10:00",
        type: "Test - Wizyta kontrolna",
        location: "Online",
        isOnline: true,
        status: "scheduled",
        meetingLink: "https://meet.google.com/test-link",
        notes: "Wizyta testowa dla sprawdzenia zdarzeń",
      }

      dataManager.addAppointment(eventTestAppointment)

      // Wait for event
      await new Promise((resolve) => setTimeout(resolve, 500))

      window.removeEventListener("mymidwife:appointmentsUpdated", eventHandler as EventListener)

      if (eventReceived) {
        results[2] = {
          step: "3. System powiadomień",
          status: "success",
          message: "✅ Zdarzenia są poprawnie propagowane",
        }
      } else {
        throw new Error("Zdarzenie nie zostało odebrane")
      }
    } catch (error) {
      results[2] = {
        step: "3. System powiadomień",
        status: "error",
        message: `❌ Błąd: ${error}`,
      }
    }
    setTestResults([...results])
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Step 4: Test calendar integration
    results.push({
      step: "4. Integracja z kalendarzem",
      status: "pending",
      message: "Sprawdzanie widoczności w kalendarzu...",
    })
    setTestResults([...results])

    try {
      const allAppointments = dataManager.getAppointments()
      const upcomingAppointments = dataManager.getUpcomingAppointments()
      const testAppointments = allAppointments.filter(
        (apt) => apt.midwifeName.includes("Testowa") || apt.midwifeName.includes("Eventowa"),
      )

      if (testAppointments.length >= 2) {
        results[3] = {
          step: "4. Integracja z kalendarzem",
          status: "success",
          message: `✅ Wizyty widoczne w kalendarzu (${testAppointments.length} testowych, ${upcomingAppointments.length} nadchodzących)`,
        }
      } else {
        throw new Error(`Znaleziono tylko ${testAppointments.length} testowych wizyt`)
      }
    } catch (error) {
      results[3] = {
        step: "4. Integracja z kalendarzem",
        status: "error",
        message: `❌ Błąd: ${error}`,
      }
    }
    setTestResults([...results])
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Step 5: Test localStorage persistence
    results.push({
      step: "5. Trwałość danych",
      status: "pending",
      message: "Sprawdzanie zapisywania w localStorage...",
    })
    setTestResults([...results])

    try {
      const storedData = localStorage.getItem("mymidwife:appointments")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        const testAppointments = parsedData.filter(
          (apt: Appointment) => apt.midwifeName.includes("Testowa") || apt.midwifeName.includes("Eventowa"),
        )

        if (testAppointments.length >= 2) {
          results[4] = {
            step: "5. Trwałość danych",
            status: "success",
            message: `✅ Dane zapisane w localStorage (${testAppointments.length} testowych wizyt)`,
          }
        } else {
          throw new Error("Testowe wizyty nie zostały zapisane")
        }
      } else {
        throw new Error("Brak danych w localStorage")
      }
    } catch (error) {
      results[4] = {
        step: "5. Trwałość danych",
        status: "error",
        message: `❌ Błąd: ${error}`,
      }
    }
    setTestResults([...results])

    setIsRunning(false)
  }

  const clearTestData = () => {
    try {
      const allAppointments = dataManager.getAppointments()
      const nonTestAppointments = allAppointments.filter(
        (apt) => !apt.midwifeName.includes("Testowa") && !apt.midwifeName.includes("Eventowa"),
      )
      dataManager.saveAppointments(nonTestAppointments)
      setTestResults([])
      console.log("Test data cleared")
    } catch (error) {
      console.error("Error clearing test data:", error)
    }
  }

  const getStatusIcon = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "pending":
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Test przepływu rezerwacji wizyt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Ten test sprawdza kompletny przepływ rezerwacji wizyt od profilu położnej do integracji z kalendarzem.
            </p>

            <div className="flex gap-3">
              <Button onClick={runBookingFlowTest} disabled={isRunning} className="bg-pink-500 hover:bg-pink-600">
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testowanie...
                  </>
                ) : (
                  "Uruchom test"
                )}
              </Button>
              <Button variant="outline" onClick={clearTestData} disabled={isRunning}>
                Wyczyść dane testowe
              </Button>
              <Button variant="outline" onClick={loadAppointments}>
                Odśwież dane
              </Button>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="font-semibold">Wyniki testu:</h3>
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-medium">{result.step}</div>
                      <div className="text-sm text-gray-600">{result.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Appointments Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Aktualne wizyty ({appointments.length})</span>
            <Badge variant="outline">
              {appointments.filter((apt) => apt.status === "scheduled").length} zaplanowanych
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Brak wizyt w systemie</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{appointment.midwifeName}</h4>
                      {appointment.midwifeName.includes("Testowa") || appointment.midwifeName.includes("Eventowa") ? (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">TEST</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">DEMO</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(appointment.date).toLocaleDateString("pl-PL")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center gap-1">
                        {appointment.isOnline ? (
                          <>
                            <Video className="w-3 h-3" />
                            Online
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3 h-3" />
                            Wizyta
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      appointment.status === "scheduled"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {appointment.status === "scheduled"
                      ? "Zaplanowana"
                      : appointment.status === "completed"
                        ? "Zakończona"
                        : "Anulowana"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
