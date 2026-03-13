import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, FlaskConical, Calculator, Brain, Sparkles, ArrowRight, Zap, Heart } from 'lucide-react';
import LightRays from '@/components/LightRays';

const features = [
  { icon: BookOpen, title: 'Адаптивті сабақ', desc: 'Эмоцияңа сай оқу стилі автоматты бейімделеді', gradient: 'from-primary to-primary/70' },
  { icon: FlaskConical, title: 'Интерактивті демо', desc: 'Жарық сынуын өз көзіңмен көр, слайдермен басқар', gradient: 'from-secondary to-secondary/70' },
  { icon: Calculator, title: 'Ақылды есептер', desc: 'Деңгейің бойынша бейімделетін тапсырмалар', gradient: 'from-success to-success/70' },
  { icon: Brain, title: 'AI көмекші', desc: 'Эмоцияңды анықтап, мотивация мен қолдау береді', gradient: 'from-warning to-warning/70' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LightRays />

      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20" 
             style={{ background: 'radial-gradient(circle, hsl(330 65% 70% / 0.3), transparent)' }} />
        <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full opacity-15" 
             style={{ background: 'radial-gradient(circle, hsl(200 90% 55% / 0.3), transparent)' }} />
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card-pink text-sm font-semibold mb-8"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-foreground">Theory of Mind AI платформасы</span>
            <Zap className="w-3.5 h-3.5 text-warning" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6">
            Жарықтың{' '}
            <span className="text-gradient relative">
              сынуы
              <motion.span 
                className="absolute -top-2 -right-6 text-2xl"
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >✨</motion.span>
            </span>
            <br />
            <span className="text-xl md:text-3xl font-semibold text-muted-foreground mt-2 block">
              Эмоцияға бейімделген оқу тәжірибесі
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Оптика әлемін зерттеп, жарық сынуының құпиясын аш. 
            <span className="text-foreground font-medium"> AI көмекші</span> сенің эмоцияңды ескеріп, ең тиімді оқу жолын ұсынады.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button variant="hero" size="xl" asChild className="glow-primary">
              <Link to="/lesson">
                <Heart className="w-5 h-5 mr-1" />
                Сабақты бастау
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild className="glow-pink">
              <Link to="/simulation">
                <FlaskConical className="w-4 h-4 mr-1" />
                Демонстрация
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Snell's Law visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-lg mx-auto floating-block"
        >
          <div className="glass-card p-8 text-center shadow-elevated relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" 
                 style={{ background: 'var(--gradient-primary)', backgroundSize: '200% 200%', animation: 'gradient-shift 4s ease-in-out infinite' }} />
            <p className="text-sm text-muted-foreground mb-3 font-semibold uppercase tracking-wider">Снелл заңы</p>
            <p className="text-3xl md:text-5xl font-display font-bold text-foreground relative">
              n₁ sin<span className="text-primary">α</span> = n₂ sin<span className="text-secondary">β</span>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Түсу бұрышы мен сыну бұрышы арасындағы байланыс
            </p>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 relative">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-12"
        >
          Платформа <span className="text-gradient">мүмкіндіктері</span>
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={item} 
              className="glass-card p-6 hover:shadow-elevated transition-all duration-500 group hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <f.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Real-life examples */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 shadow-elevated relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" 
               style={{ background: 'radial-gradient(circle, hsl(330 65% 70%), transparent)' }} />
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Жарық сынуы — <span className="text-gradient">күнделікті өмірде</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '🥄', title: 'Судағы қасық', desc: 'Суға салынған қасық сынғандай көрінеді' },
              { emoji: '🏊', title: 'Бассейн түбі', desc: 'Бассейн түбі жақынырақ көрінеді' },
              { emoji: '🔍', title: 'Линзалар', desc: 'Лупа, микроскоп, телескоп — барлығы сыну заңын қолданады' },
              { emoji: '👓', title: 'Көзілдірік', desc: 'Линзалар жарықты сындырып, көруді жақсартады' },
            ].map((ex, i) => (
              <motion.div key={i} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-5 rounded-2xl hover:bg-accent/30 transition-colors duration-300">
                <span className="text-5xl mb-4 block">{ex.emoji}</span>
                <h4 className="font-display font-semibold text-foreground mb-2">{ex.title}</h4>
                <p className="text-sm text-muted-foreground">{ex.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
