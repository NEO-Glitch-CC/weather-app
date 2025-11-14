import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Unit = 'c' | 'f';
type Theme = 'light' | 'dark' | 'system';

interface UIStore {
  unit: Unit;
  theme: Theme;
  forecastDays: number;
  refreshIntervalMinutes: number; // polling interval in minutes
  animationsEnabled: boolean;

  setUnit: (u: Unit) => void;
  toggleUnit: () => void;
  setTheme: (t: Theme) => void;
  setForecastDays: (d: number) => void;
  setRefreshInterval: (m: number) => void;
  setAnimationsEnabled: (v: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        unit: 'c',
        theme: 'system',
        forecastDays: 7,
        refreshIntervalMinutes: 10,
        animationsEnabled: true,

        setUnit: (u) => set({ unit: u }),
        toggleUnit: () =>
          set((state) => ({ unit: state.unit === 'c' ? 'f' : 'c' })),
        setTheme: (t) => set({ theme: t }),
        setForecastDays: (d) => set({ forecastDays: d }),
        setRefreshInterval: (m) => set({ refreshIntervalMinutes: m }),
        setAnimationsEnabled: (v) => set({ animationsEnabled: v }),
      }),
      {
        name: 'ui-store',
      }
    )
  )
);
