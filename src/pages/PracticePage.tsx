import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '@/contexts/EmotionContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Lightbulb, ChevronRight, Trophy, FlaskConical, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  {
    id: 'p1', level: 'easy',
    question: 'Жарық ауадан суға өткенде не болады?',
    options: ['Жылдамдығы артады', 'Жылдамдығы кемиді', 'Жылдамдығы өзгермейді', 'Жарық жоғалады'],
    correctIndex: 1,
    hint: 'Судың оптикалық тығыздығы ауадан жоғары',
    stepByStep: ['Ауаның сыну көрсеткіші n=1.0', 'Судың сыну көрсеткіші n=1.33', 'n жоғары болса, жылдамдық кемиді'],
    explanation: 'Су оптикалық тығыз орта, сондықтан жарық баяулайды.',
  },
  {
    id: 'p2', level: 'easy',
    question: 'Сыну бұрышы қай сызықтан өлшенеді?',
    options: ['Беткей сызығынан', 'Нормаль сызығынан', 'Көлденең сызықтан', 'Тік сызықтан'],
    correctIndex: 1,
    hint: 'Оптикада бұрыштар әрдайым бір арнайы сызықтан өлшенеді',
    stepByStep: ['Нормаль — беткейге перпендикуляр сызық', 'Барлық бұрыштар нормальдан өлшенеді'],
    explanation: 'Нормаль — екі орта шекарасына перпендикуляр сызық, бұрыштар осыдан өлшенеді.',
  },
  {
    id: 'p3', level: 'easy',
    question: 'Ауаның сыну көрсеткіші шамамен қанша?',
    options: ['0.5', '1.0', '1.33', '2.42'],
    correctIndex: 1,
    hint: 'Ауа — ең «сирек» орта, вакуумға жақын',
    stepByStep: ['Вакуумда n=1.0', 'Ауа вакуумға өте жақын'],
    explanation: 'Ауаның сыну көрсеткіші шамамен 1.0.',
  },
  {
    id: 'p4', level: 'medium',
    question: 'Жарық ауадан (n=1) суға (n=1.33) 45° бұрышпен түседі. Сыну бұрышы қанша?',
    formula: 'n₁ sinα = n₂ sinβ → sinβ = sin45°/1.33',
    options: ['25.2°', '32.1°', '45°', '60°'],
    correctIndex: 1,
    hint: 'Снелл заңын қолдан: sinβ = (n₁/n₂)·sinα',
    stepByStep: ['n₁ sinα = n₂ sinβ', '1 × sin45° = 1.33 × sinβ', 'sinβ = 0.707/1.33 = 0.532', 'β = arcsin(0.532) ≈ 32.1°'],
    explanation: 'Тығыз ортаға кіргенде сыну бұрышы түсу бұрышынан кіші болады.',
  },
  {
    id: 'p5', level: 'medium',
    question: 'Жарық судан (n=1.33) ауаға (n=1) 20° бұрышпен шығады. Сыну бұрышы қанша?',
    formula: 'sinβ = (1.33/1)·sin20°',
    options: ['15.1°', '20°', '27.1°', '35°'],
    correctIndex: 2,
    hint: 'Сирек ортаға шыққанда сыну бұрышы үлкейеді',
    stepByStep: ['1.33 × sin20° = 1 × sinβ', 'sinβ = 1.33 × 0.342 = 0.455', 'β = arcsin(0.455) ≈ 27.1°'],
    explanation: 'Тығыз ортадан сирек ортаға шыққанда β > α.',
  },
  {
    id: 'p6', level: 'medium',
    question: 'Судағы қасық неліктен «сынған» болып көрінеді?',
    options: ['Қасық нашар сапалы', 'Су қасықты бұзады', 'Жарық су бетінде сынады', 'Көздің алдануы'],
    correctIndex: 2,
    hint: 'Жарық ауа-су шекарасынан өткенде бағытын өзгертеді',
    stepByStep: ['Жарық қасықтан шағылып, суда жүреді', 'Су бетінен шығарда сынады', 'Көз сыну есебінен қасықтың «жылжыған» бейнесін көреді'],
    explanation: 'Рефракция — жарық бағытының ауытқуы — қасықтың «сынған» көрінуіне себеп.',
  },
  {
    id: 'p7', level: 'medium',
    question: 'Жарық ауадан шыныға (n=1.5) 30° бұрышпен түседі. Сыну бұрышы?',
    formula: 'sinβ = sin30°/1.5 = 0.333',
    options: ['19.5°', '22.0°', '30°', '45°'],
    correctIndex: 0,
    hint: 'sinβ = (1/1.5)·sin30° = 0.5/1.5',
    stepByStep: ['sinβ = (n₁/n₂)sinα = (1/1.5)sin30°', 'sinβ = 0.5/1.5 = 0.333', 'β = arcsin(0.333) ≈ 19.5°'],
    explanation: 'Шыны ауадан тығызырақ, сондықтан сәуле нормальға жақындайды.',
  },
  {
    id: 'p8', level: 'hard',
    question: 'Судан ауаға өтуде толық ішкі шағылу бұрышы қанша? (n_су=1.33)',
    formula: 'sin(α_крит) = n₂/n₁ = 1/1.33',
    options: ['42.2°', '48.8°', '53.1°', '60°'],
    correctIndex: 1,
    hint: 'Критикалық бұрыш: sin(α_крит) = n_сирек/n_тығыз',
    stepByStep: ['sin(α_крит) = n₂/n₁ = 1/1.33', 'sin(α_крит) = 0.752', 'α_крит = arcsin(0.752) ≈ 48.8°'],
    explanation: 'Критикалық бұрыштан асқанда жарық сынбай, толық шағылады.',
  },
  {
    id: 'p9', level: 'hard',
    question: 'Жарық ауадан алмазға (n=2.42) 60° бұрышпен түседі. Сыну бұрышы?',
    formula: 'sinβ = sin60°/2.42',
    options: ['18.2°', '21.0°', '25.4°', '30°'],
    correctIndex: 1,
    hint: 'Алмаздың сыну көрсеткіші өте жоғары',
    stepByStep: ['sinβ = (1/2.42)·sin60°', 'sinβ = 0.866/2.42 = 0.358', 'β = arcsin(0.358) ≈ 21.0°'],
    explanation: 'Алмаздың жоғары n мәні оны ерекше жарқыратады.',
  },
  {
    id: 'p10', level: 'hard',
    question: 'Екі орта арасында жарық 40° бұрышпен түсіп, 25° бұрышпен сынады. n₂ = ? (n₁=1)',
    formula: 'n₂ = sinα/sinβ = sin40°/sin25°',
    options: ['1.22', '1.52', '1.73', '2.00'],
    correctIndex: 1,
    hint: 'Снелл заңынан n₂ = sinα/sinβ',
    stepByStep: ['n₁ sinα = n₂ sinβ', 'n₂ = sinα/sinβ = sin40°/sin25°', 'n₂ = 0.643/0.423 ≈ 1.52'],
    explanation: 'Бұл мән шыныға сәйкес келеді (n ≈ 1.5).',
  },
];

