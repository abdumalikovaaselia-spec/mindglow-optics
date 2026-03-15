import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion, EmotionType, GenderType } from '@/contexts/EmotionContext';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Shield, AlertTriangle, Sparkles, BookOpen, FlaskConical, Calculator, Zap, ArrowRight, Volume2, VolumeX, ChevronRight, ChevronLeft, RotateCcw, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const avatarMap: Record<GenderType, Record<EmotionType, string>> = {
  girl: { confident: girlConfident, curious: girlCurious, confused: girlConfused, tired: girlTired, sad: girlSad, bored: girlBored, neutral: girlNeutral },
  boy: { confident: boyConfident, curious: boyCurious, confused: boyConfused, tired: boyTired, sad: boySad, bored: boyBored, neutral: boyNeutral },
};

const emotionOptions: { type: EmotionType; label: string; desc: string }[] = [
  { type: 'confident', label: 'Сенімдімін', desc: 'Жақсы түсініп жатырмын' },
  { type: 'curious', label: 'Қызығып отырмын', desc: 'Көбірек білгім келеді' },
  { type: 'confused', label: 'Шатасып тұрмын', desc: 'Түсінбей жатырмын' },
  { type: 'tired', label: 'Шаршадым', desc: 'Демалғым келеді' },
  { type: 'sad', label: 'Жабырқаумын', desc: 'Көңіл-күйім төмен' },
  { type: 'bored', label: 'Жалығып отырмын', desc: 'Қызықсыз' },
];

const emotionBorderColors: Record<EmotionType, string> = {
  confident: 'border-success/40 shadow-[0_4px_20px_-4px_hsl(155_70%_42%/0.15)]',
  curious: 'border-primary/40 shadow-[0_4px_20px_-4px_hsl(200_90%_55%/0.15)]',
  confused: 'border-warning/40 shadow-[0_4px_20px_-4px_hsl(38_90%_52%/0.15)]',
  tired: 'border-muted-foreground/20',
  sad: 'border-secondary/40 shadow-[0_4px_20px_-4px_hsl(330_65%_70%/0.15)]',
  bored: 'border-muted-foreground/20',
  neutral: 'border-border',
};

type LessonEmotion = Exclude<EmotionType, 'neutral'>;

interface LessonStep { title: string; content: string; highlight: string; }
interface FormulaItem { name: string; value: string; desc: string; }
interface ExerciseItem { question: string; answer: string; hint: string; }
interface LessonConfig {
  color: string; motivation: string; lessonStyle: string;
  n1: number; n2: number; angle: number;
  steps: LessonStep[]; formula: FormulaItem[]; exercise: ExerciseItem;
}

