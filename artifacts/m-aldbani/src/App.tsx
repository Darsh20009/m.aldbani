import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { LanguageProvider } from "./hooks/use-language";
import { SplashScreen } from "./components/SplashScreen";

// Public pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Portfolio from "@/pages/portfolio";
import PortfolioDetail from "@/pages/portfolio-detail";
import Services from "@/pages/services";
import Articles from "@/pages/articles";
import ArticleDetail from "@/pages/article-detail";
import Contact from "@/pages/contact";
import Book from "@/pages/book";
import Community from "@/pages/community";
import NotFound from "@/pages/not-found";

// Auth pages
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";

// Client pages
import ClientDashboard from "@/pages/client/dashboard";
import ClientConsultations from "@/pages/client/consultations";
import ClientMessages from "@/pages/client/messages";
import ClientFiles from "@/pages/client/files";
import ClientInvoices from "@/pages/client/invoices";

// Admin pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLeads from "@/pages/admin/leads";
import AdminClients from "@/pages/admin/clients";
import AdminConsultations from "@/pages/admin/consultations";
import AdminProjects from "@/pages/admin/projects";
import AdminArticles from "@/pages/admin/articles";
import AdminServices from "@/pages/admin/services";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminSettings from "@/pages/admin/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
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
      
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />

      <Route path="/client" component={ClientDashboard} />
      <Route path="/client/consultations" component={ClientConsultations} />
      <Route path="/client/messages" component={ClientMessages} />
      <Route path="/client/files" component={ClientFiles} />
      <Route path="/client/invoices" component={ClientInvoices} />

      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/admin/clients" component={AdminClients} />
      <Route path="/admin/consultations" component={AdminConsultations} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/articles" component={AdminArticles} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/settings" component={AdminSettings} />

      <Route component={NotFound} />
    </Switch>
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