export default function PracticePage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [filterLevel, setFilterLevel] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const { getAdaptiveLevel, emotion, getMotivationalMessage } = useEmotion();
  const { completeProblem, progress } = useProgress();

  const filteredProblems = filterLevel === 'all' ? problems : problems.filter(p => p.level === filterLevel);
  const problem = filteredProblems[currentIdx] || filteredProblems[0];
  const isCorrect = selected !== null && selected === problem.correctIndex;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    completeProblem(problem.id, idx === problem.correctIndex);
  };

  const nextProblem = () => {
    setSelected(null);
    setShowHint(false);
    setShowSteps(false);
    setCurrentIdx(prev => (prev + 1) % filteredProblems.length);
  };

  const levelLabel = { easy: 'Жеңіл', medium: 'Орташа', hard: 'Күрделі' };
  const levelColor = { easy: 'bg-success/10 text-success', medium: 'bg-warning/10 text-warning', hard: 'bg-destructive/10 text-destructive' };

  // Emotion-based encouragement after wrong answer
  const getEncouragement = () => {
    if (emotion.current === 'confused' || emotion.current === 'sad') {
      return 'Ештеңе етпейді! Демонстрацияны қарап, визуалды түсінуге тырыс.';
    }
    if (emotion.current === 'tired') {
      return 'Демалып ал, сосын қайта оралсаң да болады!';
    }
    return getMotivationalMessage();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
               style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Есептер шығару</h1>
            <p className="text-sm text-muted-foreground">
              Деңгей: {getAdaptiveLevel() === 'simplified' ? 'Жеңілдетілген' : getAdaptiveLevel() === 'advanced' ? 'Күрделілеу' : 'Стандарт'}
            </p>
          </div>
        </div>

        {/* Level filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'easy', 'medium', 'hard'] as const).map(l => (
            <button key={l} onClick={() => { setFilterLevel(l); setCurrentIdx(0); setSelected(null); }}
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
                  Келесі есеп <ChevronRight className="w-4 h-4 ml-1" />
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
