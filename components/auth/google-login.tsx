"use client"

import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

interface GoogleLoginProps {
  onSuccess: (userData: any) => void
  onError: (error: any) => void
  mode?: "login" | "register"
}

export function GoogleLogin({ onSuccess, onError, mode = "login" }: GoogleLoginProps) {
  const handleGoogleLogin = async () => {
    try {
      // Symulacja logowania przez Google
      console.log("🔐 Symulacja logowania przez Google...")

      // Symuluj opóźnienie
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Symuluj dane użytkownika z Google
      const mockGoogleUser = {
        firstName: "Jan",
        lastName: "Kowalski",
        email: "jan.kowalski@gmail.com",
        accountType: "patient" as const,
        phone: "+48 123 456 789",
      }

      console.log("✅ Symulacja Google logowania zakończona:", mockGoogleUser)
      onSuccess(mockGoogleUser)
    } catch (error) {
      console.error("❌ Błąd symulacji Google logowania:", error)
      onError(error)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
    >
      <Chrome className="w-4 h-4 mr-2" />
      {mode === "register" ? "Zarejestruj się przez Google" : "Zaloguj się przez Google"}
    </Button>
  )
}
