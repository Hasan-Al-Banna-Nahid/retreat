import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/app/providers/QueryProviders";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/app/components/Header";

const font = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotel Venue Booking",
  description: "Book venues for team offsites",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <QueryProvider>
          <Header />
          <main className="container py-8">{children}</main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
