"use client"

import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Stethoscope, Heart } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { dataManager, type UserProfile } from "@/lib/data-manager"

/**
 * NOTE:
 * 1. No next-auth here – authentication is handled by the custom demo system.
 * 2. We listen for the `profileUpdated` event so that all open tabs update the avatar / name.
 */

export function UserMenu() {
  const auth = useAuth() // demo auth hook
  const [profile, setProfile] = useState<UserProfile | null>(dataManager.getUserProfile())

  // keep local state in sync with storage updates
  useEffect(() => {
    const listener = () => setProfile(dataManager.getUserProfile())
    window.addEventListener("profileUpdated", listener)
    return () => window.removeEventListener("profileUpdated", listener)
  }, [])

  // Fallback to auth.user if data-manager has nothing yet
  const currentUser = profile ?? auth.user
  if (!currentUser) return null

  const getInitials = (firstName: string, lastName: string): string => {
    const first = firstName?.trim().charAt(0).toUpperCase() || ""
    const last = lastName?.trim().charAt(0).toUpperCase() || ""
    return first + last || "G"
  }

  const initials = getInitials(currentUser.firstName, currentUser.lastName)

  const demoIcon =
    currentUser.role === "patient" ? (
      <Heart className="h-3 w-3" />
    ) : currentUser.role === "midwife" ? (
      <Stethoscope className="h-3 w-3" />
    ) : (
      <User className="h-3 w-3" />
    )

  // logout just downgrades to demo guest and reloads
  const handleLogout = () => {
    auth.logout()
    window.location.reload()
  }

  // Always show avatar image if user has one
  const hasRealAvatar = currentUser.avatar

  // Określ odpowiedni link do dashboardu na podstawie roli
  const getDashboardLink = () => {
    if (currentUser.role === "midwife") {
      return "/demo/midwife-dashboard"
    }
    return "/dashboard"
  }

  const getDashboardLabel = () => {
    if (currentUser.role === "midwife") {
      return "Panel Położnej"
    }
    return "Panel Pacjentki"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Otwórz menu użytkownika"
        >
          <Avatar className="h-10 w-10">
            {hasRealAvatar && (
              <AvatarImage
                src={currentUser.avatar || "/images/midwife-consultation.png"}
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
              />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium leading-none">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <Badge variant="secondary" className="text-xs">
                DEMO
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{currentUser.email}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              {demoIcon}
              {currentUser.role === "patient" ? "Pacjentka" : currentUser.role === "midwife" ? "Położna" : "Gość"}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href={getDashboardLink()} className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{getDashboardLabel()}</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-orange-600 flex items-center gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>Przełącz na gościa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
