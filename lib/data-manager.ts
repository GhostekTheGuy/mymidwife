/**
 * Simple local-storage–backed data layer for the demo-only application.
 * NOTE: This is intentionally lightweight – no external DB or auth service.
 */

import { v4 as uuidv4 } from "uuid"

function generateId(): string {
  return uuidv4()
}

export type DemoRole = "patient" | "midwife" | "guest"

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: {
    // Added address to match ProfileEditor
    street: string
    city: string
    postalCode: string
  }
  avatar?: string // data-URL or public URL
  pregnancy?: {
    // Changed to optional and added full structure
    isPregnant: boolean
    dueDate?: string
    currentWeek?: number
    babyName?: string
    complications?: string[]
  }
  medicalInfo?: {
    // Added medicalInfo to match ProfileEditor
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
  preferences?: {
    // Added preferences to match ProfileEditor
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
  role: DemoRole
}

export interface Appointment {
  id: string
  midwifeId: string
  midwifeName: string
  midwifeAvatar?: string
  date: string
  time: string
  type: string
  location: string
  isOnline: boolean
  status: "scheduled" | "completed" | "cancelled"
  meetingLink?: string
  notes?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  type: "text" | "image" | "file"
  attachments?: Attachment[]
  isRead: boolean
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export interface Conversation {
  id: string
  midwifeId: string
  midwifeName: string
  midwifeAvatar?: string
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

export interface SymptomEntry {
  id: string
  date: string
  symptoms: {
    category: string
    severity: number
    emoji: string
    label: string
  }[]
  mood: {
    level: number
    emoji: string
    label: string
  }
  medicalData: {
    weight?: number
    bloodPressure?: {
      systolic: number
      diastolic: number
    }
    temperature?: number
    heartRate?: number
  }
  notes: string
  createdAt: string
}

const STORAGE_KEY = "mymidwife:user-profile"
const APPOINTMENTS_KEY = "mymidwife:appointments"
const CONVERSATIONS_KEY = "mymidwife:conversations"
const MESSAGES_KEY = "mymidwife:messages"
const SYMPTOMS_KEY = "mymidwife:symptoms"

// Event dispatcher for real-time updates
function dispatchDataUpdate(type: "appointments" | "profile" | "messages" | "symptoms", data?: any) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(`mymidwife:${type}Updated`, { detail: data }))
  }
}

function read(): UserProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch {
    return null
  }
}

function write(profile: UserProfile) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  dispatchDataUpdate("profile", profile)
}

function getAppointments(): Appointment[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(APPOINTMENTS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  // Return default appointments
  const defaultAppointments: Appointment[] = [
    {
      id: uuidv4(),
      midwifeId: "midwife-1",
      midwifeName: "Anna Kowalska",
      midwifeAvatar: "/placeholder.svg?height=40&width=40",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "10:00",
      type: "Kontrola prenatalna",
      location: "Warszawa, ul. Marszałkowska 1",
      isOnline: false,
      status: "scheduled",
      notes: "Rutynowa kontrola",
    },
    {
      id: uuidv4(),
      midwifeId: "midwife-2",
      midwifeName: "Magdalena Nowak",
      midwifeAvatar: "/placeholder.svg?height=40&width=40",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "14:30",
      type: "Edukacja przedporodowa",
      location: "Online",
      isOnline: true,
      status: "scheduled",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      notes: "Sesja edukacyjna online",
    },
  ]

  saveAppointments(defaultAppointments)
  return defaultAppointments
}

function saveAppointments(appointments: Appointment[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments))
  dispatchDataUpdate("appointments", appointments)
}

function addAppointment(appointment: Appointment): void {
  const appointments = getAppointments()
  appointments.push(appointment)
  saveAppointments(appointments)
  console.log("Appointment added to data manager:", appointment)
}

function updateAppointment(id: string, updates: Partial<Appointment>): void {
  const appointments = getAppointments()
  const index = appointments.findIndex((apt) => apt.id === id)
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates }
    saveAppointments(appointments)
  }
}

