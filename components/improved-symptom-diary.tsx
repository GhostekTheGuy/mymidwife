"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  CalendarIcon,
  Heart,
  Zap,
  Moon,
  Utensils,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Scale,
  Gauge,
  Thermometer,
} from "lucide-react"
import { dataManager } from "@/lib/data-manager"

interface SymptomEntry {
  id: string
  date: string
  symptoms: {
    category: string
    severity: number
    emoji: string
    label: string
  }[]
  mood: {
    level: number
    emoji: string
    label: string
  }
  medicalData: {
    weight?: number
    bloodPressure?: {
      systolic: number
      diastolic: number
    }
    temperature?: number
    heartRate?: number
  }
  notes: string
  timestamp: Date
}

const SYMPTOM_CATEGORIES = [
  {
    category: "Samopoczucie",
    icon: Heart,
    color: "text-red-500",
    options: [
      { emoji: "😊", label: "Bardzo dobre", severity: 1 },
      { emoji: "🙂", label: "Dobre", severity: 2 },
      { emoji: "😐", label: "Neutralne", severity: 3 },
      { emoji: "😔", label: "Słabe", severity: 4 },
      { emoji: "😰", label: "Bardzo słabe", severity: 5 },
    ],
  },
  {
    category: "Energia",
    icon: Zap,
    color: "text-yellow-500",
    options: [
      { emoji: "⚡", label: "Pełna energii", severity: 1 },
      { emoji: "🔋", label: "Dobra energia", severity: 2 },
      { emoji: "🪫", label: "Średnia energia", severity: 3 },
      { emoji: "😴", label: "Mała energia", severity: 4 },
      { emoji: "💤", label: "Brak energii", severity: 5 },
    ],
  },
  {
    category: "Sen",
    icon: Moon,
    color: "text-blue-500",
    options: [
      { emoji: "😴", label: "Doskonały sen", severity: 1 },
      { emoji: "😌", label: "Dobry sen", severity: 2 },
      { emoji: "😐", label: "Średni sen", severity: 3 },
      { emoji: "😵", label: "Słaby sen", severity: 4 },
      { emoji: "🥱", label: "Bezsenność", severity: 5 },
    ],
  },
  {
    category: "Apetyt",
    icon: Utensils,
    color: "text-green-500",
    options: [
      { emoji: "🍽️", label: "Bardzo dobry", severity: 1 },
      { emoji: "😋", label: "Dobry", severity: 2 },
      { emoji: "😐", label: "Normalny", severity: 3 },
      { emoji: "😕", label: "Słaby", severity: 4 },
      { emoji: "🤢", label: "Brak apetytu", severity: 5 },
    ],
  },
  {
    category: "Nudności",
    icon: AlertCircle,
    color: "text-purple-500",
    options: [
      { emoji: "😊", label: "Brak", severity: 1 },
      { emoji: "😐", label: "Lekkie", severity: 2 },
      { emoji: "😕", label: "Umiarkowane", severity: 3 },
      { emoji: "🤢", label: "Silne", severity: 4 },
      { emoji: "🤮", label: "Bardzo silne", severity: 5 },
    ],
  },
  {
    category: "Ruch dziecka",
    icon: Activity,
    color: "text-pink-500",
    options: [
      { emoji: "🤸", label: "Bardzo aktywne", severity: 1 },
      { emoji: "🏃", label: "Aktywne", severity: 2 },
      { emoji: "🚶", label: "Umiarkowane", severity: 3 },
      { emoji: "😴", label: "Spokojne", severity: 4 },
      { emoji: "❓", label: "Brak ruchu", severity: 5 },
    ],
  },
]

const MOOD_OPTIONS = [
  { emoji: "😄", label: "Bardzo dobry", level: 5 },
  { emoji: "🙂", label: "Dobry", level: 4 },
  { emoji: "😐", label: "Neutralny", level: 3 },
  { emoji: "😔", label: "Słaby", level: 2 },
  { emoji: "😢", label: "Bardzo słaby", level: 1 },
]

// Predefiniowane wartości dla szybkiego wyboru
const WEIGHT_PRESETS = [55, 60, 65, 70, 75, 80, 85, 90]
const BP_PRESETS = [
  { systolic: 110, diastolic: 70, label: "Niskie" },
  { systolic: 120, diastolic: 80, label: "Normalne" },
  { systolic: 130, diastolic: 85, label: "Podwyższone" },
  { systolic: 140, diastolic: 90, label: "Wysokie" },
]

