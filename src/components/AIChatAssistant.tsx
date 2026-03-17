import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEmotion } from '@/contexts/EmotionContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const topicKnowledge: Record<string, string> = {
  'сыну': 'Жарықтың сынуы — жарық бір мөлдір ортадан екіншісіне өткенде бағытын өзгерту құбылысы. Мысалы, ауадан суға кіргенде жарық баяулайды және бағытын өзгертеді.',
  'снелл': 'Снелл заңы: n₁ × sin(α) = n₂ × sin(β). Мұнда n₁ және n₂ — орталардың сыну көрсеткіштері, α — түсу бұрышы, β — сыну бұрышы.',
  'көрсеткіш': 'Сыну көрсеткіші (n) — ортаның оптикалық тығыздығын көрсетеді. Ауа: n=1.0, Су: n=1.33, Шыны: n=1.5, Алмаз: n=2.42.',
  'толық': 'Толық ішкі шағылу — жарық тығыз ортадан сирек ортаға белгілі бір бұрыштан (критикалық бұрыш) асқанда мүлдем сынбай, толық шағылатын құбылыс. Оптикалық талшықтар осы принциппен жұмыс істейді.',
  'қасық': 'Судағы қасықтың «сынған» көрінуі — рефракция (жарық сынуы) құбылысы. Жарық су бетінде бағытын өзгертеді, сондықтан көз қасықтың «жылжыған» бейнесін көреді.',
  'линза': 'Линза — шыныдан жасалған оптикалық құрал. Жинағыш линза жарықты фокусқа жинайды, ал шашыратқыш линза жарықты ыдыратады. Көзілдірік, камера, микроскоп — бәрі линза принципімен жұмыс істейді.',
  'кемпірқосақ': 'Кемпірқосақ — жарықтың су тамшыларында сынуы мен дисперсиясы нәтижесінде пайда болатын құбылыс. Ақ жарық спектрдің 7 түсіне жіктеледі.',
  'бұрыш': 'Түсу бұрышы (α) — жарық сәулесі мен нормаль сызық арасындағы бұрыш. Сыну бұрышы (β) — сынған сәуле мен нормаль арасындағы бұрыш. Бұрыштар нормальдан өлшенеді.',
  'формула': 'Негізгі формулалар:\n• Снелл заңы: n₁ sinα = n₂ sinβ\n• Сыну көрсеткіші: n = c/v (c — вакуумдағы жылдамдық, v — ортадағы жылдамдық)\n• Критикалық бұрыш: sin(α_крит) = n₂/n₁',
  'нормаль': 'Нормаль — екі орта шекарасына перпендикуляр (тік) сызық. Оптикада барлық бұрыштар нормальдан өлшенеді, беткейден емес.',
};

const greetings = [
  'Сәлем! 👋 Мен — сенің AI көмекшіңмін. Жарықтың сынуы тақырыбы бойынша кез келген сұрағыңды қоя бересің!',
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase();
  
  // Check topic keywords
  for (const [key, answer] of Object.entries(topicKnowledge)) {
    if (lower.includes(key)) return answer;
  }

  // Common questions
  if (lower.includes('не') && (lower.includes('жарық') || lower.includes('рефракция'))) {
    return topicKnowledge['сыну'];
  }
  if (lower.includes('заң') || lower.includes('формула') || lower.includes('есепте')) {
    return topicKnowledge['формула'];
  }
  if (lower.includes('мысал') || lower.includes('өмір') || lower.includes('қайда')) {
    return 'Жарық сынуының күнделікті мысалдары: 🥄 Судағы қасықтың «сынған» көрінуі, 🏊 Бассейн түбінің жақын көрінуі, 🌈 Кемпірқосақ, 👓 Көзілдірік линзалары.';
  }
  if (lower.includes('не үшін') || lower.includes('неліктен') || lower.includes('себеб')) {
    return 'Жарық сынуының себебі — жарық жылдамдығының әртүрлі орталарда өзгеруі. Тығыз ортада жарық баяулайды, сирек ортада жылдамдайды. Жылдамдық айырмашылығы бағыт өзгеруіне алып келеді.';
  }
  if (lower.includes('сәлем') || lower.includes('қалай') || lower.includes('привет') || lower.includes('hello')) {
    return 'Сәлем! 😊 Жарықтың сынуы тақырыбы бойынша сұрағың бар ма? Мысалы, «Снелл заңы деген не?» немесе «Жарық неліктен сынады?» деп сұрай аласың.';
  }
  if (lower.includes('рахмет') || lower.includes('спасибо') || lower.includes('thanks')) {
    return 'Оқасы жоқ! 😊 Тағы сұрағың болса, кез келген уақытта сұрай бер!';
  }

  return 'Жақсы сұрақ! 🤔 Бұл тақырып бойынша нақтырақ сұра, мысалы:\n• «Снелл заңы деген не?»\n• «Сыну көрсеткіші қанша?»\n• «Жарық неліктен сынады?»\n• «Толық ішкі шағылу деген не?»';
}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: greetings[0] },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { emotion } = useEmotion();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));

    let answer = findAnswer(text);

    // Add emotion-aware prefix
    if (emotion.current === 'confused' || emotion.current === 'sad') {
      answer = '💙 ' + answer + '\n\nТүсініксіз болса, тағы сұра — қарапайым тілмен түсіндіремін!';
    } else if (emotion.current === 'tired') {
      answer = '😊 ' + answer + '\n\nШаршасаң, демал. Мен мұнда күтіп тұрамын!';
    } else if (emotion.current === 'confident' || emotion.current === 'curious') {
      answer = '🚀 ' + answer;
    }

    setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg glow-primary"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] flex flex-col glass-card shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30" style={{ background: 'var(--gradient-primary)' }}>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-foreground" />
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">AI Көмекші</p>
                  <p className="text-xs text-primary-foreground/70">Жарықтың сынуы</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                      <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                    <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/30">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Сұрағыңды жаз..."
                  className="flex-1 px-3 py-2 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button size="sm" variant="hero" onClick={sendMessage} disabled={!input.trim() || isTyping} className="rounded-xl px-3">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
