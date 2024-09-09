"use client"

import localFont from "next/font/local";
import "./globals.css";

import { Toaster } from 'react-hot-toast';
import { SessionProvider, getSession } from "next-auth/react";


import Layout from "@/components/@me/Layout";
import LoginModal from "@/components/@me/modals/LoginModal";
import RegisterModal from "@/components/@me/modals/RegisterModal";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-400 via-indigo-500 to-blue-600`}
      >
        <SessionProvider session={session || null}>
          <Toaster />
          <RegisterModal />
          <LoginModal />
          <Layout>
            {children}
          </Layout>
        </SessionProvider>
      </body>
    </html>
  );
}
