// Skrypt do czyszczenia danych demo
// Uruchom w przeglądarce w konsoli deweloperskiej

console.log('Czyszczenie danych demo...');

// Usuń wszystkie klucze związane z MyMidwife
const keysToRemove = [
  'mymidwife:conversations',
  'mymidwife:messages',
  'mymidwife:appointments',
  'mymidwife:symptoms',
  'mymidwife_user'
];

keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log(`Usunięto: ${key}`);
});

console.log('Dane demo zostały wyczyszczone!');
console.log('Odśwież stronę, aby zobaczyć zmiany.');
