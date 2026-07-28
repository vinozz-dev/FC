import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Dashboard from "@/pages/dashboard";
import FundingIndex from "@/pages/funding/index";
import FundingCreate from "@/pages/funding/create";
import MentorshipIndex from "@/pages/mentorship/index";
import ResourcesIndex from "@/pages/resources/index";
import CollaborationIndex from "@/pages/collaboration/index";
import EventsIndex from "@/pages/events/index";
import ReelsIndex from "@/pages/reels/index";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  
  return <>{children}</>;
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login">
            <PublicRoute>
              <Login />
            </PublicRoute>
          </Route>
          <Route path="/register">
            <PublicRoute>
              <Register />
            </PublicRoute>
          </Route>
          <Route path="/dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/projects">
            <ProtectedRoute>
              <FundingIndex />
            </ProtectedRoute>
          </Route>
          <Route path="/funding">
            <ProtectedRoute>
              <FundingIndex />
            </ProtectedRoute>
          </Route>
          <Route path="/funding/create">
            <ProtectedRoute>
              <FundingCreate />
            </ProtectedRoute>
          </Route>
          <Route path="/mentorship">
            <ProtectedRoute>
              <MentorshipIndex />
            </ProtectedRoute>
          </Route>
          <Route path="/resources">
            <ProtectedRoute>
              <ResourcesIndex />
            </ProtectedRoute>
          </Route>
          <Route path="/collaboration">
            <ProtectedRoute>
              <CollaborationIndex />
            </ProtectedRoute>
          </Route>
          <Route path="/events">
            <ProtectedRoute>
              <EventsIndex />
            </ProtectedRoute>
          </Route>
          <Route path="/reels">
            <ProtectedRoute>
              <ReelsIndex />
            </ProtectedRoute>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
