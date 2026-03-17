import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '@/contexts/EmotionContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Lightbulb, ChevronRight, Trophy, FlaskConical, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Problem {
  id: string;
  level: 'easy' | 'medium' | 'hard';
  question: string;
  formula?: string;
  options: string[];
  correctIndex: number;
  hint: string;
  stepByStep: string[];
  explanation: string;
}

const problems: Problem[] = [
  // === EASY (10) ===
  {
    id: 'e1', level: 'easy',
    question: 'Жарық ауадан суға өткенде не болады?',
    options: ['Жылдамдығы артады', 'Жылдамдығы кемиді', 'Жылдамдығы өзгермейді', 'Жарық жоғалады'],
    correctIndex: 1,
    hint: 'Судың оптикалық тығыздығы ауадан жоғары',
    stepByStep: ['Ауаның сыну көрсеткіші n=1.0', 'Судың сыну көрсеткіші n=1.33', 'n жоғары болса, жылдамдық кемиді'],
    explanation: 'Су оптикалық тығыз орта, сондықтан жарық баяулайды.',
  },
  {
    id: 'e2', level: 'easy',
    question: 'Сыну бұрышы қай сызықтан өлшенеді?',
    options: ['Беткей сызығынан', 'Нормаль сызығынан', 'Көлденең сызықтан', 'Тік сызықтан'],
    correctIndex: 1,
    hint: 'Оптикада бұрыштар әрдайым бір арнайы сызықтан өлшенеді',
    stepByStep: ['Нормаль — беткейге перпендикуляр сызық', 'Барлық бұрыштар нормальдан өлшенеді'],
    explanation: 'Нормаль — екі орта шекарасына перпендикуляр сызық, бұрыштар осыдан өлшенеді.',
  },
  {
    id: 'e3', level: 'easy',
    question: 'Ауаның сыну көрсеткіші шамамен қанша?',
    options: ['0.5', '1.0', '1.33', '2.42'],
    correctIndex: 1,
    hint: 'Ауа — ең «сирек» орта, вакуумға жақын',
    stepByStep: ['Вакуумда n=1.0', 'Ауа вакуумға өте жақын'],
    explanation: 'Ауаның сыну көрсеткіші шамамен 1.0.',
  },
  {
    id: 'e4', level: 'easy',
    question: 'Судағы қасық неліктен «сынған» болып көрінеді?',
    options: ['Қасық нашар сапалы', 'Су қасықты бұзады', 'Жарық су бетінде сынады', 'Көздің алдануы'],
    correctIndex: 2,
    hint: 'Жарық ауа-су шекарасынан өткенде бағытын өзгертеді',
    stepByStep: ['Жарық қасықтан шағылып, суда жүреді', 'Су бетінен шығарда сынады', 'Көз сыну есебінен қасықтың «жылжыған» бейнесін көреді'],
    explanation: 'Рефракция — жарық бағытының ауытқуы — қасықтың «сынған» көрінуіне себеп.',
  },
  {
    id: 'e5', level: 'easy',
    question: 'Судың сыну көрсеткіші қанша?',
    options: ['1.0', '1.33', '1.5', '2.0'],
    correctIndex: 1,
    hint: 'Су — ауа мен шынының арасында',
    stepByStep: ['Ауа: n=1.0', 'Су: n=1.33', 'Шыны: n=1.5'],
    explanation: 'Судың сыну көрсеткіші 1.33 — стандартты мән.',
  },
  {
    id: 'e6', level: 'easy',
    question: 'Жарық тығыз ортаға кіргенде нормальға қарай қалай ауытқиды?',
    options: ['Нормальдан алыстайды', 'Нормальға жақындайды', 'Бағытын өзгертпейді', 'Кері шағылады'],
    correctIndex: 1,
    hint: 'Тығыз ортада жарық баяулайды',
    stepByStep: ['Тығыз ортаға кіру = жылдамдық кемиді', 'Жылдамдық кемісе, сәуле нормальға жақындайды'],
    explanation: 'Тығыз ортаға кіргенде сәуле нормальға қарай ауытқиды (β < α).',
  },
  {
    id: 'e7', level: 'easy',
    question: 'Вакуумда жарық жылдамдығы қанша?',
    options: ['3×10⁶ м/с', '3×10⁸ м/с', '3×10¹⁰ м/с', '3×10⁴ м/с'],
    correctIndex: 1,
    hint: 'Бұл физикадағы ең жоғары жылдамдық',
    stepByStep: ['c = 3×10⁸ м/с', 'Бұл — табиғаттағы ең жоғары жылдамдық'],
    explanation: 'Вакуумда жарық жылдамдығы c = 3×10⁸ м/с.',
  },
  {
    id: 'e8', level: 'easy',
    question: 'Жарық сынуы қай шекарада болады?',
    options: ['Бір ортаның ішінде', 'Екі орта шекарасында', 'Тек вакуумда', 'Тек суда'],
    correctIndex: 1,
    hint: 'Сыну — орта ауысқанда пайда болатын құбылыс',
    stepByStep: ['Жарық бір ортадан екінші ортаға өтеді', 'Шекарада жылдамдық өзгереді', 'Жылдамдық өзгерісі бағыт өзгерісіне алып келеді'],
    explanation: 'Жарық сынуы тек екі мөлдір ортаның шекарасында болады.',
  },
  {
    id: 'e9', level: 'easy',
    question: 'Бассейн түбі неліктен жақынырақ көрінеді?',
    options: ['Су линза ретінде жұмыс істейді', 'Жарық сынуы себебінен', 'Су мөлдір болғандықтан', 'Түбі ақ болғандықтан'],
    correctIndex: 1,
    hint: 'Су бетінен шығатын жарық бағытын өзгертеді',
    stepByStep: ['Түптен шыққан жарық суда жүреді', 'Су-ауа шекарасында сынады', 'Көз сыну есебінен түпті жақынырақ көреді'],
    explanation: 'Жарық сынуы нысандарды нақты орнынан өзгеше жерде көрсетеді.',
  },
  {
    id: 'e10', level: 'easy',
    question: 'Кемпірқосақ қалай пайда болады?',
    options: ['Бұлт түстері', 'Су тамшыларында жарық сынуы', 'Күн сәулесінің шағылуы', 'Ауа температурасы'],
    correctIndex: 1,
    hint: 'Су тамшылары жарықты жіктейді',
    stepByStep: ['Ақ жарық су тамшысына кіреді', 'Тамшыда жарық сынады және дисперсияланады', 'Әр түсті толқын әртүрлі бұрышпен шығады'],
    explanation: 'Кемпірқосақ — жарықтың су тамшыларында сынуы мен дисперсиясы нәтижесі.',
  },

  // === MEDIUM (10) ===
  {
    id: 'm1', level: 'medium',
    question: 'Жарық ауадан (n=1) суға (n=1.33) 45° бұрышпен түседі. Сыну бұрышы қанша?',
    formula: 'n₁ sinα = n₂ sinβ → sinβ = sin45°/1.33',
    options: ['25.2°', '32.1°', '45°', '60°'],
    correctIndex: 1,
    hint: 'Снелл заңын қолдан: sinβ = (n₁/n₂)·sinα',
    stepByStep: ['n₁ sinα = n₂ sinβ', '1 × sin45° = 1.33 × sinβ', 'sinβ = 0.707/1.33 = 0.532', 'β = arcsin(0.532) ≈ 32.1°'],
    explanation: 'Тығыз ортаға кіргенде сыну бұрышы түсу бұрышынан кіші болады.',
  },
  {
    id: 'm2', level: 'medium',
    question: 'Жарық судан (n=1.33) ауаға (n=1) 20° бұрышпен шығады. Сыну бұрышы қанша?',
    formula: 'sinβ = (1.33/1)·sin20°',
    options: ['15.1°', '20°', '27.1°', '35°'],
    correctIndex: 2,
    hint: 'Сирек ортаға шыққанда сыну бұрышы үлкейеді',
    stepByStep: ['1.33 × sin20° = 1 × sinβ', 'sinβ = 1.33 × 0.342 = 0.455', 'β = arcsin(0.455) ≈ 27.1°'],
    explanation: 'Тығыз ортадан сирек ортаға шыққанда β > α.',
  },
  {
    id: 'm3', level: 'medium',
    question: 'Жарық ауадан шыныға (n=1.5) 30° бұрышпен түседі. Сыну бұрышы?',
    formula: 'sinβ = sin30°/1.5 = 0.333',
    options: ['19.5°', '22.0°', '30°', '45°'],
    correctIndex: 0,
    hint: 'sinβ = (1/1.5)·sin30° = 0.5/1.5',
    stepByStep: ['sinβ = (n₁/n₂)sinα = (1/1.5)sin30°', 'sinβ = 0.5/1.5 = 0.333', 'β = arcsin(0.333) ≈ 19.5°'],
    explanation: 'Шыны ауадан тығызырақ, сондықтан сәуле нормальға жақындайды.',
  },
  {
    id: 'm4', level: 'medium',
    question: 'Жарық ауадан (n=1) суға (n=1.33) 60° бұрышпен түседі. Сыну бұрышы?',
    formula: 'sinβ = sin60°/1.33',
    options: ['35.3°', '40.6°', '45°', '50°'],
    correctIndex: 1,
    hint: 'sinβ = 0.866/1.33',
    stepByStep: ['sinβ = (1/1.33) × sin60°', 'sinβ = 0.866/1.33 = 0.651', 'β = arcsin(0.651) ≈ 40.6°'],
    explanation: 'Түсу бұрышы үлкен болса да, сыну бұрышы одан кіші болады.',
  },
  {
    id: 'm5', level: 'medium',
    question: 'Шыны ішіндегі жарық жылдамдығы қанша? (n=1.5)',
    formula: 'v = c/n = 3×10⁸/1.5',
    options: ['1×10⁸ м/с', '2×10⁸ м/с', '3×10⁸ м/с', '4.5×10⁸ м/с'],
    correctIndex: 1,
    hint: 'v = c/n формуласын қолдан',
    stepByStep: ['v = c/n', 'v = 3×10⁸ / 1.5', 'v = 2×10⁸ м/с'],
    explanation: 'Шыныда жарық вакуумдағыдан 1.5 есе баяу жүреді.',
  },
  {
    id: 'm6', level: 'medium',
    question: 'Сыну көрсеткіші n = c/v формуласынан v-ні тап, егер n=1.33, c=3×10⁸ м/с',
    formula: 'v = c/n',
    options: ['1.5×10⁸ м/с', '2.26×10⁸ м/с', '3×10⁸ м/с', '4×10⁸ м/с'],
    correctIndex: 1,
    hint: 'v = 3×10⁸ / 1.33',
    stepByStep: ['v = c/n', 'v = 3×10⁸ / 1.33', 'v ≈ 2.26×10⁸ м/с'],
    explanation: 'Суда жарық жылдамдығы шамамен 2.26×10⁸ м/с.',
  },
  {
    id: 'm7', level: 'medium',
    question: 'Жарық 0° бұрышпен (перпендикуляр) ортаға түссе не болады?',
    options: ['Сынады', 'Шағылады', 'Сынбай өтеді', 'Жоғалады'],
    correctIndex: 2,
    hint: 'sin(0°) = 0',
    stepByStep: ['Түсу бұрышы α = 0°', 'sin(0°) = 0', 'sinβ = 0 → β = 0°', 'Сәуле бағытын өзгертпей өтеді'],
    explanation: 'Перпендикуляр түскен жарық сынбайды — тік бағытпен өтеді.',
  },
  {
    id: 'm8', level: 'medium',
    question: 'Егер n₁ < n₂ болса, сыну бұрышы түсу бұрышынан қалай болады?',
    options: ['Үлкен болады', 'Кіші болады', 'Тең болады', 'Болжау мүмкін емес'],
    correctIndex: 1,
    hint: 'Тығыз ортаға кірсе, сәуле нормальға жақындайды',
    stepByStep: ['n₁ sinα = n₂ sinβ', 'n₂ > n₁ болғанда', 'sinβ < sinα', 'Демек β < α'],
    explanation: 'Тығыз ортаға кіргенде сыну бұрышы түсу бұрышынан кіші болады.',
  },
  {
    id: 'm9', level: 'medium',
    question: 'Жарық ауадан (n=1) шыныға (n=1.5) 0° бұрышпен түседі. Сыну бұрышы?',
    options: ['0°', '15°', '30°', '45°'],
    correctIndex: 0,
    hint: 'Перпендикуляр түскен жарық...',
    stepByStep: ['sin(0°) = 0', 'sinβ = (1/1.5) × 0 = 0', 'β = 0°'],
    explanation: 'Тік түскен жарық бағытын өзгертпей өтеді.',
  },
  {
    id: 'm10', level: 'medium',
    question: 'Снелл заңы бойынша, қай шама сақталады?',
    options: ['Жылдамдық', 'Жиілік', 'Толқын ұзындығы', 'n × sin(бұрыш)'],
    correctIndex: 3,
    hint: 'n₁ sinα = n₂ sinβ — тепе-теңдік',
    stepByStep: ['Снелл заңы: n₁ sinα = n₂ sinβ', 'Екі жағы тең', 'n × sin(бұрыш) көбейтіндісі сақталады'],
    explanation: 'Снелл заңы бойынша n × sin(бұрыш) шамасы шекарадан өтерде сақталады.',
  },

  // === HARD (10) ===
  {
    id: 'h1', level: 'hard',
    question: 'Судан ауаға өтуде толық ішкі шағылу бұрышы қанша? (n_су=1.33)',
    formula: 'sin(α_крит) = n₂/n₁ = 1/1.33',
    options: ['42.2°', '48.8°', '53.1°', '60°'],
    correctIndex: 1,
    hint: 'Критикалық бұрыш: sin(α_крит) = n_сирек/n_тығыз',
    stepByStep: ['sin(α_крит) = n₂/n₁ = 1/1.33', 'sin(α_крит) = 0.752', 'α_крит = arcsin(0.752) ≈ 48.8°'],
    explanation: 'Критикалық бұрыштан асқанда жарық сынбай, толық шағылады.',
  },
  {
    id: 'h2', level: 'hard',
    question: 'Жарық ауадан алмазға (n=2.42) 60° бұрышпен түседі. Сыну бұрышы?',
    formula: 'sinβ = sin60°/2.42',
    options: ['18.2°', '21.0°', '25.4°', '30°'],
    correctIndex: 1,
    hint: 'Алмаздың сыну көрсеткіші өте жоғары',
    stepByStep: ['sinβ = (1/2.42)·sin60°', 'sinβ = 0.866/2.42 = 0.358', 'β = arcsin(0.358) ≈ 21.0°'],
    explanation: 'Алмаздың жоғары n мәні оны ерекше жарқыратады.',
  },
  {
    id: 'h3', level: 'hard',
    question: 'Екі орта арасында жарық 40° бұрышпен түсіп, 25° бұрышпен сынады. n₂ = ? (n₁=1)',
    formula: 'n₂ = sinα/sinβ = sin40°/sin25°',
    options: ['1.22', '1.52', '1.73', '2.00'],
    correctIndex: 1,
    hint: 'Снелл заңынан n₂ = sinα/sinβ',
    stepByStep: ['n₁ sinα = n₂ sinβ', 'n₂ = sinα/sinβ = sin40°/sin25°', 'n₂ = 0.643/0.423 ≈ 1.52'],
    explanation: 'Бұл мән шыныға сәйкес келеді (n ≈ 1.5).',
  },
  {
    id: 'h4', level: 'hard',
    question: 'Алмаздан (n=2.42) ауаға өтуде критикалық бұрыш қанша?',
    formula: 'sin(α_крит) = 1/2.42',
    options: ['22.5°', '24.4°', '30°', '45°'],
    correctIndex: 1,
    hint: 'sin(α_крит) = n_ауа/n_алмаз',
    stepByStep: ['sin(α_крит) = n₂/n₁ = 1/2.42', 'sin(α_крит) = 0.413', 'α_крит = arcsin(0.413) ≈ 24.4°'],
    explanation: 'Алмаздың критикалық бұрышы өте кіші, сондықтан ол ерекше жарқырайды.',
  },
  {
    id: 'h5', level: 'hard',
    question: 'Жарық судан (n=1.33) шыныға (n=1.5) 30° бұрышпен өтеді. Сыну бұрышы?',
    formula: 'sinβ = (1.33/1.5)·sin30°',
    options: ['22.8°', '26.3°', '30°', '35°'],
    correctIndex: 1,
    hint: 'Шыны судан тығызырақ',
    stepByStep: ['1.33 × sin30° = 1.5 × sinβ', 'sinβ = (1.33 × 0.5)/1.5', 'sinβ = 0.665/1.5 = 0.443', 'β = arcsin(0.443) ≈ 26.3°'],
    explanation: 'Судан шыныға өткенде жарық нормальға жақындайды.',
  },
  {
    id: 'h6', level: 'hard',
    question: 'Екі қабатты жүйе: ауа → шыны (n=1.5) → су (n=1.33). Ауадан 45° бұрышпен түскен жарық судан қандай бұрышпен шығады?',
    formula: 'n_ауа sinα = n_су sinβ_соңғы',
    options: ['28.1°', '32.1°', '45°', '50.3°'],
    correctIndex: 1,
    hint: 'Аралық ортаны елемеуге болады! n₁ sinα₁ = n₃ sinα₃',
    stepByStep: ['n_ауа sin45° = n_су sinβ', '1 × 0.707 = 1.33 × sinβ', 'sinβ = 0.532', 'β ≈ 32.1°'],
    explanation: 'Параллель қабаттарда аралық ортаны елемеуге болады — тек бірінші мен соңғы орта маңызды.',
  },
  {
    id: 'h7', level: 'hard',
    question: 'Шыныдан (n=1.5) ауаға өтуде критикалық бұрыш қанша?',
    formula: 'sin(α_крит) = 1/1.5',
    options: ['38.7°', '41.8°', '45°', '48.6°'],
    correctIndex: 1,
    hint: 'sin(α_крит) = n_ауа/n_шыны',
    stepByStep: ['sin(α_крит) = 1/1.5 = 0.667', 'α_крит = arcsin(0.667) ≈ 41.8°'],
    explanation: 'Шынының критикалық бұрышы ~41.8°. Одан үлкен бұрышта толық шағылу болады.',
  },
  {
    id: 'h8', level: 'hard',
    question: 'Ортаның сыну көрсеткіші 1.7. Ондағы жарық жылдамдығы қанша?',
    formula: 'v = c/n = 3×10⁸/1.7',
    options: ['1.5×10⁸ м/с', '1.76×10⁸ м/с', '2×10⁸ м/с', '2.5×10⁸ м/с'],
    correctIndex: 1,
    hint: 'v = c/n',
    stepByStep: ['v = c/n', 'v = 3×10⁸/1.7', 'v ≈ 1.76×10⁸ м/с'],
    explanation: 'Сыну көрсеткіші жоғары болған сайын жарық жылдамдығы төмен.',
  },
  {
    id: 'h9', level: 'hard',
    question: 'Жарық ауадан белгісіз ортаға 50° бұрышпен түсіп, 30° бұрышпен сынады. Ортадағы жарық жылдамдығы?',
    formula: 'n₂ = sin50°/sin30° → v = c/n₂',
    options: ['1.56×10⁸ м/с', '1.96×10⁸ м/с', '2.3×10⁸ м/с', '2.8×10⁸ м/с'],
    correctIndex: 1,
    hint: 'Алдымен n₂ тап, сосын v = c/n₂',
    stepByStep: ['n₂ = sin50°/sin30° = 0.766/0.5 = 1.532', 'v = c/n₂ = 3×10⁸/1.532', 'v ≈ 1.96×10⁸ м/с'],
    explanation: 'Сыну бұрышынан ортаның сыну көрсеткішін, одан жылдамдықты табуға болады.',
  },
  {
    id: 'h10', level: 'hard',
    question: 'Оптикалық талшықта жарық неліктен шығып кетпейді?',
    options: ['Талшық өте жіңішке', 'Толық ішкі шағылу принципі', 'Жарық жұтылады', 'Талшық мөлдір емес'],
    correctIndex: 1,
    hint: 'Талшық ішіндегі жарық шекараға белгілі бұрышпен түседі',
    stepByStep: ['Талшық өзегі (core) қабықшадан (cladding) тығызырақ', 'Жарық критикалық бұрыштан үлкен бұрышпен түседі', 'Толық ішкі шағылу болады — жарық талшықта қалады'],
    explanation: 'Оптикалық талшық — толық ішкі шағылу принципінің ең маңызды қолданысы.',
  },
];

