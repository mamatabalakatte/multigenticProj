import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-IROS // Investment Research Operating System",
  description: "Bloomberg-style AI Multi-Agent Boardroom Decision System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
