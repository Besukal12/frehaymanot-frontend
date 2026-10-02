"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Icon } from "./AdminShell";

type AuthMode = "signin" | "signup" | "forgot";

const copy: Record<AuthMode, { title: string; intro: string; action: string }> =
  {
    signin: {
      title: "Welcome back",
      intro: "Sign in to continue caring for your community.",
      action: "Sign in",
    },
    signup: {
      title: "Create your account",
      intro: "Set up your administrator access to Fre Haymanot.",
      action: "Create account",
    },
    forgot: {
      title: "Reset your password",
      intro: "Enter your email and we’ll prepare reset instructions.",
      action: "Send reset link",
    },
  };

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const [dark, setDark] = useState(false);
  const [message, setMessage] = useState("");
  const pageCopy = copy[mode];

  useEffect(() => {
    const isDark = window.localStorage.getItem("fh-admin-theme") === "dark";
    setDark(isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "default";
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "This sign-in preview is not connected to an account service yet.",
    );
  }

  return (
    <main className="auth-page">
      <button
        className="icon-button auth-theme"
        onClick={toggleTheme}
        aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
        title={`Switch to ${dark ? "light" : "dark"} theme`}
      >
        <Icon name={dark ? "sun" : "moon"} />
      </button>
      <section className="auth-art" aria-label="Fre Haymanot welcome">
        <Link href="/overview" className="auth-brand">
          <span className="brand-mark">ፍ</span>
          <span>
            <span className="brand-name">Fre Haymanot</span>
            <span className="brand-caption">Administration</span>
          </span>
        </Link>
        <div className="auth-art-copy">
          <div className="eyebrow">A place to grow together</div>
          <h1>Faith, learning, and community.</h1>
          <p>
            Care for the stories, songs, and shared wisdom that bring your
            community closer.
          </p>
        </div>
        <div className="auth-quote">
          “Where two or three are gathered in my name, there am I among them.”
          <strong>Matthew 18:20</strong>
        </div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <Link href="/overview" className="auth-mobile-brand">
            <span className="brand-mark">ፍ</span>
            <span>
              <span className="brand-name">Fre Haymanot</span>
              <span className="brand-caption">Administration</span>
            </span>
          </Link>
          <div className="eyebrow">Administrator access</div>
          <h2>{pageCopy.title}</h2>
          <p className="auth-intro">{pageCopy.intro}</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="field">
                <label htmlFor="auth-name">Full name</label>
                <input
                  id="auth-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>
            {mode !== "forgot" && (
              <div className="field">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  placeholder="Enter your password"
                  minLength={8}
                  required
                />
              </div>
            )}
            {mode === "signin" && (
              <div className="auth-form-options">
                <label className="check-label">
                  <input type="checkbox" name="remember" /> Keep me signed in
                </label>
                <Link href="/forgot-password">Forgot password?</Link>
              </div>
            )}
            {mode === "signup" && (
              <div className="field">
                <label htmlFor="auth-confirm-password">Confirm password</label>
                <input
                  id="auth-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  minLength={8}
                  required
                />
              </div>
            )}
            <button className="button button-primary" type="submit">
              {pageCopy.action}
              <Icon name="arrow" />
            </button>
            {message && (
              <p className="auth-intro" role="status">
                {message}
              </p>
            )}
          </form>
          <div className="auth-separator">SECURE ADMINISTRATOR PORTAL</div>
          <p className="auth-switch">
            {mode === "signin" ? (
              <>
                New to the admin portal?{" "}
                <Link href="/sign-up">Request an account</Link>
              </>
            ) : mode === "signup" ? (
              <>
                Already have access? <Link href="/sign-in">Sign in</Link>
              </>
            ) : (
              <>
                Remembered your password?{" "}
                <Link href="/sign-in">Return to sign in</Link>
              </>
            )}
          </p>
          <p className="auth-footnote">
            © 2026 Fre Haymanot · Made for the community
          </p>
        </div>
      </section>
    </main>
  );
}
