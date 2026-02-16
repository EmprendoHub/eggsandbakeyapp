"use client";

import { usePathname } from "next/navigation";
import Menu from "../(home)/_components/Menu";

export default function ConditionalMenu() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return <Menu />;
}
