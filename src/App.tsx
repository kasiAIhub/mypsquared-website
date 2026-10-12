import { Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Home from "./pages/Index";
import AssessmentPage from "./pages/AssessmentPage";
import StartPage from "./pages/StartPage";
import CurriculumPage from "./pages/CurriculumPage";
import RegistrationPage from "./pages/RegistrationPage";
import MyHomeschoolingCoachPage from "./pages/MyHomeschoolingCoachPage";
import AboutPage from "./pages/AboutPage";
import DBERegistrationPage from "./pages/DBERegistrationPage";
import ForHomeschoolersPage from "./pages/ForHomeschoolersPage";
import ForSchoolParentsPage from "./pages/ForSchoolParentsPage";
import MyApplicationPage from "./pages/MyApplicationPage";
import LearnerBlueprintPage from "./pages/LearnerBlueprintPage";
import Results from "./pages/Results";
import MotivationalLetterGuidePage from "./pages/MotivationalLetterGuidePage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogIndexPage from "./pages/BlogIndexPage";
import ChildIsCurriculumPage from "./pages/ChildIsCurriculumPage";
import NotFound from "./pages/NotFound";
import WaitlistPage from "./pages/WaitlistPage";
import ResetPassword from "./pages/admin/ResetPassword";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import MigrateData from "./pages/admin/MigrateData";

const queryClient = new QueryClient();

export const AppRoutes = () => (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/start" element={<StartPage />} />
            <Route path="/curriculum" element={<Navigate to="/learner-blueprint" replace />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/my-learning-coach" element={<MyHomeschoolingCoachPage />} />
            <Route path="/my-homeschooling-coach" element={<Navigate to="/my-learning-coach" replace />} />
            <Route path="/learning-coach" element={<Navigate to="/my-learning-coach" replace />} />
            <Route path="/7-day-reset" element={<Navigate to="/assessment" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dbe-registration" element={<DBERegistrationPage />} />
            <Route path="/for-homeschoolers" element={<ForHomeschoolersPage />} />
            <Route path="/for-mainstream-parents" element={<ForSchoolParentsPage />} />
            <Route path="/my-application/:ref" element={<MyApplicationPage />} />
            <Route path="/learner-blueprint" element={<LearnerBlueprintPage />} />
            <Route path="/results" element={<Results />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/dbe-registration-motivational-letter" element={<MotivationalLetterGuidePage />} />
            <Route path="/blog/what-to-teach-children-age-of-ai" element={<ChildIsCurriculumPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/migrate-data"
              element={
                <ProtectedRoute>
                  <MigrateData />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
