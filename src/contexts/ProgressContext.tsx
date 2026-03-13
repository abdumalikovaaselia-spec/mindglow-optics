import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ProgressState {
  completedLessons: string[];
  completedProblems: { id: string; correct: boolean; attempts: number }[];
  simulationsViewed: number;
  quizScore: number;
  totalQuizQuestions: number;
  streak: number;
  badges: string[];
  emotionHistory: { emotion: string; timestamp: number; section: string }[];
}

interface ProgressContextType {
  progress: ProgressState;
  completeLesson: (lessonId: string) => void;
  completeProblem: (problemId: string, correct: boolean) => void;
  viewSimulation: () => void;
  addQuizScore: (correct: boolean) => void;
  addBadge: (badge: string) => void;
  getCompletionPercentage: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>({
    completedLessons: [],
    completedProblems: [],
    simulationsViewed: 0,
    quizScore: 0,
    totalQuizQuestions: 0,
    streak: 0,
    badges: [],
    emotionHistory: [],
  });

  const completeLesson = useCallback((lessonId: string) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId],
    }));
  }, []);

  const completeProblem = useCallback((problemId: string, correct: boolean) => {
    setProgress(prev => {
      const existing = prev.completedProblems.find(p => p.id === problemId);
      const updated = existing
        ? prev.completedProblems.map(p => p.id === problemId ? { ...p, correct, attempts: p.attempts + 1 } : p)
        : [...prev.completedProblems, { id: problemId, correct, attempts: 1 }];
      return {
        ...prev,
        completedProblems: updated,
        streak: correct ? prev.streak + 1 : 0,
        badges: correct && prev.streak + 1 >= 5 && !prev.badges.includes('streak5')
          ? [...prev.badges, 'streak5']
          : prev.badges,
      };
    });
  }, []);

  const viewSimulation = useCallback(() => {
    setProgress(prev => ({ ...prev, simulationsViewed: prev.simulationsViewed + 1 }));
  }, []);

  const addQuizScore = useCallback((correct: boolean) => {
    setProgress(prev => ({
      ...prev,
      quizScore: correct ? prev.quizScore + 1 : prev.quizScore,
      totalQuizQuestions: prev.totalQuizQuestions + 1,
    }));
  }, []);

  const addBadge = useCallback((badge: string) => {
    setProgress(prev => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge],
    }));
  }, []);

  const getCompletionPercentage = useCallback(() => {
    const total = 6; // total lesson sections
    return Math.round((progress.completedLessons.length / total) * 100);
  }, [progress.completedLessons.length]);

  return (
    <ProgressContext.Provider value={{ progress, completeLesson, completeProblem, viewSimulation, addQuizScore, addBadge, getCompletionPercentage }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}
