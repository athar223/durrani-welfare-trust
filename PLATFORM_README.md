# Durrani Welfare Trust - Web Platform

A modern, responsive web platform for the Durrani Welfare Trust NGO, including a public-facing
landing website and a centralized management system, all powered by a shared Django REST backend.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│   Next.js Frontend (React + Tailwind)       │
│   - Public landing site                     │
│   - Public forms (volunteer, student, etc.) │
│   - Admin dashboard                         │
└──────────────────┬──────────────────────────┘
                   │ REST API (JWT)
                   ▼
┌─────────────────────────────────────────────┐
│   Django REST API Backend                   │
│   - DRF + Simple JWT                        │
│   - CMS app (banners, news, gallery, etc.)  │
│   - Existing apps (students, staff, etc.)   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│   PostgreSQL (production) / SQLite (dev)    │
└─────────────────────────────────────────────┘
```

---

## Folder Structure

```
durrani welfare trust/
├── durrani_welfare_system/        # Django backend
│   ├── core/                       # Auth, dashboard, users
│   ├── students/                   # Student module
│   ├── staff/                      # Staff module
│   ├── volunteers/                 # Volunteers
│   ├── drivers/                    # Drivers
│   ├── ambulance/                  # Ambulance service
│   ├── projects/                   # Community projects
│   ├── accounts/                   # Donations & expenses
│   ├── daily_expenses/             # Daily expenses
│   ├── salaries/                   # Salary records
│   ├── reports/                    # Reports
│   ├── cms/                        # NEW - Public website CMS
│   │   ├── models.py               # SiteSettings, HeroBanner, News, Gallery,
│   │   │                            #  Service, Campaign, ContactMessage,
│   │   │                            #  StudentApplication, VolunteerApplication,
│   │   │                            #  PublicDonation, NewsletterSubscriber
│   │   └── admin.py                # Django admin for CMS
│   ├── api/                        # NEW - REST API
│   │   ├── serializers.py          # DRF serializers for all modules
│   │   ├── views.py                # ViewSets (CRUD + custom actions)
│   │   ├── permissions.py          # IsAdminUser, ReadOnlyOrAdmin
│   │   └── urls.py                 # /api/v1/* routes
│   ├── settings.py                 # Django settings (DRF, JWT, CORS, DB)
│   └── urls.py                     # /api/v1/ + legacy desktop URLs
├── frontend/                       # NEW - Next.js frontend
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── page.tsx            # Home (landing)
│   │   │   ├── about/              # About page
│   │   │   ├── services/           # Services
│   │   │   ├── news/               # News list + detail
│   │   │   ├── gallery/            # Gallery albums
│   │   │   ├── volunteer/          # Volunteer registration form
│   │   │   ├── enroll/             # Student enrollment form
│   │   │   ├── donate/             # Donation form
│   │   │   ├── contact/            # Contact form
│   │   │   └── admin/              # Admin dashboard
│   │   ├── components/             # Header, Footer, sections
│   │   ├── lib/api.ts              # API client (axios + JWT)
│   │   └── globals.css             # Tailwind + DWT theme
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
├── templates/                      # Legacy desktop UI templates
├── static/                         # Tabler theme + DWT assets
├── media/                          # Uploaded files
├── manage.py
├── requirements.txt
└── PLATFORM_README.md              # This file
```

---

## Quick Start (Development)

### 1. Backend (Django)

```bash
# Install Python dependencies
pip install -r requirements.txt
pip install djangorestframework djangorestframework-simplejwt django-cors-headers django-filter psycopg2-binary

# Run migrations
python manage.py migrate

# Create superuser (or use existing admin / admin123)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
# Backend running at http://localhost:8000
# API docs at http://localhost:8000/api/v1/
# Django admin at http://localhost:8000/django-admin/
# Legacy desktop UI at http://localhost:8000/
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
# Frontend running at http://localhost:3000
```

---

## REST API Endpoints

Base URL: `http://localhost:8000/api/v1`

### Authentication
- `POST /auth/login/` — JWT login (returns access + refresh tokens)
- `POST /auth/refresh/` — Refresh JWT
- `GET /auth/me/` — Current user profile

### Public CMS (read for everyone, write for admin)
- `GET /site-settings/`
- `GET /hero-banners/`
- `GET /about-sections/`
- `GET /services/`
- `GET /news/`, `GET /news/{slug}/`
- `GET /gallery/`, `GET /gallery/{slug}/`
- `GET /campaigns/`

### Public Submissions (anyone can POST)
- `POST /contact-messages/`
- `POST /newsletter/subscribe/`
- `POST /student-applications/`
- `POST /volunteer-applications/`
- `POST /public-donations/`

