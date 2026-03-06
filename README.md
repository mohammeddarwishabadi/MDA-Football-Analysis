# MDA | Football Analysis

Production-ready full-stack football analytics platform:
- **Frontend:** Next.js (App Router) + TailwindCSS + Framer Motion + Chart.js
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Auth:** JWT + role-based authorization (`admin`, `editor`, `user`)

## Highlights
- Dark brand styling aligned to logo identity (`#0B0F14` background, `#00FF9C` accent).
- Blog + predictions listing pages with backend pagination.
- Dynamic single pages:
  - `/blog/[id]` → loads `GET /api/posts/:id`
  - `/predictions/[id]` → loads `GET /api/predictions/:id`
- Admin dashboard protection using JWT + role checks.
- Upload pipeline with Multer and static `/uploads` delivery.
- Centralized backend error handling and frontend error banners.

## Folder structure

```text
.
├── backend
│   ├── .env.example
│   ├── package.json
│   ├── scripts/seed.js
│   └── src
│       ├── app.js
│       ├── config
│       │   ├── db.js
│       │   └── upload.js
│       ├── controllers
│       │   ├── authController.js
│       │   ├── postController.js
│       │   ├── predictionController.js
│       │   └── uploadController.js
│       ├── middleware
│       │   ├── auth.js
│       │   └── errorHandler.js
│       ├── models
│       │   ├── Post.js
│       │   ├── Prediction.js
│       │   └── User.js
│       ├── routes
│       │   ├── authRoutes.js
│       │   ├── postRoutes.js
│       │   ├── predictionRoutes.js
│       │   └── uploadRoutes.js
│       ├── uploads/
│       ├── utils/asyncHandler.js
│       └── server.js
├── frontend
│   ├── app
│   │   ├── admin/login/page.js
│   │   ├── admin/dashboard/page.js
│   │   ├── analysis/page.js
│   │   ├── blog/page.js
│   │   ├── blog/[id]/page.js
│   │   ├── predictions/page.js
│   │   ├── predictions/[id]/page.js
│   │   ├── data-viz/page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components
│   │   ├── ChartSection.js
│   │   ├── ErrorBanner.js
│   │   ├── Footer.js
│   │   ├── MatchStatsCard.js
│   │   ├── Navbar.js
│   │   ├── PageIntro.js
│   │   ├── Pagination.js
│   │   ├── PostCard.js
│   │   └── PredictionCard.js
│   ├── lib
│   │   ├── api.js
│   │   └── dummyData.js
│   └── public/logo.svg
└── README.md
```


## Admin CMS upgrade
- Global auth context at `frontend/context/AuthContext.js` with persistent session restore (`mda_token`), `login`, `logout`, and `fetchCurrentUser`.
- Route guard component `frontend/components/ProtectedRoute.js` for role-based frontend protection.
- New CMS routes:
  - `/admin/dashboard`
  - `/admin/posts`
  - `/admin/posts/edit/[id]`
  - `/admin/predictions`
  - `/admin/predictions/edit/[id]`
- Dashboard now includes KPI cards: total posts, total predictions, latest post, latest prediction.
- Navbar now keeps session state globally and shows Dashboard + Logout for `admin`/`editor`.

## Backend API
Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/login`
- `GET /auth/me` (protected)

### Posts
- `GET /posts?page=1&limit=10`
- `GET /posts/:id`
- `POST /posts` (protected: `admin`, `editor`)
- `PUT /posts/:id` (protected: `admin`, `editor`)
- `DELETE /posts/:id` (protected: `admin`)

### Predictions
- `GET /predictions?page=1&limit=10`
- `GET /predictions/:id`
- `POST /predictions` (protected: `admin`, `editor`)
- `PUT /predictions/:id` (protected: `admin`, `editor`)
- `DELETE /predictions/:id` (protected: `admin`)

### Uploads
- `POST /upload` (protected: `admin`, `editor`, multipart `image`)
- Files are served from `/uploads/<filename>`

## Collections
### Posts
- title, match, teams, stats, xg, shots, possession, analysis_text, charts, imageUrl

### Predictions
- match, teams, win_probability, expected_goals, confidence, charts, imageUrl

### Users
- email, password, role (`admin` | `editor` | `user`)

## Seed users
`backend/scripts/seed.js` creates:
- `admin@mda.com` / `admin123`
- `editor@mda.com` / `editor123`
- `user@mda.com` / `user123`

## Run locally

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# optional if backend URL differs
# echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

Open: `http://localhost:3000`
