'use client';

import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WeatherDetailProps {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  city: string;
  country: string;
}

export function WeatherDetail({
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  description,
  icon,
  city,
  country,
}: WeatherDetailProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Weather Display */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>

          <motion.div
            className="relative z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="mb-4">
              <h2 className="text-4xl font-bold">{city}</h2>
              <p className="text-blue-100">{country}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-6xl font-bold mb-2">{temperature}°C</div>
                <p className="text-blue-100 text-lg mb-2">{description}</p>
                <p className="text-blue-100">Feels like {feelsLike}°C</p>
              </div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="text-8xl opacity-30"
              >
                <Sun />
              </motion.div>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      {/* Weather Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {/* Humidity */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Humidity</p>
                <p className="text-2xl font-bold mt-2">{humidity}%</p>
              </div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Droplets className="w-10 h-10 text-blue-500" />
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Wind Speed */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Wind Speed</p>
                <p className="text-2xl font-bold mt-2">{windSpeed} km/h</p>
              </div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Wind className="w-10 h-10 text-emerald-500" />
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Temperature */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Temperature</p>
                <p className="text-2xl font-bold mt-2">{temperature}°C</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sun className="w-10 h-10 text-orange-500" />
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Condition */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Condition</p>
                <p className="text-lg font-bold mt-2 line-clamp-2">
                  {description}
                </p>
              </div>
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Cloud className="w-10 h-10 text-gray-400" />
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
