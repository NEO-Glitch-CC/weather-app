import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface LocationStore {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  loading: boolean;
  error: string | null;

  setLocation: (lat: number, lng: number) => void;
  setCityCountry: (city: string, country: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useLocationStore = create<LocationStore>()(
  devtools((set) => ({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    loading: false,
    error: null,

    setLocation: (latitude, longitude) => set({ latitude, longitude }),
    setCityCountry: (city, country) => set({ city, country }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    reset: () =>
      set({
        latitude: null,
        longitude: null,
        city: null,
        country: null,
        error: null,
      }),
  }))
);
