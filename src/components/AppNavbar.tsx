import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, Calculator, Brain, TrendingUp, LayoutDashboard, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmotion } from '@/contexts/EmotionContext';

const navItems = [
  { path: '/', label: 'Басты бет', icon: Home },
  { path: '/lesson', label: 'Сабақ', icon: BookOpen },
  { path: '/simulation', label: 'Демо', icon: FlaskConical },
  { path: '/practice', label: 'Есептер', icon: Calculator },
  { path: '/emotion', label: 'Эмоция', icon: Brain },
  { path: '/progress', label: 'Прогресс', icon: TrendingUp },
  { path: '/teacher', label: 'Мұғалім', icon: LayoutDashboard },
];

const emotionEmoji: Record<string, string> = {
  confident: '😊',
  curious: '🤔',
  confused: '😕',
  tired: '😴',
  sad: '😢',
  bored: '😑',
  neutral: '✨',
};

const emotionLabels: Record<string, string> = {
  confident: 'Сенімді',
  curious: 'Қызығушылық',
  confused: 'Шатасқан',
  tired: 'Шаршаңқы',
  sad: 'Жабырқау',
  bored: 'Жалыққан',
  neutral: 'Дайын',
};

export default function AppNavbar() {
  const location = useLocation();
  const { emotion } = useEmotion();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg glow-primary" 
                 style={{ background: 'var(--gradient-primary)' }}>
              <Sparkles className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground hidden sm:inline">
              Optics<span className="text-gradient">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{ background: 'linear-gradient(135deg, hsl(200 90% 55% / 0.1), hsl(330 65% 70% / 0.08))' }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 glass-card px-3 py-1.5 !rounded-full">
            <span className="text-base">{emotionEmoji[emotion.current]}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline font-medium">
              {emotionLabels[emotion.current]}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
