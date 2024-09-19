import type { Metadata } from "next";
import "./globals.css";
import Menu from "./(home)/_components/Menu";

export const metadata: Metadata = {
  title: "Eggs & Bakey Marketing Agency",
  description: "Marketing Agency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body>
        <Menu />
        {children}
      </body>
    </html>
  );
}
