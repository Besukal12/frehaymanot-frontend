"use client";

import Link from "next/link";
import Image from "next/image";
import { SignIn as ClerkSignIn, SignUp as ClerkSignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useAdminAuth } from "./AdminAuthProvider";
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
  const { isConfigured } = useAdminAuth();
  const pageCopy = copy[mode];

  useEffect(() => {
    const isDark = window.localStorage.getItem("fh-admin-theme") === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "default";
    const frame = window.requestAnimationFrame(() => setDark(isDark));
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
          <div className="eyebrow">Administrator access</div>
          <h2>{pageCopy.title}</h2>
          <p className="auth-intro">{pageCopy.intro}</p>
          {isConfigured ? (
            <div className="clerk-widget">
              {mode === "signup" ? (
                <ClerkSignUp
                  routing="hash"
                  signInUrl="/sign-in"
                  fallbackRedirectUrl="/overview"
                  appearance={{
                    variables: {
                      colorPrimary: "var(--primary)",
                      colorForeground: "var(--ink)",
                      colorMutedForeground: "var(--muted)",
                      colorBackground: "var(--surface)",
                      colorInput: "var(--background)",
                      colorInputForeground: "var(--ink)",
                      borderRadius: "6px",
                    },
                    elements: { rootBox: "clerk-root", card: "clerk-card" },
                  }}
                />
              ) : (
                <ClerkSignIn
                  routing="hash"
                  signUpUrl="/sign-up"
                  fallbackRedirectUrl="/overview"
                  appearance={{
                    variables: {
                      colorPrimary: "var(--primary)",
                      colorForeground: "var(--ink)",
                      colorMutedForeground: "var(--muted)",
                      colorBackground: "var(--surface)",
                      colorInput: "var(--background)",
                      colorInputForeground: "var(--ink)",
                      borderRadius: "6px",
                    },
                    elements: { rootBox: "clerk-root", card: "clerk-card" },
                  }}
                />
              )}
            </div>
          ) : (
            <div className="setup-notice" role="status">
              <strong>Clerk is not configured yet</strong>
              <p>
                Add the Clerk publishable key and secret key to the frontend
                environment to enable secure sign-in.
              </p>
            </div>
          )}
          {mode === "forgot" && (
            <p className="auth-switch">
              Password recovery is available from the Clerk sign-in panel.{" "}
              <Link href="/sign-in">Return to sign in</Link>
            </p>
          )}
          <p className="auth-footnote">
            © 2026 Fre Haymanot · Made for the community
          </p>
        </div>
      </section>
    </main>
  );
}
