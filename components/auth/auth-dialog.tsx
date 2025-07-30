"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Stethoscope, User, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface DemoInfoProps {
  onClose?: () => void
}

export function DemoInfo({ onClose }: DemoInfoProps) {
  const { switchAccount } = useAuth()

  const handleAccountSelect = (accountType: "patient" | "midwife" | "guest") => {
    switchAccount(accountType)
    onClose?.()
    window.location.reload()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-pink-600" />
        </div>
        <CardTitle className="text-xl font-semibold">Witaj w MyMidwife Demo</CardTitle>
        <CardDescription className="text-gray-600">
          Wybierz typ konta, aby eksplorować platformę z różnych perspektyw
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          onClick={() => handleAccountSelect("patient")}
          className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white"
        >
          <Heart className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Anna Kowalska - Pacjentka</div>
            <div className="text-xs opacity-90">Pełny dostęp do narzędzi pacjentki</div>
          </div>
        </Button>

        <Button
          onClick={() => handleAccountSelect("midwife")}
          variant="outline"
          className="w-full h-12 border-pink-200 hover:bg-pink-50"
        >
          <Stethoscope className="w-5 h-5 mr-3 text-pink-600" />
          <div className="text-left">
            <div className="font-medium">Maria Nowak - Położna</div>
            <div className="text-xs text-gray-500">Panel i narzędzia dla położnych</div>
          </div>
        </Button>

        <Button onClick={() => handleAccountSelect("guest")} variant="ghost" className="w-full h-12">
          <User className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Kontynuuj jako Gość</div>
            <div className="text-xs text-gray-500">Ograniczony dostęp do funkcji</div>
          </div>
        </Button>

        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">🎭 Wszystkie dane i funkcje są demonstracyjne</p>
        </div>
      </CardContent>
    </Card>
  )
}
