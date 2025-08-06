// Skrypt testowy do sprawdzenia danych wiadomości
// Uruchom w konsoli przeglądarki

console.log('=== TEST DANYCH WIADOMOŚCI ===');

// Sprawdź dane użytkownika
const user = localStorage.getItem('mymidwife_user');
console.log('Dane użytkownika:', user ? JSON.parse(user) : 'Brak');

// Sprawdź konwersacje (stare)
const conversations = localStorage.getItem('mymidwife:conversations');
console.log('Konwersacje (stare):', conversations ? JSON.parse(conversations) : 'Brak');

// Sprawdź wiadomości (stare)
const messages = localStorage.getItem('mymidwife:messages');
console.log('Wiadomości (stare):', messages ? JSON.parse(messages) : 'Brak');

// Sprawdź wspólne konwersacje (nowe)
const sharedConversations = localStorage.getItem('mymidwife:shared-conversations');
console.log('Wspólne konwersacje:', sharedConversations ? JSON.parse(sharedConversations) : 'Brak');

// Sprawdź wspólne wiadomości (nowe)
const sharedMessages = localStorage.getItem('mymidwife:shared-messages');
console.log('Wspólne wiadomości:', sharedMessages ? JSON.parse(sharedMessages) : 'Brak');

// Sprawdź czy dane są spójne - używaj nowych wspólnych danych
const dataToAnalyze = sharedConversations && sharedMessages ? 
  { convs: JSON.parse(sharedConversations), msgs: JSON.parse(sharedMessages), source: 'wspólne' } :
  conversations && messages ? 
  { convs: JSON.parse(conversations), msgs: JSON.parse(messages), source: 'stare' } :
  null;

if (dataToAnalyze) {
  const { convs, msgs, source } = dataToAnalyze;
  
  console.log('\n=== ANALIZA ===');
  console.log('Źródło danych:', source);
  console.log('Liczba konwersacji:', convs.length);
  console.log('Liczba wiadomości:', msgs.length);
  
  convs.forEach((conv, index) => {
    console.log(`\nKonwersacja ${index + 1}:`);
    console.log('- ID:', conv.id);
    console.log('- Nazwa:', conv.midwifeName);
    console.log('- ID położnej:', conv.midwifeId);
    
    const convMessages = msgs.filter(m => m.conversationId === conv.id);
    console.log('- Liczba wiadomości:', convMessages.length);
    
    convMessages.forEach((msg, msgIndex) => {
      console.log(`  Wiadomość ${msgIndex + 1}:`);
      console.log(`    - Nadawca: ${msg.senderName} (${msg.senderId})`);
      console.log(`    - Treść: ${msg.content.substring(0, 50)}...`);
      
      // Sprawdź logikę isOwn (nowa)
      const isMidwife = user ? JSON.parse(user).role === "midwife" : false;
      const isOwn = isMidwife 
        ? (msg.senderId === "midwife-maria")
        : (msg.senderId === "patient-anna");
      
      console.log(`    - Czy własna: ${isOwn}`);
      console.log(`    - Powinna wyświetlać nazwę: ${!isOwn}`);
    });
  });
}

console.log('\n=== INSTRUKCJE ===');
console.log('1. Wyczyść dane demo: localStorage.clear()');
console.log('2. Odśwież stronę');
console.log('3. Sprawdź czy wiadomości wyświetlają się poprawnie');

console.log('\n=== KONIEC TESTU ==='); 