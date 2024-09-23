export function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  }
}
