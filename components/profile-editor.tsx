"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  MapPin,
  Baby,
  Heart,
  Camera,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: {
    street: string
    city: string
    postalCode: string
  }
  avatar: string
  pregnancy: {
    isPregnant: boolean
    dueDate?: string
    currentWeek?: number
    babyName?: string
    complications?: string[]
  }
  medicalInfo: {
    bloodType: string
    allergies: string[]
    medications: string[]
    conditions: string[]
    emergencyContact: {
      name: string
      phone: string
      relation: string
    }
  }
  preferences: {
    notifications: {
      appointments: boolean
      reminders: boolean
      educational: boolean
    }
    privacy: {
      shareWithMidwives: boolean
      shareProgress: boolean
    }
  }
}

export function ProfileEditor() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("personal")

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = () => {
    const savedProfile = localStorage.getItem("user-profile")
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(parsed)
      setEditedProfile(parsed)
    } else {
      // Default profile
      const defaultProfile: UserProfile = {
        id: "user-1",
        firstName: "Anna",
        lastName: "Kowalska",
        email: "anna.kowalska@example.com",
        phone: "+48 123 456 789",
        dateOfBirth: "1990-05-15",
        address: {
          street: "ul. Przykładowa 123",
          city: "Warszawa",
          postalCode: "00-001",
        },
        avatar: "/images/midwife-consultation.png",
        pregnancy: {
          isPregnant: true,
          dueDate: "2024-08-15",
          currentWeek: 24,
          babyName: "Zosia",
          complications: [],
        },
        medicalInfo: {
          bloodType: "A+",
          allergies: ["Penicylina"],
          medications: ["Kwas foliowy", "Witaminy prenatalne"],
          conditions: [],
          emergencyContact: {
            name: "Jan Kowalski",
            phone: "+48 987 654 321",
            relation: "Mąż",
          },
        },
        preferences: {
          notifications: {
            appointments: true,
            reminders: true,
            educational: true,
          },
          privacy: {
            shareWithMidwives: true,
            shareProgress: true,
          },
        },
      }
      setProfile(defaultProfile)
      setEditedProfile(defaultProfile)
      saveProfile(defaultProfile)
    }
  }

  const saveProfile = (profileToSave: UserProfile) => {
    localStorage.setItem("user-profile", JSON.stringify(profileToSave))

    // Dispatch event for other components
    window.dispatchEvent(
      new CustomEvent("profileUpdated", {
        detail: profileToSave,
      }),
    )
  }

  const handleSave = async () => {
    if (!editedProfile) return

    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setProfile(editedProfile)
    saveProfile(editedProfile)
    setIsEditing(false)
    setIsSaving(false)
    setSaveSuccess(true)

    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const updateProfile = (path: string, value: any) => {
    if (!editedProfile) return

    const keys = path.split(".")
    const updated = { ...editedProfile }
    let current: any = updated

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    setEditedProfile(updated)
  }

  const addArrayItem = (path: string, item: string) => {
    if (!editedProfile || !item.trim()) return

    const keys = path.split(".")
    let current: any = editedProfile

    for (const key of keys) {
      current = current[key]
    }

    if (Array.isArray(current) && !current.includes(item.trim())) {
      updateProfile(path, [...current, item.trim()])
    }
  }

  const removeArrayItem = (path: string, index: number) => {
    if (!editedProfile) return

    const keys = path.split(".")
    let current: any = editedProfile

    for (const key of keys) {
      current = current[key]
    }

    if (Array.isArray(current)) {
      updateProfile(
        path,
        current.filter((_, i) => i !== index),
      )
    }
  }

  const calculatePregnancyWeek = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    return Math.max(1, 40 - diffWeeks)
  }

  if (!profile || !editedProfile) {
    return <div>Ładowanie profilu...</div>
  }

  const sections = [
    { id: "personal", label: "Dane osobowe", icon: User },
    { id: "pregnancy", label: "Ciąża", icon: Baby },
    { id: "medical", label: "Informacje medyczne", icon: Heart },
    { id: "preferences", label: "Preferencje", icon: Edit3 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mój profil</h2>
          <p className="text-gray-600">Zarządzaj swoimi danymi osobowymi i preferencjami</p>
        </div>
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Zapisano!</span>
            </div>
          )}
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Anuluj
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Zapisywanie..." : "Zapisz"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edytuj profil
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Sekcje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map((section) => {
              const IconComponent = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    activeSection === section.id
                      ? "bg-pink-50 text-pink-600 border border-pink-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{section.label}</span>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal Information */}
          {activeSection === "personal" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Dane osobowe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={editedProfile.avatar || "/images/midwife-consultation.png"} />
                    <AvatarFallback>
                      {editedProfile.firstName[0]}
                      {editedProfile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Zmień zdjęcie
                    </Button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      value={editedProfile.firstName}
                      onChange={(e) => updateProfile("firstName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      value={editedProfile.lastName}
                      onChange={(e) => updateProfile("lastName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => updateProfile("email", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={editedProfile.phone}
                      onChange={(e) => updateProfile("phone", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Data urodzenia</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editedProfile.dateOfBirth}
                      onChange={(e) => updateProfile("dateOfBirth", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Adres
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Ulica</Label>
                      <Input
                        id="street"
                        value={editedProfile.address.street}
                        onChange={(e) => updateProfile("address.street", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Miasto</Label>
                      <Input
                        id="city"
                        value={editedProfile.address.city}
                        onChange={(e) => updateProfile("address.city", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Kod pocztowy</Label>
                      <Input
                        id="postalCode"
                        value={editedProfile.address.postalCode}
                        onChange={(e) => updateProfile("address.postalCode", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pregnancy Information */}
          {activeSection === "pregnancy" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-5 h-5" />
                  Informacje o ciąży
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {editedProfile.pregnancy.isPregnant ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dueDate">Przewidywany termin porodu</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={editedProfile.pregnancy.dueDate || ""}
                          onChange={(e) => {
                            updateProfile("pregnancy.dueDate", e.target.value)
                            updateProfile("pregnancy.currentWeek", calculatePregnancyWeek(e.target.value))
                          }}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentWeek">Aktualny tydzień ciąży</Label>
                        <Input
                          id="currentWeek"
                          type="number"
                          min="1"
                          max="42"
                          value={editedProfile.pregnancy.currentWeek || ""}
                          onChange={(e) => updateProfile("pregnancy.currentWeek", Number.parseInt(e.target.value))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="babyName">Imię dziecka (opcjonalne)</Label>
                        <Input
                          id="babyName"
                          value={editedProfile.pregnancy.babyName || ""}
                          onChange={(e) => updateProfile("pregnancy.babyName", e.target.value)}
                          disabled={!isEditing}
                          placeholder="Np. Zosia"
                        />
                      </div>
                    </div>

                    {/* Pregnancy Progress */}
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Postęp ciąży</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Tydzień {editedProfile.pregnancy.currentWeek}</span>
                            <span>{Math.round(((editedProfile.pregnancy.currentWeek || 0) / 40) * 100)}%</span>
                          </div>
                          <div className="w-full bg-pink-200 rounded-full h-2">
                            <div
                              className="bg-pink-500 h-2 rounded-full transition-all"
                              style={{ width: `${((editedProfile.pregnancy.currentWeek || 0) / 40) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-2xl">👶</div>
                      </div>
                    </div>

                    {/* Complications */}
                    <div className="space-y-3">
                      <Label>Powikłania lub uwagi</Label>
                      <div className="space-y-2">
                        {editedProfile.pregnancy.complications?.map((complication, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="outline" className="flex-1">
                              {complication}
                            </Badge>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem("pregnancy.complications", index)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Dodaj powikłanie lub uwagę"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  addArrayItem("pregnancy.complications", e.currentTarget.value)
                                  e.currentTarget.value = ""
                                }
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                addArrayItem("pregnancy.complications", input.value)
                                input.value = ""
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Baby className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Nie jesteś obecnie w ciąży</p>
                    {isEditing && (
                      <Button className="mt-4" onClick={() => updateProfile("pregnancy.isPregnant", true)}>
                        Oznacz jako ciężarna
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Medical Information */}
          {activeSection === "medical" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Informacje medyczne
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Blood Type */}
                <div>
                  <Label htmlFor="bloodType">Grupa krwi</Label>
                  <Select
                    value={editedProfile.medicalInfo.bloodType}
                    onValueChange={(value) => updateProfile("medicalInfo.bloodType", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Allergies */}
                <div className="space-y-3">
                  <Label>Alergie</Label>
                  <div className="space-y-2">
                    {editedProfile.medicalInfo.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="flex-1 bg-red-50 text-red-700 border-red-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {allergy}
                        </Badge>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem("medicalInfo.allergies", index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Dodaj alergię"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addArrayItem("medicalInfo.allergies", e.currentTarget.value)
                              e.currentTarget.value = ""
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            addArrayItem("medicalInfo.allergies", input.value)
                            input.value = ""
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Medications */}
                <div className="space-y-3">
                  <Label>Przyjmowane leki</Label>
                  <div className="space-y-2">
                    {editedProfile.medicalInfo.medications.map((medication, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="flex-1">
                          {medication}
                        </Badge>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem("medicalInfo.medications", index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Dodaj lek"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addArrayItem("medicalInfo.medications", e.currentTarget.value)
                              e.currentTarget.value = ""
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            addArrayItem("medicalInfo.medications", input.value)
                            input.value = ""
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Kontakt awaryjny</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="emergencyName">Imię i nazwisko</Label>
                      <Input
                        id="emergencyName"
                        value={editedProfile.medicalInfo.emergencyContact.name}
                        onChange={(e) => updateProfile("medicalInfo.emergencyContact.name", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Telefon</Label>
                      <Input
                        id="emergencyPhone"
                        value={editedProfile.medicalInfo.emergencyContact.phone}
                        onChange={(e) => updateProfile("medicalInfo.emergencyContact.phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyRelation">Relacja</Label>
                      <Input
                        id="emergencyRelation"
                        value={editedProfile.medicalInfo.emergencyContact.relation}
                        onChange={(e) => updateProfile("medicalInfo.emergencyContact.relation", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Np. Mąż, Matka"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences */}
          {activeSection === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Preferencje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Powiadomienia</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Przypomnienia o wizytach</Label>
                        <p className="text-sm text-gray-600">Otrzymuj powiadomienia o nadchodzących wizytach</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={editedProfile.preferences.notifications.appointments}
                        onChange={(e) => updateProfile("preferences.notifications.appointments", e.target.checked)}
                        disabled={!isEditing}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Przypomnienia o lekach</Label>
                        <p className="text-sm text-gray-600">Przypomnienia o przyjmowaniu leków i witamin</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={editedProfile.preferences.notifications.reminders}
                        onChange={(e) => updateProfile("preferences.notifications.reminders", e.target.checked)}
                        disabled={!isEditing}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Treści edukacyjne</Label>
                        <p className="text-sm text-gray-600">Otrzymuj artykuły i porady związane z ciążą</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={editedProfile.preferences.notifications.educational}
                        onChange={(e) => updateProfile("preferences.notifications.educational", e.target.checked)}
                        disabled={!isEditing}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Prywatność</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Udostępnianie danych położnym</Label>
                        <p className="text-sm text-gray-600">Pozwól położnym na dostęp do Twoich danych medycznych</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={editedProfile.preferences.privacy.shareWithMidwives}
                        onChange={(e) => updateProfile("preferences.privacy.shareWithMidwives", e.target.checked)}
                        disabled={!isEditing}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Udostępnianie postępów ciąży</Label>
                        <p className="text-sm text-gray-600">Pozwól na udostępnianie informacji o postępach ciąży</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={editedProfile.preferences.privacy.shareProgress}
                        onChange={(e) => updateProfile("preferences.privacy.shareProgress", e.target.checked)}
                        disabled={!isEditing}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
