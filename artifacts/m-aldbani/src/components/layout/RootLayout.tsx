import { Navbar } from "./Navbar";
import { ReactNode } from "react";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-white/10 py-12 text-center text-white/50 text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} M-ALDBANI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
