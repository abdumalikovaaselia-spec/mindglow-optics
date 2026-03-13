import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EmotionProvider } from "@/contexts/EmotionContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import AppNavbar from "@/components/AppNavbar";
import EmotionCompanion from "@/components/EmotionCompanion";
import LandingPage from "./pages/LandingPage";
import LessonPage from "./pages/LessonPage";
import SimulationPage from "./pages/SimulationPage";
import PracticePage from "./pages/PracticePage";
import EmotionPage from "./pages/EmotionPage";
import ProgressPage from "./pages/ProgressPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EmotionProvider>
        <ProgressProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppNavbar />
            <EmotionCompanion />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/lesson" element={<LessonPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/emotion" element={<EmotionPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProgressProvider>
      </EmotionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
