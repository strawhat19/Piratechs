'use client';

import { useEffect, useState } from 'react';
import { roleIcons } from '../nav/nav';
import TextReveal from '../effects/text-reveal';
import Spinner from '../loaders/spinners/spinner';
import ElementReveal from '../effects/element-reveal';
import { useGlobalContext } from '@/shared/global-context';
import { capWords } from '@/shared/common/scripts/globals';

type AuthMode = `sign-in` | `sign-up`;

export default function AuthWidget({ 
  mobile = false, 
  defaultOpen = false, 
  showAuthStatus = false, 
  showAccessButton = false,
  showButton = !defaultOpen, 
}: any) {
  const [open, setOpen] = useState(defaultOpen);
  const [mode, setMode] = useState<AuthMode>(`sign-in`);
  const { user, loaded, authStatus, firebaseReady, onSignOut, signInUser, signUpUser, signInWithGoogle } = useGlobalContext();

  const signInLabel = mode == `sign-in` ? `Sign In` : `Sign Up`;
  const modeLabel = mode == `sign-in` ? `Need Access?` : `Have Access?`;
  const userInitial = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? `P`;

  useEffect(() => {
    if (mobile) return;
    document.body.classList.toggle(`authPanelOpen`, open);
    return () => document.body.classList.remove(`authPanelOpen`);
  }, [mobile, open]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get(`name`) ?? ``);
    const email = String(formData.get(`email`) ?? ``);
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
      {showButton && (
        <button
          type={`button`}
          disabled={!loaded}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          title={user?.email || `Sign In`}
          aria-label={user ? `Open profile menu` : `Open sign in form`}
          className={`iconButton authToggle ${user ? `authAvatarToggle` : ``}`}
        >
          {loaded ? (
            user ? (
              <span className={`authAvatarLetter`}>
                {userInitial}
              </span>
            ) : <i className={`fa-solid fa-user`} />
          ) : <Spinner size={20} thickness={5} />}
        </button>
      )}
      <div className={`authPanel ${user ? `wUser` : `noUser`}`}>
        {user ? (
          <div className={`authForm`}>
            <div className={`authUserCard`}>
              <span>{userInitial}</span>
              <div>
                <strong className={`gradientTextColor`}>
                  {capWords(user?.name)}
                </strong>
                <small>{user?.email || `Signed In`}</small>
              </div>
              <div style={{ marginLeft: `auto`, textAlign: `right` }}>
                <strong className={`gradientTextColor`}>
                  Role
                </strong>
                <div className={`flexI alignCenter justifyEnd gap5`}>
                  {(roleIcons as any)?.[user?.role]}
                  <small>{user?.role}</small>
                </div>
              </div>
            </div>
            <button type={`button`} className={`buttonLink primary`} onClick={onSignOut}>
              <ElementReveal>
                <i className={`fa-solid fa-right-from-bracket logoLetter`} />
              </ElementReveal>
              <TextReveal as={`span`} className={`logoLetter`} text={`Sign Out`} />
            </button>
            {authStatus && showAuthStatus ? (
              <small className={`authStatus`}>
                {authStatus}
              </small>
            ) : null}
          </div>
        ) : (
          <form className={`authForm`} onSubmit={onSubmit}>
            <div className={`authHeader`}>
              <strong>{signInLabel}</strong>
              {showAuthStatus && (
                <small>{firebaseReady ? (loaded ? `Firebase Ready` : `Loading`) : `Connect Firebase Env`}</small>
              )}
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
                <ElementReveal>
                  <i className={`fa-solid fa-right-to-bracket logoLetter`} />
                </ElementReveal>
                <TextReveal as={`span`} className={`logoLetter`} text={signInLabel} />
              </button>
              {showAccessButton && (
                <button type={`button`} className={`accessBtn buttonLink ghost`} onClick={() => setMode(mode == `sign-in` ? `sign-up` : `sign-in`)}>
                  {modeLabel}
                </button>
              )}
            </div>
            <button type={`button`} className={`googleButton`} onClick={signInWithGoogle}>
              <ElementReveal>
                <i className={`fa-brands fa-google logoLetter`} />
              </ElementReveal>
              <TextReveal as={`span`} className={`logoLetter`} text={`Google`} />
            </button>
            {authStatus && showAuthStatus ? (
              <small className={`authStatus`}>
                {authStatus}
              </small>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
