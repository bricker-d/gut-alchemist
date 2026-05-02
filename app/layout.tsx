import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Gut Alchemist Protocol — Elias Root",
  description:
    "Identify the hidden inflammatory triggers destroying your gut. A 21-day protocol built on ancient wisdom, confirmed by modern science.",
  openGraph: {
    title: "The Gut Alchemist Protocol",
    description:
      "Your body isn't broken. It's responding. Here's what it's responding to.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
