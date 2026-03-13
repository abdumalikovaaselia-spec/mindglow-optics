import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, Calculator, Brain, TrendingUp, LayoutDashboard, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmotion } from '@/contexts/EmotionContext';

const navItems = [
  { path: '/', label: 'Басты бет', icon: Home },
  { path: '/lesson', label: 'Сабақ', icon: BookOpen },
  { path: '/simulation', label: 'Демонстрация', icon: FlaskConical },
  { path: '/practice', label: 'Есептер', icon: Calculator },
  { path: '/emotion', label: 'Эмоция', icon: Brain },
  { path: '/progress', label: 'Прогресс', icon: TrendingUp },
  { path: '/teacher', label: 'Мұғалім', icon: LayoutDashboard },
];

const emotionColors: Record<string, string> = {
  confident: 'bg-success',
  curious: 'bg-secondary',
  confused: 'bg-warning',
  tired: 'bg-muted-foreground',
  sad: 'bg-secondary',
  bored: 'bg-muted-foreground',
  neutral: 'bg-primary',
};

export default function AppNavbar() {
  const location = useLocation();
  const { emotion } = useEmotion();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">O</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground hidden sm:inline">
              Optics<span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-accent rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full animate-pulse-glow", emotionColors[emotion.current])} />
            <span className="text-xs text-muted-foreground hidden sm:inline font-medium">
              {emotion.current === 'neutral' ? 'Дайын' : emotion.current === 'confident' ? 'Сенімді' : emotion.current === 'confused' ? 'Шатасқан' : emotion.current === 'tired' ? 'Шаршаңқы' : emotion.current === 'curious' ? 'Қызығушылық' : emotion.current === 'sad' ? 'Жабырқау' : 'Жалыққан'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
