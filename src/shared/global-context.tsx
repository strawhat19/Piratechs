'use client';

import { User } from '@/shared/models/User';
import { DataSources, Roles } from './types/types';
import type { ThemeMode } from '@/shared/types/app';
import { devEnv } from './common/database/constants';
import type { User as FirebaseUser } from 'firebase/auth';
import { getDeviceDetails, removeNullAndUndefinedProperties } from './common/scripts/globals';
import { collection, doc, getDocs, limit, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { firebaseEnvReady, getFirebaseAuth, getFirebaseDb, getGoogleProvider } from '@/shared/lib/firebase';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';

export const logUsers = (users: User[] | any[], user: User | null | any, extraData: any = {}) => {
  if (devEnv) {
    if (users?.length > 0) {
      if (user != null) {
        console.log(`User(s)`, { 
          user, 
          users, 
          ...extraData,
        });
      }
    }
  }
}

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
  user: User | null;
  users: User[];
  selected: unknown;
  menuExpanded: boolean;
  platform?: any;
  setPlatform?: any;
  slantedSignalLines?: boolean;
  isChromeOrAdvancedDevice?: any;
  setUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  setTheme: (theme: ThemeMode) => void;
  setSelected: (selected: unknown) => void;
  setMenuExpanded: (expanded: boolean) => void;
  setSlantedSignalLines: (slantedSgnalLines: boolean) => void;
  toggleTheme: () => void;
  onSignOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshUsers: () => Promise<User[]>;
  signInUser: (email: string, password: string) => Promise<void>;
  signUpUser: (email: string, password: string, name?: string) => Promise<void>;
};

const emptyAsync = async () => undefined;

const defaultState: GlobalContextValue = {
  user: null,
  users: [],
  width: 1920,
  height: 1080,
  platform: {}, 
  isPWA: false,
  loaded: false,
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
  onSignOut: emptyAsync,
  signInUser: emptyAsync,
  signUpUser: emptyAsync,
  setSelected: () => null,
  toggleTheme: () => null,
  slantedSignalLines: false,
  setMenuExpanded: () => null,
  refreshUsers: async () => [],
  signInWithGoogle: emptyAsync,
  setPlatform: async () => null,
  setSlantedSignalLines: () => null,
  isChromeOrAdvancedDevice: () => null,
};

export const StateGlobals = createContext<GlobalContextValue>(defaultState);

const mobileBreakpoint = 768;
const defaultRole = Roles.Guest;
const usersCollection = `users`;

const getCurrentDate = () => new Date().toISOString();

const getNextUserNumber = (currentUsers: User[]) => Math.max(0, ...currentUsers.map(currentUser => Number(currentUser.number || 0))) + 1;

const getUserWriteData = (nextUser: User, now: string) => removeNullAndUndefinedProperties({
  ...nextUser,
  updated: now,
  created: nextUser.created ?? now,
});

const normalizeUser = (id: string, data: Record<string, unknown>, fallbackNumber: number): User => new User({
  ...data,
  id,
  uid: String(data.uid ?? id),
  role: String(data.role ?? defaultRole),
  name: String(data.name ?? data.email ?? `Piratechs User`),
  email: String(data.email ?? ``),
  avatar: String(data.avatar ?? data.photoURL ?? data.imageURL ?? data.image ?? ``),
  source: String(data.source ?? DataSources.Firebase),
  number: Number(data.number ?? fallbackNumber),
  provider: data.provider ? String(data.provider) : undefined,
  signedIn: Boolean(data.signedIn ?? false),
});

const mapFirebaseUser = (firebaseUser: FirebaseUser, number = 1, storedUser: User | null = null, displayName?: string): User => new User({
  ...storedUser,
  uid: firebaseUser.uid,
  role: storedUser?.role ?? defaultRole,
  name: displayName || firebaseUser.displayName || storedUser?.name || firebaseUser.email?.split(`@`)?.[0] || `Piratechs User`,
  email: firebaseUser.email ?? storedUser?.email ?? ``,
  avatar: firebaseUser.photoURL ?? storedUser?.avatar ?? ``,
  number: storedUser?.number ?? number,
  source: DataSources.Firebase,
  signedIn: true,
  photoURL: firebaseUser.photoURL ?? storedUser?.photoURL ?? ``,
  providerId: firebaseUser.providerData?.[0]?.providerId ?? firebaseUser.providerId,
  creationTime: firebaseUser.metadata?.creationTime ?? storedUser?.creationTime ?? ``,
  lastSignInTime: firebaseUser.metadata?.lastSignInTime ?? storedUser?.lastSignInTime ?? ``,
  metadata: removeNullAndUndefinedProperties({
    creationTime: firebaseUser.metadata?.creationTime,
    lastSignInTime: firebaseUser.metadata?.lastSignInTime,
  }),
  emailVerified: firebaseUser.emailVerified,
});

const getStoredUser = async (firebaseUser: FirebaseUser, currentUsers: User[]) => {
  const cachedUser = currentUsers.find(currentUser => currentUser.uid == firebaseUser.uid);
  if (cachedUser != null) return cachedUser;
  const db = getFirebaseDb();
  if (db == null) return null;
  const usersQuery = query(collection(db, usersCollection), where(`uid`, `==`, firebaseUser.uid), limit(1));
  const snapshot = await getDocs(usersQuery);
  const userDoc = snapshot.docs?.[0];
  const userFromDB = userDoc ? normalizeUser(userDoc.id, userDoc.data(), getNextUserNumber(currentUsers)) : null;
  console.log({userFromDB});
  return userFromDB;
};

