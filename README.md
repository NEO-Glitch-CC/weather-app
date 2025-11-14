# 🌤️ Weather App - Modern Weather Application

A beautiful, real-time weather application built with Next.js 16, featuring modern UI/UX with smooth animations, geolocation support, and a powerful backend.

## ✨ Features

### 🌍 Core Features
- **Real-time Weather Data**: Get accurate weather information powered by Open-Meteo API (no API key required)
- **Geolocation Support**: Automatically detect your location and display weather for your city
- **City Search**: Search for any city worldwide and get instant weather information
- **7-Day Forecast**: View weather predictions for the next 7 days
- **Detailed Weather Information**:
  - Current temperature and "feels like" temperature
  - Humidity levels
  - Wind speed
  - Sunrise and sunset times
  - Weather description with emoji visualization

### 🎨 UI/UX Features
- **Modern Design**: Beautiful gradient backgrounds and intuitive layout
- **Smooth Animations**: Framer Motion animations for engaging user experience
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Interactive Components**: Hover effects and smooth transitions
- **Shadcn UI Components**: Pre-built, customizable UI components

### 🗄️ Data & State Management
- **Zustand State Management**: Efficient state management for weather, location, and user data
- **Prisma Database**: PostgreSQL database for storing user profiles and weather history
- **API Routes**: RESTful API endpoints for weather and geocoding

### 🔐 Backend Features
- **Middleware**: Request handling and routing
- **API Integration**: Open-Meteo API for weather data and geocoding
- **Database**: User and weather history persistence with Prisma ORM

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**
Create a `.env.local` file:
```env
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### NextAuth / Authentication (optional but recommended)
To enable login with GitHub or Email (magic links) you should add these environment variables to your `.env.local`:

```
NEXTAUTH_SECRET=replace-with-a-secure-random-string
# GitHub OAuth (optional)
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret

# Email provider (optional, for magic links)
EMAIL_SERVER=smtp://USER:PASSWORD@smtp.example.com:587
EMAIL_FROM="Weather App" <no-reply@example.com>
```

Notes:
- If you don't configure providers, a simple email credentials provider UI is still available for quick demo sign-ins.
- Make sure `NEXTAUTH_SECRET` is set in production to secure session cookies and tokens.

3. **Setup database**
```bash
npx prisma migrate dev
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
weather-app/
├── app/
│   ├── api/
│   │   ├── weather/
│   │   │   ├── route.ts          # Weather data endpoint
│   │   │   └── history/
│   │   │       └── route.ts      # Weather history endpoint
│   │   └── geocoding/
│   │       └── route.ts          # City search endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── CitySearch.tsx            # City search component
│   ├── Forecast.tsx              # 7-day forecast component
│   ├── LoadingAnimation.tsx       # Loading spinner
│   ├── WeatherDetail.tsx          # Weather display component
│   └── ui/                        # Shadcn UI components
├── hooks/
│   ├── use-geolocation.ts         # Geolocation hook
│   └── use-mobile.ts              # Mobile detection hook
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── utils.ts                  # Utility functions
│   └── weatherService.ts         # Weather API integration
├── store/
│   ├── weatherStore.ts           # Zustand weather store
│   ├── userStore.ts              # Zustand user store
│   └── locationStore.ts          # Zustand location store
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
└── middleware.ts                 # Next.js middleware
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Lucide React** - Icon library
- **React Icons** - Additional icons

### State Management
- **Zustand** - Lightweight state management

### Backend & Data
- **Prisma** - ORM for database
- **PostgreSQL** - Database (via Neon)
- **Axios** - HTTP client
- **Next.js API Routes** - Backend endpoints

### External APIs
- **Open-Meteo API** - Weather data (free, no API key required)

## 🌐 API Endpoints

### Get Weather
```
GET /api/weather?lat=<latitude>&lng=<longitude>&userId=<optional>
```

### Search Cities
```
GET /api/geocoding?q=<city_name>&limit=<number>
```

### Weather History
```
GET /api/weather/history?userId=<user_id>
```

## 🎨 Design Highlights

- **Gradient Backgrounds**: Modern blue gradient design
- **Card Layout**: Clean card-based component structure
- **Emoji Icons**: Weather visualization with emojis
- **Animations**: Smooth fade-in, scale, and rotate animations
- **Responsive Grid**: Adapts from 1 column on mobile to 4 columns on desktop

---

Made with ❤️ by Valerie Attila