const LESSON_DATA: Record<LessonEmotion, LessonConfig> = {
  confident: {
    color: '#22c55e', motivation: 'Тамаша! Күрделі тапсырмаларға кіріс!',
    lessonStyle: 'Жылдам, интерактивті + Толық шағылу теориясы',
    n1: 1.0, n2: 1.5, angle: 45,
    steps: [
      { title: 'Жарық сәулесі', content: 'Жарық ауадан (n₁=1.0) шыны ортасына (n₂=1.5) өтеді. Жылдамдық өзгереді.', highlight: 'v = c/n' },
      { title: 'Снеллиус заңы', content: 'n₁·sin(θ₁) = n₂·sin(θ₂). Сынулық бұрыш кіші болады.', highlight: '1.0 × sin(45°) = 1.5 × sin(θ₂)' },
      { title: 'Бұрышты табу', content: 'sin(θ₂) = 0.707/1.5 = 0.471 → θ₂ ≈ 28.1°', highlight: 'θ₂ ≈ 28.1°' },
      { title: 'Толық шағылу', content: 'n₂ < n₁ болса және θ > θкр болса сәуле өтпейді. Оптикалық талшық принципі.', highlight: 'θкр = arcsin(n₂/n₁)' },
    ],
    formula: [
      { name: 'Снеллиус заңы', value: 'n₁sin(θ₁) = n₂sin(θ₂)', desc: 'Сыну шарты' },
      { name: 'Сыну көрсеткіші', value: 'n = c/v', desc: 'c=3×10⁸ м/с' },
      { name: 'Критикалық бұрыш', value: 'θкр = arcsin(n₂/n₁)', desc: 'Толық шағылу' },
    ],
    exercise: { question: 'n=1.5 шыныда 30° бұрышпен сәуле түседі. θ₂ тап.', answer: 'θ₂ = arcsin(sin30°/1.5) ≈ 19.5°', hint: 'sin(30°) = 0.5' },
  },
  curious: {
    color: '#06b6d4', motivation: 'Қызығушылық — білімнің кілті! Тереңдетілген теорияға кіреміз!',
    lessonStyle: 'Толық теория + Брюстер бұрышы',
    n1: 1.33, n2: 1.7, angle: 50,
    steps: [
      { title: 'Гюйгенс принципі', content: 'Толқын майданының әрбір нүктесі жаңа толқынның көзі болады.', highlight: 'Толқындық оптиканың негізі' },
      { title: 'Судағы жылдамдық', content: 'n=1.33 болса v = c/1.33 ≈ 2.25×10⁸ м/с. Жарық баяулайды!', highlight: 'v = 225 000 км/с (суда)' },
      { title: 'Брюстер бұрышы', content: 'tan(θB) = n₂/n₁. Бұл бұрышта шағылған сәуле толық поляризацияланады.', highlight: 'θB = arctan(n₂/n₁)' },
      { title: 'Дисперсия', content: 'Сыну көрсеткіші толқын ұзындығына байланысты — сондықтан кемпірқосақ пайда болады!', highlight: 'Қызыл: n кіші, Күлгін: n үлкен' },
    ],
    formula: [
      { name: 'Брюстер бұрышы', value: 'tan(θB) = n₂/n₁', desc: 'Толық поляризация' },
      { name: 'Дисперсия', value: 'n = n(λ)', desc: 'Толқын ұзындығынан тәуелді' },
      { name: 'Оптикалық жол', value: 'L = n·d', desc: 'd — орта қалыңдығы' },
    ],
    exercise: { question: 'Су-шыны (n₁=1.33, n₂=1.7) шекарасында Брюстер бұрышын тап.', answer: 'θB = arctan(1.7/1.33) ≈ 51.9°', hint: 'tan(θB) = n₂/n₁' },
  },
  confused: {
    color: '#f59e0b', motivation: 'Шатаспа! Қадамба-қадам бірге түсінеміз.',
    lessonStyle: 'Қарапайым аналогиялар + баяу қадамдар',
    n1: 1.0, n2: 1.3, angle: 35,
    steps: [
      { title: 'Қарапайым ұғым', content: 'Сыну — жарықтың бір ортадан екіншіге өткенде бағытын өзгертуі. Суға салынған қасық иілген болып көрінеді.', highlight: 'Қасық иілуі = жарық сынуы!' },
      { title: 'Неге иіледі?', content: 'Жарық тығыз ортада жай жүреді. Машинаның бір доңғалағы лайға кіргенін елестет!', highlight: 'Жылдамдық өзгерсе → бағыт өзгереді' },
      { title: 'Формула (жай)', content: 'n₁×sin(θ₁) = n₂×sin(θ₂). Ауада n=1, суда n=1.33.', highlight: 'n үлкен = орта тығызырақ' },
      { title: 'Есеп шығару', content: '35°: sin(35°)=0.574. sin(θ₂) = 0.574/1.3 = 0.441 → θ₂ ≈ 26.2°', highlight: 'Кіші бұрыш → тығыз ортаға кірді!' },
    ],
    formula: [
      { name: 'Снеллиус (жай)', value: 'n₁·sin θ₁ = n₂·sin θ₂', desc: 'Негізгі формула' },
      { name: 'Ауа', value: 'n = 1.0', desc: 'Эталон орта' },
      { name: 'Су', value: 'n = 1.33', desc: 'Жарық жайылады' },
    ],
    exercise: { question: 'Ауадан суға (n=1.33) 30° бұрышпен жарық өтсе, θ₂ қанша?', answer: 'sin(θ₂) = 0.5/1.33 ≈ 0.376 → θ₂ ≈ 22.1°', hint: 'sin(30°) = 0.5' },
  },
  tired: {
    color: '#8b5cf6', motivation: 'Аз-аздап ілгері жылжу — ол да жеңіс!',
    lessonStyle: 'Тек анимация — оқымай-ақ, көзбен түсін',
    n1: 1.0, n2: 1.2, angle: 30,
    steps: [
      { title: 'Тек бір факт', content: 'Жарық иіледі — бітті. Осыны білсең жеткілікті!', highlight: '💤 Жеңіл режим' },
      { title: 'Анимацияны қара', content: 'Слайдерді жылжытып, сәуленің иілуін бақыла. Формула жоқ — тек бақылау.', highlight: 'Слайдер → иілу' },
      { title: 'Бір формула', content: 'n₁·sin(θ₁) = n₂·sin(θ₂). Осы бір формуланы есте сақта.', highlight: 'Тек осы!' },
      { title: 'Жарайды!', content: 'Бүгін осы жеткілікті. Жақсы демалсаң ертең оңай болады.', highlight: 'Сен мықтысың! 🌟' },
    ],
    formula: [
      { name: 'Негізгі', value: 'n₁sin θ₁ = n₂sin θ₂', desc: 'Тек осы' },
      { name: 'Ауа n', value: '1.0', desc: 'Есте сақта' },
      { name: 'Шыны n', value: '~1.5', desc: 'Тығызырақ' },
    ],
    exercise: { question: 'Жарық ауадан шыныға (n=1.5) 0° бұрышпен өтсе, иіле ме?', answer: 'Жоқ! 0° (тік) бұрышта иілмейді — тура өтеді.', hint: 'sin(0°) = 0' },
  },
  sad: {
    color: '#3b82f6', motivation: 'Сенің қолыңнан келеді! Кешкі мысалдармен бірге оқимыз.',
    lessonStyle: 'Өмірдегі мысалдар + визуалды',
    n1: 1.0, n2: 1.2, angle: 25,
    steps: [
      { title: 'Күнделікті мысал', content: 'Бассейнде судың түбі жақынырақ болып көрінеді — бұл жарық сынуынан.', highlight: 'Сыну = оптикалық алдану' },
      { title: 'Кемпірқосақ', content: 'Жаңбырдан кейінгі кемпірқосақ — жарықтың су тамшыларында сынуынан пайда болады.', highlight: 'Кемпірқосақ = табиғи спектр!' },
      { title: 'Оптикалық талшық', content: 'Интернет кабельдері жарықпен жұмыс істейді! Жарық ішкі шағылу арқылы алысқа жетеді.', highlight: 'Интернет = жарық технологиясы' },
      { title: 'Формула', content: 'n₁·sin(θ₁) = n₂·sin(θ₂) — Снеллиус заңы. Екі жағы тең болуы керек.', highlight: 'Тепе-теңдік заңы' },
    ],
    formula: [
      { name: 'Снеллиус заңы', value: 'n₁sin θ₁ = n₂sin θ₂', desc: 'Негізгі заң' },
      { name: 'Ауа', value: 'n₁ = 1.0', desc: 'Стандарт мән' },
      { name: 'Шыны', value: 'n₂ = 1.5', desc: 'Жиі қолданылады' },
    ],
    exercise: { question: 'Неліктен бассейн суы таяз болып көрінеді?', answer: 'Жарық сыну кезінде бағытын өзгертеді, объект нақты орнынан жоғары болып көрінеді.', hint: 'Жарық судан ауаға өткенде иіледі' },
  },
  bored: {
    color: '#ef4444', motivation: 'Алмастың n=2.42 екенін білесің бе?! Таңғажайып фактілер!',
    lessonStyle: 'Таңғажайып фактілер + Speed challenge',
    n1: 1.0, n2: 2.4, angle: 60,
    steps: [
      { title: 'Алмас рекорды!', content: 'Алмас — n=2.42! Ең жоғары мәндердің бірі. Сондықтан алмас жарқырайды.', highlight: 'Алмас n=2.42 — рекорд!' },
      { title: 'Жарық баяулайды!', content: 'Судағы жарық — тек 225 000 км/с. Шыны арқылы — 200 000 км/с!', highlight: 'Жарық баяулауы мүмкін!' },
      { title: 'Ай кемпірқосағы!', content: 'Ай сәулесі де сынып кемпірқосақ жасайды — тек тауда немесе ұшақтан көруге болады!', highlight: 'Ай кемпірқосағы бар!' },
      { title: 'Интернет = жарық', content: 'Толық шағылу принципі интернет кабельдерін мүмкін етеді!', highlight: 'Оптикалық талшық = толық шағылу' },
    ],
    formula: [
      { name: 'Алмас n', value: 'n = 2.42', desc: 'Ең жарқырайтын тас' },
      { name: 'Критикалық бұрыш', value: 'θкр = arcsin(1/n)', desc: 'Толық шағылу' },
      { name: 'Жарық жылдамдығы', value: 'v = c/n', desc: 'c = 3×10⁸ м/с' },
    ],
    exercise: { question: 'Алмас ішіндегі (n=2.42) критикалық бұрышты тап.', answer: 'θкр = arcsin(1/2.42) ≈ 24.4°', hint: 'arcsin(0.413) ≈ 24.4°' },
  },
};

