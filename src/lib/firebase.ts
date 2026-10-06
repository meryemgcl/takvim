import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  inMemoryPersistence,
  indexedDBLocalPersistence,
  setPersistence
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Reuse app instance if already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// In browser environments (especially iframe previews and multi-tab auth popups),
// ensure browserPopupRedirectResolver is provided to prevent auth/argument-error.
// Persistence fallbacks: localStorage -> inMemory -> indexedDB
let authInstance;
try {
  if (typeof window !== 'undefined') {
    authInstance = initializeAuth(app, {
      popupRedirectResolver: browserPopupRedirectResolver,
      persistence: [browserLocalPersistence, inMemoryPersistence, indexedDBLocalPersistence]
    });
  } else {
    authInstance = getAuth(app);
  }
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/tasks');
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/calendar.events');
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/meetings.space.created');
provider.addScope('https://www.googleapis.com/auth/meetings.space.readonly');
provider.addScope('https://www.googleapis.com/auth/meetings.space.settings');
provider.setCustomParameters({
  prompt: 'select_account'
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;
let activeSignInPromise: Promise<{ user: User; accessToken: string } | null> | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!cachedAccessToken && typeof window !== 'undefined') {
    try {
      const backup = localStorage.getItem('google_access_token_backup');
      if (backup) cachedAccessToken = backup;
    } catch {}
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('google_access_token_backup');
        } catch {}
      }
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (retryCount = 0): Promise<{ user: User; accessToken: string } | null> => {
  // If a sign-in operation is already in progress, deduplicate by returning the existing promise
  if (activeSignInPromise) {
    return activeSignInPromise;
  }

  activeSignInPromise = (async () => {
    try {
      isSigningIn = true;
      
      // Ensure persistence is configured to localStorage or in-memory to prevent IndexedDB lockups
      try {
        if (typeof window !== 'undefined') {
          await setPersistence(auth, browserLocalPersistence);
        }
      } catch {
        try {
          if (typeof window !== 'undefined') {
            await setPersistence(auth, inMemoryPersistence);
          }
        } catch {}
      }

      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('Failed to obtain Google access token');
      }

      cachedAccessToken = credential.accessToken;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('google_access_token_backup', cachedAccessToken);
        } catch {}
      }

      return { user: result.user, accessToken: cachedAccessToken };
    } catch (error: any) {
      const errorMsg = String(error?.message || '').toLowerCase();
      const errorCode = String(error?.code || '').toLowerCase();

      // Gracefully handle cancelled popup requests (e.g. user clicked multiple times or dismissed popup)
      const isCancelled = errorCode.includes('cancelled-popup-request') ||
                          errorMsg.includes('cancelled-popup-request') ||
                          errorCode.includes('popup-closed-by-user') ||
                          errorMsg.includes('popup-closed-by-user');

      if (isCancelled) {
        console.warn('Google sign-in popup was closed or superseded by another operation.');
        return null;
      }

      const isDbClosing = errorMsg.includes('database is closing') || 
                          errorMsg.includes('closing/hidden') || 
                          errorMsg.includes('connection is closing');

      // Auto-retry once after 400ms with in-memory persistence if IndexedDB was closed/hidden by browser
      if (isDbClosing && retryCount < 2) {
        console.warn(`IndexedDB database closed/hidden detected. Retrying with in-memory fallback (attempt ${retryCount + 1})...`);
        await new Promise(resolve => setTimeout(resolve, 400));
        try {
          await setPersistence(auth, inMemoryPersistence);
        } catch {}
        return googleSignIn(retryCount + 1);
      }

      console.error('Sign-in error:', error);
      throw error;
    } finally {
      isSigningIn = false;
      activeSignInPromise = null;
    }
  })();

  return activeSignInPromise;
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!cachedAccessToken && typeof window !== 'undefined') {
    try {
      const backup = localStorage.getItem('google_access_token_backup');
      if (backup) cachedAccessToken = backup;
    } catch {}
  }
  return cachedAccessToken;
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Sign-out warning:', err);
  }
  cachedAccessToken = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('google_access_token_backup');
    } catch {}
  }
};
