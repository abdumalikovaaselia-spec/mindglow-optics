import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '@/contexts/ProgressContext';
import { useEmotion } from '@/contexts/EmotionContext';

const media = [
  { label: 'Ауа', n: 1.0, color: '#E0F2FE' },
  { label: 'Су', n: 1.33, color: '#BAE6FD' },
  { label: 'Шыны', n: 1.5, color: '#DBEAFE' },
  { label: 'Алмаз', n: 2.42, color: '#C7D2FE' },
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

  // Incident ray
  const ix = cx - rayLen * Math.sin(angleRad);
  const iy = cy - rayLen * Math.cos(angleRad);

  // Refracted ray
  const rx = totalInternalReflection
    ? cx + rayLen * Math.sin(angleRad)
    : cx + rayLen * Math.sin(refrAngleRad);
  const ry = totalInternalReflection
    ? cy - rayLen * Math.cos(angleRad)
    : cy + rayLen * Math.cos(refrAngleRad);

  const showHints = emotion.current === 'confused' || emotion.current === 'tired';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Интерактивті демонстрация</h1>
        <p className="text-muted-foreground mb-6">Жарық сәулесінің сынуын өз көзіңмен көр</p>

        <div className="glass-card p-6 mb-6">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-h-[500px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Medium 1 (top) */}
            <rect x="0" y="0" width={W} height={cy} fill={media[medium1Idx].color} opacity={0.6} />
            {/* Medium 2 (bottom) */}
            <rect x="0" y={cy} width={W} height={cy} fill={media[medium2Idx].color} opacity={0.6} />
            {/* Interface line */}
            <line x1="0" y1={cy} x2={W} y2={cy} stroke="hsl(215,28%,17%)" strokeWidth="2" strokeDasharray="8,4" opacity={0.3} />
            {/* Normal line */}
            <line x1={cx} y1={cy - 180} x2={cx} y2={cy + 180} stroke="hsl(215,16%,47%)" strokeWidth="1.5" strokeDasharray="5,5" opacity={0.5} />
            <text x={cx + 8} y={cy - 165} fill="hsl(215,16%,47%)" fontSize="12">Нормаль</text>

            {/* Incident ray */}
            <line x1={ix} y1={iy} x2={cx} y2={cy} stroke="hsl(187,94%,43%)" strokeWidth="3" />
            <polygon
              points={`${cx},${cy} ${cx - 6},${cy - 12} ${cx + 6},${cy - 12}`}
              fill="hsl(187,94%,43%)"
              transform={`rotate(${angle}, ${cx}, ${cy})`}
            />

            {/* Refracted/reflected ray */}
            <line
              x1={cx} y1={cy} x2={rx} y2={ry}
              stroke={totalInternalReflection ? 'hsl(0,84%,60%)' : 'hsl(217,91%,60%)'}
              strokeWidth="3"
            />

            {/* Angle arcs */}
            <path
              d={`M ${cx},${cy - 40} A 40,40 0 0,${angle > 0 ? 1 : 0} ${cx + 40 * Math.sin(angleRad)},${cy - 40 * Math.cos(angleRad)}`}
              fill="none" stroke="hsl(187,94%,43%)" strokeWidth="1.5"
            />
            <text x={cx + 45 * Math.sin(angleRad / 2)} y={cy - 45 * Math.cos(angleRad / 2)} fill="hsl(187,94%,43%)" fontSize="13" fontWeight="600">
              α={angle}°
            </text>

            {!totalInternalReflection && (
              <>
                <path
                  d={`M ${cx},${cy + 35} A 35,35 0 0,0 ${cx + 35 * Math.sin(refrAngleRad)},${cy + 35 * Math.cos(refrAngleRad)}`}
                  fill="none" stroke="hsl(217,91%,60%)" strokeWidth="1.5"
                />
                <text x={cx + 45 * Math.sin(refrAngleRad / 2)} y={cy + 50 * Math.cos(refrAngleRad / 2)} fill="hsl(217,91%,60%)" fontSize="13" fontWeight="600">
                  β={refrAngle.toFixed(1)}°
                </text>
              </>
            )}

            {/* Labels */}
            <text x="20" y="30" fill="hsl(215,28%,17%)" fontSize="14" fontWeight="600">{media[medium1Idx].label} (n={n1})</text>
            <text x="20" y={cy + 25} fill="hsl(215,28%,17%)" fontSize="14" fontWeight="600">{media[medium2Idx].label} (n={n2})</text>

            {totalInternalReflection && (
              <text x={cx - 80} y={cy + 30} fill="hsl(0,84%,60%)" fontSize="14" fontWeight="600">
                Толық ішкі шағылу!
              </text>
            )}
          </svg>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Түсу бұрышы: {angle}°</label>
            <input
              type="range" min="0" max="85" value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div className="glass-card p-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Бірінші орта</label>
            <div className="flex gap-2 flex-wrap">
              {media.map((m, i) => (
                <button key={i} onClick={() => setMedium1Idx(i)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${i === medium1Idx ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="glass-card p-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Екінші орта</label>
            <div className="flex gap-2 flex-wrap">
              {media.map((m, i) => (
                <button key={i} onClick={() => setMedium2Idx(i)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${i === medium2Idx ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
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
          className="glass-card p-6"
        >
          <h3 className="font-display font-semibold text-foreground text-lg mb-3">Нәтижелер</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-primary">{angle}°</p>
              <p className="text-xs text-muted-foreground">Түсу бұрышы</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-secondary">
                {totalInternalReflection ? '—' : `${refrAngle.toFixed(1)}°`}
              </p>
              <p className="text-xs text-muted-foreground">Сыну бұрышы</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{n1}</p>
              <p className="text-xs text-muted-foreground">n₁</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{n2}</p>
              <p className="text-xs text-muted-foreground">n₂</p>
            </div>
          </div>

          {showHints && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-accent p-4 rounded-xl">
              <p className="text-sm text-accent-foreground">
                💡 Қарашы, слайдерді жылжытқанда сәуле қалай бұрылатынын бақыла. {n1 < n2 ? 'Тығыз ортаға кіргенде сәуле нормальға қарай ауытқиды.' : 'Сирек ортаға шыққанда сәуле нормальдан алыстайды.'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