function RefractionCanvas({ n1, n2, angle, color }: { n1: number; n2: number; angle: number; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const W = canvas.width, H = canvas.height, cx = W / 2, boundary = H / 2;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(30,41,59,0.4)'; ctx.fillRect(0, 0, W, boundary);
    ctx.fillStyle = 'rgba(15,23,42,0.6)'; ctx.fillRect(0, boundary, W, boundary);
    ctx.fillStyle = 'rgba(148,163,184,0.5)'; ctx.font = '11px monospace';
    ctx.fillText('n\u2081=' + n1.toFixed(2), 6, 16);
    ctx.fillText('n\u2082=' + n2.toFixed(2), 6, boundary + 16);
    ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.setLineDash([5, 4]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, boundary); ctx.lineTo(W, boundary); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, boundary - 70); ctx.lineTo(cx, boundary + 70); ctx.stroke();
    ctx.setLineDash([]);
    const rad = (angle * Math.PI) / 180;
    const ix = cx - Math.sin(rad) * 110, iy = boundary - Math.cos(rad) * 110;
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.shadowColor = color; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(cx, boundary); ctx.stroke();
    ctx.shadowBlur = 0;
    const sin2 = (n1 / n2) * Math.sin(rad);
    if (Math.abs(sin2) <= 1) {
      const t2 = Math.asin(sin2);
      ctx.globalAlpha = 0.85; ctx.shadowColor = color; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.moveTo(cx, boundary); ctx.lineTo(cx + Math.sin(t2) * 100, boundary + Math.cos(t2) * 100); ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      ctx.fillStyle = color; ctx.font = 'bold 11px monospace';
      ctx.fillText('\u03b8\u2081=' + angle + '\u00b0', cx + 8, boundary - 22);
      ctx.fillText('\u03b8\u2082=' + Math.round((t2 * 180) / Math.PI) + '\u00b0', cx + 8, boundary + 28);
    } else {
      ctx.strokeStyle = '#f59e0b'; ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(cx, boundary); ctx.lineTo(cx + Math.sin(rad) * 100, boundary - Math.cos(rad) * 100); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 11px monospace';
      ctx.fillText('\u0422\u043e\u043b\u044b\u049b \u0448\u0430\u0493\u044b\u043b\u0443!', cx - 50, boundary - 22);
    }
  }, [n1, n2, angle, color]);
  return <canvas ref={canvasRef} width={300} height={220} className="w-full rounded-xl" style={{ maxHeight: 220 }} />;
}

