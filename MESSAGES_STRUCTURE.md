# Struktura wiadomości - MyMidwife

## Przegląd zmian

Rozdzielono strukturę wiadomości dla położnej i pacjentki na osobne stałe, aby uniknąć konfliktów i ułatwić przyszłą integrację z backendem.

## Struktura danych

### Dla położnej (Anna Kowalska)
- **Konwersacja:** Maria Nowak (pacjentka)
- **ID konwersacji:** `patient-maria`
- **Wiadomości od:** `patient-maria` (Maria Nowak)
- **Wiadomości do:** `midwife-anna` (Ty - własne wiadomości)

### Dla pacjentki (Maria Nowak)
- **Konwersacja:** Anna Kowalska (położna)
- **ID konwersacji:** `midwife-anna`
- **Wiadomości od:** `midwife-anna` (Anna Kowalska)
- **Wiadomości do:** `patient-maria` (Ty - własne wiadomości)

## Stałe w kodzie

### MIDWIFE_CONVERSATIONS
\`\`\`typescript
const MIDWIFE_CONVERSATIONS: Conversation[] = [
  {
    id: uuidv4(),
    midwifeId: "patient-maria",
    midwifeName: "Maria Nowak",
    midwifeAvatar: "/images/pregnancy-support.png",
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
]
\`\`\`

### PATIENT_CONVERSATIONS
\`\`\`typescript
const PATIENT_CONVERSATIONS: Conversation[] = [
  {
    id: uuidv4(),
    midwifeId: "midwife-anna",
    midwifeName: "Anna Kowalska",
    midwifeAvatar: "/images/pregnancy-support.png",
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
]
\`\`\`

### MIDWIFE_MESSAGES
- Wiadomości dla położnej z pacjentką Marią Nowak
- Sender IDs: `patient-maria`, `midwife-anna`
- **Własne wiadomości położnej:** `senderName: "Ty"`

### PATIENT_MESSAGES
- Wiadomości dla pacjentki z położną Anną Kowalską
- Sender IDs: `midwife-anna`, `patient-maria`
- **Własne wiadomości pacjentki:** `senderName: "Ty"`

## Logika wyboru danych

\`\`\`typescript
const isMidwife = storedUser ? JSON.parse(storedUser).role === "midwife" : false
const conversations = isMidwife ? MIDWIFE_CONVERSATIONS : PATIENT_CONVERSATIONS
const messages = isMidwife ? MIDWIFE_MESSAGES : PATIENT_MESSAGES
\`\`\`

## Logika wyświetlania wiadomości

### Rozpoznawanie własnych wiadomości
\`\`\`typescript
const isOwn = isMidwife() 
  ? (message.senderId === "demo-midwife" || message.senderId === "midwife-anna")
  : (message.senderId === "demo-patient" || message.senderId === "patient-maria")
\`\`\`

### Wyświetlanie nazwy nadawcy
- **Własne wiadomości:** Nie wyświetla nazwy nadawcy (`{!isOwn && ...}`)
- **Cudze wiadomości:** Wyświetla nazwę nadawcy z avatarem

## Korzyści

1. **Rozdzielone dane** - Każda rola ma swoje własne dane
2. **Brak konfliktów** - Nie ma pomieszania imion
3. **Poprawne wyświetlanie** - Własne wiadomości nie pokazują nazwy nadawcy
4. **Łatwość rozszerzania** - Można łatwo dodać więcej konwersacji
5. **Przygotowanie na backend** - Struktura gotowa na API
6. **Czytelność** - Kod jest bardziej zorganizowany

## Testowanie

Użyj skryptu `test-messages.js` w konsoli przeglądarki, aby sprawdzić poprawność danych.

### Instrukcje testowania:
1. Wyczyść dane demo: `localStorage.clear()`
2. Odśwież stronę
3. Sprawdź czy wiadomości wyświetlają się poprawnie
4. Uruchom skrypt testowy w konsoli
