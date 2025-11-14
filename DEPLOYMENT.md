# 🚀 Deployment Guide

## Deployment Options

Choose one of the following platforms to deploy your Weather App:

---

## Option 1: Vercel (Recommended) ⭐

### Why Vercel?
- Optimized for Next.js
- Free tier available
- Easy environment setup
- Auto deployments from Git

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Weather App"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Sign up on Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "Sign up"
- Choose "Continue with GitHub"

3. **Import Project**
- Click "New Project"
- Select your repository
- Click "Import"

4. **Configure Environment**
- Go to Settings → Environment Variables
- Add `DATABASE_URL` with your production database
- Save

5. **Deploy**
- Vercel automatically deploys
- Visit your project URL

---

## Option 2: Railway

### Steps

1. **Sign up**
- Go to [railway.app](https://railway.app)
- Connect GitHub account

2. **Create Database**
- Create new project
- Add PostgreSQL plugin
- Copy connection string

3. **Create App**
- Add Node.js service
- Connect GitHub repository
- Set `DATABASE_URL` environment variable

4. **Deploy**
- Click Deploy
- Monitor in Railway dashboard

---

## Option 3: Render

### Steps

1. **Sign up**
- Go to [render.com](https://render.com)
- Connect GitHub

2. **Create Web Service**
- New → Web Service
- Select GitHub repo
- Name: `weather-app`
- Runtime: Node
- Build command: `npm run build`
- Start command: `npm run start`

3. **Configure Database**
- Create PostgreSQL database
- Copy connection string

4. **Add Environment Variables**
- Set `DATABASE_URL`
- Set `NODE_ENV=production`

5. **Deploy**
- Click "Create Web Service"

---

## Pre-Deployment Checklist

- [ ] Database URL configured
- [ ] Build passes locally: `npm run build`
- [ ] Environment variables set
- [ ] No console errors
- [ ] API routes working
- [ ] Geolocation works on HTTPS
- [ ] Migrations run on database
- [ ] Git repository initialized

---

## Production Environment Setup

### .env.production (or in platform settings)
```env
DATABASE_URL=your_production_postgresql_url
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### Important Notes
- Use HTTPS in production
- Set proper CORS if needed
- Configure database backups
- Monitor performance

---

## Database Migration in Production

After deploying, run migrations on production database:

### If using Vercel Postgres
```bash
# Migrations run automatically
npx prisma migrate deploy
```

### If using external database
1. SSH into server or use platform CLI
2. Run: `npx prisma migrate deploy`
3. Verify with: `npx prisma studio`

---

## Post-Deployment

### Verify Deployment
- [ ] App loads at URL
- [ ] Search works
- [ ] Geolocation requests location
- [ ] Check browser console for errors
- [ ] Verify API calls in Network tab

### Monitor & Maintain
- Check platform dashboard regularly
- Monitor error logs
- Review analytics
- Plan for scaling

---

## Performance Optimization for Production

### Front-end
```bash
# Generate optimized build
npm run build

# Output size
# JavaScript: ~250KB
# CSS: ~50KB
# Total: Highly optimized with code splitting
```

### Database
- Add indexes for frequently queried fields
- Regular backups
- Monitor query performance

### API
- Consider caching responses
- Add rate limiting if needed
- Monitor API response times

---

## Troubleshooting Deployment

### Build Fails
```bash
# Locally test build
npm run build
npm run start
```

### Database Connection Error
- Verify DATABASE_URL is correct
- Check database is accessible from deployment server
- Test connection locally first

### Geolocation Not Working
- Ensure HTTPS is enabled
- Check browser permissions on client side
- Test on actual domain

### Slow Performance
- Check database query performance
- Review API response times
- Optimize images and assets
- Consider adding caching

---

## CI/CD Pipeline (Optional)

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npx prisma migrate deploy
      # Deploy step here
```

---

## Domain Setup

### Point Your Domain
1. Get deployment URL from platform
2. Add CNAME record to domain DNS
3. Update `NEXT_PUBLIC_API_URL` with domain
4. Enable HTTPS/SSL

### Example DNS Setup
```
Type: CNAME
Name: www
Value: your-app.vercel.app
```

---

## Scaling Considerations

### When to Scale
- Traffic exceeds platform limits
- Database queries become slow
- Need multiple servers
- International users

### Scaling Options
1. **Platform auto-scaling**
   - Most platforms handle automatically
   
2. **Database scaling**
   - Upgrade plan
   - Add read replicas
   
3. **CDN**
   - Add Cloudflare or similar
   - Cache API responses

---

## Monitoring & Logging

### Available Platforms
- Vercel Analytics
- Railway Logs
- Sentry (error tracking)
- LogRocket (session replay)

### Important Metrics to Monitor
- Page load time
- API response time
- Error rate
- Database query time
- User geolocation success rate

---

## Rollback Procedure

### If Deployment Goes Wrong

**Vercel**
- Go to Deployments
- Click previous successful deployment
- Click "Promote to Production"

**Railway**
- Check deployment history
- Redeploy previous version

**Render**
- Go to Deployments
- Select previous version
- Deploy

---

## Backup & Recovery

### Database Backups
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Configure Automatic Backups
- Most platforms offer automatic backups
- Set retention policy
- Test recovery regularly

---

## Security in Production

### Recommended Actions
1. Enable HTTPS (automatic on most platforms)
2. Set secure database password
3. Use environment variables only
4. Enable database backups
5. Monitor for unusual activity
6. Keep dependencies updated

### Update Dependencies
```bash
npm update
npm audit fix
npm run build
# Test locally
npm run start
# Deploy if successful
```

---

## Cost Estimation

### Vercel
- **Free**: Up to 12 serverless function executions/second
- **Pro**: $20/month for higher limits

### Railway
- **Free**: $5 credits/month
- **Plus**: Pay-as-you-go ($0.05/hour compute)

### Render
- **Free**: Limited resources
- **Pro**: $7/month for static sites

### PostgreSQL
- **Neon**: Free tier includes database
- **Railway**: Included with project
- **Render**: $9/month standalone

---

## Success Checklist

After deployment, verify:
- [ ] App loads without errors
- [ ] Search functionality works
- [ ] Geolocation works
- [ ] Weather data displays correctly
- [ ] Animations smooth
- [ ] No console errors
- [ ] API responses fast
- [ ] Database connected
- [ ] HTTPS enabled
- [ ] Custom domain working (if using)

---

## Next: Ongoing Maintenance

- Weekly: Check logs and errors
- Monthly: Review performance metrics
- Quarterly: Update dependencies
- Yearly: Conduct security audit

---

## Support

- Platform documentation
- Community forums
- GitHub issues
- Documentation files

---

## Deployment Complete! 🎉

Your Weather App is now live and ready for users!

---

**Remember**: Start with free tier → Monitor usage → Scale when needed

Good luck! 🚀
