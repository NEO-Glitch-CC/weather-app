"use client";

import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';

// Settings page also provides a simple email-only login for demo/auth

export default function SettingsPage() {
  const { unit, theme, forecastDays, refreshIntervalMinutes, animationsEnabled, setUnit, setTheme, setForecastDays, setRefreshInterval, setAnimationsEnabled } = useUIStore();
  const setUser = useUserStore((s) => s.setUser);
  const user = useUserStore((s) => s.user);

  const [email, setEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [localUnit, setLocalUnit] = useState(unit);
  const [localTheme, setLocalTheme] = useState(theme);
  const [localForecastDays, setLocalForecastDays] = useState(forecastDays);
  const [localRefresh, setLocalRefresh] = useState(refreshIntervalMinutes);
  const [localAnimations, setLocalAnimations] = useState(animationsEnabled);

  const apply = () => {
    setUnit(localUnit);
    setTheme(localTheme);
    setForecastDays(localForecastDays);
    setRefreshInterval(localRefresh);
    setAnimationsEnabled(localAnimations);
  };

  useEffect(() => {
    // fetch current session
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        if (json?.user) setUser(json.user);
      } catch (err) {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    if (!email) return;
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json?.user) setUser(json.user);
    } catch (err) {
      console.error('Login failed', err);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>

        <Card className="p-6 mb-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Account</h3>
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{user.email}</div>
                </div>
                <div>
                  <Button size="sm" variant="outline" onClick={handleLogout}>Logout</Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="px-3 py-2 border rounded" />
                <Button onClick={handleLogin} disabled={loginLoading}>Login</Button>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Unit</label>
            <select value={localUnit} onChange={(e) => setLocalUnit(e.target.value as 'c' | 'f')} className="px-3 py-2 border rounded">
              <option value="c">°C</option>
              <option value="f">°F</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select value={localTheme} onChange={(e) => setLocalTheme(e.target.value as any)} className="px-3 py-2 border rounded">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Forecast days</label>
            <input type="number" min={1} max={14} value={localForecastDays} onChange={(e) => setLocalForecastDays(parseInt(e.target.value || '0', 10) || 1)} className="px-3 py-2 border rounded w-32" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Refresh interval (minutes)</label>
            <input type="number" min={1} value={localRefresh} onChange={(e) => setLocalRefresh(parseInt(e.target.value || '0', 10) || 1)} className="px-3 py-2 border rounded w-32" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Animations</label>
            <select value={localAnimations ? 'on' : 'off'} onChange={(e) => setLocalAnimations(e.target.value === 'on')} className="px-3 py-2 border rounded">
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={apply}>Apply</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
