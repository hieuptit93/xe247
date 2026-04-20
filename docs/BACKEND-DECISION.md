# XE 247 - Backend Architecture Decision

> **Decision:** Supabase-only cho MVP  
> **Date:** 2026-04-20  
> **Status:** Recommended

---

## Executive Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BACKEND ARCHITECTURE OPTIONS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OPTION A: Supabase Only (RECOMMENDED for MVP)                              │
│  ═══════════════════════════════════════════════                            │
│                                                                              │
│  ┌──────────────┐     ┌─────────────────────────────────────────────────┐  │
│  │  React Native │────▶│              SUPABASE                           │  │
│  │     App       │     │  ┌─────────┐ ┌──────────┐ ┌─────────────────┐  │  │
│  └──────────────┘     │  │  Auth   │ │ Realtime │ │    Storage      │  │  │
│                        │  │  (OTP)  │ │  (Chat)  │ │   (Photos)      │  │  │
│                        │  └─────────┘ └──────────┘ └─────────────────┘  │  │
│                        │  ┌─────────────────────────────────────────┐   │  │
│                        │  │     PostgreSQL + PostGIS                 │   │  │
│                        │  │     (Location queries, RLS security)     │   │  │
│                        │  └─────────────────────────────────────────┘   │  │
│                        │  ┌─────────────────────────────────────────┐   │  │
│                        │  │     Edge Functions (Deno)                │   │  │
│                        │  │     • Push notifications                 │   │  │
│                        │  │     • SMS OTP                            │   │  │
│                        │  │     • Complex queries                    │   │  │
│                        │  └─────────────────────────────────────────┘   │  │
│                        └─────────────────────────────────────────────────┘  │
│                                                                              │
│  Cost: $25/month (Pro plan)                                                 │
│  Setup time: 1 week                                                         │
│  Maintenance: Minimal                                                       │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OPTION B: Custom Backend (NOT needed for MVP)                              │
│  ═════════════════════════════════════════════                              │
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────────────────┐     │
│  │  React Native │────▶│   API Layer  │────▶│       Database          │     │
│  │     App       │     │  (Node/Bun)  │     │   (Supabase/Neon)       │     │
│  └──────────────┘     └──────────────┘     └─────────────────────────┘     │
│                              │                                              │
│                              ▼                                              │
│                        ┌──────────────┐                                     │
│                        │    Redis     │                                     │
│                        │   (Cache)    │                                     │
│                        └──────────────┘                                     │
│                                                                              │
│  Cost: $50-100/month (hosting + DB + Redis)                                │
│  Setup time: 3-4 weeks                                                      │
│  Maintenance: High (DevOps needed)                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Analysis: Supabase vs Custom Backend

| Feature | Supabase | Custom BE | Winner |
|---------|----------|-----------|--------|
| **Auth (Email/Phone OTP)** | ✅ Built-in | Need to build | Supabase |
| **Location Search (PostGIS)** | ✅ Native | Same capability | Tie |
| **File Storage** | ✅ Built-in | S3 integration | Supabase |
| **Real-time Chat** | ✅ Realtime | Socket.io/ws | Supabase |
| **Push Notifications** | ✅ Edge Functions | Direct FCM | Tie |
| **Complex Business Logic** | ⚠️ Edge Functions | ✅ Full control | Custom |
| **Background Jobs** | ⚠️ Cron + Functions | ✅ BullMQ/etc | Custom |
| **Rate Limiting** | ⚠️ Basic | ✅ Advanced | Custom |
| **Custom Caching** | ❌ Limited | ✅ Redis | Custom |
| **Multi-tenant** | ✅ RLS | Need to build | Supabase |

**For XE 247 MVP:** Tất cả features chính đều có thể handle bằng Supabase.

---

## XE 247 Feature Mapping

