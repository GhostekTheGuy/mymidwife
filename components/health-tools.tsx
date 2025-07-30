"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Calendar, Bell, Activity } from "lucide-react"

// Import date utilities at the top
import {
  formatDate as formatDateUtil,
  addDays,
  calculatePregnancyWeek,
  calculateDueDate,
  formatDateInput,
} from "@/lib/date-utils"

export function HealthTools() {
  const [bmiData, setBmiData] = useState({ height: "", weight: "", result: null as number | null })
  const [cycleData, setCycleData] = useState({
    lastPeriod: "",
    cycleLength: "28",
    periodLength: "5",
  })
  // Update reminders to use real dates
  const [reminders, setReminders] = useState([
    { id: 1, type: "Cytologia", date: formatDateInput(addDays(new Date(), 30)), completed: false },
    { id: 2, type: "Badania krwi", date: formatDateInput(addDays(new Date(), -5)), completed: true },
    { id: 3, type: "Wizyta u ginekologa", date: formatDateInput(addDays(new Date(), 15)), completed: false },
    { id: 4, type: "USG", date: formatDateInput(addDays(new Date(), 5)), completed: false },
  ])

  const calculateBMI = () => {
    const height = Number.parseFloat(bmiData.height) / 100 // convert cm to m
    const weight = Number.parseFloat(bmiData.weight)

    if (height > 0 && weight > 0) {
      const bmi = weight / (height * height)
      setBmiData((prev) => ({ ...prev, result: Math.round(bmi * 10) / 10 }))
    }
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Niedowaga", color: "text-blue-600", bg: "bg-blue-100" }
    if (bmi < 25) return { category: "Prawidłowa waga", color: "text-green-600", bg: "bg-green-100" }
    if (bmi < 30) return { category: "Nadwaga", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { category: "Otyłość", color: "text-red-600", bg: "bg-red-100" }
  }

  const calculateCycle = () => {
    if (!cycleData.lastPeriod) return null

    const lastPeriod = new Date(cycleData.lastPeriod)
    const cycleLength = Number.parseInt(cycleData.cycleLength)

    const nextPeriod = new Date(lastPeriod)
    nextPeriod.setDate(lastPeriod.getDate() + cycleLength)

    const ovulation = new Date(lastPeriod)
    ovulation.setDate(lastPeriod.getDate() + Math.floor(cycleLength / 2))

    const fertileStart = new Date(ovulation)
    fertileStart.setDate(ovulation.getDate() - 5)

    const fertileEnd = new Date(ovulation)
    fertileEnd.setDate(ovulation.getDate() + 1)

    return {
      nextPeriod,
      ovulation,
      fertileStart,
      fertileEnd,
    }
  }

  const cycleInfo = calculateCycle()

  const toggleReminder = (id: number) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder)),
    )
  }

  // Update formatDate calls to use the imported function
  const formatDate = (date: Date) => {
    return formatDateUtil(date, {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getDaysUntil = (date: Date) => {
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Narzędzia zdrowotne</h1>
        <p className="text-gray-600">Kalkulatory i narzędzia do monitorowania zdrowia</p>
      </div>

      <Tabs defaultValue="bmi" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bmi">Kalkulator BMI</TabsTrigger>
          <TabsTrigger value="cycle">Cykl menstruacyjny</TabsTrigger>
          <TabsTrigger value="reminders">Przypomnienia</TabsTrigger>
          <TabsTrigger value="pregnancy">Kalkulator ciąży</TabsTrigger>
        </TabsList>

        <TabsContent value="bmi">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Kalkulator BMI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="height">Wzrost (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="np. 165"
                    value={bmiData.height}
                    onChange={(e) => setBmiData((prev) => ({ ...prev, height: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Waga (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="np. 60"
                    value={bmiData.weight}
                    onChange={(e) => setBmiData((prev) => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
                <Button onClick={calculateBMI} className="w-full bg-pink-500 hover:bg-pink-600">
                  Oblicz BMI
                </Button>
              </CardContent>
            </Card>

            {bmiData.result && (
              <Card>
                <CardHeader>
                  <CardTitle>Wynik BMI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-pink-600 mb-2">{bmiData.result}</div>
                    <Badge
                      className={`${getBMICategory(bmiData.result).bg} ${getBMICategory(bmiData.result).color} text-sm`}
                    >
                      {getBMICategory(bmiData.result).category}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Niedowaga:</strong> BMI poniżej 18.5
                    </p>
                    <p>
                      <strong>Prawidłowa waga:</strong> BMI 18.5-24.9
                    </p>
                    <p>
                      <strong>Nadwaga:</strong> BMI 25-29.9
                    </p>
                    <p>
                      <strong>Otyłość:</strong> BMI 30 i więcej
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Uwaga:</strong> BMI to tylko orientacyjny wskaźnik. Skonsultuj się z lekarzem lub położną
                      w sprawie swojej wagi.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="cycle">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Kalkulator cyklu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="lastPeriod">Data ostatniej miesiączki</Label>
                  <Input
                    id="lastPeriod"
                    type="date"
                    value={cycleData.lastPeriod}
                    onChange={(e) => setCycleData((prev) => ({ ...prev, lastPeriod: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cycleLength">Długość cyklu (dni)</Label>
                  <Input
                    id="cycleLength"
                    type="number"
                    value={cycleData.cycleLength}
                    onChange={(e) => setCycleData((prev) => ({ ...prev, cycleLength: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="periodLength">Długość miesiączki (dni)</Label>
                  <Input
                    id="periodLength"
                    type="number"
                    value={cycleData.periodLength}
                    onChange={(e) => setCycleData((prev) => ({ ...prev, periodLength: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {cycleInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Przewidywania cyklu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium">Następna miesiączka</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(cycleInfo.nextPeriod)}
                        <span className="ml-2 text-red-600">(za {getDaysUntil(cycleInfo.nextPeriod)} dni)</span>
                      </p>
                    </div>

                    <div className="p-3 bg-pink-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                        <span className="font-medium">Owulacja</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(cycleInfo.ovulation)}
                        <span className="ml-2 text-pink-600">(za {getDaysUntil(cycleInfo.ovulation)} dni)</span>
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Dni płodne</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(cycleInfo.fertileStart)} - {formatDate(cycleInfo.fertileEnd)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Uwaga:</strong> To są tylko przewidywania. Cykl może się różnić i zależeć od wielu
                      czynników.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Przypomnienia o badaniach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      reminder.completed
                        ? "bg-green-50 border-green-200"
                        : getDaysUntil(new Date(reminder.date)) < 0
                          ? "bg-red-50 border-red-200"
                          : getDaysUntil(new Date(reminder.date)) <= 7
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={reminder.completed}
                        onChange={() => toggleReminder(reminder.id)}
                        className="w-4 h-4 text-pink-600 rounded"
                      />
                      <div>
                        <h3 className={`font-medium ${reminder.completed ? "line-through text-gray-500" : ""}`}>
                          {reminder.type}
                        </h3>
                        <p className="text-sm text-gray-600">{formatDate(new Date(reminder.date))}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      {reminder.completed ? (
                        <Badge className="bg-green-100 text-green-800">Wykonane</Badge>
                      ) : getDaysUntil(new Date(reminder.date)) < 0 ? (
                        <Badge className="bg-red-100 text-red-800">Przeterminowane</Badge>
                      ) : getDaysUntil(new Date(reminder.date)) <= 7 ? (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Za {getDaysUntil(new Date(reminder.date))} dni
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Za {getDaysUntil(new Date(reminder.date))} dni</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Zalecane badania dla kobiet:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Cytologia - co 3 lata (18-65 lat)</li>
                  <li>• Badanie piersi - co miesiąc (samobadanie)</li>
                  <li>• Mammografia - co 2 lata (50-69 lat)</li>
                  <li>• Badania krwi - co rok</li>
                  <li>• Badanie ginekologiczne - co rok</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pregnancy">
          <PregnancyCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PregnancyCalculator() {
  const [lastPeriod, setLastPeriod] = useState("")
  const [pregnancyInfo, setPregnancyInfo] = useState<any>(null)

  // Update PregnancyCalculator to use real calculations
  const calculatePregnancy = () => {
    if (!lastPeriod) return

    const lmp = new Date(lastPeriod)
    const weeks = calculatePregnancyWeek(lmp)
    const days = Math.floor((new Date().getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24)) % 7
    const dueDate = calculateDueDate(lmp)
    const daysUntilDue = Math.floor((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    // Determine trimester
    let trimester = 1
    if (weeks >= 28) trimester = 3
    else if (weeks >= 14) trimester = 2

    setPregnancyInfo({
      weeks,
      days,
      dueDate,
      daysUntilDue,
      trimester,
      totalDays: weeks * 7 + days,
    })
  }

  const formatDate = (date: Date) => {
    return formatDateUtil(date, {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Kalkulator ciąży
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pregnancyLMP">Data ostatniej miesiączki</Label>
            <Input id="pregnancyLMP" type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
          </div>
          <Button onClick={calculatePregnancy} className="w-full bg-pink-500 hover:bg-pink-600">
            Oblicz
          </Button>
        </CardContent>
      </Card>

      {pregnancyInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Informacje o ciąży</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {pregnancyInfo.weeks} tygodni {pregnancyInfo.days} dni
              </div>
              <Badge className="bg-pink-100 text-pink-800">{pregnancyInfo.trimester} trymestr</Badge>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">Przewidywany termin porodu</div>
                <div className="text-blue-800">{formatDate(pregnancyInfo.dueDate)}</div>
                <div className="text-sm text-blue-600">Za {pregnancyInfo.daysUntilDue} dni</div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-900">Postęp ciąży</div>
                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(pregnancyInfo.totalDays / 280) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-green-600 mt-1">
                  {Math.round((pregnancyInfo.totalDays / 280) * 100)}% ukończone
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Uwaga:</strong> To są orientacyjne obliczenia. Dokładny termin porodu może się różnić o ±2
                tygodnie.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
