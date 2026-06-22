import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import { Link } from "wouter";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-3">
              <img src={logoPath} alt="m-aldbani" className="h-12 w-auto object-contain" />
              <p className="text-xs text-muted-foreground max-w-xs text-center md:text-start">
                Business Development · Operations · Brand Strategy
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center text-sm text-muted-foreground font-medium">
              {[
                { href: "/about",     label: "About" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/articles",  label: "Articles" },
                { href: "/contact",   label: "Contact" },
                { href: "/book",      label: "Book" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="text-center md:text-end">
              <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} محمد الدباني</p>
              <p className="text-xs text-muted-foreground">All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
