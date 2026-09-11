/**
 * PWA Service Worker Registration & Installation Prompt Handler
 */

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('PWA ServiceWorker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('PWA ServiceWorker registration failed:', err);
        });
    });
  }
}

let deferredPrompt: any = null;

export function setupBeforeInstallPrompt(onCanInstallChange: (canInstall: boolean) => void) {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    onCanInstallChange(true);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    onCanInstallChange(false);
    console.log('PWA installed successfully');
  });
}

export async function promptPWAInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome === 'accepted';
}
