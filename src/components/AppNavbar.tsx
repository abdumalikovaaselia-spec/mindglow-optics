import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, Calculator, Brain, TrendingUp, LayoutDashboard, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmotion } from '@/contexts/EmotionContext';

// Anime avatars
import girlConfident from '@/assets/emotions/girl-confident.png';
import girlCurious from '@/assets/emotions/girl-curious.png';
import girlConfused from '@/assets/emotions/girl-confused.png';
import girlTired from '@/assets/emotions/girl-tired.png';
import girlSad from '@/assets/emotions/girl-sad.png';
import girlBored from '@/assets/emotions/girl-bored.png';
import girlNeutral from '@/assets/emotions/girl-neutral.png';
import boyConfident from '@/assets/emotions/boy-confident.png';
import boyCurious from '@/assets/emotions/boy-curious.png';
import boyConfused from '@/assets/emotions/boy-confused.png';
import boyTired from '@/assets/emotions/boy-tired.png';
import boySad from '@/assets/emotions/boy-sad.png';
import boyBored from '@/assets/emotions/boy-bored.png';
import boyNeutral from '@/assets/emotions/boy-neutral.png';

import type { EmotionType, GenderType } from '@/contexts/EmotionContext';

const avatarMap: Record<GenderType, Record<EmotionType, string>> = {
  girl: { confident: girlConfident, curious: girlCurious, confused: girlConfused, tired: girlTired, sad: girlSad, bored: girlBored, neutral: girlNeutral },
  boy: { confident: boyConfident, curious: boyCurious, confused: boyConfused, tired: boyTired, sad: boySad, bored: boyBored, neutral: boyNeutral },
};

const navItems = [
  { path: '/', label: 'Басты бет', icon: Home },
  { path: '/lesson', label: 'Сабақ', icon: BookOpen },
  { path: '/simulation', label: 'Демо', icon: FlaskConical },
  { path: '/practice', label: 'Есептер', icon: Calculator },
  { path: '/emotion', label: 'Эмоция', icon: Brain },
  { path: '/progress', label: 'Прогресс', icon: TrendingUp },
  { path: '/teacher', label: 'Мұғалім', icon: LayoutDashboard },
];

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
  const { emotion, gender } = useEmotion();

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
            <img
              src={avatarMap[gender][emotion.current]}
              alt={emotionLabels[emotion.current]}
              className="w-8 h-8 object-contain"
            />
            <span className="text-xs text-muted-foreground hidden sm:inline font-medium">
              {emotionLabels[emotion.current]}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
