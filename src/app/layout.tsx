import type { Metadata } from "next";
import "./globals.css";
import Menu from "./(home)/_components/Menu";
import { TransitionProvider } from "@/context/TransitionContext";

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
    <html lang="en">
      <body className="overflow-x-hidden">
        <TransitionProvider>
          <Menu />
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
