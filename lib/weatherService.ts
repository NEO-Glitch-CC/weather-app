import axios from 'axios';

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly?: {
    time: string[];
    temperature_2m?: number[];
    relativehumidity_2m?: number[];
    apparent_temperature?: number[];
    precipitation?: number[];
    weathercode?: number[];
    wind_speed_10m?: number[];
    uv_index?: number[];
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max?: number[];
  };
}

export interface GeocodingResponse {
  results: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    feature_code: string;
    country_code: string;
    admin1: string;
    timezone: string;
    population?: number;
    country?: string;
  }>;
  generationtime_ms: number;
}

const WEATHER_API = 'https://api.open-meteo.com/v1';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1';

// WMO Weather interpretation codes
const WMO_CODES: { [key: number]: string } = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export const getWeatherByCoordinates = async (
  latitude: number,
  longitude: number,
  days = 7
): Promise<WeatherResponse> => {
  try {
    const response = await axios.get<WeatherResponse>(
      `${WEATHER_API}/forecast`,
      {
        params: {
          latitude,
          longitude,
          current:
            'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
          hourly:
            'temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode,wind_speed_10m,uv_index',
          daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
          timezone: 'auto',
          // open-meteo returns a default number of daily entries; we'll slice on the server if needed
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error}`);
  }
};

export const getGeocoding = async (
  city: string,
  count = 10
): Promise<GeocodingResponse> => {
  try {
    const response = await axios.get<GeocodingResponse>(
      `${GEOCODING_API}/search`,
      {
        params: {
          name: city,
          count,
          language: 'en',
          format: 'json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch geocoding data: ${error}`);
  }
};

export const reverseGeocoding = async (
  latitude: number,
  longitude: number
): Promise<GeocodingResponse> => {
  try {
    const response = await axios.get<GeocodingResponse>(
      `${GEOCODING_API}/reverse`,
      {
        params: {
          latitude,
          longitude,
          language: 'en',
          format: 'json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch reverse geocoding data: ${error}`);
  }
};

export const getWeatherDescription = (weatherCode: number): string => {
  return WMO_CODES[weatherCode] || 'Unknown';
};

export const getWeatherIcon = (weatherCode: number): string => {
  // Returns icon names that match with weather icons library
  if (weatherCode === 0) return 'sun';
  if (weatherCode === 1 || weatherCode === 2) return 'cloud-sun';
  if (weatherCode === 3) return 'cloud';
  if (weatherCode === 45 || weatherCode === 48) return 'cloud-fog';
  if (
    weatherCode === 51 ||
    weatherCode === 53 ||
    weatherCode === 55 ||
    weatherCode === 80 ||
    weatherCode === 81 ||
    weatherCode === 82
  )
    return 'cloud-rain';
  if (weatherCode === 61 || weatherCode === 63 || weatherCode === 65)
    return 'cloud-rain';
  if (
    weatherCode === 71 ||
    weatherCode === 73 ||
    weatherCode === 75 ||
    weatherCode === 77 ||
    weatherCode === 85 ||
    weatherCode === 86
  )
    return 'cloud-snow';
  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99)
    return 'cloud-lightning-rain';

  return 'sun';
};
