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
  inMemoryPersistence,
  setPersistence
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Reuse app instance if already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// In browser environments (especially iframe previews and multi-tab auth popups),
// IndexedDB persistence in Firebase Auth v12.17 can throw "Database is closing/hidden"
// when tabs become hidden or during popup handoffs.
// Using browserLocalPersistence (localStorage) and inMemoryPersistence guarantees
// seamless authentication without crashing on IndexedDB lifecycle closures.
let authInstance;
try {
  if (typeof window !== 'undefined') {
    authInstance = initializeAuth(app, {
      persistence: [browserLocalPersistence, inMemoryPersistence]
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
  try {
    isSigningIn = true;
    
    // Ensure persistence is configured to localStorage or in-memory to prevent IndexedDB lockups
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (pErr) {
      try {
        await setPersistence(auth, inMemoryPersistence);
      } catch {}
    }

    const result = await signInWithPopup(auth, provider);
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
  }
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
