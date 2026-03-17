import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EmotionProvider } from "@/contexts/EmotionContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import AppNavbar from "@/components/AppNavbar";
import EmotionCompanion from "@/components/EmotionCompanion";
import AIChatAssistant from "@/components/AIChatAssistant";
import EmotionPage from "./pages/EmotionPage";
import LessonPage from "./pages/LessonPage";
import SimulationPage from "./pages/SimulationPage";
import PracticePage from "./pages/PracticePage";
import ProgressPage from "./pages/ProgressPage";
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
            <AIChatAssistant />
            <Routes>
              <Route path="/" element={<EmotionPage />} />
              <Route path="/lesson" element={<LessonPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProgressProvider>
      </EmotionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
