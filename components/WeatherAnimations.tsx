"use client";

import { motion } from 'framer-motion';
import React from 'react';

interface WeatherAnimationsProps {
  icon?: string; // simple icon string from weatherService
}

export default function WeatherAnimations({ icon }: WeatherAnimationsProps) {
  // Simple animated overlays: rain, snow, sun rays
  if (!icon) return null;

  if (icon.includes('rain')) {
    return (
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.02),transparent)]"
          animate={{ opacity: [0.2, 0.05, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.span
              key={i}
              className="block absolute bg-white/60 w-[2px] h-6 rounded translate-y-0"
              style={{ left: `${(i / 30) * 100}%`, top: `${-20 - (i % 10) * 10}px` }}
              animate={{ y: [0, 300] }}
              transition={{ duration: 1.2 + (i % 5) * 0.2, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (icon.includes('snow')) {
    return (
      <div className="pointer-events-none absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/90 w-2 h-2"
            style={{ left: `${(i / 20) * 100}%`, top: `${-30 - (i % 5) * 10}px` }}
            animate={{ y: [0, 260], x: [0, (i % 3) * 6 - 3] }}
            transition={{ duration: 3 + (i % 4) * 0.5, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>
    );
  }

  if (icon.includes('sun')) {
    return (
      <motion.div
        className="pointer-events-none absolute right-8 top-8"
        animate={{ rotate: [0, 10, 0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className="w-40 h-40 rounded-full bg-yellow-400/20 blur-[12px]" />
      </motion.div>
    );
  }

  return null;
}
