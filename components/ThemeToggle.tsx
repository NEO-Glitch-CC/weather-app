"use client";

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const uiTheme = useUIStore((s) => s.theme);
  const setUITheme = useUIStore((s) => s.setTheme);

  // Keep uiStore and next-themes in sync
  useEffect(() => {
    if (!uiTheme) return;
    if (uiTheme === 'system') return; // let next-themes manage system
    setTheme(uiTheme === 'dark' ? 'dark' : 'light');
  }, [uiTheme, setTheme]);

  useEffect(() => {
    // Ensure uiStore reflects next-themes on mount
    if (theme === 'dark') setUITheme('dark');
    else if (theme === 'light') setUITheme('light');
  }, [theme, setUITheme]);

  const toggle = () => {
    const next = uiTheme === 'dark' ? 'light' : uiTheme === 'light' ? 'system' : 'dark';
    setUITheme(next);
    if (next === 'system') {
      // revert to system preference
      setTheme('system');
    } else {
      setTheme(next === 'dark' ? 'dark' : 'light');
    }
  };

  return (
    <Button size="sm" variant="ghost" onClick={toggle}>
      Theme: {uiTheme === 'system' ? 'Auto' : uiTheme === 'dark' ? 'Dark' : 'Light'}
    </Button>
  );
}
