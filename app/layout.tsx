import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "NEXIUM Storage",
  description: "Object storage for developers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0f] text-gray-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