function LessonPanel({ emotionType }: { emotionType: LessonEmotion }) {
  const cfg = LESSON_DATA[emotionType];
  const [step, setStep] = useState(0);
  const [angle, setAngle] = useState(cfg.angle);
  const [n2, setN2] = useState(cfg.n2);
  const [audioOn, setAudioOn] = useState(true);
  const [showFormula, setShowFormula] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const speak = (text: string) => {
    if (!audioOn) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'kk-KZ'; u.rate = 0.9;
    const v = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('kk') || v.lang.startsWith('ru'));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };

  const sinT2 = (cfg.n1 / n2) * Math.sin((angle * Math.PI) / 180);
  const theta2 = Math.abs(sinT2) <= 1 ? Math.round((Math.asin(sinT2) * 180) / Math.PI) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border/40" />
        <span className="text-xs text-muted-foreground px-2">\u042d\u043c\u043e\u0446\u0438\u044f\u04a3\u0430 \u049b\u0430\u0440\u0430\u0439 \u0431\u0435\u0439\u0456\u043c\u0434\u0435\u043b\u0433\u0435\u043d \u0441\u0430\u0431\u0430\u049b</span>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      <div className="glass-card p-4 border-2 rounded-2xl flex items-center justify-between gap-3"
           style={{ borderColor: cfg.color + '40', background: cfg.color + '08' }}>
        <div className="flex-1">
          <p className="font-semibold text-sm text-foreground">{cfg.motivation}</p>
          <p className="text-xs text-muted-foreground mt-0.5">\ud83d\udcda {cfg.lessonStyle}</p>
        </div>
        <button onClick={() => setAudioOn(!audioOn)} className="p-2 rounded-xl transition-colors"
          style={{ background: audioOn ? cfg.color + '20' : 'transparent' }}>
          {audioOn ? <Volume2 className="w-4 h-4" style={{ color: cfg.color }} /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>

      <div className="glass-card p-5 shadow-elevated">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
          <FlaskConical className="w-4 h-4" style={{ color: cfg.color }} />
          \u0406\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u0442\u0456 \u0434\u0435\u043c\u043e\u043d\u0441\u0442\u0440\u0430\u0446\u0438\u044f
        </h4>
        <RefractionCanvas n1={cfg.n1} n2={n2} angle={angle} color={cfg.color} />
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs w-28">\u0411\u04b1\u0440\u044b\u0448 \u03b8\u2081</span>
            <input type="range" min="5" max="80" step="1" value={angle}
              onChange={e => setAngle(Number(e.target.value))} className="flex-1 accent-indigo-400" />
            <span className="text-foreground text-xs font-mono w-10 text-right">{angle}&deg;</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs w-28">n\u2082 (\u043e\u0440\u0442\u0430)</span>
            <input type="range" min="1.0" max="2.5" step="0.05" value={n2}
              onChange={e => setN2(Number(e.target.value))} className="flex-1 accent-purple-400" />
            <span className="text-foreground text-xs font-mono w-10 text-right">{n2.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-3 p-2.5 glass-card rounded-xl text-xs font-mono text-center" style={{ color: cfg.color }}>
          {theta2 !== null
            ? cfg.n1.toFixed(2) + '\u00d7sin(' + angle + '\u00b0) = ' + n2.toFixed(2) + '\u00d7sin(' + theta2 + '\u00b0)'
            : <span className="text-amber-400">\u26a1 \u0422\u043e\u043b\u044b\u049b \u0448\u0430\u0493\u044b\u043b\u0443!</span>}
        </div>
      </div>

      <div className="glass-card p-5 shadow-elevated">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
          <BookOpen className="w-4 h-4" style={{ color: cfg.color }} />
          \u049a\u0430\u0434\u0430\u043c\u0434\u044b\u049b \u0442\u04af\u0441\u0456\u043d\u0434\u0456\u0440\u043c\u0435
        </h4>
        <div className="flex gap-1.5 mb-3">
          {cfg.steps.map((_, i) => (
            <button key={i} onClick={() => { setStep(i); speak(cfg.steps[i].content); }}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === step ? '2rem' : '0.5rem', background: i === step ? cfg.color : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
        <div className="p-4 rounded-xl border" style={{ background: cfg.color + '08', borderColor: cfg.color + '30' }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: cfg.color }}>{step + 1}. {cfg.steps[step].title}</p>
          <p className="text-sm text-foreground leading-relaxed">{cfg.steps[step].content}</p>
          <p className="text-xs font-mono mt-2 p-1.5 bg-black/10 rounded-lg" style={{ color: cfg.color }}>\ud83d\udca1 {cfg.steps[step].highlight}</p>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => { const ns = Math.max(0, step - 1); setStep(ns); speak(cfg.steps[ns].content); }}
            disabled={step === 0}
            className="flex-1 py-2 rounded-xl text-xs flex items-center justify-center gap-1 border border-border text-muted-foreground hover:bg-accent/50 disabled:opacity-30 transition-all">
            <ChevronLeft className="w-3.5 h-3.5" /> \u0410\u043b\u0434\u044b\u04a3\u0493\u044b
          </button>
          <button onClick={() => speak(cfg.steps[step].content)}
            className="px-3 py-2 rounded-xl border border-border text-muted-foreground hover:bg-accent/50 transition-all">
            <PlayCircle className="w-4 h-4" />
          </button>
          <button onClick={() => { const ns = Math.min(cfg.steps.length - 1, step + 1); setStep(ns); speak(cfg.steps[ns].content); }}
            disabled={step === cfg.steps.length - 1}
            className="flex-1 py-2 rounded-xl text-xs flex items-center justify-center gap-1 border text-white disabled:opacity-30 transition-all"
            style={{ background: cfg.color, borderColor: cfg.color }}>
            \u041a\u0435\u043b\u0435\u0441\u0456 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden shadow-elevated">
        <button onClick={() => setShowFormula(!showFormula)}
          className="w-full p-4 flex items-center justify-between text-foreground hover:bg-accent/30 transition-colors">
          <span className="font-semibold text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4" style={{ color: cfg.color }} /> \u0424\u043e\u0440\u043c\u0443\u043b\u0430\u043b\u0430\u0440
          </span>
          <ChevronRight className={'w-4 h-4 text-muted-foreground transition-transform ' + (showFormula ? 'rotate-90' : '')} />
        </button>
        {showFormula && (
          <div className="px-4 pb-4 grid gap-2">
            {cfg.formula.map((f, i) => (
              <div key={i} className="p-3 glass-card rounded-xl flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{f.name}</p>
                  <p className="text-foreground font-mono text-sm font-semibold mt-0.5">{f.value}</p>
                </div>
                <span className="text-xs text-muted-foreground">{f.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card overflow-hidden shadow-elevated">
        <button onClick={() => { setShowExercise(!showExercise); setShowAnswer(false); }}
          className="w-full p-4 flex items-center justify-between text-foreground hover:bg-accent/30 transition-colors">
          <span className="font-semibold text-sm flex items-center gap-2">
            <RotateCcw className="w-4 h-4" style={{ color: cfg.color }} /> \u0415\u0441\u0435\u043f \u0448\u044b\u0493\u0430\u0440
          </span>
          <ChevronRight className={'w-4 h-4 text-muted-foreground transition-transform ' + (showExercise ? 'rotate-90' : '')} />
        </button>
        {showExercise && (
          <div className="px-4 pb-4 space-y-3">
            <div className="p-3 rounded-xl border text-sm font-semibold text-foreground"
                 style={{ background: cfg.color + '08', borderColor: cfg.color + '30' }}>
              \ud83d\udcdd {cfg.exercise.question}
            </div>
            {!showAnswer && (
              <div className="p-3 glass-card rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">\ud83d\udcac \u041a\u0435\u04a3\u0435\u0441:</p>
                <p className="text-sm text-foreground">{cfg.exercise.hint}</p>
              </div>
            )}
            <button onClick={() => setShowAnswer(!showAnswer)}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: showAnswer ? 'var(--accent)' : cfg.color, color: 'white' }}>
              {showAnswer ? '\u0416\u0430\u0441\u044b\u0440\u0443' : '\u0416\u0430\u0443\u0430\u043f\u0442\u044b \u043a\u04e9\u0440\u0443'}
            </button>
            {showAnswer && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-xl">
                <p className="text-xs font-semibold text-success mb-1">\u2705 \u0416\u0430\u0443\u0430\u043f:</p>
                <p className="text-sm font-mono text-foreground">{cfg.exercise.answer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface AdaptiveAction { icon: React.ElementType; label: string; desc: string; to: string; color: string; }
const emotionAdaptiveActions: Record<EmotionType, AdaptiveAction[]> = {
  confused: [
    { icon: FlaskConical, label: 'Демонстрация көру', desc: 'Анимациямен жарықтың сынуын қара', to: '/simulation', color: 'from-primary to-cyan-400' },
    { icon: BookOpen, label: 'Жеңіл түсіндірме', desc: 'Тақырыпты қарапайым тілмен оқы', to: '/lesson', color: 'from-blue-400 to-indigo-400' },
  ],
  tired: [
    { icon: FlaskConical, label: 'Қысқа демонстрация', desc: 'Тек анимация — оқымай-ақ, көзбен түсін', to: '/simulation', color: 'from-violet-400 to-purple-400' },
    { icon: Sparkles, label: 'Мотивация алу', desc: 'Аз-аздап ілгері жылжу — ол да жеңіс! 🏆', to: '/emotion', color: 'from-pink-400 to-rose-400' },
  ],
  sad: [
    { icon: FlaskConical, label: 'Анимация көру', desc: 'Жарық сәулесін интерактивті қарап, көңіліңді көтер', to: '/simulation', color: 'from-cyan-400 to-teal-400' },
    { icon: BookOpen, label: 'Жұмсақ сабақ', desc: 'Қысқа блоктармен оқы', to: '/lesson', color: 'from-blue-400 to-sky-400' },
  ],
  confident: [
    { icon: Calculator, label: 'Күрделі есептер', desc: 'Snell заңымен байланысты қиын тапсырмалар', to: '/practice', color: 'from-emerald-400 to-green-400' },
    { icon: BookOpen, label: 'Тереңдетілген сабақ', desc: 'Толық формулалар мен жетілдірілген түсіндірмелер', to: '/lesson', color: 'from-primary to-blue-500' },
    { icon: Zap, label: 'Speed Challenge', desc: 'Уақыт бойынша жарыс!', to: '/practice', color: 'from-amber-400 to-orange-400' },
  ],
  curious: [
    { icon: FlaskConical, label: 'Зерттеу демо', desc: 'Параметрлерді өзгертіп тәжірибе жаса', to: '/simulation', color: 'from-primary to-cyan-400' },
    { icon: BookOpen, label: 'Қызықты фактілер', desc: 'Кемпірқосақ, линзалар, миражар!', to: '/lesson', color: 'from-indigo-400 to-violet-400' },
    { icon: Calculator, label: 'Есеп шығару', desc: 'Білімді тәжірибеде қолдан', to: '/practice', color: 'from-teal-400 to-emerald-400' },
  ],
  bored: [
    { icon: Zap, label: 'Speed Challenge!', desc: 'Тез-тез есеп шығар — ойын сияқты! ⚡', to: '/practice', color: 'from-orange-400 to-red-400' },
    { icon: FlaskConical, label: 'Интерактивті демо', desc: 'Slider-мен ойна, бұрыштарды өзгерт', to: '/simulation', color: 'from-primary to-cyan-400' },
  ],
  neutral: [
    { icon: BookOpen, label: 'Сабақты бастау', desc: 'Жарықтың сынуы тақырыбын оқы', to: '/lesson', color: 'from-primary to-blue-500' },
    { icon: FlaskConical, label: 'Демонстрация', desc: 'Интерактивті анимацияларды қара', to: '/simulation', color: 'from-cyan-400 to-teal-400' },
  ],
};

export default function EmotionPage() {
  const { emotion, setEmotion, cameraEnabled, setCameraEnabled, getMotivationalMessage, gender, setGender } = useEmotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [showLesson, setShowLesson] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 320, height: 240 } });
      if (videoRef.current) { videoRef.current.srcObject = stream; setCameraEnabled(true); setCameraError(''); }
    } catch { setCameraError('Камераға қол жетімділік жоқ. Қолмен таңдау режимін қолданыңыз.'); }
  }, [setCameraEnabled]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraEnabled(false); setShowLesson(false);
  }, [setCameraEnabled]);

  useEffect(() => () => stopCamera(), []);

  const detectEmotion = useCallback(async () => {
    if (!cameraEnabled || detecting) return;
    setDetecting(true);
    for (let i = 3; i >= 1; i--) { setCountdown(i); await new Promise(r => setTimeout(r, 1000)); }
    setCountdown(null);
    await new Promise(r => setTimeout(r, 800));
    const pool: EmotionType[] = ['confident', 'curious', 'confused', 'tired', 'sad', 'bored'];
    const detected = pool[Math.floor(Math.random() * pool.length)];
    setEmotion(detected, 'camera');
    setDetecting(false); setShowLesson(true);
  }, [cameraEnabled, detecting, setEmotion]);

  useEffect(() => { if (emotion.current !== 'neutral') setMessage(getMotivationalMessage()); }, [emotion.current]);

  const handleManualSelect = (type: EmotionType) => {
    setEmotion(type, 'manual'); setMessage(getMotivationalMessage()); setShowLesson(true);
  };

  const currentAvatar = avatarMap[gender][emotion.current];
  const actions = emotionAdaptiveActions[emotion.current];
  const isLessonEmotion = emotion.current !== 'neutral';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Эмоцияны анықтау</h1>
            <p className="text-sm text-muted-foreground">AI көмекші сенің күйіңді ескеріп, оқуды бейімдейді</p>
          </div>
        </div>

        <div className="glass-card p-4 mb-6 shadow-elevated">
          <p className="text-sm font-semibold text-foreground mb-3">Кейіпкеріңді таңда:</p>
          <div className="flex gap-3">
            {(['girl', 'boy'] as GenderType[]).map(g => (
              <button key={g} onClick={() => setGender(g)}
                className={'flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all duration-300 ' + (
                  gender === g ? (g === 'girl' ? 'border-secondary/60 bg-secondary/10 shadow-lg' : 'border-primary/60 bg-primary/10 shadow-lg') : 'border-border hover:border-primary/30'
                )}>
                <img src={avatarMap[g].neutral} alt={g} className="w-12 h-12 object-contain" />
                <span className="font-semibold text-foreground">{g === 'girl' ? 'Қыз' : 'Ұл'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card-blue p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Құпиялылық кепілдігі</p>
            <p className="text-xs text-muted-foreground">Камера деректері тек жергілікті (local) түрде өңделеді. Ешқандай видео сақталмайды.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card p-6 shadow-elevated">
            <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Камера режимі
              <span className="text-xs glass-card-pink px-2.5 py-1 rounded-full font-semibold">Демо</span>
            </h2>
            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden mb-4 shadow-inner">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
              {!cameraEnabled && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CameraOff className="w-12 h-12 text-muted-foreground/50" />
                </div>
              )}
              {countdown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl">
                  <span className="text-white text-7xl font-bold">{countdown}</span>
                </div>
              )}
              {detecting && !countdown && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl gap-2">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="text-primary text-sm">Анықталуда...</p>
                </div>
              )}
            </div>
            {cameraError && (
              <div className="flex items-center gap-2 text-destructive text-sm mb-4">
                <AlertTriangle className="w-4 h-4" /> {cameraError}
              </div>
            )}
            <div className="flex gap-3 justify-center flex-wrap">
              {!cameraEnabled ? (
                <Button variant="hero" onClick={startCamera} className="rounded-xl glow-primary">
                  <Camera className="w-4 h-4 mr-1" /> Камераны қосу
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={stopCamera} className="rounded-xl">
                    <CameraOff className="w-4 h-4 mr-1" /> Өшіру
                  </Button>
                  <Button variant="hero" onClick={detectEmotion} disabled={detecting} className="rounded-xl glow-primary">
                    <Sparkles className="w-4 h-4 mr-1" /> Эмоцияны анықта
                  </Button>
                </>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={emotion.current + gender}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={'glass-card p-6 border-2 shadow-elevated flex flex-col items-center justify-center ' + emotionBorderColors[emotion.current]}>
              <motion.img src={currentAvatar} alt={emotion.current}
                className="w-32 h-32 md:w-40 md:h-40 object-contain mb-4 drop-shadow-lg"
                animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} />
              <h3 className="font-display font-bold text-xl text-foreground mb-1">
                {emotionOptions.find(e => e.type === emotion.current)?.label || 'Бейтарап'}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {emotion.source === 'camera' ? '📷 Камера арқылы' : '✋ Қолмен таңдалды'}
              </p>
              {message && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-center text-muted-foreground italic px-2">{message}</motion.p>
              )}
              {isLessonEmotion && (
                <button onClick={() => setShowLesson(!showLesson)}
                  className="mt-4 px-5 py-2 rounded-xl text-white text-xs font-semibold transition-all shadow-md"
                  style={{ background: LESSON_DATA[emotion.current as LessonEmotion].color }}>
                  {showLesson ? '▲ Сабақты жасыру' : '▼ Сабақты ашу'}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="glass-card p-6 mb-6 shadow-elevated">
          <h2 className="font-display font-semibold text-foreground text-lg mb-2">Қолмен таңдау</h2>
          <p className="text-sm text-muted-foreground mb-5">Өзіңіздің қазіргі күйіңізді таңдаңыз:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {emotionOptions.map(opt => (
              <button key={opt.type} onClick={() => handleManualSelect(opt.type)}
                className={'p-4 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-[1.03] hover:shadow-lg ' + (
                  emotion.current === opt.type ? emotionBorderColors[opt.type] + ' bg-accent/30' : 'border-border hover:border-primary/30'
                )}>
                <img src={avatarMap[gender][opt.type]} alt={opt.label} className="w-16 h-16 mx-auto mb-2 object-contain" />
                <p className="font-semibold text-foreground text-sm">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {showLesson && isLessonEmotion && (
          <div className="mb-6">
            <LessonPanel emotionType={emotion.current as LessonEmotion} />
          </div>
        )}

        <motion.div key={emotion.current + '-actions'}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 shadow-elevated border-2 border-primary/20">
          <div className="flex items-center gap-3 mb-5">
            <motion.img src={currentAvatar} alt="" className="w-14 h-14 object-contain"
              animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }} />
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">
                {emotion.current === 'confused' && '🤝 Көмектесемін!'}
                {emotion.current === 'tired' && '😊 Демалайық!'}
                {emotion.current === 'sad' && '💙 Бірге шығарамыз!'}
                {emotion.current === 'confident' && '🚀 Алға жүр!'}
                {emotion.current === 'curious' && '🔬 Зерттейік!'}
                {emotion.current === 'bored' && '⚡ Қызықты болады!'}
                {emotion.current === 'neutral' && '📚 Бастайық!'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {emotion.current === 'confused' && 'Шатаспа — қарапайым түсіндірмелер дайын'}
                {emotion.current === 'tired' && 'Қысқа анимациялар сенің күйіңе сай'}
                {emotion.current === 'sad' && 'Жұмсақ қолдаумен оқуды жалғастыр'}
                {emotion.current === 'confident' && 'Күрделірек тапсырмалар ұсынылады'}
                {emotion.current === 'curious' && 'Тәжірибе мен зерттеу арқылы үйрен'}
                {emotion.current === 'bored' && 'Интерактивті челлендждер қосылды'}
                {emotion.current === 'neutral' && 'Стандартты оқу режимі — таңда және баста!'}
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {actions.map((action, i) => (
              <Link key={i} to={action.to}>
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}
                  className="glass-card p-4 h-full cursor-pointer group hover:shadow-lg transition-shadow">
                  <div className={'w-10 h-10 rounded-xl bg-gradient-to-br ' + action.color + ' flex items-center justify-center mb-3 shadow-md'}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1 flex items-center gap-1">
                    {action.label}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{action.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
