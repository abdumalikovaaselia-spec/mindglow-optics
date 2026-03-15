import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion, EmotionType, GenderType } from '@/contexts/EmotionContext';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Shield, AlertTriangle, Sparkles, BookOpen, FlaskConical, Calculator, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import anime avatars
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
  girl: {
    confident: girlConfident,
    curious: girlCurious,
    confused: girlConfused,
    tired: girlTired,
    sad: girlSad,
    bored: girlBored,
    neutral: girlNeutral,
  },
  boy: {
    confident: boyConfident,
    curious: boyCurious,
    confused: boyConfused,
    tired: boyTired,
    sad: boySad,
    bored: boyBored,
    neutral: boyNeutral,
  },
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

interface AdaptiveAction {
  icon: React.ElementType;
  label: string;
  desc: string;
  to: string;
  color: string;
}

const emotionAdaptiveActions: Record<EmotionType, AdaptiveAction[]> = {
  confused: [
    { icon: FlaskConical, label: 'Демонстрация көру', desc: 'Анимациямен жарықтың сынуын қара — түсіну оңай болады', to: '/simulation', color: 'from-primary to-cyan-400' },
    { icon: BookOpen, label: 'Жеңіл түсіндірме', desc: 'Тақырыпты қарапайым тілмен, қысқа абзацтармен оқы', to: '/lesson', color: 'from-blue-400 to-indigo-400' },
  ],
  tired: [
    { icon: FlaskConical, label: 'Қысқа демонстрация', desc: 'Тек анимация — оқымай-ақ, көзбен түсін', to: '/simulation', color: 'from-violet-400 to-purple-400' },
    { icon: Sparkles, label: 'Мотивация алу', desc: 'Аз-аздап ілгері жылжу — ол да жеңіс! 🏆', to: '/emotion', color: 'from-pink-400 to-rose-400' },
  ],
  sad: [
    { icon: FlaskConical, label: 'Анимация көру', desc: 'Жарық сәулесін интерактивті қарап, көңіліңді көтер', to: '/simulation', color: 'from-cyan-400 to-teal-400' },
    { icon: BookOpen, label: 'Жұмсақ сабақ', desc: 'Қысқа блоктармен, қолдау сөздерімен оқы', to: '/lesson', color: 'from-blue-400 to-sky-400' },
  ],
  confident: [
    { icon: Calculator, label: 'Күрделі есептер', desc: 'Snell заңымен байланысты қиын тапсырмалар шеш', to: '/practice', color: 'from-emerald-400 to-green-400' },
    { icon: BookOpen, label: 'Тереңдетілген сабақ', desc: 'Толық формулалар мен жетілдірілген түсіндірмелер', to: '/lesson', color: 'from-primary to-blue-500' },
    { icon: Zap, label: 'Speed Challenge', desc: 'Уақыт бойынша жарыс — өз рекордыңды жаңарт!', to: '/practice', color: 'from-amber-400 to-orange-400' },
  ],
  curious: [
    { icon: FlaskConical, label: 'Зерттеу демо', desc: 'Параметрлерді өзгертіп, жарық сынуын тәжірибе жаса', to: '/simulation', color: 'from-primary to-cyan-400' },
    { icon: BookOpen, label: 'Қызықты фактілер', desc: 'Кемпірқосақ, линзалар, миражар — бәрін біл!', to: '/lesson', color: 'from-indigo-400 to-violet-400' },
    { icon: Calculator, label: 'Есеп шығару', desc: 'Білімді тәжірибеде қолдан — формулаларды қолдан', to: '/practice', color: 'from-teal-400 to-emerald-400' },
  ],
  bored: [
    { icon: Zap, label: 'Speed Challenge!', desc: 'Тез-тез есеп шығар — ойын сияқты! ⚡', to: '/practice', color: 'from-orange-400 to-red-400' },
    { icon: FlaskConical, label: 'Интерактивті демо', desc: 'Slider-мен ойна, бұрыштарды өзгерт, сәулені бағытта', to: '/simulation', color: 'from-primary to-cyan-400' },
  ],
  neutral: [
    { icon: BookOpen, label: 'Сабақты бастау', desc: 'Жарықтың сынуы тақырыбын стандартты режимде оқы', to: '/lesson', color: 'from-primary to-blue-500' },
    { icon: FlaskConical, label: 'Демонстрация', desc: 'Интерактивті анимацияларды қара', to: '/simulation', color: 'from-cyan-400 to-teal-400' },
  ],
};

