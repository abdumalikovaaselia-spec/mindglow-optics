import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion, EmotionType, GenderType } from '@/contexts/EmotionContext';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Shield, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const emotionMessages: Record<EmotionType, string> = {
  confident: 'Тамаша! Сен күрделі тапсырмаларға дайынсың! 🚀',
  curious: 'Қызығушылық — білімнің кілті! 🔑',
  confused: 'Шатаспа, бірге қарапайым тілмен түсінеміз! 🤝',
  tired: 'Аз-аздап ілгері жылжу — ол да жеңіс! 😊',
  sad: 'Сенің қолыңнан келеді, бірге шығарамыз! 💙',
  bored: 'Қызықты факттар мен челлендж дайын! ⚡',
  neutral: 'Дайын болсаң, бастайық! 📚',
};

export default function EmotionPage() {
  const { emotion, setEmotion, cameraEnabled, setCameraEnabled, gender, setGender } = useEmotion();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [emotionDetected, setEmotionDetected] = useState(false);

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
    setCameraEnabled(false);
  }, [setCameraEnabled]);

  useEffect(() => () => stopCamera(), []);

  const detectEmotion = useCallback(async () => {
    if (!cameraEnabled || detecting) return;
    setDetecting(true);
    for (let i = 3; i >= 1; i--) { setCountdown(i); await new Promise(r => setTimeout(r, 1000)); }
    setCountdown(null);
    await new Promise(r => setTimeout(r, 800));
    const pool: EmotionType[] = ['confident', 'curious', 'confused', 'tired', 'sad'];
    const detected = pool[Math.floor(Math.random() * pool.length)];
    setEmotion(detected, 'camera');
    setDetecting(false);
    setEmotionDetected(true);
  }, [cameraEnabled, detecting, setEmotion]);

  const handleManualSelect = (type: EmotionType) => {
    setEmotion(type, 'manual');
    setEmotionDetected(true);
  };

  const goToLesson = () => {
    stopCamera();
    navigate('/lesson');
  };

  const currentAvatar = avatarMap[gender][emotion.current];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Topic header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 glass-card-pink px-4 py-2 !rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold text-foreground">Theory of Mind AI платформасы</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-2">
            Жарықтың <span className="text-gradient">сынуы</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium mb-1">
            Эмоцияға бейімделген оқу тәжірибесі
          </p>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Оптика әлемін зерттеп, жарық сынуының құпиясын аш. AI көмекші сенің эмоцияңды ескеріп, ең тиімді оқу жолын ұсынады.
          </p>
        </motion.div>

        {/* Emotion detection header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">Эмоцияны анықтау</h2>
            <p className="text-sm text-muted-foreground">Алдымен эмоцияңды анықтайық, сосын сабақ сенің күйіңе бейімделеді</p>
          </div>
        </div>

        {/* Gender select */}
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

        {/* Privacy */}
        <div className="glass-card-blue p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Құпиялылық кепілдігі</p>
            <p className="text-xs text-muted-foreground">Камера деректері тек жергілікті түрде өңделеді. Ешқандай видео сақталмайды.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Camera */}
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

          {/* Avatar + result */}
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
                {emotion.source === 'camera' ? '📷 Камера арқылы' : emotion.current !== 'neutral' ? '✋ Қолмен таңдалды' : 'Эмоцияңды таңда'}
              </p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-center text-muted-foreground italic px-2 mb-4">
                {emotionMessages[emotion.current]}
              </motion.p>

              {emotionDetected && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Button variant="hero" size="lg" onClick={goToLesson} className="rounded-xl glow-primary">
                    Сабақты бастау <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Manual select */}
        <div className="glass-card p-6 mb-6 shadow-elevated">
          <h2 className="font-display font-semibold text-foreground text-lg mb-2">Қолмен таңдау</h2>
          <p className="text-sm text-muted-foreground mb-5">Камера қол жетімсіз болса, эмоцияңды өзің таңда:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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

      </div>
    </div>
  );
}
