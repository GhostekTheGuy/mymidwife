"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, Heart, Stethoscope, UserCheck, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function DemoAccountSwitcher() {
  const { user, switchAccount, getDemoAccountType } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleAccountSwitch = (accountType: "patient" | "midwife" | "guest") => {
    switchAccount(accountType)
    setIsOpen(false)
    // Refresh the page to update all components
    window.location.reload()
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "patient":
        return <Heart className="w-4 h-4" />
      case "midwife":
        return <Stethoscope className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getAccountLabel = (type: string) => {
    switch (type) {
      case "patient":
        return "Pacjentka"
      case "midwife":
        return "Położna"
      default:
        return "Gość"
    }
  }

  const currentAccountType = getDemoAccountType

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 h-10 bg-transparent">
          {getAccountIcon(currentAccountType)}
          <span className="hidden sm:inline">{getAccountLabel(currentAccountType)}</span>
          <Badge variant="secondary" className="text-xs">
            DEMO
          </Badge>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Tryb demonstracyjny</p>
            <p className="text-xs text-muted-foreground">Wybierz typ konta do eksploracji</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleAccountSwitch("patient")}
          className={currentAccountType === "patient" ? "bg-pink-50" : ""}
        >
          <div className="flex items-center gap-3 w-full">
            <Heart className="w-4 h-4 text-pink-600" />
            <div className="flex-1">
              <div className="font-medium">Anna Kowalska</div>
              <div className="text-xs text-muted-foreground">Pacjentka</div>
            </div>
            {currentAccountType === "patient" && <UserCheck className="w-4 h-4 text-pink-600" />}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleAccountSwitch("midwife")}
          className={currentAccountType === "midwife" ? "bg-pink-50" : ""}
        >
          <div className="flex items-center gap-3 w-full">
            <Stethoscope className="w-4 h-4 text-pink-600" />
            <div className="flex-1">
              <div className="font-medium">Maria Nowak</div>
              <div className="text-xs text-muted-foreground">Położna</div>
            </div>
            {currentAccountType === "midwife" && <UserCheck className="w-4 h-4 text-pink-600" />}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleAccountSwitch("guest")}
          className={currentAccountType === "guest" ? "bg-pink-50" : ""}
        >
          <div className="flex items-center gap-3 w-full">
            <User className="w-4 h-4 text-gray-600" />
            <div className="flex-1">
              <div className="font-medium">Gość Demo</div>
              <div className="text-xs text-muted-foreground">Podstawowy dostęp</div>
            </div>
            {currentAccountType === "guest" && <UserCheck className="w-4 h-4 text-pink-600" />}
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="text-xs text-muted-foreground text-center">🎭 Wszystkie dane są demonstracyjne</div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