### Application Review (admin only)
- `POST /student-applications/{id}/approve/` — Approve & create Student record
- `POST /student-applications/{id}/reject/`
- `POST /volunteer-applications/{id}/approve/` — Approve & create Volunteer
- `POST /volunteer-applications/{id}/reject/`
- `POST /public-donations/{id}/confirm/` — Confirm & create Donation record
- `POST /public-donations/{id}/reject/`

### Existing Modules (admin only, full CRUD)
- `/students/`, `/student-attendance/`
- `/staff/`, `/staff-attendance/`
- `/volunteers/`
- `/drivers/`
- `/projects/`
- `/donations/`, `/expenses/`
- `/daily-expenses/`
- `/salaries/`

### Dashboard
- `GET /dashboard/stats/` — Summary statistics
- `GET /dashboard/chart/` — 6-month donation/expense trend

---

## PostgreSQL Migration

To switch from SQLite (development) to PostgreSQL (production):

### 1. Install PostgreSQL

Windows: https://www.postgresql.org/download/windows/
Linux: `sudo apt install postgresql postgresql-contrib`

### 2. Create database

```sql
CREATE DATABASE dwt_db;
CREATE USER dwt_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE dwt_db TO dwt_user;
ALTER DATABASE dwt_db OWNER TO dwt_user;
```

### 3. Set environment variables

Create a `.env` (or set in your shell / hosting panel):

```bash
DWT_DB_ENGINE=postgres
DWT_DB_NAME=dwt_db
DWT_DB_USER=dwt_user
DWT_DB_PASSWORD=your_secure_password
DWT_DB_HOST=localhost
DWT_DB_PORT=5432
DWT_SECRET_KEY=your-long-random-secret-key
DWT_DEBUG=0
```

### 4. Migrate data from SQLite to PostgreSQL

```bash
# Export from SQLite (current dev DB)
python manage.py dumpdata --natural-foreign --natural-primary \
    -e contenttypes -e auth.Permission \
    --output dwt_data.json

# Switch to PostgreSQL by setting env vars above

# Run schema migrations on PostgreSQL
python manage.py migrate

# Import data
python manage.py loaddata dwt_data.json
```

---

## Default Login

- **Username:** `admin`
- **Password:** `admin123`

⚠️ Change immediately after first login.

---

## CMS Workflow

The Management System acts as a CMS for the public website. Admins can:

1. Update **Site Settings** (logo, contact info, social links) — `/django-admin/cms/sitesettings/`
2. Add/manage **Hero Banners** for the home page slideshow
3. Create **News Posts** which appear automatically on `/news`
4. Manage **Gallery Albums** with photos
5. Update **About Sections** (mission, vision, values)
6. Create **Services** offered by the NGO
7. Launch **Donation Campaigns** with progress tracking
8. Review **Student/Volunteer Applications** from the public website
9. Confirm **Donation Pledges** and link them to the accounts module
10. Read **Contact Messages** submitted via the public form

All changes appear instantly on the public Next.js website (which fetches from the API).

---

## Tech Stack

### Backend
- Python 3.14
- Django 4.2
- Django REST Framework
- Simple JWT (token auth)
- django-cors-headers (CORS)
- django-filter (API filtering)
- PostgreSQL / SQLite

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios
- Lucide Icons
- React Hot Toast

### Branding
- **Primary color:** `#1a6b3c` (DWT green)
- **Headings:** Libre Baskerville (serif)
- **Body:** Lato (sans-serif)

---

## Deployment (Future)

Production architecture (recommended):

```
Nginx → Gunicorn → Django (backend.dwt.org)
Nginx → Next.js   → React (www.dwt.org)
PostgreSQL (managed DB)
Redis (cache, optional)
```

A Docker setup will be added in a future phase.

---

## What's Done vs. What's Next

### ✅ Completed
- Django REST API for ALL modules (CMS + existing)
- JWT authentication
- Public landing website (Hero, About, Services, Stats, Campaigns, News, CTAs)
- Public forms: Volunteer registration, Student enrollment, Donation, Contact
- Public pages: News list/detail, Gallery, About, Services
- Admin login + dashboard with stats
- PostgreSQL/SQLite via env var
- CMS app with all content models
- Application approval workflow (auto-creates Student/Volunteer/Donation records)

### 🚧 Coming Next (future sessions)
- Full CRUD admin pages for each module (replacing the legacy desktop UI)
- CMS admin panels (manage hero banners, news, gallery from the web)
- Application review pages with rich filtering
- Charts and analytics on dashboard
- Email notifications (volunteer/student approval, donation confirmation)
- Docker + Nginx + Gunicorn production setup
- File migration from desktop installer paths
