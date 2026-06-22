import { Navbar } from "./Navbar";
import { ReactNode } from "react";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-12 text-center text-muted-foreground text-sm bg-muted/40">
        <div className="container mx-auto px-4 flex flex-col items-center gap-3">
          <img
            src="/icons/icon-192.png"
            alt="M-ALDBANI"
            className="h-10 w-10 object-contain opacity-80"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <p className="font-heading font-semibold text-foreground/70 text-base tracking-wide">M-ALDBANI</p>
          <p>© {new Date().getFullYear()} محمد الدباني · All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
