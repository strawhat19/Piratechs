'use client';

import type { AppUser } from '@/shared/types/user';
import { devEnv } from './common/database/constants';
import type { ThemeMode } from '@/shared/types/site';
import type { User as FirebaseUser } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { firebaseEnvReady, getFirebaseAuth, getFirebaseDb, getGoogleProvider } from '@/shared/lib/firebase';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';

type GlobalContextValue = {
  width: number;
  height: number;
  loaded: boolean;
  isPWA: boolean;
  authStatus: string;
  firebaseReady: boolean;
  smallScreen: boolean;
  usersLoading: boolean;
  theme: ThemeMode;
  user: AppUser | null;
  users: AppUser[];
  selected: unknown;
  menuExpanded: boolean;
  setUser: (user: AppUser | null) => void;
  setUsers: (users: AppUser[]) => void;
  setTheme: (theme: ThemeMode) => void;
  setSelected: (selected: unknown) => void;
  setMenuExpanded: (expanded: boolean) => void;
  toggleTheme: () => void;
  onSignOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshUsers: () => Promise<AppUser[]>;
  signInUser: (email: string, password: string) => Promise<void>;
  signUpUser: (email: string, password: string, name?: string) => Promise<void>;
};

const emptyAsync = async () => undefined;

const defaultState: GlobalContextValue = {
  width: 1920,
  height: 1080,
  loaded: false,
  isPWA: false,
  user: null,
  users: [],
  theme: `dark`,
  selected: null,
  authStatus: ``,
  smallScreen: false,
  usersLoading: false,
  menuExpanded: false,
  firebaseReady: false,
  setUser: () => null,
  setUsers: () => null,
  setTheme: () => null,
  setSelected: () => null,
  toggleTheme: () => null,
  setMenuExpanded: () => null,
  onSignOut: emptyAsync,
  signInUser: emptyAsync,
  signUpUser: emptyAsync,
  refreshUsers: async () => [],
  signInWithGoogle: emptyAsync,
};

export const StateGlobals = createContext<GlobalContextValue>(defaultState);

const usersCollection = `users`;
const defaultRole = `Visitor`;
const mobileBreakpoint = 768;

const getCurrentDate = () => new Date().toISOString();

const mapFirebaseUser = (firebaseUser: FirebaseUser, number = 1): AppUser => ({
  number,
  role: defaultRole,
  source: `firebase`,
  uid: firebaseUser.uid,
  id: firebaseUser.uid,
  provider: `Firebase`,
  signedIn: true,
  email: firebaseUser.email ?? ``,
  avatar: firebaseUser.photoURL ?? ``,
  name: firebaseUser.displayName || firebaseUser.email?.split(`@`)?.[0] || `Piratechs User`,
  firebaseUser,
});

const normalizeUser = (id: string, data: Record<string, unknown>, fallbackNumber: number): AppUser => ({
  id,
  uid: String(data.uid ?? id),
  role: String(data.role ?? defaultRole),
  name: String(data.name ?? data.email ?? `Piratechs User`),
  email: String(data.email ?? ``),
  avatar: String(data.avatar ?? ``),
  source: String(data.source ?? `firestore`),
  number: Number(data.number ?? fallbackNumber),
  created: data.created ? String(data.created) : undefined,
  updated: data.updated ? String(data.updated) : undefined,
  provider: data.provider ? String(data.provider) : undefined,
  signedIn: Boolean(data.signedIn ?? false),
});

export const useGlobalContext = () => useContext(StateGlobals);

