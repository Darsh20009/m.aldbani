import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { LanguageProvider } from "./hooks/use-language";
import { SplashScreen } from "./components/SplashScreen";

// ── Public pages — loaded on demand ──────────────────────────────────────────
const Home            = lazy(() => import("@/pages/home"));
const About           = lazy(() => import("@/pages/about"));
const Portfolio       = lazy(() => import("@/pages/portfolio"));
const PortfolioDetail = lazy(() => import("@/pages/portfolio-detail"));
const Services        = lazy(() => import("@/pages/services"));
const Articles        = lazy(() => import("@/pages/articles"));
const ArticleDetail   = lazy(() => import("@/pages/article-detail"));
const Contact         = lazy(() => import("@/pages/contact"));
const Book            = lazy(() => import("@/pages/book"));
const Community       = lazy(() => import("@/pages/community"));
const NotFound        = lazy(() => import("@/pages/not-found"));

// ── Auth pages ────────────────────────────────────────────────────────────────
const Login        = lazy(() => import("@/pages/auth/login"));
const Register     = lazy(() => import("@/pages/auth/register"));
const AuthCallback = lazy(() => import("@/pages/auth/callback"));

// ── Client pages ──────────────────────────────────────────────────────────────
const ClientDashboard     = lazy(() => import("@/pages/client/dashboard"));
const ClientConsultations = lazy(() => import("@/pages/client/consultations"));
const ClientMessages      = lazy(() => import("@/pages/client/messages"));
const ClientFiles         = lazy(() => import("@/pages/client/files"));
const ClientInvoices      = lazy(() => import("@/pages/client/invoices"));

// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminDashboard     = lazy(() => import("@/pages/admin/dashboard"));
const AdminLeads         = lazy(() => import("@/pages/admin/leads"));
const AdminClients       = lazy(() => import("@/pages/admin/clients"));
const AdminConsultations = lazy(() => import("@/pages/admin/consultations"));
const AdminProjects      = lazy(() => import("@/pages/admin/projects"));
const AdminArticles      = lazy(() => import("@/pages/admin/articles"));
const AdminServices      = lazy(() => import("@/pages/admin/services"));
const AdminAnalytics     = lazy(() => import("@/pages/admin/analytics"));
const AdminSettings      = lazy(() => import("@/pages/admin/settings"));
const AdminEmail         = lazy(() => import("@/pages/admin/email"));
const AdminFaqs          = lazy(() => import("@/pages/admin/faqs"));

// ── Query client — 5-min staleTime prevents re-fetch on every navigation ──────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

/** Minimal spinner shown while a lazy page chunk loads */
function PageLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-white">
      <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Public */}
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/portfolio/:id" component={PortfolioDetail} />
        <Route path="/services" component={Services} />
        <Route path="/articles" component={Articles} />
        <Route path="/articles/:slug" component={ArticleDetail} />
        <Route path="/contact" component={Contact} />
        <Route path="/book" component={Book} />
        <Route path="/community" component={Community} />

        {/* Auth */}
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/register" component={Register} />
        <Route path="/auth/callback" component={AuthCallback} />

        {/* Client */}
        <Route path="/client" component={ClientDashboard} />
        <Route path="/client/consultations" component={ClientConsultations} />
        <Route path="/client/messages" component={ClientMessages} />
        <Route path="/client/files" component={ClientFiles} />
        <Route path="/client/invoices" component={ClientInvoices} />

        {/* Admin */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/leads" component={AdminLeads} />
        <Route path="/admin/clients" component={AdminClients} />
        <Route path="/admin/consultations" component={AdminConsultations} />
        <Route path="/admin/projects" component={AdminProjects} />
        <Route path="/admin/articles" component={AdminArticles} />
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/analytics" component={AdminAnalytics} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin/email" component={AdminEmail} />
        <Route path="/admin/faqs" component={AdminFaqs} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <SplashScreen />
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
