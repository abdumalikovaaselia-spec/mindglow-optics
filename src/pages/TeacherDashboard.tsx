import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, TrendingDown, BarChart3, Shield, BookOpen } from 'lucide-react';

// Mock teacher data
const mockStudents = [
  { name: 'Айдана', progress: 85, mistakes: 2, commonError: 'Снелл заңы', emotion: 'confident' },
  { name: 'Бекзат', progress: 60, mistakes: 5, commonError: 'Бұрыш анықтау', emotion: 'confused' },
  { name: 'Гүлнұр', progress: 45, mistakes: 3, commonError: 'Сыну көрсеткіші', emotion: 'tired' },
  { name: 'Дархан', progress: 92, mistakes: 1, commonError: '-', emotion: 'confident' },
  { name: 'Еркебұлан', progress: 30, mistakes: 7, commonError: 'Формула қолдану', emotion: 'bored' },
];

const commonErrors = [
  { topic: 'Снелл заңын қолдану', count: 12 },
  { topic: 'Бұрыштарды нормальдан өлшеу', count: 8 },
  { topic: 'Сыну көрсеткіші', count: 6 },
  { topic: 'Толық ішкі шағылу', count: 4 },
];

const emotionLabel: Record<string, string> = {
  confident: '😊 Сенімді',
  confused: '😕 Шатасқан',
  tired: '😴 Шаршаңқы',
  bored: '😑 Жалыққан',
};

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Мұғалім панелі</h1>
        </div>
        <p className="text-muted-foreground mb-8">Оқушылардың жалпы үлгерімі мен аналитикасы</p>

        {/* Privacy note */}
        <div className="glass-card p-4 mb-6 flex items-start gap-3 border-l-4 border-primary">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Эмоция деректері жалпыланған форматта көрсетілген. Жеке оқушының нақты эмоция бейнесі сақталмайды.
          </p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Оқушылар', value: '5', color: 'text-primary' },
            { icon: BookOpen, label: 'Орташа прогресс', value: '62%', color: 'text-secondary' },
            { icon: AlertTriangle, label: 'Жиі қате', value: '12', color: 'text-warning' },
            { icon: TrendingDown, label: 'Қиын бөлім', value: 'Снелл заңы', color: 'text-destructive' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-5">
              <s.icon className={`w-6 h-6 mb-2 ${s.color}`} />
              <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Student table */}
        <div className="glass-card p-6 mb-8 overflow-x-auto">
          <h2 className="font-display font-semibold text-foreground text-lg mb-4">Оқушылар тізімі</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Оқушы</th>
                <th className="pb-3 font-medium">Прогресс</th>
                <th className="pb-3 font-medium">Қателер</th>
                <th className="pb-3 font-medium">Жиі қате</th>
                <th className="pb-3 font-medium">Жалпы күй</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((s, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-3 font-medium text-foreground">{s.name}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-muted-foreground">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-foreground">{s.mistakes}</td>
                  <td className="py-3 text-muted-foreground">{s.commonError}</td>
                  <td className="py-3">{emotionLabel[s.emotion] || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Common errors */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-foreground text-lg mb-4">Жиі кездесетін қателер</h2>
          <div className="space-y-3">
            {commonErrors.map((err, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground w-48">{err.topic}</span>
                <div className="flex-1 bg-muted rounded-full h-3">
                  <div className="h-full bg-gradient-to-r from-warning to-destructive rounded-full" style={{ width: `${(err.count / 12) * 100}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{err.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
