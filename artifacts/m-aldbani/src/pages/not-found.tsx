import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <RootLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-9xl font-bold font-mono text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold font-heading mb-6">Page Not Found</h2>
        <p className="text-foreground/60 mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
            Return to Home
          </Button>
        </Link>
      </div>
    </RootLayout>
  );
}
