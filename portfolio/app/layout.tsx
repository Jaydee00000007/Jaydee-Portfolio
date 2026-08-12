import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Portfolio Contact",
  description: "Portfolio contact form with email backend"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
