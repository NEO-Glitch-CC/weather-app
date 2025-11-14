'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface SearchResultItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface CitySearchProps {
  onSelect: (lat: number, lng: number, city: string, country: string) => void;
  loading?: boolean;
}

export function CitySearch({ onSelect, loading = false }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/geocoding?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCity = (city: SearchResultItem) => {
    onSelect(city.latitude, city.longitude, city.name, city.country);
    setQuery('');
    setResults([]);
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search for a city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10"
              disabled={loading || isSearching}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <Button
            type="submit"
            disabled={loading || isSearching}
            className="px-6"
          >
            {isSearching && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSearching ? 'Searching' : 'Search'}
          </Button>
        </div>
      </form>

      {/* Search Results */}
      {results.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {results.map((result, idx) => (
            <motion.button
              key={result.id}
              onClick={() => handleSelectCity(result)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-4 text-left hover:bg-blue-50 transition-colors cursor-pointer">
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
    </motion.div>
  );
}
