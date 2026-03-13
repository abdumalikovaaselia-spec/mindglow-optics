import React from 'react';
import { motion } from 'framer-motion';

interface LightRaysProps {
  className?: string;
}

export default function LightRays({ className }: LightRaysProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-b from-primary/10 to-transparent"
          style={{
            width: `${2 + i * 0.5}px`,
            height: '120%',
            left: `${15 + i * 18}%`,
            top: '-10%',
            transform: `rotate(${-15 + i * 8}deg)`,
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scaleY: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
      {/* Prism glow */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
    </div>
  );
}