### Core Features (100% Supabase)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     XE 247 FEATURES → SUPABASE MAPPING                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AUTHENTICATION                                                             │
│  ══════════════                                                             │
│  • Phone OTP login ──────────────── Supabase Auth + Twilio/MSG91           │
│  • Social login (Zalo) ──────────── Supabase Auth custom provider          │
│  • Session management ───────────── Supabase Auth (JWT)                    │
│                                                                              │
│  PROVIDER MANAGEMENT                                                        │
│  ═══════════════════                                                        │
│  • CRUD providers ───────────────── PostgREST API (auto-generated)         │
│  • Photo upload ─────────────────── Supabase Storage                       │
│  • Working hours ────────────────── JSONB column                           │
│  • Categories/Services ──────────── Relational tables                      │
│                                                                              │
│  SEARCH & DISCOVERY                                                         │
│  ══════════════════                                                         │
│  • Nearby search ────────────────── PostGIS ST_DWithin                     │
│  • Category filter ──────────────── SQL WHERE                              │
│  • Rating filter ────────────────── SQL WHERE                              │
│  • Full-text search ─────────────── PostgreSQL tsvector                    │
│                                                                              │
│  REVIEWS & RATINGS                                                          │
│  ═════════════════                                                          │
│  • Submit review ────────────────── PostgREST INSERT                       │
│  • Photo reviews ────────────────── Supabase Storage                       │
│  • Rating aggregation ───────────── PostgreSQL trigger/function            │
│                                                                              │
│  FAVORITES & HISTORY                                                        │
│  ═══════════════════                                                        │
│  • Save favorites ───────────────── Junction table                         │
│  • View history ─────────────────── Timestamp queries                      │
│                                                                              │
│  REAL-TIME (Future)                                                         │
│  ══════════════════                                                         │
│  • Chat messages ────────────────── Supabase Realtime                      │
│  • Booking status ───────────────── Supabase Realtime                      │
│  • Push notifications ───────────── Edge Functions + FCM                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Edge Functions Needed

```javascript
// 1. Push Notification (FCM)
// supabase/functions/send-push/index.ts
Deno.serve(async (req) => {
  const { user_id, title, body } = await req.json();
  // Get FCM token from users table
  // Send via FCM API
});

// 2. SMS OTP (via Twilio/MSG91)
// Supabase Auth handles this automatically with config

// 3. Rating Aggregation (or use DB trigger)
// supabase/functions/update-rating/index.ts
// Called after review insert via DB webhook

// 4. Data Import (one-time)
// supabase/functions/import-providers/index.ts
```

---

## When to Add Custom Backend?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EVOLUTION PATH: Supabase → Hybrid                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: MVP (Month 1-3)                                                   │
│  ════════════════════════                                                   │
│                                                                              │
│  ┌──────────────┐                                                           │
│  │  React Native │────────────▶ SUPABASE (100%)                             │
│  │     App       │                                                           │
│  └──────────────┘                                                           │
│                                                                              │
│  ✓ Simple architecture                                                      │
│  ✓ Fast development                                                         │
│  ✓ Low cost ($25/month)                                                     │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────   │
│                                                                              │
│  PHASE 2: Growth (Month 4-6) - IF NEEDED                                   │
│  ═══════════════════════════════════════                                    │
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐                                     │
│  │  React Native │────▶│   API Layer  │─────▶ SUPABASE (Database)          │
│  │     App       │     │   (Bun/Hono) │                                     │
│  └──────────────┘     └──────────────┘                                     │
│                              │                                              │
│                              ├── Complex booking logic                      │
│                              ├── Payment integration                        │
│                              ├── Advanced analytics                         │
│                              └── Third-party integrations                   │
│                                                                              │
│  Add backend ONLY when:                                                     │
│  • In-app payments (MoMo, VNPay) - needs server-side secrets               │
│  • Complex booking workflow with state machine                              │
│  • Heavy analytics/reporting                                                │
│  • AI/ML features (recommendation engine)                                   │
│  • Third-party integrations (CRM, ERP)                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## If Custom Backend: Technology Recommendation

### Database Options

