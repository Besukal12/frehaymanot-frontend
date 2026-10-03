"use client";

import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { createContext, useContext } from "react";

type AdminAuthValue = {
  isConfigured: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  displayName: string;
  email: string;
  getToken: () => Promise<string | null>;
};

const AdminAuthContext = createContext<AdminAuthValue>({
  isConfigured: false,
  isLoaded: true,
  isSignedIn: false,
  displayName: "Administrator",
  email: "",
  getToken: async () => null,
});

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const displayName =
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Administrator";

  return (
    <AdminAuthContext.Provider
      value={{
        isConfigured: true,
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
        displayName,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        getToken,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  if (!publishableKey) {
    return (
      <AdminAuthContext.Provider
        value={{
          isConfigured: false,
          isLoaded: true,
          isSignedIn: false,
          displayName: "Clerk setup required",
          email: "",
          getToken: async () => null,
        }}
      >
        {children}
      </AdminAuthContext.Provider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/sign-in"
    >
      <ClerkAuthBridge>{children}</ClerkAuthBridge>
    </ClerkProvider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
