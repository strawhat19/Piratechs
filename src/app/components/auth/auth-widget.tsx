'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { firebaseEnvReady, getFirebaseAuth, getGoogleProvider } from '@/shared/lib/firebase';

type AuthMode = `sign-in` | `sign-up`;

export default function AuthWidget({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(``);
  const [mode, setMode] = useState<AuthMode>(`sign-in`);

  const signInLabel = mode == `sign-in` ? `Sign In` : `Sign Up`;
  const modeLabel = mode == `sign-in` ? `Need Access?` : `Have Access?`;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const auth = getFirebaseAuth();
    if (auth == null) {
      setStatus(`Firebase Env Needed`);
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get(`email`) ?? ``);
    const password = String(formData.get(`password`) ?? ``);
    try {
      setStatus(`${signInLabel}...`);
      if (mode == `sign-in`) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setStatus(`${signInLabel} Ready`);
      form.reset();
    } catch (error) {
      setStatus(`Auth Needs Setup`);
      console.log(`Auth Error`, error);
    }
  };

  const onGoogleSignIn = async () => {
    const auth = getFirebaseAuth();
    if (auth == null) {
      setStatus(`Firebase Env Needed`);
      return;
    }
    try {
      setStatus(`Google Sign In...`);
      await signInWithPopup(auth, getGoogleProvider());
      setStatus(`Google Sign In Ready`);
    } catch (error) {
      setStatus(`Google Needs Setup`);
      console.log(`Google Auth Error`, error);
    }
  };

  return (
    <div className={`authWidget ${open ? `authOpen` : ``} ${mobile ? `mobileAuthWidget` : ``}`}>
      <button
        type={`button`}
        aria-expanded={open}
        className={`iconButton authToggle`}
        aria-label={`Open sign in form`}
        onClick={() => setOpen(!open)}
      >
        <i className={`fa-solid fa-user`} />
      </button>
      <div className={`authPanel`}>
        <form className={`authForm`} onSubmit={onSubmit}>
          <div className={`authHeader`}>
            <strong>{signInLabel}</strong>
            <small>{firebaseEnvReady() ? `Firebase Ready` : `Connect Firebase Env`}</small>
          </div>
          <label>
            <span>Email</span>
            <input name={`email`} type={`email`} placeholder={`you@example.com`} autoComplete={`email`} required />
          </label>
          <label>
            <span>Password</span>
            <input name={`password`} type={`password`} placeholder={`Password`} autoComplete={`current-password`} minLength={6} required />
          </label>
          <div className={`authActions`}>
            <button type={`submit`} className={`buttonLink primary`}>
              {signInLabel}
            </button>
            <button type={`button`} className={`buttonLink ghost`} onClick={() => setMode(mode == `sign-in` ? `sign-up` : `sign-in`)}>
              {modeLabel}
            </button>
          </div>
          <button type={`button`} className={`googleButton`} onClick={onGoogleSignIn}>
            <i className={`fa-brands fa-google`} />
            Google
          </button>
          {status ? <small className={`authStatus`}>{status}</small> : null}
        </form>
      </div>
    </div>
  );
}
