import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '@/contexts/ProgressContext';
import { useEmotion } from '@/contexts/EmotionContext';
import { Sparkles } from 'lucide-react';

const media = [
  { label: 'Ауа', n: 1.0, color: '#EFF6FF' },
  { label: 'Су', n: 1.33, color: '#DBEAFE' },
  { label: 'Шыны', n: 1.5, color: '#E0E7FF' },
  { label: 'Алмаз', n: 2.42, color: '#EDE9FE' },
];

export default function SimulationPage() {
  const [angle, setAngle] = useState(30);
  const [medium1Idx, setMedium1Idx] = useState(0);
  const [medium2Idx, setMedium2Idx] = useState(1);
  const { viewSimulation } = useProgress();
  const { emotion } = useEmotion();
  const hasViewed = useRef(false);

  useEffect(() => {
    if (!hasViewed.current) { viewSimulation(); hasViewed.current = true; }
  }, []);

  const n1 = media[medium1Idx].n;
  const n2 = media[medium2Idx].n;
  const angleRad = (angle * Math.PI) / 180;
  const sinBeta = (n1 / n2) * Math.sin(angleRad);
  const totalInternalReflection = sinBeta > 1;
  const refrAngle = totalInternalReflection ? 90 : (Math.asin(sinBeta) * 180) / Math.PI;
  const refrAngleRad = (refrAngle * Math.PI) / 180;

  const W = 600, H = 500;
  const cx = W / 2, cy = H / 2;
  const rayLen = 200;

  const ix = cx - rayLen * Math.sin(angleRad);
  const iy = cy - rayLen * Math.cos(angleRad);

  const rx = totalInternalReflection
    ? cx + rayLen * Math.sin(angleRad)
    : cx + rayLen * Math.sin(refrAngleRad);
  const ry = totalInternalReflection
    ? cy - rayLen * Math.cos(angleRad)
    : cy + rayLen * Math.cos(refrAngleRad);

  const showHints = emotion.current === 'confused' || emotion.current === 'tired' || emotion.current === 'sad';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
               style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Интерактивті демонстрация</h1>
            <p className="text-sm text-muted-foreground">Жарық сәулесінің сынуын өз көзіңмен көр</p>
          </div>
        </div>

        <div className="glass-card p-6 mb-6 shadow-elevated">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-h-[500px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <defs>
              <linearGradient id="rayGrad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(200,90%,55%)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(200,90%,55%)" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="rayGrad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(330,65%,70%)" stopOpacity="1" />
                <stop offset="100%" stopColor="hsl(330,65%,70%)" stopOpacity="0.3" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect x="0" y="0" width={W} height={cy} fill={media[medium1Idx].color} opacity={0.7} rx="0" />
            <rect x="0" y={cy} width={W} height={cy} fill={media[medium2Idx].color} opacity={0.7} rx="0" />
            <line x1="0" y1={cy} x2={W} y2={cy} stroke="hsl(220,20%,80%)" strokeWidth="2" strokeDasharray="8,4" opacity={0.5} />
            <line x1={cx} y1={cy - 180} x2={cx} y2={cy + 180} stroke="hsl(220,15%,60%)" strokeWidth="1.5" strokeDasharray="5,5" opacity={0.4} />
            <text x={cx + 8} y={cy - 165} fill="hsl(220,15%,46%)" fontSize="11" fontWeight="500">Нормаль</text>

            <line x1={ix} y1={iy} x2={cx} y2={cy} stroke="url(#rayGrad1)" strokeWidth="3" filter="url(#glow)" />
            <polygon
              points={`${cx},${cy} ${cx - 6},${cy - 12} ${cx + 6},${cy - 12}`}
              fill="hsl(200,90%,55%)"
              transform={`rotate(${angle}, ${cx}, ${cy})`}
            />

            <line
              x1={cx} y1={cy} x2={rx} y2={ry}
              stroke={totalInternalReflection ? 'hsl(0,75%,55%)' : 'url(#rayGrad2)'}
              strokeWidth="3" filter="url(#glow)"
            />

            <path
              d={`M ${cx},${cy - 40} A 40,40 0 0,${angle > 0 ? 1 : 0} ${cx + 40 * Math.sin(angleRad)},${cy - 40 * Math.cos(angleRad)}`}
              fill="none" stroke="hsl(200,90%,55%)" strokeWidth="1.5"
            />
            <text x={cx + 45 * Math.sin(angleRad / 2)} y={cy - 45 * Math.cos(angleRad / 2)} fill="hsl(200,90%,55%)" fontSize="13" fontWeight="600">
              α={angle}°
            </text>

            {!totalInternalReflection && (
              <>
                <path
                  d={`M ${cx},${cy + 35} A 35,35 0 0,0 ${cx + 35 * Math.sin(refrAngleRad)},${cy + 35 * Math.cos(refrAngleRad)}`}
                  fill="none" stroke="hsl(330,65%,70%)" strokeWidth="1.5"
                />
                <text x={cx + 45 * Math.sin(refrAngleRad / 2)} y={cy + 50 * Math.cos(refrAngleRad / 2)} fill="hsl(330,65%,70%)" fontSize="13" fontWeight="600">
                  β={refrAngle.toFixed(1)}°
                </text>
              </>
            )}

            <text x="20" y="30" fill="hsl(230,25%,15%)" fontSize="13" fontWeight="600">{media[medium1Idx].label} (n={n1})</text>
            <text x="20" y={cy + 25} fill="hsl(230,25%,15%)" fontSize="13" fontWeight="600">{media[medium2Idx].label} (n={n2})</text>

            {totalInternalReflection && (
              <text x={cx - 80} y={cy + 30} fill="hsl(0,75%,55%)" fontSize="14" fontWeight="600">
                Толық ішкі шағылу!
              </text>
            )}
          </svg>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-5">
            <label className="text-sm font-semibold text-foreground mb-3 block">Түсу бұрышы: {angle}°</label>
            <input
              type="range" min="0" max="85" value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div className="glass-card p-5">
            <label className="text-sm font-semibold text-foreground mb-3 block">Бірінші орта</label>
            <div className="flex gap-2 flex-wrap">
              {media.map((m, i) => (
                <button key={i} onClick={() => setMedium1Idx(i)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    i === medium1Idx 
                      ? 'text-primary-foreground shadow-lg' 
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                  style={i === medium1Idx ? { background: 'var(--gradient-primary)' } : {}}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="glass-card p-5">
            <label className="text-sm font-semibold text-foreground mb-3 block">Екінші орта</label>
            <div className="flex gap-2 flex-wrap">
              {media.map((m, i) => (
                <button key={i} onClick={() => setMedium2Idx(i)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    i === medium2Idx 
                      ? 'text-secondary-foreground shadow-lg' 
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                  style={i === medium2Idx ? { background: 'linear-gradient(135deg, hsl(330 65% 70%), hsl(330 65% 80%))' } : {}}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <motion.div
          key={`${angle}-${medium1Idx}-${medium2Idx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 shadow-elevated"
        >
          <h3 className="font-display font-semibold text-foreground text-lg mb-4">Нәтижелер</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="glass-card-blue p-4">
              <p className="text-2xl font-display font-bold text-primary">{angle}°</p>
              <p className="text-xs text-muted-foreground mt-1">Түсу бұрышы</p>
            </div>
            <div className="glass-card-pink p-4">
              <p className="text-2xl font-display font-bold text-secondary">
                {totalInternalReflection ? '—' : `${refrAngle.toFixed(1)}°`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Сыну бұрышы</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-2xl font-display font-bold text-foreground">{n1}</p>
              <p className="text-xs text-muted-foreground mt-1">n₁</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-2xl font-display font-bold text-foreground">{n2}</p>
              <p className="text-xs text-muted-foreground mt-1">n₂</p>
            </div>
          </div>

          {showHints && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 glass-card-pink p-5">
              <p className="text-sm text-foreground">
                💡 Қарашы, слайдерді жылжытқанда сәуле қалай бұрылатынын бақыла. {n1 < n2 ? 'Тығыз ортаға кіргенде сәуле нормальға қарай ауытқиды.' : 'Сирек ортаға шыққанда сәуле нормальдан алыстайды.'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
