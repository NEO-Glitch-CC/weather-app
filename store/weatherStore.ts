import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface WeatherData {
  id: string;
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
  latitude: number;
  longitude: number;
  sunrise: string;
  sunset: string;
  uvIndex?: number | null;
  forecast?: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    uvIndexMax?: number | null;
  }>;
}

interface WeatherStore {
  currentWeather: WeatherData | null;
  weatherHistory: WeatherData[];
  loading: boolean;
  error: string | null;
  selectedCity: string | null;

  setCurrentWeather: (weather: WeatherData) => void;
  addWeatherHistory: (weather: WeatherData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCity: (city: string | null) => void;
  clearHistory: () => void;
}

export const useWeatherStore = create<WeatherStore>()(
  devtools(
    persist(
      (set) => ({
        currentWeather: null,
        weatherHistory: [],
        loading: false,
        error: null,
        selectedCity: null,

        setCurrentWeather: (weather) => set({ currentWeather: weather }),
        addWeatherHistory: (weather) =>
          set((state) => ({
            weatherHistory: [weather, ...state.weatherHistory].slice(0, 10),
          })),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setSelectedCity: (city) => set({ selectedCity: city }),
        clearHistory: () => set({ weatherHistory: [] }),
      }),
      {
        name: 'weather-store',
      }
    )
  )
);
