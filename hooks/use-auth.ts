"use client"

import { useState, useEffect } from "react"
import { authService, type AuthState } from "@/lib/auth"
import { emailService } from "@/lib/email-service"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isDemo: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Załaduj stan autoryzacji
    const currentState = authService.getAuthState()
    setAuthState(currentState)
    setIsLoading(false)
  }, [])

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    accountType: "patient" | "midwife"
    phone?: string
    dateOfBirth?: string
    licenseNumber?: string
    yearsOfExperience?: string
    qualifications?: string
    specializations?: string[]
    workLocation?: string
    bio?: string
  }) => {
    try {
      setIsLoading(true)
      const user = await authService.register(userData)

      // Wyślij email powitalny
      await emailService.sendWelcomeEmail(user.email, user.firstName, user.role)

      const newState = authService.getAuthState()
      setAuthState(newState)

      return user
    } catch (error) {
      console.error("Błąd rejestracji:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const user = await authService.login(email, password)
      const newState = authService.getAuthState()
      setAuthState(newState)
      return user
    } catch (error) {
      console.error("Błąd logowania:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const switchAccount = (accountType: "patient" | "midwife" | "guest") => {
    const user = authService.switchAccount(accountType)
    const newState = authService.getAuthState()
    setAuthState(newState)
    return user
  }

  const logout = () => {
    authService.logout()
    const newState = authService.getAuthState()
    setAuthState(newState)
  }

  return {
    ...authState,
    isLoading,
    register,
    login,
    logout,
    switchAccount,
    getUserDisplayName: () => authService.getUserDisplayName(),
    getUserInitials: () => authService.getUserInitials(),
    isPatient: () => authService.isPatient(),
    isMidwife: () => authService.isMidwife(),
    isGuest: () => authService.isGuest(),
    getDemoAccountType: () => authService.getDemoAccountType(),
    getAllRegisteredUsers: () => authService.getAllRegisteredUsers(),
  }
}
