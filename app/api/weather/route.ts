import { NextRequest, NextResponse } from 'next/server';
import {
  getWeatherByCoordinates,
  getWeatherDescription,
  getWeatherIcon,
  reverseGeocoding,
} from '@/lib/weatherService';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const latitude = parseFloat(searchParams.get('lat') || '0');
    const longitude = parseFloat(searchParams.get('lng') || '0');
    const userId = searchParams.get('userId');

    if (latitude === 0 || longitude === 0) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // Get weather data from API
    const weatherData = await getWeatherByCoordinates(latitude, longitude);

    // Get reverse geocoding for city/country
    const geoData = await reverseGeocoding(latitude, longitude);
    const location = geoData.results?.[0];
    const city = location?.name || 'Unknown';
    const country = location?.country || 'Unknown';

    // Prepare weather response
    const current = weatherData.current;
    const daily = weatherData.daily;

    const response = {
      city,
      country,
      latitude,
      longitude,
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      description: getWeatherDescription(current.weather_code),
      icon: getWeatherIcon(current.weather_code),
      pressure: 1013, // Open-Meteo doesn't provide pressure, using default
      sunrise: daily.sunrise[0],
      sunset: daily.sunset[0],
      forecast: daily.time.map((time, idx) => ({
        date: time,
        tempMax: daily.temperature_2m_max[idx],
        tempMin: daily.temperature_2m_min[idx],
      })),
    };

    // Save to database if userId provided
    if (userId) {
      try {
        await prisma.weather.create({
          data: {
            userId,
            city,
            country,
            temperature: current.temperature_2m,
            feelsLike: current.apparent_temperature,
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
            pressure: 1013,
            description: getWeatherDescription(current.weather_code),
            icon: getWeatherIcon(current.weather_code),
            latitude,
            longitude,
            sunrise: new Date(daily.sunrise[0]),
            sunset: new Date(daily.sunset[0]),
          },
        });
      } catch (dbError) {
        console.error('Error saving weather to database:', dbError);
        // Don't fail the response if database save fails
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
