import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminAuthProvider } from "../components/AdminAuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Overview | Fre Haymanot Admin",
    template: "%s | Fre Haymanot Admin",
  },
  description: "Fre Haymanot content and community administration.",
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </body>
    </html>
  );
}
