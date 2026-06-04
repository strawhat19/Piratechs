import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { GoogleAuthProvider, browserLocalPersistence, getAuth, setPersistence, type Auth } from 'firebase/auth';

type FirebaseClientConfig = {
  appId?: string;
  apiKey?: string;
  projectId?: string;
  authDomain?: string;
  storageBucket?: string;
  messagingSenderId?: string;
};

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export const getFirebaseConfig = (): FirebaseClientConfig => ({
  appId: process.env.NEXT_PUBLIC_appId,
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  projectId: process.env.NEXT_PUBLIC_projectId,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
});

export const firebaseEnvReady = () => (
  Object.values(getFirebaseConfig()).every(Boolean)
);

export const getFirebaseApp = () => {
  if (!firebaseEnvReady()) return null;
  if (firebaseApp == null) {
    firebaseApp = getApps()?.[0] ?? initializeApp(getFirebaseConfig());
  }
  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (firebaseAuth != null) return firebaseAuth;
  const app = getFirebaseApp();
  if (app == null) return null;
  firebaseAuth = getAuth(app);
  setPersistence(firebaseAuth, browserLocalPersistence).catch(() => null);
  return firebaseAuth;
};

export const getGoogleProvider = () => {
  if (googleProvider == null) {
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: `select_account` });
  }
  return googleProvider;
};