| Database | PostGIS | Serverless | Free Tier | Recommendation |
|----------|---------|------------|-----------|----------------|
| **Supabase** | ✅ | ✅ | 500MB | ⭐ Best for XE 247 |
| **Neon** | ✅ | ✅ | 512MB | Good alternative |
| **PlanetScale** | ❌ | ✅ | 5GB | MySQL only, no PostGIS |
| **Railway Postgres** | ✅ | ❌ | $5/month | Need to manage |
| **AWS RDS** | ✅ | ❌ | None | Enterprise scale |

**Recommendation:** Giữ **Supabase PostgreSQL** ngay cả khi thêm custom backend.

### Backend Framework Options

| Framework | Language | Performance | DX | Ecosystem |
|-----------|----------|-------------|-----|-----------|
| **Hono + Bun** | TypeScript | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Growing |
| **Express + Node** | TypeScript | ⭐⭐⭐ | ⭐⭐⭐⭐ | Mature |
| **Fastify + Node** | TypeScript | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Mature |
| **NestJS** | TypeScript | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Enterprise |
| **Go + Fiber** | Go | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Mature |

**Recommendation nếu cần backend:** **Hono + Bun** 
- Cùng TypeScript với React Native
- Extremely fast (Bun runtime)
- Minimal boilerplate
- Easy to deploy (Railway, Fly.io)

---

## Recommended Architecture for XE 247

### MVP Architecture (Supabase Only)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     XE 247 MVP ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                         ┌─────────────────┐                                 │
│                         │   React Native  │                                 │
│                         │   (Expo + RN)   │                                 │
│                         └────────┬────────┘                                 │
│                                  │                                          │
│                    ┌─────────────┼─────────────┐                           │
│                    │             │             │                           │
│                    ▼             ▼             ▼                           │
│           ┌────────────┐ ┌────────────┐ ┌────────────┐                    │
│           │ @supabase/ │ │ @supabase/ │ │ @supabase/ │                    │
│           │  supabase  │ │  realtime  │ │  storage   │                    │
│           └─────┬──────┘ └─────┬──────┘ └─────┬──────┘                    │
│                 │              │              │                            │
│                 └──────────────┼──────────────┘                            │
│                                │                                            │
│                                ▼                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         SUPABASE                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │                    PostgreSQL + PostGIS                          │ │  │
│  │  │                                                                   │ │  │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │ │  │
│  │  │  │  users  │ │providers│ │ reviews │ │favorites│ │ sessions│   │ │  │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │ │  │
│  │  │                                                                   │ │  │
│  │  │  Security: Row Level Security (RLS)                              │ │  │
│  │  │  Geo: PostGIS ST_DWithin, ST_Distance                            │ │  │
│  │  │  Search: Full-text with tsvector                                 │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │  │
│  │  │    Auth     │  │   Storage   │  │  Realtime   │                  │  │
│  │  │  • Phone OTP│  │  • Photos   │  │  • Chat     │                  │  │
│  │  │  • JWT      │  │  • Avatars  │  │  • Updates  │                  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │                    Edge Functions (Deno)                         │ │  │
│  │  │  • send-push-notification                                        │ │  │
│  │  │  • aggregate-ratings (webhook trigger)                           │ │  │
│  │  │  • import-providers (one-time)                                   │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│                                  │                                          │
│                                  ▼                                          │
│                    ┌─────────────────────────┐                             │
│                    │    External Services    │                             │
│                    │  • Firebase Cloud Msg   │                             │
│                    │  • Twilio/MSG91 (SMS)   │                             │
│                    │  • Cloudinary (images)  │                             │
│                    └─────────────────────────┘                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cost Breakdown

| Service | Free Tier | Pro Tier | Notes |
|---------|-----------|----------|-------|
| **Supabase** | 500MB DB, 1GB storage | $25/month | 8GB DB, 100GB storage |
| **Twilio SMS** | - | ~$0.05/SMS | OTP verification |
| **Firebase FCM** | Unlimited | Free | Push notifications |
| **Expo** | Free | Free | Build service |

