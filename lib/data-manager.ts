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
    mood: "excellent" | "good" | "fair" | "poor" | "terrible"
    energy: "high" | "normal" | "low" | "very-low"
    nausea: "none" | "mild" | "moderate" | "severe"
    appetite: "excellent" | "good" | "poor" | "none"
    sleep: "excellent" | "good" | "fair" | "poor"
    pain: "none" | "mild" | "moderate" | "severe"
    weight?: number
    bloodPressure?: string
    temperature?: number
    notes?: string
  }
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

  const defaultConversations: Conversation[] = [
    {
      id: uuidv4(),
      midwifeId: "midwife-1",
      midwifeName: "Anna Kowalska",
      midwifeAvatar: "/placeholder.svg?height=32&width=32",
      unreadCount: 1,
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      midwifeId: "midwife-2",
      midwifeName: "Magdalena Nowak",
      midwifeAvatar: "/placeholder.svg?height=32&width=32",
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

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
    if (message.senderId !== "demo-patient") {
      conversations[convIndex].unreadCount += 1
    }
    saveConversations(conversations)
  }

  dispatchDataUpdate("messages", message)
}

function markMessagesAsRead(conversationId: string): void {
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
    {
      id: uuidv4(),
      date: new Date().toISOString().split("T")[0],
      symptoms: {
        mood: "good",
        energy: "normal",
        nausea: "mild",
        appetite: "good",
        sleep: "good",
        pain: "none",
        weight: 68.5,
        bloodPressure: "120/80",
        temperature: 36.6,
        notes: "Czuję się dobrze, lekkie nudności rano",
      },
      createdAt: new Date().toISOString(),
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
  getSymptomEntryForDate: getSymptomEntryForDate,
  getOrCreateConversation,
  generateId,
}
