# Weather App API Documentation

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Get Current Weather

**Endpoint:** `GET /api/weather`

**Description:** Get current weather data for given coordinates using geolocation.

**Query Parameters:**
- `lat` (required): Latitude coordinate (float)
- `lng` (required): Longitude coordinate (float)
- `userId` (optional): User ID to save weather history to database

**Example Request:**
```bash
curl "http://localhost:3000/api/weather?lat=-6.2088&lng=106.8456&userId=user123"
```

**Response:**
```json
{
  "city": "Jakarta",
  "country": "Indonesia",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "temperature": 28.5,
  "feelsLike": 32.1,
  "humidity": 75,
  "windSpeed": 15,
  "pressure": 1013,
  "description": "Slight rain",
  "icon": "cloud-rain",
  "sunrise": "2025-11-14T05:30:00Z",
  "sunset": "2025-11-14T17:30:00Z",
  "forecast": [
    {
      "date": "2025-11-14",
      "tempMax": 30,
      "tempMin": 24
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Invalid coordinates"
}
```

---

### 2. Search Cities

**Endpoint:** `GET /api/geocoding`

**Description:** Search for cities and get their coordinates using geocoding API.

**Query Parameters:**
- `q` (required): City name to search (string)
- `limit` (optional): Maximum number of results (default: 10, max: 50)

**Example Request:**
```bash
curl "http://localhost:3000/api/geocoding?q=Jakarta&limit=5"
```

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Jakarta",
      "latitude": -6.2088,
      "longitude": 106.8456,
      "country": "Indonesia",
      "admin1": "Jakarta"
    },
    {
      "id": 2,
      "name": "Jakarta Barat",
      "latitude": -6.1500,
      "longitude": 106.7500,
      "country": "Indonesia",
      "admin1": "Jakarta"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Query parameter is required"
}
```

---

### 3. Get Weather History

**Endpoint:** `GET /api/weather/history`

**Description:** Get user's saved weather history from database.

**Query Parameters:**
- `userId` (required): User ID to fetch history for (string)

**Example Request:**
```bash
curl "http://localhost:3000/api/weather/history?userId=user123"
```

**Response:**
```json
[
  {
    "id": "clh1234567890",
    "userId": "user123",
    "city": "Jakarta",
    "country": "Indonesia",
    "temperature": 28.5,
    "feelsLike": 32.1,
    "humidity": 75,
    "windSpeed": 15,
    "pressure": 1013,
    "description": "Slight rain",
    "icon": "cloud-rain",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "sunrise": "2025-11-14T05:30:00Z",
    "sunset": "2025-11-14T17:30:00Z",
    "savedAt": "2025-11-14T12:30:00Z"
  }
]
```

**Error Response:**
```json
{
  "error": "userId is required"
}
```

---

## HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success - Request processed successfully |
| 400 | Bad Request - Invalid parameters or missing required fields |
| 500 | Server Error - Internal server error |

---

## Data Types

### Weather Object
```typescript
{
  id: string;
  city: string;
  country: string;
  temperature: number;        // in Celsius
  feelsLike: number;          // in Celsius
  humidity: number;           // percentage (0-100)
  windSpeed: number;          // in km/h
  pressure: number;           // in hPa
  description: string;        // e.g., "Slight rain"
  icon: string;              // weather icon name
  latitude: number;
  longitude: number;
  sunrise: string;           // ISO 8601 format
  sunset: string;            // ISO 8601 format
}
```

### Location Object
```typescript
{
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;           // region/state (optional)
}
```

### Forecast Object
```typescript
{
  date: string;              // YYYY-MM-DD
  tempMax: number;           // in Celsius
  tempMin: number;           // in Celsius
}
```

---

## Weather Icon Codes

The `icon` field returns the following values:

| Icon | Description |
|------|-------------|
| sun | Clear sky |
| cloud-sun | Mainly clear / Partly cloudy |
| cloud | Overcast |
| cloud-fog | Foggy |
| cloud-rain | Rainy / Drizzle |
| cloud-snow | Snowy |
| cloud-lightning-rain | Thunderstorm |

---

## Rate Limiting

Currently, there are no rate limits on the API. However, the external Open-Meteo API may have rate limits. For production use, implement rate limiting on your API routes.

---

## Error Handling

### Common Errors

#### Invalid Coordinates
```json
{
  "error": "Invalid coordinates",
  "status": 400
}
```

#### Missing Query Parameter
```json
{
  "error": "Query parameter is required",
  "status": 400
}
```

#### API Service Unavailable
```json
{
  "error": "Failed to fetch weather data",
  "status": 500
}
```

---

## Examples

### JavaScript/Fetch Example
```javascript
async function getWeather(lat, lng) {
  try {
    const response = await fetch(
      `/api/weather?lat=${lat}&lng=${lng}&userId=user123`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

getWeather(-6.2088, 106.8456);
```

### Python Example
```python
import requests

def get_weather(lat, lng):
    url = f"http://localhost:3000/api/weather?lat={lat}&lng={lng}"
    response = requests.get(url)
    return response.json()

data = get_weather(-6.2088, 106.8456)
print(data)
```

### cURL Example
```bash
# Get weather
curl "http://localhost:3000/api/weather?lat=-6.2088&lng=106.8456"

# Search cities
curl "http://localhost:3000/api/geocoding?q=Tokyo"

# Get history
curl "http://localhost:3000/api/weather/history?userId=user123"
```

---

## Integration with Frontend

The frontend components automatically call these endpoints:

1. **City Search Component**: Calls `/api/geocoding` when user searches for a city
2. **Weather Detail Component**: Displays data from `/api/weather` response
3. **Main Page**: Uses geolocation and calls `/api/weather` for current location

---

## Database Schema

Weather data is stored in PostgreSQL using Prisma ORM. See `prisma/schema.prisma` for the complete schema.

### Weather Table
```sql
CREATE TABLE "Weather" (
  id          VARCHAR PRIMARY KEY,
  userId      VARCHAR NOT NULL,
  city        VARCHAR NOT NULL,
  country     VARCHAR NOT NULL,
  temperature FLOAT NOT NULL,
  feelsLike   FLOAT NOT NULL,
  humidity    INTEGER NOT NULL,
  windSpeed   FLOAT NOT NULL,
  pressure    INTEGER NOT NULL,
  description VARCHAR NOT NULL,
  icon        VARCHAR NOT NULL,
  latitude    FLOAT NOT NULL,
  longitude   FLOAT NOT NULL,
  sunrise     TIMESTAMP NOT NULL,
  sunset      TIMESTAMP NOT NULL,
  savedAt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES "User"(id)
);
```

---

## Testing

### Manual Testing with Postman

1. Create a new GET request
2. Enter URL: `http://localhost:3000/api/weather?lat=-6.2088&lng=106.8456`
3. Send request
4. Check response in Response panel

### Automated Testing

```javascript
describe('Weather API', () => {
  it('should return weather data', async () => {
    const response = await fetch(
      'http://localhost:3000/api/weather?lat=-6.2088&lng=106.8456'
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('temperature');
  });
});
```

---

## Performance

- Average response time: ~500-800ms
- Data is cached in Zustand store on frontend
- Database queries are optimized with Prisma
- External API calls use efficient endpoints

---

## Support

For API issues or questions, check:
1. Browser console for errors
2. Network tab in DevTools
3. Server logs in terminal
4. README.md for general troubleshooting
