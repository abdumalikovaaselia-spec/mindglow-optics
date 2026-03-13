import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, FlaskConical, Calculator, Brain, Sparkles, ArrowRight } from 'lucide-react';
import LightRays from '@/components/LightRays';

const features = [
  { icon: BookOpen, title: 'Адаптивті сабақ', desc: 'Эмоцияңа сай оқу стилі', color: 'from-primary to-primary/70' },
  { icon: FlaskConical, title: 'Интерактивті демо', desc: 'Жарық сынуын өз көзіңмен көр', color: 'from-secondary to-secondary/70' },
  { icon: Calculator, title: 'Есептер', desc: '3 деңгейлі тапсырмалар', color: 'from-success to-success/70' },
  { icon: Brain, title: 'AI көмекші', desc: 'Эмоцияны анықтап, қолдау көрсетеді', color: 'from-warning to-warning/70' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LightRays />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            Theory of Mind AI платформасы
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6">
            Жарықтың <span className="text-gradient">сынуы</span>
            <br />
            <span className="text-2xl md:text-4xl font-semibold text-muted-foreground">
              Эмоцияға бейімделген оқу тәжірибесі
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Оптика әлемін зерттеп, жарық сынуының құпиясын аш. AI көмекші сенің эмоцияңды ескеріп, ең тиімді оқу жолын ұсынады.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/lesson">
                Сабақты бастау
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link to="/simulation">Демонстрация</Link>
            </Button>
          </div>
        </motion.div>

        {/* Snell's Law visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 max-w-lg mx-auto"
        >
          <div className="glass-card p-8 text-center">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Снелл заңы</p>
            <p className="text-3xl md:text-4xl font-display font-bold text-foreground">
              n₁ sin<span className="text-primary">α</span> = n₂ sin<span className="text-secondary">β</span>
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Түсу бұрышы мен сыну бұрышы арасындағы байланыс
            </p>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={item} className="glass-card p-6 hover:shadow-lg transition-shadow group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Real-life examples */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            Жарық сынуы — <span className="text-primary">күнделікті өмірде</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '🥄', title: 'Судағы қасық', desc: 'Суға салынған қасық сынғандай көрінеді — себебі жарық суға кіргенде бағытын өзгертеді' },
              { emoji: '🏊', title: 'Бассейн түбі', desc: 'Бассейн түбі шынайы тереңдіктен жақынырақ көрінеді — жарық сыну себебінен' },
              { emoji: '🔍', title: 'Линзалар', desc: 'Лупа, микроскоп, телескоп — барлығы жарық сыну заңын қолданады' },
              { emoji: '👓', title: 'Көзілдірік', desc: 'Көзілдірік линзалары жарықты дұрыс бағытқа сындырып, көруді жақсартады' },
            ].map((ex, i) => (
              <div key={i} className="text-center p-4">
                <span className="text-4xl mb-3 block">{ex.emoji}</span>
                <h4 className="font-display font-semibold text-foreground mb-1">{ex.title}</h4>
                <p className="text-sm text-muted-foreground">{ex.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
