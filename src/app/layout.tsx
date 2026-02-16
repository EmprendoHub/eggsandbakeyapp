import type { Metadata } from "next";
import "./globals.css";
import { TransitionProvider } from "@/context/TransitionContext";
import ConditionalMenu from "./components/ConditionalMenu";

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
          <ConditionalMenu />
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
