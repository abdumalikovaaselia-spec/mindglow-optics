import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, TrendingDown, BarChart3, Shield, BookOpen, UserX } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const commonErrors = [
  { topic: 'Снелл заңын қолдану', count: 12 },
  { topic: 'Бұрыштарды нормальдан өлшеу', count: 8 },
  { topic: 'Сыну көрсеткіші', count: 6 },
  { topic: 'Толық ішкі шағылу', count: 4 },
];

export default function TeacherDashboard() {
  const { progress } = useProgress();

  // Only show current user if they have completed any tasks
  const hasActivity = progress.completedLessons.length > 0 || 
                      progress.completedProblems.length > 0 || 
                      progress.simulationsViewed > 0;

  const correctProblems = progress.completedProblems.filter(p => p.correct).length;
  const totalProblems = progress.completedProblems.length;
  const accuracy = totalProblems > 0 ? Math.round((correctProblems / totalProblems) * 100) : 0;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg glow-primary"
               style={{ background: 'var(--gradient-primary)' }}>
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Мұғалім панелі</h1>
            <p className="text-sm text-muted-foreground">Оқушылардың үлгерімі мен аналитикасы</p>
          </div>
        </div>

        {/* Privacy note */}
        <div className="glass-card-blue p-4 mb-8 mt-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Эмоция деректері жалпыланған форматта көрсетілген. Жеке оқушының нақты эмоция бейнесі сақталмайды.
          </p>
        </div>

        {!hasActivity ? (
          /* Empty state - no registered students with activity */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center shadow-elevated"
          >
            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center" 
                 style={{ background: 'linear-gradient(135deg, hsl(var(--muted)), hsl(var(--accent)))' }}>
              <UserX className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Әзірше деректер жоқ</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Тіркелген оқушылар тапсырма орындағаннан кейін олардың үлгерімі мен статистикасы осы жерде көрсетіледі.
            </p>
            <p className="text-sm text-muted-foreground">
              Оқушыларға платформаны тарату үшін сілтемені жіберіңіз.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'Белсенді оқушы', value: '1', gradient: 'from-primary to-primary/70' },
                { icon: BookOpen, label: 'Оқылған бөлімдер', value: `${progress.completedLessons.length}`, gradient: 'from-secondary to-secondary/70' },
                { icon: AlertTriangle, label: 'Жалпы қателер', value: `${totalProblems - correctProblems}`, gradient: 'from-warning to-warning/70' },
                { icon: TrendingDown, label: 'Дәлдік', value: `${accuracy}%`, gradient: 'from-success to-success/70' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass-card p-5 hover:shadow-elevated transition-all duration-300">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 shadow-md`}>
                    <s.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Student activity */}
            <div className="glass-card p-6 mb-8 shadow-elevated">
              <h2 className="font-display font-semibold text-foreground text-lg mb-5">Оқушы белсенділігі</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card-blue p-4">
                  <p className="text-sm text-muted-foreground mb-1">Оқылған сабақтар</p>
                  <p className="text-2xl font-display font-bold text-foreground">{progress.completedLessons.length}/6</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="h-full rounded-full" 
                         style={{ width: `${(progress.completedLessons.length / 6) * 100}%`, background: 'var(--gradient-primary)' }} />
                  </div>
                </div>
                <div className="glass-card-pink p-4">
                  <p className="text-sm text-muted-foreground mb-1">Шығарылған есептер</p>
                  <p className="text-2xl font-display font-bold text-foreground">{correctProblems}/{totalProblems}</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="h-full bg-secondary rounded-full" style={{ width: `${accuracy}%` }} />
                  </div>
                </div>
                <div className="glass-card p-4">
                  <p className="text-sm text-muted-foreground mb-1">Демонстрация</p>
                  <p className="text-2xl font-display font-bold text-foreground">{progress.simulationsViewed} рет</p>
                  <p className="text-xs text-muted-foreground mt-2">Streak: {progress.streak} 🔥</p>
                </div>
              </div>
            </div>

            {/* Common errors */}
            <div className="glass-card p-6 shadow-elevated">
              <h2 className="font-display font-semibold text-foreground text-lg mb-5">Жиі кездесетін қателер</h2>
              <div className="space-y-4">
                {commonErrors.map((err, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground w-52 flex-shrink-0">{err.topic}</span>
                    <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(err.count / 12) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full" 
                        style={{ background: 'linear-gradient(90deg, hsl(var(--warning)), hsl(var(--destructive)))' }} />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right font-medium">{err.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
