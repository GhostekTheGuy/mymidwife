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

// Wspólne klucze dla synchronizacji między rolami
const SHARED_CONVERSATIONS_KEY = "mymidwife:shared-conversations"
const SHARED_MESSAGES_KEY = "mymidwife:shared-messages"

// Stałe ID dla konwersacji Anna Kowalska <-> Maria Nowak
const ANNA_MARIA_CONVERSATION_ID = "conversation-anna-maria"

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

  // Return default appointments for Anna Kowalska
  const defaultAppointments: Appointment[] = [
    // Nadchodzące wizyty
    {
      id: uuidv4(),
      midwifeId: "midwife-maria",
      midwifeName: "Maria Nowak",
      midwifeAvatar: "/images/pregnancy-support.png",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "10:00",
      type: "Kontrola prenatalna",
      location: "Warszawa, ul. Marszałkowska 1",
      isOnline: false,
      status: "scheduled",
      notes: "Rutynowa kontrola, 20 tydzień ciąży",
    },
    {
      id: uuidv4(),
      midwifeId: "midwife-maria",
      midwifeName: "Maria Nowak",
      midwifeAvatar: "/images/pregnancy-support.png",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "14:30",
      type: "USG morfologiczne",
      location: "Centrum Diagnostyczne, ul. Nowy Świat 15",
      isOnline: false,
      status: "scheduled",
      notes: "Badanie USG morfologiczne - 21 tydzień",
    },
    {
      id: uuidv4(),
      midwifeId: "midwife-maria",
      midwifeName: "Maria Nowak",
      midwifeAvatar: "/images/pregnancy-support.png",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "16:00",
      type: "Edukacja przedporodowa",
      location: "Online",
      isOnline: true,
      status: "scheduled",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      notes: "Sesja edukacyjna - przygotowanie do porodu",
    },
    
    // Ukończone wizyty (historia)
    {
      id: uuidv4(),
      midwifeId: "midwife-maria",
      midwifeName: "Maria Nowak",
      midwifeAvatar: "/images/pregnancy-support.png",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "09:30",
      type: "Pierwsza wizyta prenatalna",
      location: "Warszawa, ul. Marszałkowska 1",
      isOnline: false,
      status: "completed",
      notes: "Wywiad, badanie podstawowe, 16 tydzień ciąży. Wszystko w normie.",
    },
    {
      id: uuidv4(),
      midwifeId: "midwife-maria",
      midwifeName: "Maria Nowak",
      midwifeAvatar: "/images/pregnancy-support.png",
      date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "11:00",
      type: "Konsultacja przedciążowa",
      location: "Warszawa, ul. Marszałkowska 1",
      isOnline: false,
      status: "completed",
      notes: "Planowanie ciąży, badania, suplementacja",
    },
    {
      id: uuidv4(),
      midwifeId: "midwife-maria",
      midwifeName: "Maria Nowak",
      midwifeAvatar: "/images/pregnancy-support.png",
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "15:00",
      type: "Badania laboratoryjne",
      location: "Online - omówienie wyników",
      isOnline: true,
      status: "completed",
      meetingLink: "https://meet.google.com/results-review",
      notes: "Omówienie wyników badań krwi i moczu - wszystko prawidłowe",
    },

    // Wizyta z inną położną (dla różnorodności)
    {
      id: uuidv4(),
      midwifeId: "midwife-magdalena",
      midwifeName: "Magdalena Wiśniewska",
      midwifeAvatar: "/images/pregnancy-support.png",
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "12:30",
      type: "Druga opinia",
      location: "Kraków, ul. Floriańska 20",
      isOnline: false,
      status: "scheduled",
      notes: "Konsultacja dodatkowa na prośbę pacjentki",
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

  // Pobierz informacje o użytkowniku
  const storedUser = localStorage.getItem("mymidwife_user")
  const isMidwife = storedUser ? JSON.parse(storedUser).role === "midwife" : false
  const userName = storedUser ? JSON.parse(storedUser).name : ""

  // Sprawdź czy istnieją już synchronizowane konwersacje
  const sharedConversations = localStorage.getItem(SHARED_CONVERSATIONS_KEY)
  const sharedMessages = localStorage.getItem(SHARED_MESSAGES_KEY)

  if (sharedConversations && sharedMessages) {
    const allMessages: Message[] = JSON.parse(sharedMessages)
    const conversations: Conversation[] = JSON.parse(sharedConversations)

    // Zwróć konwersacje odpowiednie dla aktualnej roli
    return conversations.map(conv => {
      const conversationMessages = allMessages.filter(msg => msg.conversationId === conv.id)
      const lastMessage = conversationMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      
      const unreadCount = conversationMessages.filter(msg => 
        !msg.isRead && 
        ((isMidwife && msg.senderId === "patient-anna") || 
         (!isMidwife && msg.senderId === "midwife-maria"))
      ).length

      // Ustaw prawidłową nazwę i ID w zależności od aktualnej roli
      const midwifeId = isMidwife ? "patient-anna" : "midwife-maria"
      const midwifeName = isMidwife ? "Anna Kowalska" : "Maria Nowak"

      return {
        ...conv,
        midwifeId,
        midwifeName,
        lastMessage,
        unreadCount,
        updatedAt: lastMessage ? lastMessage.timestamp : conv.updatedAt
      }
    })
  }

  // Jeśli nie ma wspólnych danych, zainicjalizuj je
  const defaultMessages: Message[] = [
    {
      id: uuidv4(),
      conversationId: ANNA_MARIA_CONVERSATION_ID,
      senderId: "patient-anna",
      senderName: "Anna Kowalska",
      senderAvatar: "/images/pregnancy-support.png",
      content: "Dzień dobry! Mam pytanie dotyczące badań prenatalnych",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: "text",
      isRead: true,
    },
    {
      id: uuidv4(),
      conversationId: ANNA_MARIA_CONVERSATION_ID,
      senderId: "midwife-maria",
      senderName: "Maria Nowak",
      senderAvatar: "/images/pregnancy-support.png",
      content: "Dzień dobry! Oczywiście, chętnie odpowiem na Pani pytania. O które badania chodzi?",
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      type: "text",
      isRead: true,
    },
    {
      id: uuidv4(),
      conversationId: ANNA_MARIA_CONVERSATION_ID,
      senderId: "patient-anna",
      senderName: "Anna Kowalska",
      senderAvatar: "/images/pregnancy-support.png",
      content: "Chodzi mi o USG morfologiczne. Kiedy najlepiej je wykonać?",
      timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      type: "text",
      isRead: true,
    },
    {
      id: uuidv4(),
      conversationId: ANNA_MARIA_CONVERSATION_ID,
      senderId: "midwife-maria",
      senderName: "Maria Nowak",
      senderAvatar: "/images/pregnancy-support.png",
      content: "USG morfologiczne najlepiej wykonać między 18-22 tygodniem ciąży. To optymalne okno czasowe do oceny anatomii płodu. Czy może mi Pani powiedzieć, w którym tygodniu jest obecnie?",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      type: "text",
      isRead: false,
    },
  ]

  const defaultConversations: Conversation[] = [
    {
      id: ANNA_MARIA_CONVERSATION_ID,
      midwifeId: isMidwife ? "patient-anna" : "midwife-maria",
      midwifeName: isMidwife ? "Anna Kowalska" : "Maria Nowak",
      midwifeAvatar: "/images/pregnancy-support.png",
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ]

  // Zapisz wspólne dane
  localStorage.setItem(SHARED_MESSAGES_KEY, JSON.stringify(defaultMessages))
  localStorage.setItem(SHARED_CONVERSATIONS_KEY, JSON.stringify(defaultConversations))

  // Aktualizuj konwersację z ostatnią wiadomością i licznikiem
  const lastMessage = defaultMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
  const unreadCount = defaultMessages.filter(msg => 
    !msg.isRead && 
    ((isMidwife && msg.senderId === "patient-anna") || 
     (!isMidwife && msg.senderId === "midwife-maria"))
  ).length

  defaultConversations[0].lastMessage = lastMessage
  defaultConversations[0].unreadCount = unreadCount
  defaultConversations[0].updatedAt = lastMessage.timestamp

  return defaultConversations
}

function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
  dispatchDataUpdate("messages", conversations)
}

function getMessages(conversationId: string): Message[] {
  if (typeof window === "undefined") return []

  // Używaj wspólnych wiadomości
  const stored = localStorage.getItem(SHARED_MESSAGES_KEY)
  const allMessages: Message[] = stored ? JSON.parse(stored) : []
  return allMessages.filter((msg) => msg.conversationId === conversationId)
}

function saveMessage(message: Message): void {
  if (typeof window === "undefined") return

  // Pobierz aktualnego użytkownika dla określenia senderId
  const storedUser = localStorage.getItem("mymidwife_user")
  const isMidwife = storedUser ? JSON.parse(storedUser).role === "midwife" : false
  
  // Ustaw właściwy senderId na podstawie roli
  const messageWithSender = {
    ...message,
    senderId: isMidwife ? "midwife-maria" : "patient-anna",
    senderName: isMidwife ? "Maria Nowak" : "Anna Kowalska"
  }

  // Zapisz do wspólnych wiadomości
  const stored = localStorage.getItem(SHARED_MESSAGES_KEY)
  const messages: Message[] = stored ? JSON.parse(stored) : []
  messages.push(messageWithSender)
  localStorage.setItem(SHARED_MESSAGES_KEY, JSON.stringify(messages))

  // Zaktualizuj wspólne konwersacje
  const conversationsStored = localStorage.getItem(SHARED_CONVERSATIONS_KEY)
  const conversations: Conversation[] = conversationsStored ? JSON.parse(conversationsStored) : []
  
  const convIndex = conversations.findIndex((conv) => conv.id === messageWithSender.conversationId)
  if (convIndex !== -1) {
    conversations[convIndex].lastMessage = messageWithSender
    conversations[convIndex].updatedAt = messageWithSender.timestamp
    localStorage.setItem(SHARED_CONVERSATIONS_KEY, JSON.stringify(conversations))
  }

  // Wyślij event dla synchronizacji
  dispatchDataUpdate("messages", messageWithSender)
  
  // Dodatkowo wyślij custom event dla synchronizacji między rolami
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent('mymidwife:newMessage', { 
      detail: { message: messageWithSender, fromRole: isMidwife ? 'midwife' : 'patient' }
    }))
  }
}

