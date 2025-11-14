# Development Guide for Weather App

## Table of Contents
1. [Project Setup](#project-setup)
2. [Development Workflow](#development-workflow)
3. [File Structure](#file-structure)
4. [Component Development](#component-development)
5. [State Management](#state-management)
6. [Database Operations](#database-operations)
7. [API Development](#api-development)
8. [Performance Tips](#performance-tips)
9. [Troubleshooting](#troubleshooting)

---

## Project Setup

### Initial Setup
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your database URL

# Create database and run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Database Setup
```bash
# View database with Prisma Studio
npx prisma studio

# Create a new migration after schema changes
npx prisma migrate dev --name description_of_change

# Reset database (development only!)
npx prisma migrate reset
```

---

## Development Workflow

### Daily Development Steps
1. Start development server: `npm run dev`
2. Open browser at `http://localhost:3000`
3. Make code changes
4. Hot reload will update automatically
5. Check browser console for errors
6. Test API endpoints using browser or curl

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/weather-alerts

# Make changes and commit
git add .
git commit -m "feat: add weather alerts"

# Push to remote
git push origin feature/weather-alerts
```

### Building for Production
```bash
# Build the app
npm run build

# Test production build locally
npm run start

# Deploy (Vercel, Railway, etc.)
# Follow platform-specific instructions
```

---

## File Structure

### Understanding the Structure

```
app/                          # Next.js app directory
├── api/                      # API routes
│   ├── weather/             # Weather endpoints
│   ├── geocoding/           # City search endpoints
│   └── weather/history/     # Weather history endpoints
├── layout.tsx               # Root layout wrapper
└── page.tsx                 # Home page (main component)

components/                  # React components
├── WeatherDetail.tsx        # Weather display component
├── CitySearch.tsx           # City search component
├── Forecast.tsx             # 7-day forecast component
├── LoadingAnimation.tsx      # Loading spinner
└── ui/                       # Shadcn UI components

store/                        # Zustand stores (state management)
├── weatherStore.ts          # Weather state
├── userStore.ts             # User state
└── locationStore.ts         # Location state

lib/                          # Utility functions and services
├── weatherService.ts        # Weather API integration
├── prisma.ts               # Prisma client
└── utils.ts                # Helper functions

hooks/                        # Custom React hooks
└── use-geolocation.ts       # Geolocation hook

prisma/                       # Database schema
├── schema.prisma            # Database definitions
└── migrations/              # Migration files
```

---

## Component Development

### Creating a New Component

```typescript
// components/NewComponent.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  // Define props here
}

export function NewComponent({ }: Props) {
  const [state, setState] = useState('');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Component JSX */}
    </motion.div>
  );
}
```

### Using Components

```typescript
import { NewComponent } from '@/components/NewComponent';

export default function Page() {
  return (
    <div>
      <NewComponent />
    </div>
  );
}
```

### Best Practices
- Use TypeScript interfaces for props
- Add comments for complex logic
- Use Framer Motion for animations
- Keep components focused and small
- Use Shadcn UI components for consistency

---

## State Management

### Zustand Stores

#### Creating a New Store
```typescript
// store/exampleStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ExampleStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useExampleStore = create<ExampleStore>()(
  devtools((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }))
);
```

#### Using a Store
```typescript
'use client';

import { useExampleStore } from '@/store/exampleStore';

export function Counter() {
  const count = useExampleStore((state) => state.count);
  const increment = useExampleStore((state) => state.increment);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### Weather Store Example
```typescript
'use client';

import { useWeatherStore } from '@/store/weatherStore';

export function WeatherDisplay() {
  const { currentWeather, loading, setCurrentWeather } = useWeatherStore();

  const handleFetchWeather = async () => {
    const response = await fetch(`/api/weather?lat=0&lng=0`);
    const data = await response.json();
    setCurrentWeather(data);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {currentWeather && <p>{currentWeather.city}</p>}
    </div>
  );
}
```

---

## Database Operations

### Using Prisma Client

#### Query Examples
```typescript
import prisma from '@/lib/prisma';

// Create
await prisma.weather.create({
  data: {
    userId: 'user123',
    city: 'Jakarta',
    temperature: 28.5,
    // ... other fields
  },
});

// Read
const weather = await prisma.weather.findFirst({
  where: { userId: 'user123' },
});

// Read many
const weatherHistory = await prisma.weather.findMany({
  where: { userId: 'user123' },
  orderBy: { savedAt: 'desc' },
  take: 10,
});

// Update
await prisma.weather.update({
  where: { id: 'weather123' },
  data: { temperature: 29 },
});

// Delete
await prisma.weather.delete({
  where: { id: 'weather123' },
});
```

#### In API Routes
```typescript
export async function GET(request: NextRequest) {
  try {
    const data = await prisma.weather.findMany({
      take: 10,
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}
```

### Schema Modifications

```prisma
// prisma/schema.prisma
model Weather {
  id    String  @id @default(cuid())
  // Add new field
  newField  String?
}
```

Then run:
```bash
npx prisma migrate dev --name add_new_field
```

---

## API Development

### Creating New API Routes

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const param = searchParams.get('param');

    if (!param) {
      return NextResponse.json(
        { error: 'Parameter required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: 'success' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
```

### Best Practices
- Always validate input
- Return appropriate status codes
- Use try-catch for error handling
- Document parameters
- Log errors for debugging

---

## Performance Tips

### Frontend Optimization
1. **Code Splitting**: Next.js handles automatically
2. **Image Optimization**: Use Lucide icons (lightweight)
3. **Lazy Loading**: Use dynamic imports for heavy components
4. **Caching**: Zustand stores data in browser
5. **Memoization**: Use React.memo for expensive components

### Backend Optimization
1. **Database Indexing**: Add indexes to frequently queried fields
2. **Query Optimization**: Use Prisma select to fetch only needed fields
3. **API Caching**: Implement caching for geocoding results
4. **Pagination**: Limit results in list endpoints

### Example Optimization
```typescript
// Before: Fetches all fields
const weather = await prisma.weather.findMany();

// After: Fetch only needed fields
const weather = await prisma.weather.findMany({
  select: {
    id: true,
    city: true,
    temperature: true,
  },
});
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Database Connection Error
```bash
# Verify DATABASE_URL in .env.local
# Test connection
npx prisma db execute --stdin
```

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

#### State Not Updating
- Check console for errors
- Verify Zustand store is properly initialized
- Use React DevTools to inspect state
- Check if component is wrapped with 'use client'

#### API Not Responding
- Check if server is running
- Verify endpoint URL in fetch call
- Check browser Network tab
- Look for CORS errors in console
- Verify environment variables

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run dev

# View Prisma logs
npx prisma studio
```

---

## Testing

### Manual Testing
```bash
# Test API endpoint
curl "http://localhost:3000/api/weather?lat=0&lng=0"

# Test in browser
open http://localhost:3000
```

### Automated Testing (Setup)
```bash
npm install --save-dev jest @testing-library/react

# Run tests
npm test
```

---

## Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy automatically through Vercel dashboard
# Set DATABASE_URL in Vercel environment variables
```

### Other Platforms
- Railway
- Render
- Fly.io
- DigitalOcean

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Framer Motion Docs](https://www.framer.com/motion)
- [React Docs](https://react.dev)

---

Happy coding! 🚀