export function ImprovedSymptomDiary() {
  const [entries, setEntries] = useState<SymptomEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<Partial<SymptomEntry>>({
    symptoms: [],
    mood: { level: 3, emoji: "😐", label: "Neutralny" },
    medicalData: {},
    notes: "",
  })
  const [selectedWeek, setSelectedWeek] = useState(0)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = () => {
    const savedEntries = localStorage.getItem("symptom-diary-entries")
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
        medicalData: entry.medicalData || {},
      }))
      setEntries(parsed)
    }
  }

  const saveEntries = (newEntries: SymptomEntry[]) => {
    localStorage.setItem("symptom-diary-entries", JSON.stringify(newEntries))
    setEntries(newEntries)
  }

  const handleSymptomSelect = (category: string, option: any) => {
    setCurrentEntry((prev) => ({
      ...prev,
      symptoms: [
        ...(prev.symptoms || []).filter((s) => s.category !== category),
        {
          category,
          severity: option.severity,
          emoji: option.emoji,
          label: option.label,
        },
      ],
    }))
  }

  const handleMoodSelect = (mood: any) => {
    setCurrentEntry((prev) => ({
      ...prev,
      mood: {
        level: mood.level,
        emoji: mood.emoji,
        label: mood.label,
      },
    }))
  }

  const handleMedicalDataChange = (field: string, value: any) => {
    setCurrentEntry((prev) => ({
      ...prev,
      medicalData: {
        ...prev.medicalData,
        [field]: value,
      },
    }))
  }

  const handleWeightSliderChange = (value: number[]) => {
    handleMedicalDataChange("weight", value[0])
  }

  const handleWeightPresetSelect = (weight: number) => {
    handleMedicalDataChange("weight", weight)
  }

  const handleBloodPressurePresetSelect = (preset: { systolic: number; diastolic: number }) => {
    handleMedicalDataChange("bloodPressure", preset)
  }

  const handleBloodPressureChange = (type: "systolic" | "diastolic", value: string) => {
    const numValue = Number.parseInt(value) || 0
    setCurrentEntry((prev) => ({
      ...prev,
      medicalData: {
        ...prev.medicalData,
        bloodPressure: {
          ...prev.medicalData?.bloodPressure,
          [type]: numValue,
        },
      },
    }))
  }

  const handleSaveEntry = () => {
    if (!currentEntry.symptoms || currentEntry.symptoms.length === 0) return

    const newEntry: SymptomEntry = {
      id: dataManager.generateId(),
      date: selectedDate.toISOString().split("T")[0],
      symptoms: currentEntry.symptoms,
      mood: currentEntry.mood || { level: 3, emoji: "😐", label: "Neutralny" },
      medicalData: currentEntry.medicalData || {},
      notes: currentEntry.notes || "",
      timestamp: new Date(),
    }

    const updatedEntries = [...entries, newEntry]
    saveEntries(updatedEntries)

    // Reset form
    setCurrentEntry({
      symptoms: [],
      mood: { level: 3, emoji: "😐", label: "Neutralny" },
      medicalData: {},
      notes: "",
    })
    setShowAddEntry(false)
  }

  const getEntryForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return entries.find((entry) => entry.date === dateString)
  }

  const getWeekDates = (weekOffset = 0) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7) // Monday

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
    })
  }

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("pl-PL", { weekday: "short" })
  }

  const getAverageSymptomSeverity = (category: string, weekDates: Date[]) => {
    const relevantEntries = weekDates
      .map((date) => getEntryForDate(date))
      .filter((entry) => entry && entry.symptoms.some((s) => s.category === category))

    if (relevantEntries.length === 0) return 0

    const total = relevantEntries.reduce((sum, entry) => {
      const symptom = entry!.symptoms.find((s) => s.category === category)
      return sum + (symptom?.severity || 0)
    }, 0)

    return total / relevantEntries.length
  }

  const getLatestMedicalData = () => {
    const sortedEntries = entries
      .filter((entry) => entry.medicalData && Object.keys(entry.medicalData).length > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return sortedEntries[0]?.medicalData || {}
  }

  const weekDates = getWeekDates(selectedWeek)
  const isCurrentWeek = selectedWeek === 0
  const latestMedicalData = getLatestMedicalData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dziennik objawów</h2>
          <p className="text-gray-600">Śledź swoje samopoczucie i objawy</p>
        </div>
        <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj wpis
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nowy wpis - {formatDate(selectedDate)}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Medical Data Section */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-blue-600" />
                  Pomiary medyczne
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weight Section */}
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <Scale className="w-4 h-4 text-green-600" />
                      Waga: {currentEntry.medicalData?.weight ? `${currentEntry.medicalData.weight} kg` : "nie podano"}
                    </Label>

                    {/* Weight Slider */}
                    <div className="space-y-3">
                      <Slider
                        value={[currentEntry.medicalData?.weight || 70]}
                        onValueChange={handleWeightSliderChange}
                        max={120}
                        min={40}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>40 kg</span>
                        <span>120 kg</span>
                      </div>
                    </div>

                    {/* Weight Presets */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Szybki wybór:</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {WEIGHT_PRESETS.map((weight) => (
                          <Button
                            key={weight}
                            variant={currentEntry.medicalData?.weight === weight ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleWeightPresetSelect(weight)}
                            className="text-xs"
                          >
                            {weight} kg
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Manual Weight Input */}
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Wpisz dokładną wagę"
                        value={currentEntry.medicalData?.weight || ""}
                        onChange={(e) =>
                          handleMedicalDataChange("weight", Number.parseFloat(e.target.value) || undefined)
                        }
                        className="text-sm"
                      />
                      <span className="text-sm text-gray-500">kg</span>
                    </div>
                  </div>

                  {/* Blood Pressure Section */}
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <Heart className="w-4 h-4 text-red-600" />
                      Ciśnienie krwi:{" "}
                      {currentEntry.medicalData?.bloodPressure
                        ? `${currentEntry.medicalData.bloodPressure.systolic}/${currentEntry.medicalData.bloodPressure.diastolic}`
                        : "nie podano"}
                    </Label>

                    {/* Blood Pressure Presets */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Szybki wybór:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {BP_PRESETS.map((preset) => (
                          <Button
                            key={`${preset.systolic}-${preset.diastolic}`}
                            variant={
                              currentEntry.medicalData?.bloodPressure?.systolic === preset.systolic &&
                              currentEntry.medicalData?.bloodPressure?.diastolic === preset.diastolic
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleBloodPressurePresetSelect(preset)}
                            className="text-xs flex flex-col h-auto py-2"
                          >
                            <span className="font-medium">
                              {preset.systolic}/{preset.diastolic}
                            </span>
                            <span className="text-xs opacity-70">{preset.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Manual Blood Pressure Input */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Lub wpisz dokładnie:</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="120"
                          value={currentEntry.medicalData?.bloodPressure?.systolic || ""}
                          onChange={(e) => handleBloodPressureChange("systolic", e.target.value)}
                          className="w-20 text-sm"
                        />
                        <span className="text-gray-500">/</span>
                        <Input
                          type="number"
                          placeholder="80"
                          value={currentEntry.medicalData?.bloodPressure?.diastolic || ""}
                          onChange={(e) => handleBloodPressureChange("diastolic", e.target.value)}
                          className="w-20 text-sm"
                        />
                        <span className="text-sm text-gray-500">mmHg</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Medical Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  {/* Temperature */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-600" />
                      Temperatura (°C)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="36.6"
                      value={currentEntry.medicalData?.temperature || ""}
                      onChange={(e) =>
                        handleMedicalDataChange("temperature", Number.parseFloat(e.target.value) || undefined)
                      }
                    />
                  </div>

                  {/* Heart Rate */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      Tętno (bpm)
                    </Label>
                    <Input
                      type="number"
                      placeholder="72"
                      value={currentEntry.medicalData?.heartRate || ""}
                      onChange={(e) =>
                        handleMedicalDataChange("heartRate", Number.parseInt(e.target.value) || undefined)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Symptom Categories */}
              {SYMPTOM_CATEGORIES.map((category) => {
                const IconComponent = category.icon
                const selectedSymptom = currentEntry.symptoms?.find((s) => s.category === category.category)

                return (
                  <div key={category.category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-5 h-5 ${category.color}`} />
                      <h3 className="font-semibold">{category.category}</h3>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {category.options.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => handleSymptomSelect(category.category, option)}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            selectedSymptom?.emoji === option.emoji
                              ? "border-pink-500 bg-pink-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.emoji}</div>
                          <div className="text-xs font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Mood */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Nastrój
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {MOOD_OPTIONS.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => handleMoodSelect(mood)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        currentEntry.mood?.emoji === mood.emoji
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs font-medium">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h3 className="font-semibold">Dodatkowe notatki</h3>
                <Textarea
                  placeholder="Opisz jak się czujesz, co robiłaś dzisiaj..."
                  value={currentEntry.notes || ""}
                  onChange={(e) => setCurrentEntry((prev) => ({ ...prev, notes: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddEntry(false)}>
                  Anuluj
                </Button>
                <Button
                  onClick={handleSaveEntry}
                  disabled={!currentEntry.symptoms || currentEntry.symptoms.length === 0}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  Zapisz wpis
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Medical Data Summary */}
      {Object.keys(latestMedicalData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Ostatnie pomiary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latestMedicalData.weight && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Scale className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Waga</div>
                  <div className="text-lg font-semibold">{latestMedicalData.weight} kg</div>
                </div>
              )}

              {latestMedicalData.bloodPressure && (
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <Heart className="w-6 h-6 text-red-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Ciśnienie</div>
                  <div className="text-lg font-semibold">
                    {latestMedicalData.bloodPressure.systolic}/{latestMedicalData.bloodPressure.diastolic}
                  </div>
                </div>
              )}

              {latestMedicalData.temperature && (
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Thermometer className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Temperatura</div>
                  <div className="text-lg font-semibold">{latestMedicalData.temperature}°C</div>
                </div>
              )}

              {latestMedicalData.heartRate && (
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Tętno</div>
                  <div className="text-lg font-semibold">{latestMedicalData.heartRate} bpm</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Przegląd tygodnia
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedWeek((prev) => prev - 1)}>
                ← Poprzedni
              </Button>
              {selectedWeek !== 0 && (
                <Button variant="outline" size="sm" onClick={() => setSelectedWeek(0)}>
                  Bieżący tydzień
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek((prev) => prev + 1)}
                disabled={selectedWeek >= 0}
              >
                Następny →
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week Calendar */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {weekDates.map((date, index) => {
              const entry = getEntryForDate(date)
              const isToday = date.toDateString() === new Date().toDateString()
              const hasEntry = !!entry
              const hasMedicalData = entry?.medicalData && Object.keys(entry.medicalData).length > 0

              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedDate(date)
                    if (!hasEntry) {
                      setShowAddEntry(true)
                    }
                  }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                    isToday
                      ? "border-pink-500 bg-pink-50"
                      : hasEntry
                        ? "border-green-200 bg-green-50 hover:border-green-300"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-xs font-medium text-gray-600 mb-1">{formatDayName(date)}</div>
                  <div className="text-sm font-semibold mb-2">{date.getDate()}</div>

                  {hasEntry ? (
                    <div className="space-y-1">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-lg">{entry.mood.emoji}</div>
                      <div className="text-xs text-gray-600">{entry.symptoms.length} objawów</div>
                      {hasMedicalData && (
                        <div className="flex justify-center">
                          <Gauge className="w-3 h-3 text-blue-500" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-center">
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="text-xs text-gray-500">Dodaj wpis</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Weekly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SYMPTOM_CATEGORIES.slice(0, 3).map((category) => {
              const IconComponent = category.icon
              const avgSeverity = getAverageSymptomSeverity(category.category, weekDates)
              const entriesCount = weekDates.filter((date) => {
                const entry = getEntryForDate(date)
                return entry && entry.symptoms.some((s) => s.category === category.category)
              }).length

              return (
                <Card key={category.category} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className={`w-4 h-4 ${category.color}`} />
                    <h4 className="font-medium text-sm">{category.category}</h4>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{avgSeverity > 0 ? avgSeverity.toFixed(1) : "-"}</div>
                    <div className="text-xs text-gray-600">{entriesCount} z 7 dni</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${(entriesCount / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Ostatnie wpisy</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Brak wpisów w dzienniku</p>
              <p className="text-sm">Dodaj pierwszy wpis, aby rozpocząć śledzenie objawów</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((entry) => (
                  <div key={entry.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl mb-1">{entry.mood.emoji}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(entry.date).toLocaleDateString("pl-PL", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {entry.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {symptom.emoji} {symptom.category}: {symptom.label}
                          </Badge>
                        ))}
                      </div>

                      {/* Medical Data Display */}
                      {entry.medicalData && Object.keys(entry.medicalData).length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-2 text-xs text-gray-600">
                          {entry.medicalData.weight && (
                            <span className="flex items-center gap-1">
                              <Scale className="w-3 h-3" />
                              {entry.medicalData.weight} kg
                            </span>
                          )}
                          {entry.medicalData.bloodPressure && (
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {entry.medicalData.bloodPressure.systolic}/{entry.medicalData.bloodPressure.diastolic}
                            </span>
                          )}
                          {entry.medicalData.temperature && (
                            <span className="flex items-center gap-1">
                              <Thermometer className="w-3 h-3" />
                              {entry.medicalData.temperature}°C
                            </span>
                          )}
                          {entry.medicalData.heartRate && (
                            <span className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              {entry.medicalData.heartRate} bpm
                            </span>
                          )}
                        </div>
                      )}

                      {entry.notes && <p className="text-sm text-gray-600">{entry.notes}</p>}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {entry.timestamp.toLocaleTimeString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
