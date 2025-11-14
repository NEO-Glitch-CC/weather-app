# ⚡ Quick Start Guide

## Getting Started dalam 5 Menit

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (atau Neon account untuk cloud)

### Step 1: Clone & Install (1 menit)
```bash
cd weather-app
npm install
```

### Step 2: Setup Database (2 menit)

#### Option A: Neon (Cloud - Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Sign up dan create project
3. Copy connection string
4. Create `.env.local`:
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

#### Option B: Local PostgreSQL
1. Create database: `createdb weather_app`
2. Create `.env.local`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/weather_app
```

### Step 3: Migrate Database (30 detik)
```bash
npx prisma migrate dev
```

### Step 4: Run Application (1 menit)
```bash
npm run dev
```

**Open**: http://localhost:3000 🎉

---

## How to Use

### 1. Automatic Weather Detection
- App will automatically request your location
- Weather for your city will appear instantly!

### 2. Manual City Search
- Click search bar
- Type city name
- Select from results
- Weather updates instantly

### 3. View Weather Details
- **Temperature**: Current + feels like
- **Humidity**: Air moisture level
- **Wind Speed**: Wind velocity
- **Sunrise/Sunset**: Times for today
- **7-Day Forecast**: Next week's predictions

---

## Available Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Run production build
npm run start

# View database (Prisma Studio)
npx prisma studio

# Create migration
npx prisma migrate dev --name description

# Reset database (development only)
npx prisma migrate reset
```

---

## Testing API Endpoints

### Test in Browser
1. Open DevTools (F12)
2. Go to Network tab
3. Search for city
4. See API calls to `/api/geocoding` and `/api/weather`

### Test with cURL
```bash
# Get weather for Jakarta
curl "http://localhost:3000/api/weather?lat=-6.2088&lng=106.8456"

# Search cities
curl "http://localhost:3000/api/geocoding?q=tokyo"
```

### Test with Postman
1. Open Postman
2. Create GET request
3. URL: `http://localhost:3000/api/weather?lat=0&lng=0`
4. Send and view response

---

## Understanding the App

### Main Components

```
🏠 Home Page (page.tsx)
├── 🔍 City Search Bar
├── ☀️ Weather Display Card (Gradient background)
└── 📊 Weather Stats Grid
    ├── 💧 Humidity
    ├── 💨 Wind Speed
    ├── 🌡️ Temperature
    └── ❌ Condition
```

### How Data Flows

```
User Interaction
     ↓
Zustand Store
     ↓
API Routes (/api/weather, /api/geocoding)
     ↓
External API (Open-Meteo)
     ↓
Display in UI with Animations
```

### State Management

```typescript
// Three main stores
- weatherStore → Current weather data
- locationStore → User's location
- userStore → User profile (for future use)
```

---

## Troubleshooting

### ❌ "Port 3000 already in use"
```bash
# Kill process
# Mac/Linux
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❌ "DATABASE_URL not found"
- Make sure `.env.local` exists in project root
- Check DATABASE_URL is correctly set
- Restart dev server

### ❌ "Geolocation not working"
- Check browser permissions
- Allow location access when prompted
- Try manual search as alternative
- HTTPS required for production

### ❌ "Build fails"
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### ❌ "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm run dev
```

---

## Environment Setup

### .env.local Template
```env
# Required
DATABASE_URL=postgresql://...

# Optional (defaults to localhost:3000)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional
NODE_ENV=development
```

**DO NOT commit .env.local to git!** ✋

---

## File Structure Quick Reference

```
🌤️ Weather App
├── 📄 app/page.tsx ← Main UI (START HERE)
├── 📁 app/api/ ← API routes
├── 📁 components/ ← React components
├── 📁 store/ ← State management
├── 📁 lib/ ← Utilities & services
└── 📁 prisma/ ← Database schema
```

---

## Next Steps

### Want to Customize?

1. **Change Colors**: Edit `app/page.tsx` className
2. **Add Cities**: Favorites in `store/locationStore.ts`
3. **Modify Data**: Update `prisma/schema.prisma`
4. **New Features**: Create new `app/api/route.ts`

### Want to Deploy?

1. Push to GitHub
2. Connect to Vercel
3. Set DATABASE_URL in Vercel settings
4. Deploy!

---

## Tips & Tricks

✅ **Pro Tips**
- Use Prisma Studio to view database: `npx prisma studio`
- Check network tab to see API calls
- Hover over cards for animations
- Search multiple cities to see history
- Use DevTools for debugging

⚠️ **Common Mistakes**
- Forgetting to set DATABASE_URL
- Using wrong PostgreSQL connection string
- Not running migrations
- Closing dev server by accident

---

## API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/weather` | GET | Get current weather |
| `/api/geocoding` | GET | Search cities |
| `/api/weather/history` | GET | Get weather history |

### Example Requests
```bash
# Weather
?lat=-6.2088&lng=106.8456

# Search
?q=jakarta&limit=5

# History
?userId=user123
```

---

## Performance Tips

- 🚀 Uses Open-Meteo API (free, fast)
- ⚡ Animations at 60fps
- 📱 Fully responsive
- 💾 Data cached in browser
- 🔄 Auto-updates on location change

---

## Support Resources

- 📖 `README.md` - Full documentation
- 🔌 `API_DOCUMENTATION.md` - API reference
- 👨‍💻 `DEVELOPMENT.md` - Developer guide
- 📋 `PROJECT_SUMMARY.md` - What's included
- ⚙️ `.env.example` - Configuration example

---

## What's Included? ✨

✅ Real-time weather data
✅ Geolocation support
✅ Beautiful animations
✅ Responsive design
✅ Database integration
✅ State management
✅ API routes
✅ Error handling
✅ TypeScript support
✅ Production ready

---

## Common Questions

**Q: Do I need an API key?**
A: No! We use Open-Meteo API which is free and doesn't require keys.

**Q: Will geolocation work on mobile?**
A: Yes! It works on all modern browsers and mobile devices.

**Q: Can I add more cities?**
A: Yes! Just search and the app stores history.

**Q: Is it secure?**
A: Yes! We use environment variables and API validation.

**Q: Can I deploy it?**
A: Yes! Build and deploy to Vercel, Railway, or any platform supporting Node.js.

---

## Quick Deployment

### Deploy to Vercel (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Set Environment in Vercel
1. Go to Settings
2. Environment Variables
3. Add DATABASE_URL
4. Redeploy

---

## 🎉 You're Ready!

1. ✅ Project setup
2. ✅ Database configured
3. ✅ App running
4. ✅ API working
5. ✅ Ready to customize!

**Start by searching for a city and exploring the app!** 🌍

---

## Need Help?

- Check `DEVELOPMENT.md` for detailed guide
- Read `API_DOCUMENTATION.md` for API details
- Review `PROJECT_SUMMARY.md` for overview
- Check browser console for errors

---

Happy coding! 🚀
Made with ❤️ | Weather App v1.0
