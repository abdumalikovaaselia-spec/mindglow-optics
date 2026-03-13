import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useEmotion, EmotionType } from '@/contexts/EmotionContext';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, User, Shield, AlertTriangle } from 'lucide-react';

const emotionOptions: { type: EmotionType; label: string; emoji: string; desc: string }[] = [
  { type: 'confident', label: 'Сенімдімін', emoji: '😊', desc: 'Жақсы түсініп жатырмын' },
  { type: 'curious', label: 'Қызығып отырмын', emoji: '🤔', desc: 'Көбірек білгім келеді' },
  { type: 'confused', label: 'Шатасып тұрмын', emoji: '😕', desc: 'Түсінбей жатырмын' },
  { type: 'tired', label: 'Шаршадым', emoji: '😴', desc: 'Демалғым келеді' },
  { type: 'sad', label: 'Жабырқаумын', emoji: '😢', desc: 'Көңіл-күйім төмен' },
  { type: 'bored', label: 'Жалығып отырмын', emoji: '😑', desc: 'Қызықсыз' },
];

const emotionBgColor: Record<EmotionType, string> = {
  confident: 'border-success bg-success/10',
  curious: 'border-secondary bg-secondary/10',
  confused: 'border-warning bg-warning/10',
  tired: 'border-muted-foreground bg-muted',
  sad: 'border-secondary bg-secondary/10',
  bored: 'border-muted-foreground bg-muted',
  neutral: 'border-border bg-muted',
};

export default function EmotionPage() {
  const { emotion, setEmotion, cameraEnabled, setCameraEnabled, getMotivationalMessage } = useEmotion();
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

  // Simulated emotion detection — in real app, use TensorFlow.js / face-api.js
  useEffect(() => {
    if (!cameraEnabled) return;
    const interval = setInterval(() => {
      const emotions: EmotionType[] = ['confident', 'curious', 'confused', 'neutral'];
      const detected = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(detected, 'camera');
    }, 5000);
    return () => clearInterval(interval);
  }, [cameraEnabled, setEmotion]);

  const handleManualSelect = (type: EmotionType) => {
    setEmotion(type, 'manual');
    setMessage(getMotivationalMessage());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Эмоцияны анықтау</h1>
        <p className="text-muted-foreground mb-6">AI көмекші сенің күйіңді ескеріп, оқуды бейімдейді</p>

        {/* Privacy notice */}
        <div className="glass-card p-4 mb-6 flex items-start gap-3 border-l-4 border-primary">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Құпиялылық кепілдігі</p>
            <p className="text-xs text-muted-foreground">Камера деректері тек жергілікті (local) түрде өңделеді. Ешқандай видео сақталмайды немесе серверге жіберілмейді. Бұл медициналық диагноз емес — тек оқу процесін жақсарту үшін.</p>
          </div>
        </div>

        {/* Camera section */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Камера режимі
            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">Демо</span>
          </h2>

          <div className="relative aspect-video bg-muted rounded-xl overflow-hidden mb-4 max-w-sm mx-auto">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            {!cameraEnabled && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CameraOff className="w-12 h-12 text-muted-foreground" />
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
              <Button variant="hero" onClick={startCamera}>
                <Camera className="w-4 h-4 mr-1" /> Камераны қосу
              </Button>
            ) : (
              <Button variant="outline" onClick={stopCamera}>
                <CameraOff className="w-4 h-4 mr-1" /> Камераны өшіру
              </Button>
            )}
          </div>
        </div>

        {/* Manual selection */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" />
            Қолмен таңдау
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Өзіңіздің қазіргі күйіңізді таңдаңыз:</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {emotionOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => handleManualSelect(opt.type)}
                className={`p-4 rounded-xl border-2 transition-all text-center hover:scale-105 ${
                  emotion.current === opt.type ? emotionBgColor[opt.type] : 'border-border hover:border-primary/30'
                }`}
              >
                <span className="text-3xl block mb-2">{opt.emoji}</span>
                <p className="font-medium text-foreground text-sm">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Current state */}
        <motion.div key={emotion.current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`glass-card p-6 border-2 ${emotionBgColor[emotion.current]}`}>
          <h3 className="font-display font-semibold text-foreground text-lg mb-2">Қазіргі күй</h3>
          <p className="text-foreground mb-1">
            Эмоция: <strong>{emotionOptions.find(e => e.type === emotion.current)?.label || 'Бейтарап'}</strong>
            <span className="text-muted-foreground text-sm ml-2">({emotion.source === 'camera' ? 'Камера' : 'Қолмен'})</span>
          </p>
          {message && <p className="text-sm text-muted-foreground mt-2 italic">{message}</p>}

          <div className="mt-4 bg-accent/50 p-4 rounded-xl">
            <p className="text-sm font-medium text-accent-foreground mb-1">Платформа бейімделуі:</p>
            <p className="text-sm text-muted-foreground">
              {emotion.current === 'confused' && 'Сабақтар жеңілдетілген тілмен, қысқа абзацтармен беріледі. Демонстрациялар көбейтілді.'}
              {emotion.current === 'confident' && 'Тереңдетілген түсіндірмелер мен күрделірек есептер ұсынылады.'}
              {emotion.current === 'tired' && 'Сабақ жеңіл режимде, қысқа блоктармен беріледі. Демалыс ұсынылады.'}
              {emotion.current === 'bored' && 'Интерактивті элементтер көбейтілді. Speed challenge режимі қосылды.'}
              {emotion.current === 'curious' && 'Қосымша қызықты фактілер мен тереңдетілген мазмұн ұсынылады.'}
              {emotion.current === 'sad' && 'Жұмсақ қолдау мен мотивация беріледі. Есептер жеңілдетілді.'}
              {emotion.current === 'neutral' && 'Стандартты оқу режимі белсенді.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