function markMessagesAsRead(conversationId: string): void {
  if (typeof window === "undefined") return

  // Pobierz informacje o użytkowniku
  const storedUser = localStorage.getItem("mymidwife_user")
  const isMidwife = storedUser ? JSON.parse(storedUser).role === "midwife" : false

  // Aktualizuj wiadomości jako przeczytane w wspólnym storage
  const stored = localStorage.getItem(SHARED_MESSAGES_KEY)
  if (stored) {
    const messages: Message[] = JSON.parse(stored)
    let hasUpdates = false
    
    // Oznacz jako przeczytane wiadomości od drugiej strony
    messages.forEach(message => {
      if (message.conversationId === conversationId && 
          !message.isRead && 
          ((isMidwife && message.senderId === "patient-anna") || 
           (!isMidwife && message.senderId === "midwife-maria"))) {
        message.isRead = true
        hasUpdates = true
      }
    })
    
    if (hasUpdates) {
      localStorage.setItem(SHARED_MESSAGES_KEY, JSON.stringify(messages))
    }
  }

  // Aktualizuj wspólne konwersacje
  const conversationsStored = localStorage.getItem(SHARED_CONVERSATIONS_KEY)
  if (conversationsStored) {
    const conversations: Conversation[] = JSON.parse(conversationsStored)
    const convIndex = conversations.findIndex((conv) => conv.id === conversationId)
    if (convIndex !== -1) {
      // Ponownie przelicz licznik nieprzeczytanych na podstawie aktualnych danych
      const messages: Message[] = stored ? JSON.parse(stored) : []
      const unreadCount = messages.filter(msg => 
        msg.conversationId === conversationId &&
        !msg.isRead && 
        ((isMidwife && msg.senderId === "patient-anna") || 
         (!isMidwife && msg.senderId === "midwife-maria"))
      ).length
      
      conversations[convIndex].unreadCount = unreadCount
      localStorage.setItem(SHARED_CONVERSATIONS_KEY, JSON.stringify(conversations))
    }
  }

  // Wyślij event o aktualizacji
  dispatchDataUpdate("messages", null)
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
    // Dzisiejszy wpis (20 tydzień ciąży)
    {
      id: uuidv4(),
      date: new Date().toISOString().split("T")[0],
      symptoms: [
        { category: "Samopoczucie", severity: 2, emoji: "🙂", label: "Dobre" },
        { category: "Energia", severity: 3, emoji: "🪫", label: "Średnia energia" },
        { category: "Sen", severity: 2, emoji: "😌", label: "Dobry sen" },
        { category: "Nudności", severity: 1, emoji: "🤢", label: "Lekkie" },
        { category: "Ruchy płodu", severity: 1, emoji: "👶", label: "Aktywne" },
      ],
      mood: { level: 2, emoji: "🙂", label: "Dobre" },
      medicalData: {
        weight: 68.5,
        bloodPressure: { systolic: 120, diastolic: 80 },
        temperature: 36.6,
        heartRate: 78
      },
      notes: "Pierwsze wyraźne ruchy dziecka! Lekkie nudności tylko rano. Czuję się dobrze.",
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
        { category: "Ból pleców", severity: 3, emoji: "🦴", label: "Umiarkowany" },
        { category: "Ruchy płodu", severity: 2, emoji: "👶", label: "Delikatne" },
      ],
      mood: { level: 3, emoji: "😐", label: "Neutralne" },
      medicalData: {
        weight: 68.3,
        bloodPressure: { systolic: 118, diastolic: 78 },
        temperature: 36.7,
        heartRate: 82
      },
      notes: "Problemy z zasypianiem przez ból pleców. Muszę pamiętać o ćwiczeniach.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },

    // 3 dni temu
    {
      id: uuidv4(),
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      symptoms: [
        { category: "Samopoczucie", severity: 1, emoji: "😊", label: "Bardzo dobre" },
        { category: "Energia", severity: 2, emoji: "🔋", label: "Dobra energia" },
        { category: "Sen", severity: 1, emoji: "😴", label: "Doskonały sen" },
        { category: "Nudności", severity: 1, emoji: "🤢", label: "Lekkie" },
      ],
      mood: { level: 1, emoji: "😊", label: "Bardzo dobre" },
      medicalData: {
        weight: 68.1,
        bloodPressure: { systolic: 115, diastolic: 75 },
        temperature: 36.5,
        heartRate: 75
      },
      notes: "Świetny dzień, dużo energii! Pierwszy raz tak wyraźnie poczułam ruchy dziecka.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // 5 dni temu
    {
      id: uuidv4(),
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      symptoms: [
        { category: "Samopoczucie", severity: 2, emoji: "🙂", label: "Dobre" },
        { category: "Energia", severity: 3, emoji: "🪫", label: "Średnia energia" },
        { category: "Sen", severity: 3, emoji: "😌", label: "W porządku" },
        { category: "Nudności", severity: 2, emoji: "🤢", label: "Umiarkowane" },
        { category: "Zgaga", severity: 2, emoji: "🔥", label: "Lekka" },
      ],
      mood: { level: 2, emoji: "🙂", label: "Dobre" },
      medicalData: {
        weight: 67.9,
        bloodPressure: { systolic: 118, diastolic: 76 },
        temperature: 36.6,
        heartRate: 80
      },
      notes: "Pierwsze odczucia zgagi. Muszę uważać na dietę.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // Tydzień temu
    {
      id: uuidv4(),
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      symptoms: [
        { category: "Samopoczucie", severity: 3, emoji: "😐", label: "Neutralne" },
        { category: "Energia", severity: 4, emoji: "😴", label: "Mała energia" },
        { category: "Sen", severity: 3, emoji: "😌", label: "W porządku" },
        { category: "Nudności", severity: 3, emoji: "🤢", label: "Wyraźne" },
        { category: "Zawroty głowy", severity: 2, emoji: "💫", label: "Lekkie" },
      ],
      mood: { level: 3, emoji: "😐", label: "Neutralne" },
      medicalData: {
        weight: 67.6,
        bloodPressure: { systolic: 112, diastolic: 72 },
        temperature: 36.5,
        heartRate: 85
      },
      notes: "Nudności wciąż dokuczają, ale mniej niż wcześniej. Lekkie zawroty przy wstawaniu.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // 10 dni temu
    {
      id: uuidv4(),
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      symptoms: [
        { category: "Samopoczucie", severity: 1, emoji: "😊", label: "Bardzo dobre" },
        { category: "Energia", severity: 2, emoji: "🔋", label: "Dobra energia" },
        { category: "Sen", severity: 2, emoji: "😌", label: "Dobry sen" },
        { category: "Nudności", severity: 2, emoji: "🤢", label: "Umiarkowane" },
      ],
      mood: { level: 2, emoji: "🙂", label: "Dobre" },
      medicalData: {
        weight: 67.3,
        bloodPressure: { systolic: 116, diastolic: 74 },
        temperature: 36.6,
        heartRate: 78
      },
      notes: "Dobry dzień, nudności malają. Cieszę się na następne USG!",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
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
      id: ANNA_MARIA_CONVERSATION_ID,
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

  // Dla demo zawsze zwracaj główną konwersację Anna-Maria
  const existingConversation = conversations.find((c) => c.id === ANNA_MARIA_CONVERSATION_ID)
  if (existingConversation) {
    return existingConversation
  }

  // If not found, create a new one (shouldn't happen in this demo)
  const newConversation: Conversation = {
    id: ANNA_MARIA_CONVERSATION_ID,
    midwifeId,
    midwifeName,
    midwifeAvatar,
    unreadCount: 0,
    updatedAt: new Date().toISOString(),
  }

  // Dodaj do wspólnych konwersacji
  const conversationsStored = localStorage.getItem(SHARED_CONVERSATIONS_KEY)
  const sharedConversations: Conversation[] = conversationsStored ? JSON.parse(conversationsStored) : []
  sharedConversations.push(newConversation)
  localStorage.setItem(SHARED_CONVERSATIONS_KEY, JSON.stringify(sharedConversations))

  return newConversation
}

function clearDemoData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CONVERSATIONS_KEY)
  localStorage.removeItem(MESSAGES_KEY)
  localStorage.removeItem(SHARED_CONVERSATIONS_KEY)
  localStorage.removeItem(SHARED_MESSAGES_KEY)
  localStorage.removeItem(APPOINTMENTS_KEY)
  localStorage.removeItem(SYMPTOMS_KEY)
  localStorage.removeItem('hasSeenDemoBanner')
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
