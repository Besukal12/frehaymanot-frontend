"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { createContext, useContext } from "react";

type AdminAuthValue = {
  isConfigured: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  getToken: () => Promise<string | null>;
};

const AdminAuthContext = createContext<AdminAuthValue>({
  isConfigured: false,
  isLoaded: true,
  isSignedIn: false,
  getToken: async () => null,
});

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return (
    <AdminAuthContext.Provider
      value={{
        isConfigured: true,
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
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