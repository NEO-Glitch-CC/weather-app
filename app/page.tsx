'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWeatherStore } from '@/store/weatherStore';
import { useLocationStore } from '@/store/locationStore';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, RefreshCw } from 'lucide-react';

interface SearchResultItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const { setCurrentWeather, setLoading, setError, currentWeather, loading } =
    useWeatherStore();
  const {
    latitude,
    longitude,
    city,
    country,
    setLocation,
    setCityCountry,
    error: locationError,
  } = useLocationStore();

  useEffect(() => {
    setMounted(true);
    getGeolocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude]);

  const getGeolocation = () => {
    setIsLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  const fetchWeather = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/weather?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCityCountry(data.city, data.country);
        setCurrentWeather({
          id: Math.random().toString(),
          city: data.city,
          country: data.country,
          temperature: data.temperature,
          feelsLike: data.feelsLike,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
          pressure: data.pressure,
          description: data.description,
          icon: data.icon,
          latitude: data.latitude,
          longitude: data.longitude,
          sunrise: data.sunrise,
          sunset: data.sunset,
        });
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
      setIsLoadingLocation(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/geocoding?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCity = (result: SearchResultItem) => {
    setLocation(result.latitude, result.longitude);
    setCityCountry(result.name, result.country);
    setQuery('');
    setResults([]);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen py-8 px-4 md:px-8 lg:px-16">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Weather App
          </h1>
          <p className="text-gray-600 text-lg">
            Beautiful real-time weather for your location
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search for a city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={isSearching || loading}
              className="px-6"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            <Button
              type="button"
              onClick={getGeolocation}
              disabled={isLoadingLocation || loading}
              variant="outline"
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
        </motion.form>

        {/* Search Results */}
        {results.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {results.map((result) => (
              <motion.button
                key={result.id}
                onClick={() => handleSelectCity(result)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="p-4 text-left hover:bg-blue-50 cursor-pointer transition-colors">
                  <h3 className="font-semibold">{result.name}</h3>
                  <p className="text-sm text-gray-600">
                    {result.admin1 && `${result.admin1}, `}
                    {result.country}
                  </p>
                </Card>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Current Weather Display */}
        {loading && <LoadingAnimation />}

        {currentWeather && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-linear-to-br from-blue-500 to-blue-600 text-white mb-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>

              <motion.div
                className="relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="mb-6">
                  <h2 className="text-5xl font-bold">{currentWeather.city}</h2>
                  <p className="text-blue-100 text-lg">{currentWeather.country}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-7xl font-bold mb-4">
                      {currentWeather.temperature}°C
                    </div>
                    <p className="text-blue-100 text-xl mb-3">
                      {currentWeather.description}
                    </p>
                    <p className="text-blue-100">
                      Feels like {currentWeather.feelsLike}°C
                    </p>
                  </div>

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="flex items-center justify-center"
                  >
                    <div className="text-9xl opacity-30">☀️</div>
                  </motion.div>
                </div>
              </motion.div>
            </Card>

            {/* Weather Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, staggerChildren: 0.1 }}
            >
              {[
                {
                  label: 'Humidity',
                  value: `${currentWeather.humidity}%`,
                  icon: '💧',
                },
                {
                  label: 'Wind Speed',
                  value: `${currentWeather.windSpeed} km/h`,
                  icon: '💨',
                },
                {
                  label: 'Sunrise',
                  value: new Date(currentWeather.sunrise).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  icon: '🌅',
                },
                {
                  label: 'Sunset',
                  value: new Date(currentWeather.sunset).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  icon: '🌆',
                },
              ].map((stat, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + idx * 0.1 }}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <div className="text-4xl">{stat.icon}</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
