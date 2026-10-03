"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { useAdminAuth } from "./AdminAuthProvider";

const navigation = [
  { label: "Overview", href: "/overview", icon: "grid" },
  { label: "Mezmurs", href: "/mezmurs", icon: "music" },
  { label: "Categories", href: "/mezmurs/category", icon: "layers" },
  { label: "Courses", href: "/courses", icon: "book" },
  { label: "Announcements", href: "/announcements", icon: "megaphone" },
  { label: "Feedback", href: "/feedbacks", icon: "message" },
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
        <path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h7" />
      </>
    ),
    megaphone: (
      <>
        <path d="m3 11 18-5v12L3 13v-2Z" />
        <path d="m11.6 15.4 1.8 5.1H9.8L8 14.4M21 10v4" />
      </>
    ),
    message: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </>
    ),
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    close: (
      <>
        <path d="m18 6-12 12M6 6l12 12" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
        <path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
  };
  return (
    <span className="icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">{paths[name] ?? paths.grid}</svg>
    </span>
  );
}

export { Icon };

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isConfigured, isSignedIn, displayName, email } = useAdminAuth();
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const current =
    navigation.find((item) => item.href === pathname) ?? navigation[0];

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("fh-admin-theme");
    const shouldUseDark = storedTheme === "dark";
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "default";
    const frame = window.requestAnimationFrame(() => setDark(shouldUseDark));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "default";
    window.localStorage.setItem(
      "fh-admin-theme",
      nextDark ? "dark" : "default",
    );
  }

  return (
    <div className="admin-frame">
      <button
        className={`mobile-scrim${menuOpen ? " visible" : ""}`}
        aria-label="Close navigation"
        onClick={() => setMenuOpen(false)}
      />
      <aside className={`sidebar${menuOpen ? " open" : ""}`}>
        <Link
          href="/overview"
          className="brand-lockup"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-image">
            <Image
              src="/icon.png"
              alt="Fre Haymanot"
              width={42}
              height={42}
              priority
            />
          </span>
          <span>
            <span className="brand-name">Fre Haymanot</span>
            <span className="brand-caption">Administration</span>
          </span>
        </Link>
        <div className="nav-label">Workspace</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navigation.map((item, index) => (
            <div key={item.href}>
              {index === 4 && <div className="nav-divider" />}
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`nav-link${current.href === item.href ? " active" : ""}`}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="sidebar-note">
          <strong>
            {isConfigured
              ? "Keep the community close"
              : "Connect administrator access"}
          </strong>
          <p>
            {isConfigured
              ? "Share a thoughtful update with listeners and learners."
              : "Add Clerk keys to enable sign-in and protected management."}
          </p>
          <Link href={isConfigured ? "/announcements" : "/sign-in"}>
            {isConfigured ? "Create an announcement" : "Open sign-in"}{" "}
            <Icon name="arrow" />
          </Link>
        </div>
        <div className="sidebar-bottom">
          {isConfigured && isSignedIn ? (
            <UserButton />
          ) : (
            <span className="avatar">{initials || "AD"}</span>
          )}
          <span className="account-copy">
            <strong>{displayName}</strong>
            <span>
              {email || (isConfigured ? "Not signed in" : "Setup needed")}
            </span>
          </span>
        </div>
      </aside>

      <main className="admin-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button menu-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
            <span className="crumb">Workspace</span>
            <span className="topbar-divider" />
            <span className="crumb-current">{current.label}</span>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
              title={`Switch to ${dark ? "light" : "dark"} theme`}
            >
              <Icon name={dark ? "sun" : "moon"} />
            </button>
            <button className="icon-button" aria-label="Notifications">
              <Icon name="bell" />
              <span className="notification-dot" />
            </button>
            <div className="topbar-user">
              {isConfigured && isSignedIn ? (
                <UserButton />
              ) : (
                <span className="avatar">{initials || "AD"}</span>
              )}
              <span className="account-copy">
                <strong>{displayName}</strong>
                <span>
                  {email || (isConfigured ? "Not signed in" : "Setup needed")}
                </span>
              </span>
            </div>
          </div>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
