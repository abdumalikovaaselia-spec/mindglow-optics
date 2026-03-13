import React from 'react';
import { motion } from 'framer-motion';

interface LightRaysProps {
  className?: string;
}

export default function LightRays({ className }: LightRaysProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Light rays */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: `${2 + i * 0.8}px`,
            height: '130%',
            left: `${10 + i * 16}%`,
            top: '-15%',
            transform: `rotate(${-18 + i * 7}deg)`,
            background: i % 2 === 0
              ? 'linear-gradient(180deg, hsl(200 90% 55% / 0.08), transparent)'
              : 'linear-gradient(180deg, hsl(330 65% 70% / 0.06), transparent)',
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scaleY: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.6,
          }}
        />
      ))}
      {/* Dreamy orbs */}
      <div className="absolute top-[15%] right-[20%] w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-[60%] left-[10%] w-32 h-32 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[40%] right-[5%] w-24 h-24 bg-secondary/8 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-[20%] left-[40%] w-36 h-36 bg-primary/4 rounded-full blur-3xl animate-gentle-float" />
    </div>
  );
}
