import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import MentorDashboard from "@/pages/mentor-dashboard";
import ClientDashboard from "@/pages/client-dashboard";
import TestAssignmentKanban from "@/pages/mentor/test-assignment-kanban";
import { ClientsTab } from "@/pages/mentor/clients-tab";
import { ProfileTab } from "@/pages/mentor/profile-tab";
import { TestsTab } from "@/pages/mentor/tests-tab";
import { AnalyticsTab } from "@/pages/mentor/analytics-tab";
import { GamificationTab } from "@/pages/mentor/gamification-tab";
import { ClientTestsTab } from "@/pages/client/tests-tab";
import { ClientProfileTab } from "@/pages/client/profile-tab";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Dashboard do mentor e sub-rotas */}
      <ProtectedRoute path="/mentor-dashboard" component={MentorDashboard} />
      <ProtectedRoute path="/mentor-dashboard/clients" component={ClientsTab} />
      <ProtectedRoute path="/mentor-dashboard/tests" component={TestsTab} />
      <ProtectedRoute path="/mentor-dashboard/test-assignment" component={TestAssignmentKanban} />
      <ProtectedRoute path="/mentor-dashboard/analytics" component={AnalyticsTab} />
      <ProtectedRoute path="/mentor-dashboard/gamification" component={GamificationTab} />
      <ProtectedRoute path="/mentor-dashboard/profile" component={ProfileTab} />
      
      {/* Dashboard do cliente e sub-rotas */}
      <ProtectedRoute path="/client-dashboard" component={ClientDashboard} />
      <ProtectedRoute path="/client-dashboard/tests" component={ClientTestsTab} />
      <ProtectedRoute path="/client-dashboard/profile" component={ClientProfileTab} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