function getUpcomingAppointments(): Appointment[] {
  const appointments = getAppointments()
  const now = new Date()
  return appointments
    .filter((apt) => new Date(apt.date) >= now && apt.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function getConversations(): Conversation[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(CONVERSATIONS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  // Najpierw tworzymy konwersacje
  const conv1Id = uuidv4()
  const conv2Id = uuidv4()
  const conv3Id = uuidv4()

  const defaultConversations: Conversation[] = [
    {
      id: conv1Id,
      midwifeId: "midwife-1",
      midwifeName: "Anna Kowalska",
      midwifeAvatar: "/placeholder.svg?height=32&width=32",
      unreadCount: 2,
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minut temu
    },
    {
      id: conv2Id,
      midwifeId: "midwife-2",
      midwifeName: "Magdalena Nowak",
      midwifeAvatar: "/placeholder.svg?height=32&width=32",
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 godziny temu
    },
    {
      id: conv3Id,
      midwifeId: "midwife-3",
      midwifeName: "Dr Katarzyna Wiśniewska",
      midwifeAvatar: "/placeholder.svg?height=32&width=32",
      unreadCount: 1,
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // wczoraj
    },
  ]

  // Tworzymy przykładowe wiadomości
  const defaultMessages: Message[] = [
    // Konwersacja z Anną Kowalską (najnowsza)
    {
      id: uuidv4(),
      conversationId: conv1Id,
      senderId: "demo-patient",
      senderName: "Ty",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Dzień dobry! Mam pytanie dotyczące badań prenaratalnych",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: "text",
      isRead: true,
    },
    {
      id: uuidv4(),
      conversationId: conv1Id,
      senderId: "midwife-1",
      senderName: "Anna Kowalska",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Dzień dobry! Oczywiście, chętnie odpowiem na Pani pytania. O które badania chodzi?",
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      type: "text",
      isRead: true,
    },
    {
      id: uuidv4(),
      conversationId: conv1Id,
      senderId: "demo-patient",
      senderName: "Ty",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Chodzi mi o USG morfologiczne. Kiedy najlepiej je wykonać?",
      timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      type: "text",
      isRead: true,
    },
    {
      id: uuidv4(),
      conversationId: conv1Id,
      senderId: "midwife-1",
      senderName: "Anna Kowalska",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "USG morfologiczne najlepiej wykonać między 18-22 tygodniem ciąży. To optymalne okno czasowe do oceny anatomii płodu. Czy może mi Pani powiedzieć, w którym tygodniu jest obecnie?",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      type: "text",
      isRead: false,
    },
    {
      id: uuidv4(),
      conversationId: conv1Id,
      senderId: "midwife-1",
      senderName: "Anna Kowalska",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Przesyłam również link do artykułu o badaniach prenatalnych, który może być pomocny 📖",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: "text",
      isRead: false,
    },

    // Konwersacja z Magdaleną Nowak 
    {
      id: uuidv4(),
      conversationId: conv2Id,
      senderId: "demo-patient",
      senderName: "Ty",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Dziękuję za wczorajszą sesję edukacyjną online! Było bardzo pouczające",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      type: "text",
      isRead: true,
    },
    {
      id: uuidv4(),
      conversationId: conv2Id,
      senderId: "midwife-2",
      senderName: "Magdalena Nowak",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Bardzo się cieszę, że sesja była pomocna! Jak idą ćwiczenia oddechowe, które omawiałyśmy?",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      type: "text",
      isRead: true,
    },
    {
      id: uuidv4(),
      conversationId: conv2Id,
      senderId: "demo-patient",
      senderName: "Ty",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Staram się ćwiczyć codziennie! Pomaga mi to się zrelaksować 😊",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      type: "text",
      isRead: true,
    },

    // Konwersacja z Dr Katarzyną Wiśniewską
    {
      id: uuidv4(),
      conversationId: conv3Id,
      senderId: "demo-patient",
      senderName: "Ty",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Dzień dobry Pani Doktor. Czy mogłabym umówić wizytę kontrolną?",
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      type: "text",
      isRead: true,
    },
    {
      id: uuidv4(),
      conversationId: conv3Id,
      senderId: "midwife-3",
      senderName: "Dr Katarzyna Wiśniewska",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Dzień dobry! Oczywiście. Mam wolny termin w piątek o 14:00 lub w poniedziałek o 10:30. Który termin by Pani odpowiadał?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: "text",
      isRead: false,
    },
  ]

  // Zapisujemy wiadomości
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(defaultMessages))

  // Aktualizujemy konwersacje z ostatnimi wiadomościami
  defaultConversations[0].lastMessage = defaultMessages.find(m => m.conversationId === conv1Id && m.timestamp === Math.max(...defaultMessages.filter(m => m.conversationId === conv1Id).map(m => new Date(m.timestamp).getTime())).toString())
  defaultConversations[1].lastMessage = defaultMessages.find(m => m.conversationId === conv2Id && m.timestamp === Math.max(...defaultMessages.filter(m => m.conversationId === conv2Id).map(m => new Date(m.timestamp).getTime())).toString())
  defaultConversations[2].lastMessage = defaultMessages.find(m => m.conversationId === conv3Id && m.timestamp === Math.max(...defaultMessages.filter(m => m.conversationId === conv3Id).map(m => new Date(m.timestamp).getTime())).toString())

  // Naprawiamy referencje do ostatnich wiadomości
  const conv1Messages = defaultMessages.filter(m => m.conversationId === conv1Id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  const conv2Messages = defaultMessages.filter(m => m.conversationId === conv2Id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  const conv3Messages = defaultMessages.filter(m => m.conversationId === conv3Id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  defaultConversations[0].lastMessage = conv1Messages[0]
  defaultConversations[1].lastMessage = conv2Messages[0]
  defaultConversations[2].lastMessage = conv3Messages[0]

  saveConversations(defaultConversations)
  return defaultConversations
}

function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
  dispatchDataUpdate("messages", conversations)
}

function getMessages(conversationId: string): Message[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(MESSAGES_KEY)
  const allMessages: Message[] = stored ? JSON.parse(stored) : []
  return allMessages.filter((msg) => msg.conversationId === conversationId)
}

function saveMessage(message: Message): void {
  if (typeof window === "undefined") return

  const stored = localStorage.getItem(MESSAGES_KEY)
  const messages: Message[] = stored ? JSON.parse(stored) : []
  messages.push(message)
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))

  // Update conversation
  const conversations = getConversations()
  const convIndex = conversations.findIndex((conv) => conv.id === message.conversationId)
  if (convIndex !== -1) {
    conversations[convIndex].lastMessage = message
    conversations[convIndex].updatedAt = message.timestamp
    
    // Tylko zwiększ licznik nieprzeczytanych jeśli wiadomość nie jest od użytkownika i nie jest przeczytana
    if (message.senderId !== "demo-patient" && !message.isRead) {
      conversations[convIndex].unreadCount += 1
    }
    saveConversations(conversations)
  }

  dispatchDataUpdate("messages", message)
}

function markMessagesAsRead(conversationId: string): void {
  // Aktualizuj wiadomości jako przeczytane w storage
  const stored = localStorage.getItem(MESSAGES_KEY)
  if (stored) {
    const messages: Message[] = JSON.parse(stored)
    let hasUpdates = false
    
    messages.forEach(message => {
      if (message.conversationId === conversationId && !message.isRead && message.senderId !== "demo-patient") {
        message.isRead = true
        hasUpdates = true
      }
    })
    
    if (hasUpdates) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
    }
  }

  // Aktualizuj licznik nieprzeczytanych w konwersacji
  const conversations = getConversations()
  const convIndex = conversations.findIndex((conv) => conv.id === conversationId)
  if (convIndex !== -1) {
    conversations[convIndex].unreadCount = 0
    saveConversations(conversations)
  }
}

function getTotalUnreadMessages(): number {
  const conversations = getConversations()
  return conversations.reduce((total, conv) => total + conv.unreadCount, 0)
}

function getSymptomEntries(): SymptomEntry[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(SYMPTOMS_KEY)
  if (stored) {
    return JSON.parse(stored).sort(
      (a: SymptomEntry, b: SymptomEntry) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }

  const defaultEntries: SymptomEntry[] = [
    // Dzisiejszy wpis
    {
      id: uuidv4(),
      date: new Date().toISOString().split("T")[0],
      symptoms: [
        { category: "Samopoczucie", severity: 2, emoji: "🙂", label: "Dobre" },
        { category: "Energia", severity: 3, emoji: "🪫", label: "Średnia energia" },
        { category: "Sen", severity: 2, emoji: "😌", label: "Dobry sen" },
      ],
      mood: { level: 2, emoji: "🙂", label: "Dobre" },
      medicalData: {
        weight: 68.5,
        bloodPressure: { systolic: 120, diastolic: 80 },
        temperature: 36.6,
        heartRate: 72
      },
      notes: "Czuję się dobrze, lekkie nudności rano",
      createdAt: new Date().toISOString(),
    },
    // Wczoraj
    {
      id: uuidv4(),
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      symptoms: [
        { category: "Samopoczucie", severity: 3, emoji: "😐", label: "Neutralne" },
        { category: "Energia", severity: 4, emoji: "😴", label: "Mała energia" },
        { category: "Sen", severity: 4, emoji: "😵", label: "Słaby sen" },
      ],
      mood: { level: 3, emoji: "😐", label: "Neutralne" },
      medicalData: {
        weight: 68.3,
        bloodPressure: { systolic: 118, diastolic: 78 },
        temperature: 36.7
      },
      notes: "Problemy z zasypianiem, zmęczenie",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    // 2 dni temu - brak wpisu (żeby pokazać rzeczywistą logi
    // 3 dni temu
    {
      id: uuidv4(),
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      symptoms: [
        { category: "Samopoczucie", severity: 1, emoji: "😊", label: "Bardzo dobre" },
        { category: "Energia", severity: 2, emoji: "🔋", label: "Dobra energia" },
        { category: "Sen", severity: 1, emoji: "😴", label: "Doskonały sen" },
      ],
      mood: { level: 1, emoji: "😊", label: "Bardzo dobre" },
      medicalData: {
        weight: 68.1,
        bloodPressure: { systolic: 115, diastolic: 75 },
        temperature: 36.5
      },
      notes: "Świetny dzień, dużo energii!",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  saveSymptomEntries(defaultEntries)
  return defaultEntries
}

function saveSymptomEntries(entries: SymptomEntry[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(SYMPTOMS_KEY, JSON.stringify(entries))
  dispatchDataUpdate("symptoms", entries)
}

function addSymptomEntry(entry: SymptomEntry): void {
  const entries = getSymptomEntries()
  // Remove existing entry for the same date
  const filteredEntries = entries.filter((e) => e.date !== entry.date)
  filteredEntries.push(entry)
  saveSymptomEntries(filteredEntries)
}

function updateSymptomEntry(updatedEntry: SymptomEntry): void {
  const entries = getSymptomEntries()
  const entryIndex = entries.findIndex((e) => e.id === updatedEntry.id)
  
  if (entryIndex !== -1) {
    entries[entryIndex] = updatedEntry
    saveSymptomEntries(entries)
  }
}

function getSymptomEntryForDate(date: string): SymptomEntry | null {
  const entries = getSymptomEntries()
  return entries.find((entry) => entry.date === date) || null
}

function getOrCreateConversation(midwifeId: string, midwifeName: string, midwifeAvatar?: string): Conversation {
  if (typeof window === "undefined") {
    // This should not happen in a client-side flow, but as a fallback:
    return {
      id: generateId(),
      midwifeId,
      midwifeName,
      midwifeAvatar,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    }
  }

  const conversations = getConversations()
  const conversation = conversations.find((c) => c.midwifeId === midwifeId)

  if (conversation) {
    return conversation
  }

  // If not found, create a new one
  const newConversation: Conversation = {
    id: generateId(),
    midwifeId,
    midwifeName,
    midwifeAvatar,
    unreadCount: 0,
    updatedAt: new Date().toISOString(),
  }

  conversations.push(newConversation)
  saveConversations(conversations)

  return newConversation
}

function clearDemoData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CONVERSATIONS_KEY)
  localStorage.removeItem(MESSAGES_KEY)
  localStorage.removeItem(APPOINTMENTS_KEY)
  localStorage.removeItem(SYMPTOMS_KEY)
  dispatchDataUpdate("messages", null)
  dispatchDataUpdate("appointments", null)
  dispatchDataUpdate("symptoms", null)
}

export const dataManager = {
  getUserProfile: read,
  setUserProfile: write,
  getAppointments: getAppointments,
  saveAppointments: saveAppointments,
  addAppointment: addAppointment,
  updateAppointment: updateAppointment,
  getUpcomingAppointments: getUpcomingAppointments,
  getConversations: getConversations,
  saveConversations: saveConversations,
  getMessages: getMessages,
  saveMessage: saveMessage,
  markMessagesAsRead: markMessagesAsRead,
  getTotalUnreadMessages: getTotalUnreadMessages,
  getSymptomEntries: getSymptomEntries,
  saveSymptomEntries: saveSymptomEntries,
  addSymptomEntry: addSymptomEntry,
  updateSymptomEntry: updateSymptomEntry,
  getSymptomEntryForDate: getSymptomEntryForDate,
  getOrCreateConversation,
  generateId,
  clearDemoData,
}
