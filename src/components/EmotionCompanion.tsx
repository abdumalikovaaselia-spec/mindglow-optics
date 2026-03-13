import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '@/contexts/EmotionContext';
import { X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EmotionCompanion() {
  const { emotion, getMotivationalMessage } = useEmotion();
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (emotion.current !== 'neutral' && !dismissed) {
      setMessage(getMotivationalMessage());
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [emotion.current]);

  if (!visible || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 max-w-xs"
      >
        <div className="glass-card p-4 shadow-elevated glow-primary">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                 style={{ background: 'var(--gradient-primary)' }}>
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{message}</p>
              <p className="text-xs text-muted-foreground mt-1">AI көмекші</p>
            </div>
            <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
