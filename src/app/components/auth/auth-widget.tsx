'use client';

import { useState } from 'react';
import { useGlobalContext } from '@/shared/global-context';

type AuthMode = `sign-in` | `sign-up`;

export default function AuthWidget({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>(`sign-in`);
  const { user, loaded, authStatus, firebaseReady, onSignOut, signInUser, signUpUser, signInWithGoogle } = useGlobalContext();

  const signInLabel = mode == `sign-in` ? `Sign In` : `Sign Up`;
  const modeLabel = mode == `sign-in` ? `Need Access?` : `Have Access?`;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get(`email`) ?? ``);
    const name = String(formData.get(`name`) ?? ``);
    const password = String(formData.get(`password`) ?? ``);
    try {
      if (mode == `sign-in`) {
        await signInUser(email, password);
      } else {
        await signUpUser(email, password, name);
      }
      form.reset();
    } catch (error) {
      console.log(`Auth Error`, error);
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
        {user ? (
          <div className={`authForm`}>
            <div className={`authUserCard`}>
              <span>{user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? `P`}</span>
              <div>
                <strong>{user.name}</strong>
                <small>{user.email || `Signed In`}</small>
              </div>
            </div>
            <button type={`button`} className={`buttonLink primary`} onClick={onSignOut}>
              <i className={`fa-solid fa-right-from-bracket`} />
              Sign Out
            </button>
            {authStatus ? <small className={`authStatus`}>{authStatus}</small> : null}
          </div>
        ) : (
          <form className={`authForm`} onSubmit={onSubmit}>
            <div className={`authHeader`}>
              <strong>{signInLabel}</strong>
              <small>{firebaseReady ? (loaded ? `Firebase Ready` : `Loading`) : `Connect Firebase Env`}</small>
            </div>
            {mode == `sign-up` ? (
              <label>
                <span>Name</span>
                <input name={`name`} type={`text`} placeholder={`Piratechs User`} autoComplete={`name`} />
              </label>
            ) : null}
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
            <button type={`button`} className={`googleButton`} onClick={signInWithGoogle}>
              <i className={`fa-brands fa-google`} />
              Google
            </button>
            {authStatus ? <small className={`authStatus`}>{authStatus}</small> : null}
          </form>
        )}
      </div>
    </div>
  );
}
