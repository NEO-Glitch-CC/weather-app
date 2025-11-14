"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useUIStore } from '@/store/uiStore';

interface WeatherCanvasProps {
  icon?: string;
  width?: number;
  height?: number;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len?: number;
  size?: number;
  life?: number;
};

export default function WeatherCanvas({ icon = '', width, height }: WeatherCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const animationsEnabled = useUIStore((s) => s.animationsEnabled);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = width || canvas.clientWidth;
    let h = height || canvas.clientHeight;
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const resize = () => {
      w = width || canvas.clientWidth;
      h = height || canvas.clientHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    const makeRain = (count = 80) => {
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h - h,
          vx: -0.5 + Math.random() * 0.5,
          vy: 4 + Math.random() * 4,
          len: 10 + Math.random() * 10,
        });
      }
    };

    const makeSnow = (count = 60) => {
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h - h,
          vx: -0.5 + Math.random() * 1,
          vy: 1 + Math.random() * 2,
          size: 2 + Math.random() * 3,
        });
      }
    };

    const makeSun = () => {
      particlesRef.current = [];
      // sun rays will be drawn procedurally
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (!animationsEnabled) return;

      if (icon.includes('rain') || icon.includes('cloud-rain')) {
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.5;
        particlesRef.current.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + (p.vx || 0) * (p.len || 10), p.y + (p.vy || 4) * (p.len || 10) / 6);
          ctx.stroke();
          p.x += p.vx; p.y += p.vy;
          if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
        });
      } else if (icon.includes('snow') || icon.includes('cloud-snow')) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        particlesRef.current.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size || 2, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.vx * 0.5; p.y += p.vy;
          if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
        });
      } else if (icon.includes('sun')) {
        // soft glowing sun in top-right
        const grd = ctx.createRadialGradient(w - 120, 80, 20, w - 120, 80, 200);
        grd.addColorStop(0, 'rgba(255,240,120,0.5)');
        grd.addColorStop(1, 'rgba(255,240,120,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(w - 320, -40, 320, 240);
      }
    };

    // Initialize particles based on icon
    if (icon.includes('rain') || icon.includes('cloud-rain')) makeRain(110);
    else if (icon.includes('snow') || icon.includes('cloud-snow')) makeSnow(70);
    else makeSun();

    // use gsap ticker for consistent updates
    const tick = () => draw();
    gsap.ticker.add(tick);

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [icon, width, height, animationsEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ touchAction: 'none' }}
    />
  );
}