export default function GlobalProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isPWA, setIsPWA] = useState(false);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [authStatus, setAuthStatus] = useState(``);
  const [selected, setSelected] = useState<unknown>(null);
  const [smallScreen, setSmallScreen] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>(`dark`);
  const firebaseReady = firebaseEnvReady();

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    document.body.dataset.theme = nextTheme;
    document.body.classList.remove(`dark`, `light`);
    document.body.classList.add(nextTheme);
    window.localStorage.setItem(`piratechs-theme`, nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    let themeString: ThemeMode = theme == `dark` ? `light` : `dark`;
    setTheme(themeString);
  }, [setTheme, theme]);

  const upsertUser = useCallback(async (nextUser: AppUser) => {
    const db = getFirebaseDb();
    if (db == null) return;
    const now = getCurrentDate();
    await setDoc(doc(db, usersCollection, nextUser.id), {
      ...nextUser,
      updated: now,
      firebaseUser: null,
      created: nextUser.created ?? now,
    }, { merge: true });
  }, []);

  const refreshUsers = useCallback(async () => {
    setUsersLoading(false);
    setUsers(currentUsers => {
      if (user == null) return currentUsers;
      const existingUser = currentUsers.some(currentUser => currentUser.uid == user.uid);
      return existingUser ? currentUsers : [user, ...currentUsers];
    });
    devEnv && console.log(`Users`, { users, user });
    return user ? [user, ...users.filter(currentUser => currentUser.uid != user.uid)] : users;
  }, [user, users]);

  const signInUser = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (auth == null) {
      setAuthStatus(`Firebase Env Needed`);
      return;
    }
    try {
      setAuthStatus(`Signing In`);
      await signInWithEmailAndPassword(auth, email, password);
      setAuthStatus(`Signed In`);
    } catch (error) {
      setAuthStatus(`Sign In Failed`);
      console.log(`Error Signing In`, error);
    }
  }, []);

  const signUpUser = useCallback(async (email: string, password: string, name?: string) => {
    const auth = getFirebaseAuth();
    if (auth == null) {
      setAuthStatus(`Firebase Env Needed`);
      return;
    }
    try {
      setAuthStatus(`Signing Up`);
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (name && credential.user.displayName != name) {
        await updateProfile(credential.user, { displayName: name });
      }
      const nextUser = mapFirebaseUser(credential.user, users.length + 1);
      await upsertUser({ ...nextUser, name: name || nextUser.name });
      setAuthStatus(`Signed Up`);
    } catch (error) {
      setAuthStatus(`Sign Up Failed`);
      console.log(`Error Signing Up`, error);
    }
  }, [upsertUser, users.length]);

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth == null) {
      setAuthStatus(`Firebase Env Needed`);
      return;
    }
    try {
      setAuthStatus(`Google Sign In`);
      const credential = await signInWithPopup(auth, getGoogleProvider());
      await upsertUser(mapFirebaseUser(credential.user, users.length + 1));
      setAuthStatus(`Signed In With Google`);
    } catch (error) {
      setAuthStatus(`Google Sign In Failed`);
      console.log(`Error Signing In With Google`, error);
    }
  }, [upsertUser, users.length]);

  const onSignOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth == null) {
      setUser(null);
      setAuthStatus(`Signed Out`);
      return;
    }
    try {
      setAuthStatus(`Signing Out`);
      await signOut(auth);
      setUser(null);
      setAuthStatus(`Signed Out`);
    } catch (error) {
      setAuthStatus(`Sign Out Failed`);
      console.log(`Error Signing Out`, error);
    }
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(`piratechs-theme`) as ThemeMode | null;
    setTheme(storedTheme == `light` ? `light` : `dark`);
  }, [setTheme]);

  useEffect(() => {
    document.body.classList.toggle(`menuOpen`, menuExpanded);
    return () => document.body.classList.remove(`menuOpen`);
  }, [menuExpanded]);

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setSmallScreen(window.innerWidth <= mobileBreakpoint);
      if (window.innerWidth > mobileBreakpoint) setMenuExpanded(false);
    };
    onResize();
    setIsPWA(window.matchMedia(`(display-mode: standalone)`).matches);
    window.addEventListener(`resize`, onResize);
    return () => window.removeEventListener(`resize`, onResize);
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (auth == null) {
      setLoaded(true);
      setUsersLoading(false);
      setAuthStatus(`Firebase Env Needed`);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser == null) {
        setUser(null);
        setLoaded(true);
        setAuthStatus(`Signed Out`);
        return;
      }
      const nextUser = mapFirebaseUser(firebaseUser, users.length + 1);
      setUser(nextUser);
      setLoaded(true);
      setAuthStatus(`Signed In`);
      await upsertUser(nextUser).catch(error => {
        console.log(`Error Saving User`, error);
      });
    });
    return () => unsubscribe();
  }, [upsertUser, users.length]);

  useEffect(() => {
    const db = getFirebaseDb();
    if (db == null) {
      setUsers(user ? [user] : []);
      setUsersLoading(false);
      return;
    }
    setUsersLoading(true);
    const unsubscribe = onSnapshot(collection(db, usersCollection), snapshot => {
      const firestoreUsers = snapshot.docs.map((userDoc, index) => normalizeUser(userDoc.id, userDoc.data(), index + 1));
      const currentUserExists = user == null || firestoreUsers.some(firestoreUser => firestoreUser.uid == user.uid);
      setUsers(currentUserExists || user == null ? firestoreUsers : [user, ...firestoreUsers]);
      setUsersLoading(false);
    }, error => {
      console.log(`Error Loading User(s)`, error);
      setUsers(user ? [user] : []);
      setUsersLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const state = useMemo<GlobalContextValue>(() => ({
    user,
    users,
    width,
    theme,
    height,
    isPWA,
    loaded,
    selected,
    setUser,
    setUsers,
    setTheme,
    onSignOut,
    authStatus,
    toggleTheme,
    signInUser,
    signUpUser,
    smallScreen,
    setSelected,
    refreshUsers,
    usersLoading,
    firebaseReady,
    menuExpanded,
    signInWithGoogle,
    setMenuExpanded,
  }), [
    user,
    users,
    width,
    theme,
    height,
    isPWA,
    loaded,
    selected,
    setTheme,
    onSignOut,
    authStatus,
    toggleTheme,
    signInUser,
    signUpUser,
    smallScreen,
    refreshUsers,
    usersLoading,
    firebaseReady,
    menuExpanded,
    signInWithGoogle,
  ]);

  return (
    <StateGlobals.Provider value={state}>
      {children}
    </StateGlobals.Provider>
  );
}
