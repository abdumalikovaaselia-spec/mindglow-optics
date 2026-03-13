import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '@/contexts/ProgressContext';
import { useEmotion } from '@/contexts/EmotionContext';
import { BookOpen, FlaskConical, Calculator, Trophy, Flame, Target, Star } from 'lucide-react';

const badgeInfo: Record<string, { label: string; emoji: string }> = {
  streak5: { label: '5 дұрыс қатарынан', emoji: '🔥' },
  firstLesson: { label: 'Алғашқы сабақ', emoji: '📖' },
  simExplorer: { label: 'Симуляция зерттеушісі', emoji: '🔬' },
};

export default function ProgressPage() {
  const { progress, getCompletionPercentage } = useProgress();
  const { emotion } = useEmotion();
  const pct = getCompletionPercentage();
  const correctProblems = progress.completedProblems.filter(p => p.correct).length;
  const totalProblems = progress.completedProblems.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Менің прогресім</h1>
        <p className="text-muted-foreground mb-8">Оқу жетістіктерің мен статистикаң</p>

        {/* Overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Сабақтар', value: `${progress.completedLessons.length}/6`, color: 'text-primary' },
            { icon: Calculator, label: 'Есептер', value: `${correctProblems}/${totalProblems}`, color: 'text-secondary' },
            { icon: FlaskConical, label: 'Демо', value: `${progress.simulationsViewed}`, color: 'text-success' },
            { icon: Flame, label: 'Streak', value: `${progress.streak}`, color: 'text-warning' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-5 text-center">
              <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Completion bar */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-foreground">Жалпы прогресс</h3>
            <span className="text-2xl font-display font-bold text-primary">{pct}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
        </div>

        {/* Completed lessons */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Оқылған бөлімдер
          </h3>
          {progress.completedLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">Әзірше ешқандай бөлім оқылмады</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {progress.completedLessons.map(id => (
                <span key={id} className="px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-medium">✓ {id}</span>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Жетістіктер
          </h3>
          {progress.badges.length === 0 ? (
            <p className="text-sm text-muted-foreground">Жетістіктерді ашу үшін сабақтарды оқып, есептер шығар!</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {progress.badges.map(badge => {
                const info = badgeInfo[badge] || { label: badge, emoji: '⭐' };
                return (
                  <div key={badge} className="flex items-center gap-2 bg-warning/10 px-4 py-2 rounded-xl">
                    <span className="text-xl">{info.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{info.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Today summary */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Бүгін сен...
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            {progress.completedLessons.length > 0 && <li>📖 {progress.completedLessons.length} бөлім оқыдың</li>}
            {totalProblems > 0 && <li>🧮 {totalProblems} есеп шығардың ({correctProblems} дұрыс)</li>}
            {progress.simulationsViewed > 0 && <li>🔬 {progress.simulationsViewed} рет демонстрация қарадың</li>}
            {progress.streak >= 3 && <li>🔥 {progress.streak} дұрыс жауап қатарынан!</li>}
            {progress.completedLessons.length === 0 && totalProblems === 0 && <li>Оқуды бастау үшін «Сабақ» бөліміне өт!</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
