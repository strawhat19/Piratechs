import type { User as FirebaseUser } from 'firebase/auth';

export type AppUser = {
  id: string;
  uid: string;
  role: string;
  name: string;
  email: string;
  avatar: string;
  source: string;
  number?: number;
  created?: string;
  updated?: string;
  provider?: string;
  signedIn?: boolean;
  firebaseUser?: FirebaseUser;
};