export default function EmotionPage() {
  const { emotion, setEmotion, cameraEnabled, setCameraEnabled, getMotivationalMessage, gender, setGender } = useEmotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState('');
  const [message, setMessage] = useState('');

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 320, height: 240 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraEnabled(true);
        setCameraError('');
      }
    } catch {
      setCameraError('Камераға қол жетімділік жоқ. Қолмен таңдау режимін қолданыңыз.');
    }
  }, [setCameraEnabled]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraEnabled(false);
  }, [setCameraEnabled]);

  useEffect(() => () => stopCamera(), []);

  useEffect(() => {
    if (!cameraEnabled) return;
    const interval = setInterval(() => {
      const emotions: EmotionType[] = ['confident', 'curious', 'confused', 'neutral'];
      const detected = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(detected, 'camera');
    }, 5000);
    return () => clearInterval(interval);
  }, [cameraEnabled, setEmotion]);

  // Update motivational message when emotion changes
  useEffect(() => {
    if (emotion.current !== 'neutral') {
      setMessage(getMotivationalMessage());
    }
  }, [emotion.current]);

  const handleManualSelect = (type: EmotionType) => {
    setEmotion(type, 'manual');
    setMessage(getMotivationalMessage());
  };

  const currentAvatar = avatarMap[gender][emotion.current];
  const actions = emotionAdaptiveActions[emotion.current];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
               style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Эмоцияны анықтау</h1>
            <p className="text-sm text-muted-foreground">AI көмекші сенің күйіңді ескеріп, оқуды бейімдейді</p>
          </div>
        </div>

        {/* Gender Selection */}
        <div className="glass-card p-4 mb-6 shadow-elevated">
          <p className="text-sm font-semibold text-foreground mb-3">Кейіпкеріңді таңда:</p>
          <div className="flex gap-3">
            <button
              onClick={() => setGender('girl')}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all duration-300 ${
                gender === 'girl'
                  ? 'border-secondary/60 bg-secondary/10 shadow-lg'
                  : 'border-border hover:border-secondary/30'
              }`}
            >
              <img src={avatarMap.girl.neutral} alt="Қыз" className="w-12 h-12 object-contain" />
              <span className="font-semibold text-foreground">Қыз</span>
            </button>
            <button
              onClick={() => setGender('boy')}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all duration-300 ${
                gender === 'boy'
                  ? 'border-primary/60 bg-primary/10 shadow-lg'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <img src={avatarMap.boy.neutral} alt="Ұл" className="w-12 h-12 object-contain" />
              <span className="font-semibold text-foreground">Ұл</span>
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="glass-card-blue p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Құпиялылық кепілдігі</p>
            <p className="text-xs text-muted-foreground">Камера деректері тек жергілікті (local) түрде өңделеді. Ешқандай видео сақталмайды.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Camera section */}
          <div className="glass-card p-6 shadow-elevated">
            <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Камера режимі
              <span className="text-xs glass-card-pink px-2.5 py-1 rounded-full font-semibold">Демо</span>
            </h2>

            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden mb-4 shadow-inner">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              {!cameraEnabled && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CameraOff className="w-12 h-12 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {cameraError && (
              <div className="flex items-center gap-2 text-destructive text-sm mb-4">
                <AlertTriangle className="w-4 h-4" />
                {cameraError}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              {!cameraEnabled ? (
                <Button variant="hero" onClick={startCamera} className="rounded-xl glow-primary">
                  <Camera className="w-4 h-4 mr-1" /> Камераны қосу
                </Button>
              ) : (
                <Button variant="outline" onClick={stopCamera} className="rounded-xl">
                  <CameraOff className="w-4 h-4 mr-1" /> Камераны өшіру
                </Button>
              )}
            </div>
          </div>

          {/* Current emotion display with anime avatar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={emotion.current + gender}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`glass-card p-6 border-2 shadow-elevated flex flex-col items-center justify-center ${emotionBorderColors[emotion.current]}`}
            >
              <motion.img
                src={currentAvatar}
                alt={emotion.current}
                className="w-32 h-32 md:w-40 md:h-40 object-contain mb-4 drop-shadow-lg"
                initial={{ y: 10 }}
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              />
              <h3 className="font-display font-bold text-xl text-foreground mb-1">
                {emotionOptions.find(e => e.type === emotion.current)?.label || 'Бейтарап'}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {emotion.source === 'camera' ? '📷 Камера арқылы' : '✋ Қолмен таңдалды'}
              </p>
              {message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-center text-muted-foreground italic px-2"
                >
                  {message}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Manual selection with anime avatars */}
        <div className="glass-card p-6 mb-6 shadow-elevated">
          <h2 className="font-display font-semibold text-foreground text-lg mb-4">
            Қолмен таңдау
          </h2>
          <p className="text-sm text-muted-foreground mb-5">Өзіңіздің қазіргі күйіңізді таңдаңыз:</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {emotionOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => handleManualSelect(opt.type)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-[1.03] hover:shadow-lg ${
                  emotion.current === opt.type
                    ? emotionBorderColors[opt.type] + ' bg-accent/30'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <img
                  src={avatarMap[gender][opt.type]}
                  alt={opt.label}
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
                <p className="font-semibold text-foreground text-sm">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Emotion-Adaptive Actions Panel */}
        <motion.div
          key={emotion.current + '-actions'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 shadow-elevated border-2 border-primary/20"
        >
          <div className="flex items-center gap-3 mb-5">
            <motion.img
              src={currentAvatar}
              alt=""
              className="w-14 h-14 object-contain"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            />
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
                {emotion.current === 'confused' && 'Шатаспа — қарапайым түсіндірмелер мен демонстрациялар дайын'}
                {emotion.current === 'tired' && 'Қысқа анимациялар мен жеңіл контент сенің күйіңе сай'}
                {emotion.current === 'sad' && 'Жұмсақ қолдаумен оқуды жалғастыр'}
                {emotion.current === 'confident' && 'Күрделірек тапсырмалар мен тереңдетілген мазмұн ұсынылады'}
                {emotion.current === 'curious' && 'Қызығушылығыңды тәжірибе мен зерттеу арқылы қанағаттандыр'}
                {emotion.current === 'bored' && 'Интерактивті челлендждер мен ойын элементтері қосылды'}
                {emotion.current === 'neutral' && 'Стандартты оқу режимі — таңда және баста!'}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {actions.map((action, i) => (
              <Link key={i} to={action.to}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card p-4 h-full cursor-pointer group hover:shadow-lg transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-md`}>
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
