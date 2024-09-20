import type { Metadata } from "next";
import "./globals.css";
import Menu from "./(home)/_components/Menu";
import { TransitionProvider } from "@/context/TransitionContext";
import FooterComponent from "./components/footer/FooterComponent";

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
        <TransitionProvider>
          <Menu />
          {children}
          <FooterComponent />
        </TransitionProvider>
      </body>
    </html>
  );
}
