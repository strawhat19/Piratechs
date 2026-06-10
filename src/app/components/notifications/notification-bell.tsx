'use client';

import { config } from '@/shared/config/config';
import { useEffect, useRef, useState } from 'react';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const notifications = config.topBarItems;
  const unreadCount = notifications.length;
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key == `Escape`) setOpen(false);
    };

    document.addEventListener(`click`, onDocumentClick);
    document.addEventListener(`keydown`, onEscape);

    return () => {
      document.removeEventListener(`click`, onDocumentClick);
      document.removeEventListener(`keydown`, onEscape);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle(`notificationPanelOpen`, open);
    return () => document.body.classList.remove(`notificationPanelOpen`);
  }, [open]);

  return (
    <div ref={wrapRef} className={`notificationWidget ${open ? `notificationOpen` : ``}`}>
      <button
        type={`button`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        aria-label={`Open notifications`}
        className={`iconButton notificationToggle`}
      >
        <i className={`fa-solid fa-bell`} />
        <span className={`notificationBadge gradientBGi`}>
          {unreadCount}
        </span>
      </button>
      <div className={`notificationPanel`}>
        <div className={`notificationHeader`}>
          <span>
            <strong>Notifications</strong>
            <small>{unreadCount} Piratechs Highlight(s)</small>
          </span>
          <i className={`fa-solid fa-satellite-dish gradientTextColor`} />
        </div>
        <div className={`notificationList ${notifications?.length > 5 ? `overflowingNotificationList` : ``}`}>
          {notifications.map(item => (
            <article key={`${item.label}-${item.text}`} className={`notificationItem`}>
              <span className={`notificationIcon`}>
                <i className={`${item.icon} gradientTextColor`} />
              </span>
              <span className={`notificationCopy`}>
                {item.label ? <strong>{item.label}</strong> : null}
                <small>{item.text}</small>
              </span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
