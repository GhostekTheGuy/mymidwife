"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Download, Send, TrendingUp, Heart, Thermometer } from "lucide-react"

// Import date utilities at the top
import { formatDate, formatDateInput, addDays } from "@/lib/date-utils"

interface SymptomEntry {
  id: string
  date: string
  bloodPressure: { systolic: number; diastolic: number }
  weight: number
  mood: string
  energy: string
  symptoms: string[]
  notes: string
  temperature?: number
  heartRate?: number
}

export function SymptomDiary() {
  // Update entries to use real dates
  const [entries, setEntries] = useState<SymptomEntry[]>([
    {
      id: "1",
      date: formatDateInput(new Date()),
      bloodPressure: { systolic: 120, diastolic: 80 },
      weight: 68.5,
      mood: "good",
      energy: "high",
      symptoms: ["Nudności rano", "Zmęczenie"],
      notes: "Lepsze samopoczucie po śniadaniu",
      temperature: 36.6,
      heartRate: 72,
    },
    {
      id: "2",
      date: formatDateInput(addDays(new Date(), -1)),
      bloodPressure: { systolic: 118, diastolic: 78 },
      weight: 68.3,
      mood: "average",
      energy: "medium",
      symptoms: ["Zgaga", "Problemy ze snem"],
      notes: "Trudności z zasypianiem",
      temperature: 36.7,
      heartRate: 75,
    },
  ])

  // Update newEntry default date
  const [newEntry, setNewEntry] = useState<Partial<SymptomEntry>>({
    date: formatDateInput(new Date()),
    bloodPressure: { systolic: 0, diastolic: 0 },
    weight: 0,
    mood: "",
    energy: "",
    symptoms: [],
    notes: "",
    temperature: 0,
    heartRate: 0,
  })

  const [showAddForm, setShowAddForm] = useState(false)

  const commonSymptoms = [
    "Nudności",
    "Wymioty",
    "Zgaga",
    "Zmęczenie",
    "Problemy ze snem",
    "Bóle pleców",
    "Obrzęki",
    "Częste oddawanie moczu",
    "Zawroty głowy",
    "Skurcze",
    "Ruch dziecka",
    "Brak apetytu",
    "Zwiększony apetyt",
  ]

  const moodOptions = [
    { value: "excellent", label: "Doskonały", color: "bg-green-500" },
    { value: "good", label: "Dobry", color: "bg-green-400" },
    { value: "average", label: "Przeciętny", color: "bg-yellow-400" },
    { value: "poor", label: "Słaby", color: "bg-orange-400" },
    { value: "terrible", label: "Bardzo słaby", color: "bg-red-400" },
  ]

  const energyOptions = [
    { value: "high", label: "Wysoki", color: "bg-green-500" },
    { value: "medium", label: "Średni", color: "bg-yellow-400" },
    { value: "low", label: "Niski", color: "bg-red-400" },
  ]

  const handleSymptomToggle = (symptom: string) => {
    setNewEntry((prev) => ({
      ...prev,
      symptoms: prev.symptoms?.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...(prev.symptoms || []), symptom],
    }))
  }

  const handleAddEntry = () => {
    if (newEntry.date && newEntry.mood && newEntry.energy) {
      const entry: SymptomEntry = {
        id: Date.now().toString(),
        date: newEntry.date!,
        bloodPressure: newEntry.bloodPressure || { systolic: 0, diastolic: 0 },
        weight: newEntry.weight || 0,
        mood: newEntry.mood!,
        energy: newEntry.energy!,
        symptoms: newEntry.symptoms || [],
        notes: newEntry.notes || "",
        temperature: newEntry.temperature,
        heartRate: newEntry.heartRate,
      }

      setEntries((prev) => [entry, ...prev])
      setNewEntry({
        date: new Date().toISOString().split("T")[0],
        bloodPressure: { systolic: 0, diastolic: 0 },
        weight: 0,
        mood: "",
        energy: "",
        symptoms: [],
        notes: "",
        temperature: 0,
        heartRate: 0,
      })
      setShowAddForm(false)
    }
  }

  const generateReport = () => {
    // W rzeczywistej aplikacji generowałby PDF
    alert("Raport PDF zostanie wygenerowany i pobrany")
  }

  const sendToMidwife = () => {
    // W rzeczywistej aplikacji wysyłałby do położnej
    alert("Raport zostanie wysłany do Twojej położnej")
  }

  const getMoodColor = (mood: string) => {
    return moodOptions.find((option) => option.value === mood)?.color || "bg-gray-400"
  }

  const getEnergyColor = (energy: string) => {
    return energyOptions.find((option) => option.value === energy)?.color || "bg-gray-400"
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dzienniczek objawów</h1>
          <p className="text-gray-600">Śledź swoje samopoczucie i objawy</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={generateReport}>
            <Download className="w-4 h-4 mr-2" />
            Pobierz raport
          </Button>
          <Button variant="outline" onClick={sendToMidwife}>
            <Send className="w-4 h-4 mr-2" />
            Wyślij do położnej
          </Button>
          <Button onClick={() => setShowAddForm(true)} className="bg-pink-500 hover:bg-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            Dodaj wpis
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ostatnie ciśnienie</p>
                <p className="font-semibold">
                  {entries[0]?.bloodPressure.systolic}/{entries[0]?.bloodPressure.diastolic}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Waga</p>
                <p className="font-semibold">{entries[0]?.weight} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full ${getMoodColor(entries[0]?.mood)}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nastrój</p>
                <p className="font-semibold">
                  {moodOptions.find((option) => option.value === entries[0]?.mood)?.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Temperatura</p>
                <p className="font-semibold">{entries[0]?.temperature}°C</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dodaj nowy wpis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="weight">Waga (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newEntry.weight || ""}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, weight: Number.parseFloat(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Ciśnienie krwi</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Skurczowe"
                    type="number"
                    value={newEntry.bloodPressure?.systolic || ""}
                    onChange={(e) =>
                      setNewEntry((prev) => ({
                        ...prev,
                        bloodPressure: { ...prev.bloodPressure!, systolic: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                  <Input
                    placeholder="Rozkurczowe"
                    type="number"
                    value={newEntry.bloodPressure?.diastolic || ""}
                    onChange={(e) =>
                      setNewEntry((prev) => ({
                        ...prev,
                        bloodPressure: { ...prev.bloodPressure!, diastolic: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="temperature">Temperatura (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={newEntry.temperature || ""}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, temperature: Number.parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="heartRate">Tętno</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={newEntry.heartRate || ""}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, heartRate: Number.parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nastrój</Label>
                <Select
                  value={newEntry.mood}
                  onValueChange={(value) => setNewEntry((prev) => ({ ...prev, mood: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz nastrój" />
                  </SelectTrigger>
                  <SelectContent>
                    {moodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Poziom energii</Label>
                <Select
                  value={newEntry.energy}
                  onValueChange={(value) => setNewEntry((prev) => ({ ...prev, energy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz poziom energii" />
                  </SelectTrigger>
                  <SelectContent>
                    {energyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Objawy</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {commonSymptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={symptom}
                      checked={newEntry.symptoms?.includes(symptom) || false}
                      onChange={() => handleSymptomToggle(symptom)}
                      className="rounded"
                    />
                    <Label htmlFor={symptom} className="text-sm">
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Dodatkowe notatki</Label>
              <Textarea
                id="notes"
                placeholder="Opisz swoje samopoczucie, dodatkowe objawy..."
                value={newEntry.notes}
                onChange={(e) => setNewEntry((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddEntry} className="bg-pink-500 hover:bg-pink-600">
                Zapisz wpis
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Anuluj
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Historia wpisów</h2>
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  {/* Update the date display in entries list */}
                  <span className="font-semibold">
                    {formatDate(new Date(entry.date), {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getMoodColor(entry.mood)}`} />
                  <span className="text-sm text-gray-600">
                    {moodOptions.find((option) => option.value === entry.mood)?.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Ciśnienie</p>
                  <p className="font-medium">
                    {entry.bloodPressure.systolic}/{entry.bloodPressure.diastolic}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Waga</p>
                  <p className="font-medium">{entry.weight} kg</p>
                </div>
                {entry.temperature && (
                  <div>
                    <p className="text-sm text-gray-600">Temperatura</p>
                    <p className="font-medium">{entry.temperature}°C</p>
                  </div>
                )}
                {entry.heartRate && (
                  <div>
                    <p className="text-sm text-gray-600">Tętno</p>
                    <p className="font-medium">{entry.heartRate} bpm</p>
                  </div>
                )}
              </div>

              {entry.symptoms.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Objawy:</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.symptoms.map((symptom) => (
                      <Badge key={symptom} variant="secondary">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {entry.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notatki:</p>
                  <p className="text-gray-700">{entry.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
