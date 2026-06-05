'use client';

import { useEffect, useRef, useState } from 'react';
import { config } from '@/shared/config/config';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const notifications = config.topBarItems;
  const unreadCount = notifications.length;

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

  return (
    <div ref={wrapRef} className={`notificationWidget ${open ? `notificationOpen` : ``}`}>
      <button
        type={`button`}
        aria-expanded={open}
        className={`iconButton notificationToggle`}
        aria-label={`Open notifications`}
        onClick={() => setOpen(!open)}
      >
        <i className={`fa-solid fa-bell`} />
        <span className={`notificationBadge`}>{unreadCount}</span>
      </button>
      <div className={`notificationPanel`}>
        <div className={`notificationHeader`}>
          <span>
            <strong>Notifications</strong>
            <small>{unreadCount} Piratechs Highlight(s)</small>
          </span>
          <i className={`fa-solid fa-satellite-dish`} />
        </div>
        <div className={`notificationList`}>
          {notifications.map(item => (
            <article key={`${item.label}-${item.text}`} className={`notificationItem`}>
              <span className={`notificationIcon`}>
                <i className={item.icon} />
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
