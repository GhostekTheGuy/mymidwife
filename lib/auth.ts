export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "patient" | "midwife"
  createdAt: string
  updatedAt: string
  isActive: boolean
  emailConfirmed: boolean
  lastLoginAt?: string
  isDemo: boolean
  profile?: {
    phone?: string
    dateOfBirth?: string
    bio?: string
    specializations?: string[]
    licenseNumber?: string
    yearsOfExperience?: number
    workLocation?: string
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isDemo: boolean
}

// Demo użytkownicy
const DEMO_USERS = {
  patient: {
    id: "demo-patient",
    email: "pacjentka@demo.mymidwife.pl",
    firstName: "Anna",
    lastName: "Kowalska",
    role: "patient" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    emailConfirmed: true,
    isDemo: true,
    profile: {
      phone: "+48 123 456 789",
      dateOfBirth: "1990-05-15",
    },
  },
  midwife: {
    id: "demo-midwife",
    email: "polozna@demo.mymidwife.pl",
    firstName: "Maria",
    lastName: "Nowak",
    role: "midwife" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    emailConfirmed: true,
    isDemo: true,
    profile: {
      phone: "+48 987 654 321",
      bio: "Doświadczona położna z 15-letnim stażem. Specjalizuję się w opiece prenatalnej i wsparciu podczas porodu naturalnego.",
      licenseNumber: "PWZ123456",
      yearsOfExperience: 15,
      workLocation: "Warszawa",
      specializations: [
        "Opieka prenatalna",
        "Asystowanie przy porodzie",
        "Opieka poporodowa",
        "Edukacja przedporodowa",
        "Wsparcie w karmieniu piersią",
      ],
    },
  },
  guest: {
    id: "demo-guest",
    email: "gosc@demo.mymidwife.pl",
    firstName: "Gość",
    lastName: "Demo",
    role: "patient" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    emailConfirmed: true,
    isDemo: true,
    profile: {
      phone: "+48 000 000 000",
    },
  },
}

class AuthService {
  private user: User | null = null
  private token: string | null = null
  private registeredUsers: User[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage()
      // Auto-login jako gość jeśli brak użytkownika
      if (!this.user) {
        this.loginAsGuest()
      }
    }
  }

  private loadFromStorage() {
    try {
      const storedUser = localStorage.getItem("mymidwife_user")
      const storedToken = localStorage.getItem("mymidwife_token")
      const storedRegisteredUsers = localStorage.getItem("mymidwife_registered_users")

      if (storedUser && storedToken) {
        this.user = JSON.parse(storedUser)
        this.token = storedToken
      }

      if (storedRegisteredUsers) {
        this.registeredUsers = JSON.parse(storedRegisteredUsers)
      }
    } catch (error) {
      console.error("Błąd ładowania danych z localStorage:", error)
      this.clearStorage()
    }
  }

  private saveToStorage() {
    if (this.user && this.token) {
      localStorage.setItem("mymidwife_user", JSON.stringify(this.user))
      localStorage.setItem("mymidwife_token", this.token)
    }
    localStorage.setItem("mymidwife_registered_users", JSON.stringify(this.registeredUsers))
  }

  private clearStorage() {
    localStorage.removeItem("mymidwife_user")
    localStorage.removeItem("mymidwife_token")
    this.user = null
    this.token = null
  }

  // Rejestracja nowego użytkownika
  async register(userData: {
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
  }): Promise<User> {
    // Sprawdź czy email już istnieje
    const existingUser = this.registeredUsers.find((user) => user.email === userData.email)
    if (existingUser) {
      throw new Error("Użytkownik z tym adresem email już istnieje")
    }

    // Utwórz nowego użytkownika
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.accountType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      emailConfirmed: true,
      isDemo: false,
      profile: {
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        bio: userData.bio,
        licenseNumber: userData.licenseNumber,
        yearsOfExperience: userData.yearsOfExperience ? Number.parseInt(userData.yearsOfExperience) : undefined,
        workLocation: userData.workLocation,
        specializations: userData.specializations,
      },
    }

    // Dodaj do listy zarejestrowanych użytkowników
    this.registeredUsers.push(newUser)

    // Zaloguj automatycznie
    this.user = newUser
    this.token = `token-${newUser.id}`

    this.saveToStorage()

    console.log("✅ Nowy użytkownik zarejestrowany:", newUser)

    return newUser
  }

  // Logowanie
  async login(email: string, password: string): Promise<User> {
    const user = this.registeredUsers.find((u) => u.email === email)
    if (!user) {
      throw new Error("Nieprawidłowy email lub hasło")
    }

    this.user = user
    this.token = `token-${user.id}`
    this.user.lastLoginAt = new Date().toISOString()

    this.saveToStorage()

    console.log("✅ Użytkownik zalogowany:", user)

    return user
  }

  isAuthenticated(): boolean {
    return !!(this.user && this.token)
  }

  getCurrentUser(): User | null {
    return this.user
  }

  getAuthState(): AuthState {
    return {
      user: this.user,
      isAuthenticated: this.isAuthenticated(),
      isDemo: this.user?.isDemo || false,
    }
  }

  // Login jako demo pacjentka
  loginAsPatient(): User {
    this.user = DEMO_USERS.patient
    this.token = "demo-patient-token"
    this.saveToStorage()
    return this.user
  }

  // Login jako demo położna
  loginAsMidwife(): User {
    this.user = DEMO_USERS.midwife
    this.token = "demo-midwife-token"
    this.saveToStorage()
    return this.user
  }

  // Login jako gość
  loginAsGuest(): User {
    this.user = DEMO_USERS.guest
    this.token = "demo-guest-token"
    this.saveToStorage()
    return this.user
  }

  // Przełączanie między kontami demo
  switchAccount(accountType: "patient" | "midwife" | "guest"): User {
    switch (accountType) {
      case "patient":
        return this.loginAsPatient()
      case "midwife":
        return this.loginAsMidwife()
      case "guest":
        return this.loginAsGuest()
      default:
        return this.loginAsGuest()
    }
  }

  logout(): void {
    // W trybie demo, wylogowanie przełącza na gościa
    if (this.user?.isDemo) {
      this.loginAsGuest()
    } else {
      this.clearStorage()
      this.loginAsGuest()
    }
  }

  // Metody pomocnicze
  getUserDisplayName(): string {
    if (!this.user) return "Gość"
    return `${this.user.firstName} ${this.user.lastName}`
  }

  getUserInitials(): string {
    if (!this.user) return "G"
    const firstName = this.user.firstName?.trim() || ""
    const lastName = this.user.lastName?.trim() || ""
    const firstInitial = firstName.charAt(0).toUpperCase()
    const lastInitial = lastName.charAt(0).toUpperCase()
    return firstInitial + lastInitial || "U"
  }

  isPatient(): boolean {
    return this.user?.role === "patient"
  }

  isMidwife(): boolean {
    return this.user?.role === "midwife"
  }

  isGuest(): boolean {
    return this.user?.id === "demo-guest"
  }

  getDemoAccountType(): "patient" | "midwife" | "guest" {
    if (!this.user) return "guest"
    if (this.user.id === "demo-patient") return "patient"
    if (this.user.id === "demo-midwife") return "midwife"
    return "guest"
  }

  // Pobierz wszystkich zarejestrowanych użytkowników (do celów deweloperskich)
  getAllRegisteredUsers(): User[] {
    return this.registeredUsers
  }
}

export const authService = new AuthService()
