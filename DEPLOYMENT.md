# Production Deployment Guide

## Overview
This guide covers deploying MindfulChat to production environments.

## Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

## Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Build the frontend**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set environment variables** in Vercel dashboard:
   - `VITE_API_URL` = Your backend API URL

### Option 2: Netlify

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Deploy** via Netlify CLI or drag-and-drop the `dist` folder

3. **Set environment variables** in Netlify dashboard:
   - `VITE_API_URL` = Your backend API URL

## Backend Deployment (Heroku/Railway)

### Option 1: Heroku

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create app**:
   ```bash
   cd backend
   heroku create mindfulchat-api
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set FLASK_ENV=production
   heroku config:set FLASK_DEBUG=0
   heroku config:set CORS_ORIGINS=https://your-frontend-domain.com
   ```

4. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 2: Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and init**:
   ```bash
   railway login
   railway init
   ```

3. **Deploy backend**:
   ```bash
   cd backend
   railway up
   ```

4. **Set environment variables** in Railway dashboard

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-backend-api.com
```

### Backend (.env)
```
FLASK_ENV=production
FLASK_DEBUG=0
HOST=0.0.0.0
PORT=5000
CORS_ORIGINS=https://your-frontend-domain.com
```

## Security Checklist

- [ ] Set `FLASK_DEBUG=0` in production
- [ ] Configure CORS to only allow your frontend domain
- [ ] Use HTTPS for both frontend and backend
- [ ] Set secure environment variables
- [ ] Review and update dependencies regularly
- [ ] Implement rate limiting (optional)
- [ ] Add logging and monitoring

## Performance Optimization

### Frontend
- Build is automatically optimized by Vite
- Assets are minified and tree-shaken
- Code splitting is enabled

### Backend
- Use gunicorn with multiple workers:
  ```bash
  gunicorn -w 4 -b 0.0.0.0:5000 app:app
  ```
- Model is cached after first load
- Consider using Redis for session management (future enhancement)

## Monitoring

### Recommended Tools
- **Frontend**: Vercel Analytics, Google Analytics
- **Backend**: Heroku Metrics, Sentry for error tracking
- **Uptime**: UptimeRobot, Pingdom

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGINS` includes your frontend URL
- Check that both HTTP and HTTPS are configured if needed

### Model Loading Issues
- First request may be slow (~30s) as model downloads
- Subsequent requests will be fast (model is cached)
- Consider pre-loading model on server startup

### Build Failures
- Clear `node_modules` and reinstall: `npm ci`
- Check Node.js version compatibility
- Verify all environment variables are set

## Cost Estimates

### Free Tier Options
- **Frontend**: Vercel/Netlify (Free tier available)
- **Backend**: Railway ($5/month), Heroku (Eco dyno $5/month)
- **Total**: ~$5-10/month for small-scale deployment

### Scaling Considerations
- Model requires ~500MB RAM minimum
- Each request processes in ~100-500ms
- Consider serverless functions for frontend
- Use managed PostgreSQL for user data (future enhancement)
