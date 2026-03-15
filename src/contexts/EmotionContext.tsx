import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type EmotionType = 'confident' | 'curious' | 'confused' | 'tired' | 'sad' | 'bored' | 'neutral';

export type GenderType = 'girl' | 'boy';

export interface EmotionState {
  current: EmotionType;
  confidence: number;
  history: { emotion: EmotionType; timestamp: number }[];
  source: 'camera' | 'manual' | 'inferred';
}

interface EmotionContextType {
  emotion: EmotionState;
  setEmotion: (emotion: EmotionType, source?: 'camera' | 'manual' | 'inferred') => void;
  cameraEnabled: boolean;
  setCameraEnabled: (enabled: boolean) => void;
  gender: GenderType;
  setGender: (gender: GenderType) => void;
  getAdaptiveLevel: () => 'simplified' | 'normal' | 'advanced';
  getMotivationalMessage: () => string;
}

const motivationalMessages: Record<EmotionType, string[]> = {
  confident: [
    "Тамаша! Сен жақсы меңгеріп жатырсың! 🌟",
    "Күрделірек тапсырмаға дайынсың! 💪",
    "Сенің білімің тереңдеп жатыр! 🎯",
  ],
  curious: [
    "Қызығушылығың — білімнің кілті! 🔑",
    "Сұрақ қою — ақылды адамның белгісі! 💡",
    "Зерттей бер, әлі қызық нәрселер көп! 🔬",
  ],
  confused: [
    "Шатаспа, бірге түсінеміз! 🤝",
    "Қиын көрінгенімен, бұл тақырыпты қарапайым түрде түсінуге болады 📘",
    "Сәуленің бағытын түсінсең, тақырыптың жартысын меңгердің! ✨",
  ],
  tired: [
    "Сәл демалайық, сосын жалғастырамыз 😊",
    "Аз-аздап ілгері жылжу — ол да жеңіс! 🏆",
    "Шаршадың ба? Қысқа демонстрациядан бастайық 🎬",
  ],
  sad: [
    "Сенің қолыңнан келеді, қазір бірге шығарамыз 💙",
    "Қателесу — үйренудің бір бөлігі 🌱",
    "Сен жақындап қалдың, тағы бір қадам! 🚀",
  ],
  bored: [
    "Қызықты факт: линзалар жарықты сындыру арқылы жұмыс істейді! 🔍",
    "Тез тапсырма шығарып көрейік — speed challenge! ⚡",
    "Білесің бе? Көзілдірік — сыну заңының күнделікті қолданысы! 👓",
  ],
  neutral: [
    "Жарық сынуы — табиғаттың керемет құбылысы! 🌈",
    "Бірге үйренеміз, алға! 📚",
    "Оптика әлемі қызықты нәрселерге толы! ✨",
  ],
};

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export function EmotionProvider({ children }: { children: ReactNode }) {
  const [emotion, setEmotionState] = useState<EmotionState>({
    current: 'neutral',
    confidence: 0.5,
    history: [],
    source: 'manual',
  });
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const setEmotion = useCallback((newEmotion: EmotionType, source: 'camera' | 'manual' | 'inferred' = 'manual') => {
    setEmotionState(prev => ({
      current: newEmotion,
      confidence: source === 'camera' ? 0.7 : 1.0,
      history: [...prev.history.slice(-19), { emotion: newEmotion, timestamp: Date.now() }],
      source,
    }));
  }, []);

  const getAdaptiveLevel = useCallback((): 'simplified' | 'normal' | 'advanced' => {
    switch (emotion.current) {
      case 'confused':
      case 'tired':
      case 'sad':
        return 'simplified';
      case 'confident':
      case 'curious':
        return 'advanced';
      default:
        return 'normal';
    }
  }, [emotion.current]);

  const getMotivationalMessage = useCallback((): string => {
    const messages = motivationalMessages[emotion.current];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [emotion.current]);

  return (
    <EmotionContext.Provider value={{ emotion, setEmotion, cameraEnabled, setCameraEnabled, getAdaptiveLevel, getMotivationalMessage }}>
      {children}
    </EmotionContext.Provider>
  );
}

export function useEmotion() {
  const context = useContext(EmotionContext);
  if (!context) throw new Error('useEmotion must be used within EmotionProvider');
  return context;
}
