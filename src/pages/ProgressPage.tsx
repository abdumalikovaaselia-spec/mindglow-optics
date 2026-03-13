import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '@/contexts/ProgressContext';
import { useEmotion } from '@/contexts/EmotionContext';
import { BookOpen, FlaskConical, Calculator, Trophy, Flame, Target, Star, Sparkles } from 'lucide-react';

const badgeInfo: Record<string, { label: string; emoji: string }> = {
  streak5: { label: '5 дұрыс қатарынан', emoji: '🔥' },
  firstLesson: { label: 'Алғашқы сабақ', emoji: '📖' },
  simExplorer: { label: 'Симуляция зерттеушісі', emoji: '🔬' },
};

function ProgressRing({ percent, size = 80, stroke = 6 }: { percent: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="mx-auto">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
      <circle 
        cx={size/2} cy={size/2} r={radius} fill="none" 
        stroke="url(#progressGradient)" strokeWidth={stroke}
        strokeLinecap="round"
        className="progress-ring"
        strokeDasharray={circumference} 
        strokeDashoffset={offset} 
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(200, 90%, 55%)" />
          <stop offset="100%" stopColor="hsl(330, 65%, 70%)" />
        </linearGradient>
      </defs>
      <text x="50%" y="50%" textAnchor="middle" dy=".35em" className="font-display font-bold text-foreground" fontSize="18" fill="currentColor">
        {percent}%
      </text>
    </svg>
  );
}

export default function ProgressPage() {
  const { progress, getCompletionPercentage } = useProgress();
  const { emotion } = useEmotion();
  const pct = getCompletionPercentage();
  const correctProblems = progress.completedProblems.filter(p => p.correct).length;
  const totalProblems = progress.completedProblems.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
               style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Менің прогресім</h1>
            <p className="text-sm text-muted-foreground">Оқу жетістіктерің мен статистикаң</p>
          </div>
        </div>

        {/* Progress ring + overview */}
        <div className="glass-card p-8 mb-8 shadow-elevated">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ProgressRing percent={pct} size={100} stroke={8} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full">
              {[
                { icon: BookOpen, label: 'Сабақтар', value: `${progress.completedLessons.length}/6`, gradient: 'from-primary to-primary/70' },
                { icon: Calculator, label: 'Есептер', value: `${correctProblems}/${totalProblems}`, gradient: 'from-secondary to-secondary/70' },
                { icon: FlaskConical, label: 'Демо', value: `${progress.simulationsViewed}`, gradient: 'from-success to-success/70' },
                { icon: Flame, label: 'Streak', value: `${progress.streak}`, gradient: 'from-warning to-warning/70' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="text-center p-4 rounded-2xl bg-accent/30">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mx-auto mb-2 shadow-md`}>
                    <s.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Completed lessons */}
        <div className="glass-card p-6 mb-6 shadow-elevated">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Оқылған бөлімдер
          </h3>
          {progress.completedLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">Әзірше ешқандай бөлім оқылмады</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {progress.completedLessons.map(id => (
                <span key={id} className="px-3 py-1.5 bg-success/10 text-success rounded-xl text-sm font-medium border border-success/20">✓ {id}</span>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="glass-card p-6 mb-6 shadow-elevated">
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
                  <div key={badge} className="flex items-center gap-2 glass-card-pink px-4 py-2.5">
                    <span className="text-xl">{info.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{info.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Today summary */}
        <div className="glass-card p-6 shadow-elevated">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Бүгін сен...
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
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
