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
import { InvitesTab } from "@/pages/mentor/invites-tab";
import { SettingsTab } from "@/pages/mentor/settings-tab";
import { ClientTestsTab } from "@/pages/client/tests-tab";
import { ClientProfileTab } from "@/pages/client/profile-tab";
import { ResultsTab } from "@/pages/client/results-tab";
import { AchievementsTab } from "@/pages/client/achievements-tab";
import MentorAssistantPage from "@/pages/mentor/assistant-page";
import ClientAssistantPage from "@/pages/client/assistant-page";

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
      <ProtectedRoute path="/mentor-dashboard/invites" component={InvitesTab} />
      <ProtectedRoute path="/mentor-dashboard/settings" component={SettingsTab} />
      <ProtectedRoute path="/mentor-dashboard/profile" component={ProfileTab} />
      <ProtectedRoute path="/mentor-dashboard/assistant" component={MentorAssistantPage} />
      
      {/* Dashboard do cliente e sub-rotas */}
      <ProtectedRoute path="/client-dashboard" component={ClientDashboard} />
      <ProtectedRoute path="/client-dashboard/tests" component={ClientTestsTab} />
      <ProtectedRoute path="/client-dashboard/results" component={ResultsTab} />
      <ProtectedRoute path="/client-dashboard/achievements" component={AchievementsTab} />
      <ProtectedRoute path="/client-dashboard/profile" component={ClientProfileTab} />
      <ProtectedRoute path="/client-dashboard/assistant" component={ClientAssistantPage} />
      
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
