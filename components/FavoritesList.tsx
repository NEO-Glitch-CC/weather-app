'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useUserStore } from '@/store/userStore';
import { useLocationStore } from '@/store/locationStore';
import { useWeatherStore } from '@/store/weatherStore';
import { useSession, signIn } from 'next-auth/react';

interface Favorite {
  id: string;
  userId?: string | null;
  city: string;
  country?: string | null;
  latitude: number;
  longitude: number;
}

export default function FavoritesList() {
  const user = useUserStore((s) => s.user);
  const { data: session } = useSession();
  const { setLocation, setCityCountry } = useLocationStore();
  const { setCurrentWeather } = useWeatherStore();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      if (!session?.user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/favorites');
      if (res.status === 401) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setFavorites(data || []);
    } catch (err) {
      console.error('Failed to fetch favorites', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleSelect = (f: Favorite) => {
    setLocation(f.latitude, f.longitude);
    setCityCountry(f.city, f.country || '');
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/favorites?id=${id}`, { method: 'DELETE' });
      setFavorites((s) => s.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Failed to delete favorite', err);
    }
  };

  const handleSaveCurrent = async () => {
    const current = useWeatherStore.getState().currentWeather;
    if (!current) return;
    if (!session?.user) {
      signIn();
      return;
    }
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: current.city,
          country: current.country,
          latitude: current.latitude,
          longitude: current.longitude,
        }),
      });
      const saved = await res.json();
      setFavorites((s) => [saved, ...s]);
    } catch (err) {
      console.error('Failed to save favorite', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Favorites</h3>
        <Button size="sm" onClick={handleSaveCurrent} disabled={loading}>
          Save Current
        </Button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading favorites...</p>}

      <div className="grid grid-cols-1 gap-2">
        {favorites.length === 0 && !loading && (
          user ? (
            <Card className="p-3 text-sm text-gray-500">No favorites yet</Card>
          ) : (
            <Card className="p-3 text-sm text-gray-500 flex items-center justify-between">
              <div>Log in to save and view favorites.</div>
              <div>
                <a href="/settings" className="text-blue-600 underline">Sign in</a>
              </div>
            </Card>
          )
        )}

        {favorites.map((f) => (
          <Card key={f.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{f.city}</div>
              <div className="text-sm text-gray-500">{f.country}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => handleSelect(f)}>
                Open
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(f.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
