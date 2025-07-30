"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Stethoscope, Check } from "lucide-react"
import { GoogleLogin } from "@/components/auth/google-login"
import { RegisterForm } from "@/components/auth/register-form"
import { useAuth } from "@/hooks/use-auth"

export function AccountCreationForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isDemoLogin, setIsDemoLogin] = useState(false)

  const { switchAccount } = useAuth()

  // Nasłuchuj na otwarcie modala
  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true)
    window.addEventListener("openAccountModal", handleOpenModal)
    return () => window.removeEventListener("openAccountModal", handleOpenModal)
  }, [])

  const handleDemoLogin = async (accountType: "patient" | "midwife") => {
    setIsDemoLogin(true)

    try {
      // Symulacja demo logowania
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Przełącz na odpowiednie konto demo
      switchAccount(accountType)

      // Przekieruj do odpowiedniego dashboardu
      if (accountType === "patient") {
        window.location.href = "/demo/patient-dashboard"
      } else {
        window.location.href = "/demo/midwife-dashboard"
      }
    } catch (error) {
      console.error("Błąd demo logowania:", error)
      setIsDemoLogin(false)
    }
  }

  const handleGoogleSuccess = async (userData: any) => {
    try {
      console.log("✅ Google rejestracja zakończona:", userData)
      setSubmitSuccess(true)
    } catch (error) {
      console.error("❌ Błąd Google rejestracji:", error)
    }
  }

  const handleRegisterSuccess = () => {
    setSubmitSuccess(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSubmitSuccess(false)
  }

  if (submitSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Konto utworzone!</h2>
            <p className="text-gray-600 mb-6">
              Twoje konto zostało utworzone pomyślnie. Możesz teraz zacząć korzystać z platformy MyMidwife.
            </p>
            <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={handleClose}>
              Zamknij
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Utwórz konto</DialogTitle>
          <p className="text-gray-600 text-center">Dołącz do społeczności MyMidwife</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Demo konta */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Wypróbuj konta demo</h3>
            <p className="text-xs text-blue-700 mb-3">
              Przetestuj platformę bez rejestracji - sprawdź jak działa konto pacjentki lub położnej
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("patient")}
                disabled={isDemoLogin}
                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {isDemoLogin ? "Logowanie..." : "Demo Pacjentka"}
                <User className="w-4 h-4 ml-2" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("midwife")}
                disabled={isDemoLogin}
                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {isDemoLogin ? "Logowanie..." : "Demo Położna"}
                <Stethoscope className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Google rejestracja */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-semibold text-green-900 mb-2">Szybka rejestracja</h3>
            <p className="text-xs text-green-700 mb-3">Zarejestruj się szybko używając swojego konta Google</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={(error) => {
                console.error("Google registration error:", error)
              }}
              mode="register"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Lub utwórz nowe konto</span>
            </div>
          </div>

          {/* Formularz rejestracji */}
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
