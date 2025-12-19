# 🚀 Production Deployment Guide - MindfulChat

This guide will walk you through deploying your MindfulChat application to production step-by-step.

## Quick Overview

You'll deploy:
- **Frontend** → Vercel (Free tier)
- **Backend** → Railway or Render (Free/Low-cost tier)

Total time: ~30 minutes
Total cost: **FREE** (or ~$5/month for better performance)

---

## Part 1: Deploy Backend (Railway - Recommended)

### Step 1: Prepare Your Backend

1. **Install dependencies** (if not already done):
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Test locally** to ensure it works:
   ```bash
   python app.py
   ```
   You should see: "Starting MindfulChat Backend API..."

### Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with GitHub (recommended)

### Step 3: Deploy to Railway

**Option A: Using Railway CLI (Recommended)**

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

4. **Initialize and deploy**:
   ```bash
   railway init
   railway up
   ```

5. **Set environment variables** in Railway dashboard:
   - Go to your project → Variables
   - Add:
     ```
     FLASK_ENV=production
     FLASK_DEBUG=0
     SECRET_KEY=your-random-secret-key-here
     PORT=5000
     ```

6. **Get your backend URL**:
   - Go to Settings → Generate Domain
   - Copy the URL (e.g., `https://your-app.railway.app`)

**Option B: Using Railway Dashboard**

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Connect your GitHub account
3. Select your repository
4. Set **Root Directory** to `backend`
5. Railway will auto-detect Python and deploy
6. Add environment variables as above
7. Generate domain and copy URL

---

## Part 2: Deploy Frontend (Vercel)

### Step 1: Prepare Frontend

1. **Update environment variable**:
   Edit `.env`:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   (Replace with your Railway backend URL)

2. **Test build locally**:
   ```bash
   npm run build
   ```
   Should create a `dist` folder

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set environment variable**:
   ```bash
   vercel env add VITE_API_URL production
   ```
   Enter your Railway backend URL when prompted

5. **Redeploy** to apply env variable:
   ```bash
   vercel --prod
   ```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variable:
   - Name: `VITE_API_URL`
   - Value: Your Railway backend URL
7. Click **"Deploy"**

---

## Part 3: Configure CORS

After both are deployed, update backend CORS:

1. **In Railway dashboard**, add environment variable:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```
   (Replace with your Vercel frontend URL)

2. **Redeploy backend** (Railway will auto-redeploy on env change)

---

## Part 4: Test Your Production App

1. **Open your Vercel URL** (e.g., `https://mindfulchat.vercel.app`)
2. **Complete onboarding** with your name
3. **Send a test message**: "I'm feeling great today!"
4. **Verify**:
   - ✅ Bot responds with empathetic message
   - ✅ Emotion is detected
   - ✅ No CORS errors in browser console (F12)

---

## Alternative: Deploy Backend to Render

If you prefer Render over Railway:

1. Go to [render.com](https://render.com)
2. Sign up and click **"New Web Service"**
3. Connect GitHub repository
4. Configure:
   - **Name**: mindfulchat-api
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Add environment variables (same as Railway)
6. Click **"Create Web Service"**
7. Copy the URL and use it in frontend `.env`

---

## Troubleshooting

### CORS Errors
**Problem**: "Access to fetch blocked by CORS policy"
**Solution**: 
- Ensure `CORS_ORIGINS` in backend matches your frontend URL exactly
- Include `https://` in the URL
- Redeploy backend after changing

### Backend Not Responding
**Problem**: 502 Bad Gateway or timeout
**Solution**:
- Check Railway/Render logs for errors
- Ensure all dependencies are in `requirements.txt`
- First request may take 30s (model download)

### Frontend Shows "Connection Error"
**Problem**: Can't connect to backend
**Solution**:
- Verify `VITE_API_URL` is set correctly
- Check backend is running (visit backend URL in browser)
- Ensure backend URL has `https://` not `http://`

### Database Issues
**Problem**: "Database locked" or permission errors
**Solution**:
- Railway/Render provide persistent storage automatically
- Database file is created on first run
- Check logs for specific SQLite errors

---

## Cost Breakdown

### Free Tier (Recommended for Testing)
- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: $5/month (500 hours, includes $5 credit)
- **Total**: ~$5/month

### Paid Tier (For Production)
- **Vercel Pro**: $20/month (better performance)
- **Railway Pro**: $20/month (more resources)
- **Total**: ~$40/month

---

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Chat messages send and receive
- [ ] Emotion detection works
- [ ] User sessions persist (refresh page, user ID stays)
- [ ] Database stores conversations
- [ ] No CORS errors in console
- [ ] HTTPS enabled on both frontend and backend
- [ ] Environment variables set correctly

---

## Monitoring & Maintenance

### Check Logs
**Railway**: Dashboard → Deployments → View Logs
**Vercel**: Dashboard → Deployments → Function Logs

### Update Application
1. **Push to GitHub**: `git push`
2. **Auto-deploy**: Both platforms auto-deploy on push
3. **Manual deploy**: Use CLI or dashboard

### Backup Database
Railway/Render provide automatic backups, but you can also:
```bash
# Download database from Railway
railway run python -c "import shutil; shutil.copy('mindfulchat.db', 'backup.db')"
```

---

## 🎉 You're Live!

Your MindfulChat application is now in production!

**Share your app**:
- Frontend URL: `https://your-app.vercel.app`
- Users can access it from any device
- All data is stored securely in your backend database

**Next Steps**:
- Add custom domain (optional)
- Set up monitoring/analytics
- Implement user authentication (future enhancement)
- Add more coping strategies