export default function PracticePage() {
  const { getAdaptiveLevel, emotion, getMotivationalMessage } = useEmotion();
  const { completeProblem, progress } = useProgress();
  const navigate = useNavigate();
  
  const adaptiveLevel = getAdaptiveLevel();
  const defaultFilter = adaptiveLevel === 'simplified' ? 'easy' as const 
    : adaptiveLevel === 'advanced' ? 'hard' as const 
    : 'medium' as const;

  const [filterLevel, setFilterLevel] = useState<'all' | 'easy' | 'medium' | 'hard'>(defaultFilter);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Shuffle options for each problem, preserving correct answer tracking
  const shuffledProblems = useMemo(() => {
    const base = filterLevel === 'all' ? problems : problems.filter(p => p.level === filterLevel);
    return base.map(p => {
      const indices = p.options.map((_, i) => i);
      // Fisher-Yates shuffle
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return {
        ...p,
        options: indices.map(i => p.options[i]),
        correctIndex: indices.indexOf(p.correctIndex),
      };
    });
  }, [filterLevel]);

  const filteredProblems = shuffledProblems;
  const problem = filteredProblems[currentIdx] || filteredProblems[0];
  const isCorrect = selected !== null && selected === problem.correctIndex;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    completeProblem(problem.id, idx === problem.correctIndex);
    setTotalAnswered(prev => prev + 1);
    if (idx === problem.correctIndex) setCorrectCount(prev => prev + 1);
  };

  const nextProblem = () => {
    if (currentIdx >= filteredProblems.length - 1) {
      setTestFinished(true);
      return;
    }
    setSelected(null);
    setShowHint(false);
    setShowSteps(false);
    setCurrentIdx(prev => prev + 1);
  };

  const levelLabel = { easy: 'Жеңіл', medium: 'Орташа', hard: 'Күрделі' };
  const levelColor = { easy: 'bg-success/10 text-success', medium: 'bg-warning/10 text-warning', hard: 'bg-destructive/10 text-destructive' };

  const getEncouragement = () => {
    if (emotion.current === 'confused' || emotion.current === 'sad') {
      return 'Ештеңе етпейді! Демонстрацияны қарап, визуалды түсінуге тырыс.';
    }
    if (emotion.current === 'tired') {
      return 'Демалып ал, сосын қайта оралсаң да болады!';
    }
    return getMotivationalMessage();
  };

  if (testFinished) {
    const percent = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 text-center shadow-elevated">
            <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">Тест аяқталды!</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Нәтиже: <span className="font-bold text-foreground">{correctCount}/{totalAnswered}</span> ({percent}%)
            </p>
            <div className="mb-6">
              {percent >= 80 && <p className="text-success font-semibold text-lg">🌟 Тамаша нәтиже!</p>}
              {percent >= 50 && percent < 80 && <p className="text-warning font-semibold text-lg">👍 Жақсы! Тағы біраз жаттығу керек.</p>}
              {percent < 50 && <p className="text-secondary font-semibold text-lg">💪 Сабақты қайта оқып, тағы тырыс!</p>}
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" onClick={() => navigate('/progress')} className="rounded-xl">
                Прогресті көру
              </Button>
              <Button variant="hero" onClick={() => navigate('/')} className="rounded-xl glow-primary">
                Басына оралу
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
               style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Адаптивті тест</h1>
            <p className="text-sm text-muted-foreground">
              Эмоцияңа сай деңгей: {adaptiveLevel === 'simplified' ? 'Жеңіл' : adaptiveLevel === 'advanced' ? 'Күрделі' : 'Орташа'}
            </p>
          </div>
        </div>

        {/* Level filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'easy', 'medium', 'hard'] as const).map(l => (
            <button key={l} onClick={() => { setFilterLevel(l); setCurrentIdx(0); setSelected(null); setShowHint(false); setShowSteps(false); setTestFinished(false); setCorrectCount(0); setTotalAnswered(0); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filterLevel === l 
                  ? 'text-primary-foreground shadow-lg' 
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
              style={filterLevel === l ? { background: 'var(--gradient-primary)' } : {}}>
              {l === 'all' ? 'Барлығы' : levelLabel[l]}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={problem.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass-card p-6 mb-4 shadow-elevated">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${levelColor[problem.level]}`}>
                  {levelLabel[problem.level]}
                </span>
                <span className="text-sm text-muted-foreground">{currentIdx + 1}/{filteredProblems.length}</span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-3">{problem.question}</h3>
              {problem.formula && (
                <div className="glass-card-blue p-4 mb-4">
                  <p className="font-display text-foreground text-center">{problem.formula}</p>
                </div>
              )}

              <div className="space-y-3">
                {problem.options.map((opt, i) => (
                  <button key={i} onClick={() => handleSelect(i)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                      selected === null ? 'border-border hover:border-primary/40 hover:bg-accent/30 hover:shadow-md' :
                      i === problem.correctIndex ? 'border-success bg-success/10' :
                      i === selected ? 'border-destructive bg-destructive/10' : 'border-border opacity-40'
                    }`}>
                    <span className="font-medium text-foreground">{opt}</span>
                    {selected !== null && i === problem.correctIndex && <CheckCircle className="inline w-5 h-5 text-success ml-2" />}
                    {selected === i && i !== problem.correctIndex && <XCircle className="inline w-5 h-5 text-destructive ml-2" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Help buttons */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)} className="rounded-xl">
                <Lightbulb className="w-4 h-4 mr-1" /> Кеңес
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSteps(!showSteps)} className="rounded-xl">
                Шешім қадамдары
              </Button>
              {(emotion.current === 'confused' || emotion.current === 'tired') && (
                <Button variant="outline" size="sm" asChild className="rounded-xl border-secondary/30">
                  <Link to="/simulation">
                    <FlaskConical className="w-4 h-4 mr-1" /> Демонстрация көру
                  </Link>
                </Button>
              )}
            </div>

            {showHint && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-pink p-4 mb-4">
                <p className="text-sm text-foreground">💡 {problem.hint}</p>
              </motion.div>
            )}

            {showSteps && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-blue p-4 mb-4">
                <h4 className="font-semibold text-foreground mb-2">Шешім қадамдары:</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  {problem.stepByStep.map((step, i) => (
                    <li key={i} className="text-sm text-foreground">{step}</li>
                  ))}
                </ol>
              </motion.div>
            )}

            {selected !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className={`glass-card p-5 mb-4 ${isCorrect ? 'border-success/30' : 'border-secondary/30'}`}>
                <p className={`font-semibold mb-1 ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                  {isCorrect ? '✅ Тамаша! Дұрыс жауап!' : '❌ Қате жауап'}
                </p>
                <p className="text-sm text-foreground mb-2">{problem.explanation}</p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground italic mb-2">{getEncouragement()}</p>
                )}
                <Button variant="hero" size="sm" className="mt-2 rounded-xl glow-primary" onClick={nextProblem}>
                  {currentIdx >= filteredProblems.length - 1 ? 'Нәтижені көру' : 'Келесі есеп'} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}

            {/* Streak */}
            {progress.streak >= 3 && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-5 text-center shadow-elevated"
              >
                <Trophy className="w-10 h-10 text-warning mx-auto mb-2" />
                <p className="font-display font-bold text-foreground text-lg">🔥 {progress.streak} дұрыс жауап қатарынан!</p>
                <p className="text-sm text-muted-foreground">Жарайсың! Жалғастыр!</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