export const useGlobalContext = () => useContext(StateGlobals);

export default function GlobalProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isPWA, setIsPWA] = useState(false);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [authStatus, setAuthStatus] = useState(``);
  const [selected, setSelected] = useState<unknown>(null);
  const [smallScreen, setSmallScreen] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [slantedSignalLines, setSlantedSignalLines] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>(`dark`);
  const [platform, setPlatform] = useState<any>({});
  const firebaseReady = firebaseEnvReady();
  const usersRef = useRef<User[]>([]);

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

  const upsertUser = useCallback(async (nextUser: User) => {
    const db = getFirebaseDb();
    if (db == null) return;
    const now = getCurrentDate();
    await setDoc(doc(db, usersCollection, String(nextUser.id)), getUserWriteData(nextUser, now), { merge: true });
  }, []);

  const refreshUsers = useCallback(async () => {
    setUsersLoading(false);
    setUsers(currentUsers => {
      if (user == null) return currentUsers;
      const existingUser = currentUsers.some(currentUser => currentUser.uid == user.uid);
      return existingUser ? currentUsers : [user, ...currentUsers];
    });
    return user ? [user, ...users.filter(currentUser => currentUser.uid != user.uid)] : users;
  }, [user, users]);

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

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
      const currentUsers = usersRef.current;
      const storedUser = await getStoredUser(credential.user, currentUsers);
      const nextUser = mapFirebaseUser(credential.user, storedUser?.number ?? getNextUserNumber(currentUsers), storedUser, name);
      await upsertUser(nextUser);
      setAuthStatus(`Signed Up`);
    } catch (error) {
      setAuthStatus(`Sign Up Failed`);
      console.log(`Error Signing Up`, error);
    }
  }, [upsertUser]);

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth == null) {
      setAuthStatus(`Firebase Env Needed`);
      return;
    }
    try {
      setAuthStatus(`Google Sign In`);
      const credential = await signInWithPopup(auth, getGoogleProvider());
      const currentUsers = usersRef.current;
      const storedUser = await getStoredUser(credential.user, currentUsers);
      await upsertUser(mapFirebaseUser(credential.user, storedUser?.number ?? getNextUserNumber(currentUsers), storedUser));
      setAuthStatus(`Signed In With Google`);
    } catch (error) {
      setAuthStatus(`Google Sign In Failed`);
      console.log(`Error Signing In With Google`, error);
    }
  }, [upsertUser]);

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
    const platformOSBrowser: any = getDeviceDetails();
    const platformOSBrowserDetails: any = { ...platformOSBrowser, width, height };
    setPlatform(platformOSBrowserDetails);
    devEnv && console.log(`Platform`, platformOSBrowserDetails);
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
      const currentUsers = usersRef.current;
      const storedUser = await getStoredUser(firebaseUser, currentUsers);
      const nextUser = mapFirebaseUser(firebaseUser, storedUser?.number ?? getNextUserNumber(currentUsers), storedUser);
      setUser(nextUser);
      setLoaded(true);
      setAuthStatus(`Signed In`);
      await upsertUser(nextUser).catch(error => {
        console.log(`Error Saving User`, error);
      });
    });
    return () => unsubscribe();
  }, [upsertUser]);

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
      const currentUsers = currentUserExists || user == null ? firestoreUsers : [user, ...firestoreUsers];
      setUsers(currentUsers);
      setUsersLoading(false);
      logUsers(currentUsers, user);
    }, error => {
      console.log(`Error Loading User(s)`, error);
      setUsers(user ? [user] : []);
      setUsersLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const isChromeOrAdvancedDevice = Boolean(
    !isPWA && (platform && platform?.chrome && !platform?.mobile && !platform?.ios && (
      !platform?.os?.toLowerCase()?.includes(`mac`)
    ) || (
      platform?.os?.toLowerCase()?.includes(`windows`)
    ))
  );

  const state = useMemo<GlobalContextValue>(() => ({
    user,
    users,
    width,
    isPWA,
    theme,
    height,
    loaded,
    setUser,
    setUsers,
    selected,
    setTheme,
    onSignOut,
    authStatus,
    signInUser,
    signUpUser,
    toggleTheme,
    smallScreen,
    setSelected,
    refreshUsers,
    usersLoading,
    firebaseReady,
    menuExpanded,
    setMenuExpanded,
    signInWithGoogle,
    platform, setPlatform,
    isChromeOrAdvancedDevice,
    slantedSignalLines, setSlantedSignalLines,
  }), [
    user,
    users,
    width,
    theme,
    isPWA,
    height,
    loaded,
    selected,
    platform,
    setTheme,
    onSignOut,
    authStatus,
    signInUser,
    signUpUser,
    toggleTheme,
    smallScreen,
    refreshUsers,
    usersLoading,
    menuExpanded,
    firebaseReady,
    signInWithGoogle,
    slantedSignalLines,
    isChromeOrAdvancedDevice,
  ]);

  return (
    <StateGlobals.Provider value={state}>
      {children}
    </StateGlobals.Provider>
  );
}
