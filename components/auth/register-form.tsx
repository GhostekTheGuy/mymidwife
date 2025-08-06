"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Stethoscope, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [accountType, setAccountType] = useState<"patient" | "midwife">("patient")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Pacjentka
    dateOfBirth: "",
    // Położna
    licenseNumber: "",
    yearsOfExperience: "",
    qualifications: "",
    specializations: [] as string[],
    workLocation: "",
    bio: "",
    // Zgody
    agreeToTerms: false,
    agreeToPrivacy: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const specializations = [
    "Opieka prenatalna",
            "Poród prywatny",
    "Opieka poporodowa",
    "Edukacja przedporodowa ( szkoła rodzenia )",
    "Planowanie rodziny",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "Imię jest wymagane"
    if (!formData.lastName.trim()) newErrors.lastName = "Nazwisko jest wymagane"
    if (!formData.email.trim()) {
      newErrors.email = "Email jest wymagany"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Nieprawidłowy format email"
    }
    if (!formData.phone.trim()) newErrors.phone = "Telefon jest wymagany"
    if (!formData.password) {
      newErrors.password = "Hasło jest wymagane"
    } else if (formData.password.length < 8) {
      newErrors.password = "Hasło musi mieć co najmniej 8 znaków"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Hasła nie są identyczne"
    }

    if (accountType === "patient") {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Data urodzenia jest wymagana"
    }

    if (accountType === "midwife") {
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "Numer licencji jest wymagany"
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Doświadczenie jest wymagane"
      if (!formData.qualifications.trim()) newErrors.qualifications = "Kwalifikacje są wymagane"
      if (formData.specializations.length === 0) newErrors.specializations = "Wybierz co najmniej jedną specjalizację"
      if (!formData.workLocation.trim()) newErrors.workLocation = "Lokalizacja pracy jest wymagana"
      if (!formData.bio.trim()) newErrors.bio = "Opis jest wymagany"
    }

    if (!formData.agreeToTerms) newErrors.agreeToTerms = "Musisz zaakceptować regulamin"
    if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = "Musisz zaakceptować politykę prywatności"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await register({
        ...formData,
        accountType,
      })

      console.log("✅ Rejestracja zakończona pomyślnie")
      onSuccess?.()
    } catch (error: any) {
      console.error("❌ Błąd rejestracji:", error)
      setErrors({ general: error.message || "Wystąpił błąd podczas rejestracji" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      specializations: checked
        ? [...prev.specializations, specialization]
        : prev.specializations.filter((s) => s !== specialization),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{errors.general}</div>
      )}

      {/* Wybór typu konta */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Typ konta</Label>
        <RadioGroup
          value={accountType}
          onValueChange={(value: "patient" | "midwife") => setAccountType(value)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
            <RadioGroupItem value="patient" id="patient" />
            <Label htmlFor="patient" className="flex items-center cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Pacjentka
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
            <RadioGroupItem value="midwife" id="midwife" />
            <Label htmlFor="midwife" className="flex items-center cursor-pointer">
              <Stethoscope className="w-4 h-4 mr-2" />
              Położna
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Tabs value={accountType} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patient">Dane pacjentki</TabsTrigger>
          <TabsTrigger value="midwife">Dane położnej</TabsTrigger>
        </TabsList>

        <TabsContent value="patient" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Rejestracja pacjentki
              </CardTitle>
              <CardDescription>Wypełnij podstawowe informacje o sobie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Podstawowe dane */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Imię *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nazwisko *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data urodzenia *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>

              {/* Hasła */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Hasło *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Potwierdź hasło *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="midwife" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="w-5 h-5 mr-2" />
                Rejestracja położnej
              </CardTitle>
              <CardDescription>Wypełnij informacje zawodowe i osobiste</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Podstawowe dane */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Imię *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nazwisko *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Dane zawodowe */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Numer licencji PWZ *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                    className={errors.licenseNumber ? "border-red-500" : ""}
                  />
                  {errors.licenseNumber && <p className="text-sm text-red-600">{errors.licenseNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Lata doświadczenia *</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                    className={errors.yearsOfExperience ? "border-red-500" : ""}
                  />
                  {errors.yearsOfExperience && <p className="text-sm text-red-600">{errors.yearsOfExperience}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">Kwalifikacje *</Label>
                <Input
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => handleInputChange("qualifications", e.target.value)}
                  placeholder="np. Magister położnictwa, Certyfikat..."
                  className={errors.qualifications ? "border-red-500" : ""}
                />
                {errors.qualifications && <p className="text-sm text-red-600">{errors.qualifications}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="workLocation">Lokalizacja pracy *</Label>
                <Input
                  id="workLocation"
                  value={formData.workLocation}
                  onChange={(e) => handleInputChange("workLocation", e.target.value)}
                  placeholder="np. Warszawa, Kraków..."
                  className={errors.workLocation ? "border-red-500" : ""}
                />
                {errors.workLocation && <p className="text-sm text-red-600">{errors.workLocation}</p>}
              </div>

              <div className="space-y-2">
                <Label>Specjalizacje *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {specializations.map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <Checkbox
                        id={spec}
                        checked={formData.specializations.includes(spec)}
                        onCheckedChange={(checked) => handleSpecializationChange(spec, !!checked)}
                      />
                      <Label htmlFor={spec} className="text-sm cursor-pointer">
                        {spec}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.specializations && <p className="text-sm text-red-600">{errors.specializations}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Opis zawodowy *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Opisz swoje doświadczenie, podejście do pracy..."
                  className={errors.bio ? "border-red-500" : ""}
                  rows={4}
                />
                {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
              </div>

              {/* Hasła */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Hasło *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Potwierdź hasło *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Zgody */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleInputChange("agreeToTerms", !!checked)}
            className={errors.agreeToTerms ? "border-red-500" : ""}
          />
          <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
            Akceptuję{" "}
            <a href="#" className="text-pink-600 hover:underline">
              regulamin serwisu
            </a>{" "}
            *
          </Label>
        </div>
        {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToPrivacy"
            checked={formData.agreeToPrivacy}
            onCheckedChange={(checked) => handleInputChange("agreeToPrivacy", !!checked)}
            className={errors.agreeToPrivacy ? "border-red-500" : ""}
          />
          <Label htmlFor="agreeToPrivacy" className="text-sm cursor-pointer">
            Akceptuję{" "}
            <a href="#" className="text-pink-600 hover:underline">
              politykę prywatności
            </a>{" "}
            *
          </Label>
        </div>
        {errors.agreeToPrivacy && <p className="text-sm text-red-600">{errors.agreeToPrivacy}</p>}
      </div>

      <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isLoading}>
        {isLoading ? "Tworzenie konta..." : "Utwórz konto"}
      </Button>
    </form>
  )
}
