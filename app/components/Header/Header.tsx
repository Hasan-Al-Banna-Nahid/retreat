"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <span className="text-xl font-bold">Retreat</span>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/">
            <Button variant={pathname === "/" ? "default" : "ghost"}>
              Home
            </Button>
          </Link>
          <Link href="/venues">
            <Button variant={pathname === "/venues" ? "default" : "ghost"}>
              Venues
            </Button>
          </Link>
          <Link href="/bookings">
            <Button variant={pathname === "/bookings" ? "default" : "ghost"}>
              Bookings
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