**MVP Total: ~$25-30/month** (after free tier)

---

## Implementation Checklist

### Week 1: Supabase Setup

```bash
# 1. Create Supabase project
npx supabase init

# 2. Enable PostGIS
# In SQL Editor:
CREATE EXTENSION IF NOT EXISTS postgis;

# 3. Run migrations
npx supabase db push

# 4. Set up Row Level Security
# Enable RLS on all tables
# Create policies for each operation
```

### Database Schema (Supabase SQL)

```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  phone TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'consumer' CHECK (role IN ('consumer', 'provider', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Providers table
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  location GEOGRAPHY(POINT, 4326),
  category TEXT NOT NULL,
  services TEXT[],
  working_hours JSONB,
  photos TEXT[],
  rating_avg DECIMAL(2,1) DEFAULT 0,
  rating_count INT DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for location queries
CREATE INDEX providers_location_idx ON providers USING GIST(location);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table
CREATE TABLE public.favorites (
  user_id UUID REFERENCES profiles(id),
  provider_id UUID REFERENCES providers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, provider_id)
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policies (examples)
CREATE POLICY "Public providers are viewable by everyone"
  ON providers FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function: Search nearby providers
CREATE OR REPLACE FUNCTION search_nearby_providers(
  lat FLOAT,
  lng FLOAT,
  radius_km FLOAT DEFAULT 5,
  category_filter TEXT DEFAULT NULL
)
RETURNS SETOF providers AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM providers
  WHERE status = 'active'
    AND ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000
    )
    AND (category_filter IS NULL OR category = category_filter)
  ORDER BY ST_Distance(
    location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  );
END;
$$ LANGUAGE plpgsql;
```

---

## Final Recommendation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FINAL RECOMMENDATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✅ USE SUPABASE ONLY FOR MVP                                               │
│                                                                              │
│  Reasons:                                                                   │
│  • XE 247 MVP là CRUD app + location search - Supabase handles 100%        │
│  • PostGIS built-in - không cần custom implementation                       │
│  • Auth với Phone OTP - native support                                      │
│  • Real-time cho chat - Supabase Realtime                                  │
│  • File storage cho photos - Supabase Storage                              │
│  • Edge Functions cho push notifications - đủ dùng                         │
│  • RLS security - enterprise-grade                                          │
│  • Cost: $25/month vs $50-100/month custom                                 │
│  • Time to market: 1 week setup vs 3-4 weeks                               │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────   │
│                                                                              │
│  ❌ DO NOT BUILD CUSTOM BACKEND YET                                         │
│                                                                              │
│  Wait until you need:                                                       │
│  • In-app payments (MoMo, VNPay integration)                               │
│  • Complex booking state machine                                            │
│  • AI-powered recommendations                                               │
│  • Heavy background processing                                              │
│  • Third-party CRM/ERP integration                                         │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────   │
│                                                                              │
│  📌 IF BACKEND NEEDED LATER:                                                │
│                                                                              │
│  Database: Keep Supabase PostgreSQL (PostGIS, proven, data already there)  │
│  Framework: Hono + Bun (TypeScript, fast, minimal)                         │
│  Hosting: Railway or Fly.io ($5-10/month)                                  │
│                                                                              │
│  Architecture: Hybrid                                                       │
│  • Supabase: Database + Auth + Storage + Realtime                          │
│  • Custom API: Complex business logic only                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Action Items

1. **Now:** Set up Supabase project
2. **Now:** Run database migrations with PostGIS
3. **Now:** Configure Auth with Phone OTP
4. **Week 2:** Build React Native app with Supabase SDK
5. **Month 2-3:** Evaluate if custom backend needed based on feature requirements
6. **If needed:** Add Hono + Bun API layer, keep Supabase as database

---

*Document created: 2026-04-20*  
*Decision: Supabase-only for MVP*
