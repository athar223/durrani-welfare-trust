# DWT Platform - Deployment Guide

## Current Status

✅ **Frontend deployed to Vercel:** https://frontend-chi-three-80.vercel.app
⏳ **Backend not yet deployed** - public forms and login won't work until you deploy the backend

---

## Why a separate backend host?

Vercel only hosts the Next.js frontend (static + serverless). The Django backend needs:
- Persistent Python server (gunicorn)
- PostgreSQL database
- File storage for uploaded images

This requires a different host. The two best free/cheap options:

### Option A: Railway (Recommended - easiest)
- ~$5/mo after free trial credits
- One-click PostgreSQL database
- Auto-deploy from GitHub

### Option B: Render.com
- Free tier (sleeps after 15 min idle - slow cold starts)
- $7/mo for always-on
- Free PostgreSQL for 90 days

### Option C: Fly.io
- Free tier ($5/mo credit)
- More technical setup
- Globally distributed

---

## Backend Deployment - Railway (Step-by-Step)

### 1. Push code to GitHub

```bash
cd "c:\Users\Athar\Desktop\durrani welfare trust"
git init
git add .
git commit -m "Initial DWT platform"
# Create a new repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/durrani-welfare-trust.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Railway

1. Go to https://railway.app/ and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `durrani-welfare-trust` repo
4. Railway auto-detects Python and reads `Procfile`
5. Click **Add Service** → **Database** → **PostgreSQL**
6. Click on the Django service → **Variables** tab → add:
   ```
   DWT_SECRET_KEY=<long random string>
   DWT_DEBUG=0
   DJANGO_SETTINGS_MODULE=durrani_welfare_system.settings
   ```
   (`DATABASE_URL` is set automatically by Railway when you attach Postgres)
7. Click **Settings** → **Networking** → **Generate Domain**
   - You'll get a URL like `dwt-backend.up.railway.app`

### 3. Create the admin user

In Railway, open the service → **Settings** → **Service Settings** → run a one-off command:
```bash
python manage.py createsuperuser
```
Or use the Railway CLI: `railway run python manage.py createsuperuser`

### 4. Connect frontend to backend

```bash
cd "c:\Users\Athar\Desktop\durrani welfare trust\frontend"
```

Edit `.env.production` to point at your Railway URL:
```
NEXT_PUBLIC_API_URL=https://dwt-backend.up.railway.app
NEXT_PUBLIC_API_BASE=https://dwt-backend.up.railway.app/api/v1
```

Redeploy frontend:
```bash
vercel deploy --prod --yes --scope athar223s-projects
```

### 5. Add CORS allowlist

In Django settings, the CORS already accepts everything when `DEBUG=True`. For production:

In Railway env vars, add:
```
DWT_DEBUG=0
```

Then edit `durrani_welfare_system/settings.py` and update `CORS_ALLOWED_ORIGINS`:
```python
CORS_ALLOWED_ORIGINS = [
    'https://frontend-chi-three-80.vercel.app',
    'https://your-custom-domain.com',
]
```

Commit, push to GitHub, Railway auto-redeploys.

---

## Backend Deployment - Render.com (Alternative)

1. Sign up at https://render.com/ with GitHub
2. **New** → **Web Service** → Connect repo
3. Settings:
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate --noinput`
   - **Start Command:** `gunicorn durrani_welfare_system.wsgi`
4. Add Environment Variables:
   ```
   DWT_SECRET_KEY=<random string>
   DWT_DEBUG=0
   ```
5. **New** → **PostgreSQL** → free tier
6. Copy the **Internal Database URL** from the PG dashboard, add as `DATABASE_URL` env var in your web service
7. **Manual Deploy** → wait for build

---

## Database Migration (Existing SQLite → Production Postgres)

If you've already added data locally and want to keep it:

```bash
# 1. On your local machine, export current data
python manage.py dumpdata --natural-foreign --natural-primary \
    -e contenttypes -e auth.Permission \
    --indent 2 --output dwt_data.json

# 2. After Railway/Render deployment is live, load it
# Railway:  railway run python manage.py loaddata dwt_data.json
# Render:   use the Shell tab to upload and load
```

---

## Custom Domain (optional)

### For Vercel (frontend):
1. Vercel Dashboard → your project → **Settings** → **Domains**
2. Add `www.duraniwelfaretrust.org`
3. Update DNS at your registrar (Vercel shows the exact records)

### For Railway (backend):
1. Railway → service → **Settings** → **Custom Domain**
2. Add `api.duraniwelfaretrust.org`
3. Update DNS

Then in `.env.production`:
```
NEXT_PUBLIC_API_URL=https://api.duraniwelfaretrust.org
NEXT_PUBLIC_API_BASE=https://api.duraniwelfaretrust.org/api/v1
```

---

## Summary of files added for deployment

- `Procfile` - tells Railway/Render how to run Django
- `runtime.txt` - Python version
- `requirements.txt` - all backend dependencies (DRF, gunicorn, whitenoise, dj-database-url)
- `frontend/vercel.json` - Vercel config
- `frontend/.env.production` - frontend env vars

## Already done

- ✅ Whitenoise added for static file serving
- ✅ dj_database_url for `DATABASE_URL` env var support
- ✅ Gunicorn in requirements
- ✅ CORS configured
- ✅ Frontend live on Vercel
