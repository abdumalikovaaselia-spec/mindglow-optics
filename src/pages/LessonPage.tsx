import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEmotion } from '@/contexts/EmotionContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, CheckCircle, BookOpen, Sparkles, FlaskConical, Lightbulb, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface LessonBlock {
  id: string;
  title: string;
  simplified: React.ReactNode;
  normal: React.ReactNode;
  advanced: React.ReactNode;
}

const lessonBlocks: LessonBlock[] = [
  {
    id: 'intro',
    title: 'Тақырыпқа кіріспе',
    simplified: (
      <div className="space-y-4">
        <p>Жарық — біз көретін нәрселердің бәрінің негізі. Жарық бір жерден екінші жерге сәулелер арқылы жүреді.</p>
        <p>Жарық ауадан суға өткенде не болады? Ол бағытын өзгертеді! Бұл — <strong>жарықтың сынуы</strong>.</p>
        <div className="bg-accent/50 p-5 rounded-2xl border border-accent">
          <p className="text-accent-foreground font-medium">💡 Қарапайым мысал: судағы қасық «сынған» болып көрінеді. Бұл жарық сынуы!</p>
        </div>
      </div>
    ),
    normal: (
      <div className="space-y-4">
        <p>Жарық — электромагниттік толқын. Ол вакуумда 3×10⁸ м/с жылдамдықпен таралады, бірақ әртүрлі орталарда жылдамдығы өзгереді.</p>
        <p>Жарық бір мөлдір ортадан екіншісіне өткенде, <strong>жылдамдығы өзгереді</strong> және <strong>бағыты ауытқиды</strong>. Бұл құбылыс — <strong>жарықтың сынуы (рефракция)</strong>.</p>
        <p>Сыну құбылысы — Снелл заңымен сипатталады.</p>
      </div>
    ),
    advanced: (
      <div className="space-y-4">
        <p>Жарықтың сынуы — Гюйгенс принципімен де, Ферма принципімен де түсіндірілетін іргелі оптикалық құбылыс.</p>
        <p>Фазалық жылдамдықтың өзгерісі толқын фронтының бұрылуына алып келеді. Снелл заңы импульстің жанама компонентінің сақталу заңынан шығады:</p>
        <div className="bg-accent/50 p-5 rounded-2xl font-display text-xl text-center border border-accent">
          n₁ sinα = n₂ sinβ
        </div>
        <p>Мұндағы n — ортаның сыну көрсеткіші (абсолюттік), яғни c/v қатынасы.</p>
      </div>
    ),
  },
  {
    id: 'what-is',
    title: 'Жарықтың сынуы деген не?',
    simplified: (
      <div className="space-y-4">
        <p>Көз алдыңа елестет: сен жүгіріп келе жатырсың. Асфальттан құмға шыққанда жылдамдығың баяулайды, иә?</p>
        <p>Жарық та дәл солай! Ауадан суға кіргенде, ол баяулайды. Баяулаған кезде бағытын өзгертеді.</p>
        <div className="bg-accent/50 p-5 rounded-2xl border border-accent">
          <p className="text-accent-foreground font-medium">🏃 Жарық = жүгіруші. Орта = жер бедері. Баяулау = бұрылу!</p>
        </div>
      </div>
    ),
    normal: (
      <div className="space-y-4">
        <p>Жарық бір ортадан екінші ортаға (мысалы, ауадан суға) өткенде жылдамдығы өзгереді. Егер жарық еңкейіп түссе, оның бағыты да ауытқиды.</p>
        <p>Бұл құбылыс <strong>сыну</strong> деп аталады. Жарық тығыз ортаға кіргенде нормальға қарай, ал сирек ортаға шыққанда нормальдан ауытқиды.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card-blue p-4">
            <p className="font-semibold text-foreground">Ауа → Су</p>
            <p className="text-sm text-muted-foreground">Нормальға қарай (β &lt; α)</p>
          </div>
          <div className="glass-card-pink p-4">
            <p className="font-semibold text-foreground">Су → Ауа</p>
            <p className="text-sm text-muted-foreground">Нормальдан кері (β &gt; α)</p>
          </div>
        </div>
      </div>
    ),
    advanced: (
      <div className="space-y-4">
        <p>Сыну — толқындық табиғаттағы фазалық жылдамдықтың өзгерісімен байланысты. Гюйгенс принципі бойынша, толқын фронтының бір бөлігі жаңа ортаға кірген кезде баяулайды, бұл фронтты бұрады.</p>
        <p>Толық ішкі шағылу (<em>total internal reflection</em>) жағдайы: n₁ &gt; n₂ болғанда, α критикалық бұрыштан асса, жарық мүлдем сынбай, толық шағылады. Бұл оптикалық талшықтардың жұмыс принципі.</p>
        <div className="bg-accent/50 p-5 rounded-2xl border border-accent">
          <p className="text-accent-foreground font-display text-lg">sin(α_крит) = n₂/n₁</p>
        </div>
      </div>
    ),
  },
  {
    id: 'snell',
    title: 'Снелл заңы',
    simplified: (
      <div className="space-y-4">
        <p>Снелл заңы — бұл бір қарапайым формула:</p>
        <div className="bg-accent/50 p-6 rounded-2xl text-center border border-accent">
          <p className="font-display text-2xl text-foreground font-bold">n₁ × sin(α) = n₂ × sin(β)</p>
        </div>
        <p><strong>n₁</strong> — бірінші орта (мысалы, ауа = 1)</p>
        <p><strong>n₂</strong> — екінші орта (мысалы, су = 1.33)</p>
        <p><strong>α</strong> — түсу бұрышы, <strong>β</strong> — сыну бұрышы</p>
      </div>
    ),
    normal: (
      <div className="space-y-4">
        <p>Снелл заңы (Снеллиус заңы):</p>
        <div className="bg-accent/50 p-6 rounded-2xl text-center border border-accent">
          <p className="font-display text-3xl text-foreground font-bold">n₁ sinα = n₂ sinβ</p>
        </div>
        <p>Бұл заң жарық екі мөлдір ортаның шекарасында сынғанда бұрыштар арасындағы байланысты көрсетеді.</p>
        <p>Қолданылуы: линза есептеу, оптикалық құралдар жасау, оптикалық талшық жобалау.</p>
      </div>
    ),
    advanced: (
      <div className="space-y-4">
        <p>Снелл заңын толқындық тәсілмен де, корпускулярлық тәсілмен де шығарып алуға болады. Ферма принципінен:</p>
        <div className="bg-accent/50 p-6 rounded-2xl text-center font-display text-xl border border-accent">
          <p>dT/dx = 0 → n₁ sinα = n₂ sinβ</p>
        </div>
        <p>Векторлық формасы: n₁(ŝ₁ × n̂) = n₂(ŝ₂ × n̂), мұнда ŝ — сәуленің бірлік бағыт векторы, n̂ — нормаль.</p>
      </div>
    ),
  },
  {
    id: 'examples',
    title: 'Күнделікті өмірдегі мысалдар',
    simplified: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {[
            { emoji: '🥄', title: 'Судағы қасық', desc: 'Қасық «сынған» көрінеді — себебі жарық су бетінде бағытын өзгертеді' },
            { emoji: '🏊', title: 'Бассейн', desc: 'Бассейн түбі жақынырақ көрінеді' },
            { emoji: '🌈', title: 'Кемпірқосақ', desc: 'Су тамшылары жарықты сындырады — түстер пайда болады!' },
            { emoji: '👓', title: 'Көзілдірік', desc: 'Линзалар жарықты дұрыс сындырып, көруді жақсартады' },
          ].map((ex, i) => (
            <div key={i} className="glass-card p-4 flex items-start gap-3">
              <span className="text-2xl">{ex.emoji}</span>
              <div>
                <p className="font-semibold text-foreground">{ex.title}</p>
                <p className="text-sm text-muted-foreground">{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    normal: (
      <div className="space-y-4">
        <p>Жарық сынуы күнделікті өмірде көптеген жерде кездеседі:</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { emoji: '🥄', title: 'Судағы қасық', desc: 'Жарық су-ауа шекарасында сынады.' },
            { emoji: '🏊', title: 'Бассейн түбі', desc: 'Су ішіндегі нысандар жоғарырақ көрінеді.' },
            { emoji: '🔍', title: 'Линза', desc: 'Шыныдан жасалған линзалар жарықты фокусқа жинайды.' },
            { emoji: '👓', title: 'Көзілдірік', desc: 'Миопия мен гиперметропияны линза арқылы түзетеді.' },
          ].map((ex, i) => (
            <div key={i} className="glass-card p-4">
              <span className="text-2xl mb-2 block">{ex.emoji}</span>
              <p className="font-semibold text-foreground">{ex.title}</p>
              <p className="text-sm text-muted-foreground">{ex.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    advanced: (
      <div className="space-y-4">
        <p>Рефракцияның техникалық қолданыстары:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Оптикалық талшық</strong> — толық ішкі шағылу принципімен жұмыс істейді</li>
          <li><strong>Призма</strong> — дисперсия арқылы ақ жарықты спектрге жіктейді</li>
          <li><strong>Камера объективтері</strong> — көп линзалы жүйелер аберрацияны азайту үшін</li>
          <li><strong>Атмосфералық рефракция</strong> — миражды, Күннің батардағы көрінісін түсіндіреді</li>
        </ul>
      </div>
    ),
  },
];

// Emotion-specific supportive messages
function EmotionSupportPanel({ emotion }: { emotion: string }) {
  if (emotion === 'confused' || emotion === 'sad' || emotion === 'tired') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card-pink p-5 mt-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground mb-1">
              {emotion === 'confused' && 'Қиналып жатырсың ба? 💙'}
              {emotion === 'tired' && 'Сәл демалайық! 😌'}
              {emotion === 'sad' && 'Бірге түсінеміз! 💙'}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              {emotion === 'confused' && 'Ештеңе етпейді! Қарапайым тілмен түсіндіріп жатырмыз. Демонстрацияны қарасаң, визуалды түсіну оңайырақ болады.'}
              {emotion === 'tired' && 'Аз-аздап ілгері жылжу — ол да жеңіс! Қысқа демонстрация қарап, сосын жалғастырайық.'}
              {emotion === 'sad' && 'Қателесу — үйренудің бір бөлігі. Мысалдарға қарап, визуалды түсін.'}
            </p>
            <Button variant="outline" size="sm" asChild className="border-secondary/30 hover:bg-secondary/10">
              <Link to="/simulation">
                <FlaskConical className="w-4 h-4 mr-1" /> Демонстрация көру
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (emotion === 'confident' || emotion === 'curious') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 mt-6 border-success/20">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🚀</span>
          <div>
            <p className="font-display font-semibold text-foreground mb-1">Тамаша! Жақсы меңгеріп жатырсың!</p>
            <p className="text-sm text-muted-foreground">
              Сабақтан кейін күрделірек тест күтіп тұр. Алға!
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

export default function LessonPage() {
  const [currentBlock, setCurrentBlock] = useState(0);
  const { getAdaptiveLevel, emotion } = useEmotion();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();
  const level = getAdaptiveLevel();
  const block = lessonBlocks[currentBlock];
  const isLastBlock = currentBlock === lessonBlocks.length - 1;

  const content = level === 'simplified' ? block.simplified : level === 'advanced' ? block.advanced : block.normal;

  const goNext = () => {
    completeLesson(block.id);
    if (!isLastBlock) setCurrentBlock(currentBlock + 1);
  };

  const finishLesson = () => {
    completeLesson(block.id);
    navigate('/simulation');
  };

  const levelLabels = { simplified: 'Қарапайым', normal: 'Стандарт', advanced: 'Тереңдетілген' };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8">
          {lessonBlocks.map((_, i) => (
            <div key={i} className="h-2 flex-1 rounded-full transition-all duration-500 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 w-full" style={{
                background: i < currentBlock
                  ? 'linear-gradient(135deg, hsl(155 70% 42%), hsl(155 70% 52%))'
                  : i === currentBlock
                  ? 'var(--gradient-primary)'
                  : 'hsl(var(--muted))',
              }} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <BookOpen className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-sm text-muted-foreground font-medium">
              {currentBlock + 1} / {lessonBlocks.length}
            </span>
            <span className="mx-2 text-border">·</span>
            <span className="text-xs px-2 py-1 rounded-full glass-card-pink font-medium text-foreground">
              {levelLabels[level]}
            </span>
          </div>
        </div>

        <motion.div
          key={`${block.id}-${level}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">{block.title}</h2>
          <div className="prose prose-slate max-w-none text-foreground leading-relaxed text-base">
            {content}
          </div>
        </motion.div>

        {/* Emotion support panel */}
        <EmotionSupportPanel emotion={emotion.current} />

        <div className="flex items-center justify-between mt-10">
          <Button
            variant="outline"
            onClick={() => setCurrentBlock(Math.max(0, currentBlock - 1))}
            disabled={currentBlock === 0}
            className="rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Алдыңғы
          </Button>

          {isLastBlock ? (
            <Button variant="hero" onClick={finishLesson} className="rounded-xl glow-primary">
              <FlaskConical className="w-4 h-4 mr-1" />
              Демонстрацияға өту
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="hero" onClick={goNext} className="rounded-xl glow-primary">
              Келесі
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
