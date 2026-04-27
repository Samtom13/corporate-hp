import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bond | Private Tours in Kyoto",
  description: "A fully personalized experience. Be part of Japan, not just a visitor.",
  openGraph: {
    title: "Bond | Private Tours in Kyoto",
    description: "A fully personalized experience. Be part of Japan, not just a visitor.",
    siteName: "Bond",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
