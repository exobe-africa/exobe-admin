import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "../context/AdminContext";
import { UIProvider } from "../context/UIContext";
import { ToastProvider } from "../context/ToastContext";
import ApolloProviderWrapper from "../components/providers/ApolloProviderWrapper";
import AuthGuard from "../components/providers/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eXobe Admin Dashboard",
  description: "Administrative dashboard for managing eXobe platforms, vendors, users, and data.",
  keywords: "admin, dashboard, management, eXobe",
  authors: [{ name: "Alex Sexwale" }],
  robots: "noindex, nofollow",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloProviderWrapper>
          <ToastProvider>
            <UIProvider>
              <AdminProvider>
                <AuthGuard>
                  {children}
                </AuthGuard>
              </AdminProvider>
            </UIProvider>
          </ToastProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
