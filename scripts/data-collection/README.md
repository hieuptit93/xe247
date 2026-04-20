# XE 247 - Data Collection Strategy

> **Version:** 2.0  
> **Last Updated:** 2026-04-20  
> **Total Cost:** $0 (100% FREE)

---

## Executive Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     XE 247 DATA COLLECTION STRATEGY                          │
│                           TOTAL COST: $0                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   DATA SOURCES (ALL FREE):                                                  │
│   ════════════════════════                                                  │
│                                                                              │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│   │  OpenStreetMap  │  │   Foursquare    │  │  OpenChargeMap  │            │
│   │     (OSM)       │  │   (Free Tier)   │  │     (OCM)       │            │
│   │                 │  │                 │  │                 │            │
│   │  ~2,000 POIs    │  │  ~1,000 POIs    │  │  ~300 stations  │            │
│   │  No key needed  │  │  99,999/month   │  │  Unlimited      │            │
│   │  $0             │  │  $0             │  │  $0             │            │
│   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘            │
│            │                    │                    │                      │
│            └────────────────────┼────────────────────┘                      │
│                                 │                                           │
│                                 ▼                                           │
│                    ┌─────────────────────────┐                             │
│                    │    MERGE & DEDUPE       │                             │
│                    │    ~3,000+ unique       │                             │
│                    │    providers            │                             │
│                    └────────────┬────────────┘                             │
│                                 │                                           │
│                                 ▼                                           │
│            ┌────────────────────────────────────────────┐                  │
│            │              OUTPUT FILES                   │                  │
│            │  • combined-providers.json                 │                  │
│            │  • import-providers.sql                    │                  │
│            │  • import-supabase.json                    │                  │
│            └────────────────────────────────────────────┘                  │
│                                                                              │
│   COMPARISON:                                                               │
│   ═══════════                                                               │
│   │ Approach              │ Data      │ Cost     │ Time      │            │
│   │───────────────────────│───────────│──────────│───────────│            │
│   │ FREE (OSM+FSQ+OCM)   │ ~3,300    │ $0       │ 30 mins   │            │
│   │ Google Places API     │ ~5,000    │ $115     │ 2 hours   │            │
│   │ Manual Data Entry     │ ~500      │ $500+    │ 2 weeks   │            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Sources Overview

| Source | Cost | Data Type | Coverage | Key Required |
|--------|------|-----------|----------|--------------|
| **OpenStreetMap** | FREE | Repair, Car wash, Parts | ~2,000+ VN | ❌ No |
| **OpenChargeMap** | FREE | EV Charging Stations | ~300+ VN | ✓ Free |
| **Foursquare** | FREE | All categories | ~1,000+ VN | ✓ Free |
| ~~Google Places~~ | ~~$115~~ | ~~All~~ | ~~Not needed~~ | ~~Paid~~ |

**Total Cost: $0** 🎉

## Quick Start

```bash
cd lop247/scripts/data-collection

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run ALL free collectors at once
node collect-all-free.js
```

## API Keys (All FREE)

### 1. OpenStreetMap - NO KEY NEEDED
- 100% free, unlimited
- Legal, open data (ODbL license)

### 2. OpenChargeMap - FREE
1. Đăng ký tại [openchargemap.org/site/develop/api](https://openchargemap.org/site/develop/api)
2. Copy API key vào `.env`

### 3. Foursquare - FREE TIER
1. Đăng ký tại [foursquare.com/developers](https://foursquare.com/developers/signup)
2. Tạo project mới
3. Copy API key vào `.env`
4. Free tier: **99,999 calls/month**

## Usage

```bash
# ═══════════════════════════════════════════════
# RECOMMENDED: Run all free sources at once
# ═══════════════════════════════════════════════
node collect-all-free.js

# ═══════════════════════════════════════════════
# Or run individual collectors
# ═══════════════════════════════════════════════

# OpenStreetMap (no key needed)
node collect-osm-free.js

# OpenChargeMap EV stations
node collect-ev-stations.js

# Foursquare Places
node collect-foursquare-free.js

# ═══════════════════════════════════════════════
# Export to database
# ═══════════════════════════════════════════════
node export-to-supabase.js
```

## Output Files

All data saved to `./output/`:

```
output/
├── combined-providers.json    # All merged data
├── combined-hcm.json          # HCM only
├── combined-hanoi.json        # Hanoi only
├── combined-danang.json       # Da Nang only
│
├── import-providers.sql       # SQL INSERT statements
├── import-providers.csv       # CSV for Excel/Sheets
├── import-supabase.json       # Supabase ready
│
├── osm-all-providers.json     # OpenStreetMap raw
├── fsq-providers-all.json     # Foursquare raw
└── ev-stations-all.json       # EV stations raw
```

## Cost Comparison

| Approach | Providers | EV Stations | Total Cost |
|----------|-----------|-------------|------------|
| **FREE (OSM + FSQ + OCM)** | ~3,000 | ~300 | **$0** |
| Google Places API | ~5,000 | ~200 | ~$115 |
| Manual data entry | ~500 | ~50 | ~$500 (labor) |

## Data Quality

| Source | Phone | Address | Photos | Rating |
|--------|-------|---------|--------|--------|
| OpenStreetMap | 30% | 70% | 10% | ❌ |
| Foursquare | 60% | 90% | 80% | ✓ |
| OpenChargeMap | 40% | 95% | 30% | ✓ |

**Recommendation:** 
- Use merged data từ all 3 sources
- Set `status: 'pending'` và verify manually
- Encourage providers to self-register

---

## Data Growth Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA GROWTH ROADMAP                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: SEED DATA (Week 1-2)                          Target: 3,000 POIs │
│  ═══════════════════════════════                                            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  AUTO-COLLECTION (This script)                                       │   │
│  │  • OpenStreetMap ──────────────────────────────── ~2,000 providers   │   │
│  │  • Foursquare ─────────────────────────────────── ~1,000 providers   │   │
│  │  • OpenChargeMap ──────────────────────────────── ~300 EV stations   │   │
│  │                                                                       │   │
│  │  MANUAL SEED                                                          │   │
│  │  • Team manually add 100 verified top providers                      │   │
│  │  • Focus on Q1, Q3, Q7 HCM + Hoàn Kiếm, Cầu Giấy HN                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  PHASE 2: PROVIDER SELF-REGISTER (Month 1-3)            Target: 5,000 POIs │
│  ══════════════════════════════════════════════                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  INCENTIVES:                                                          │   │
│  │  • "Đăng ký sớm = Featured listing FREE 3 tháng"                     │   │
│  │  • "Hoàn thành profile = Badge 'Verified Provider'"                   │   │
│  │  • Facebook/Zalo group marketing to mechanics                        │   │
│  │                                                                       │   │
│  │  CHANNELS:                                                            │   │
│  │  • Provider App registration flow                                    │   │
│  │  • Landing page: xe247.vn/dang-ky-tho                                │   │
│  │  • QR code flyers at existing shops                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  PHASE 3: USER CONTRIBUTION (Ongoing)                  Target: 10,000 POIs │
│  ══════════════════════════════════════                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  IN-APP FEATURES:                                                     │   │
│  │  • "Thêm tiệm mới" button on search empty state                      │   │
│  │  • "Tiệm này đã đóng cửa?" report option                             │   │
│  │  • "Sửa thông tin" for existing listings                             │   │
│  │                                                                       │   │
│  │  VERIFICATION:                                                        │   │
│  │  • GPS check-in required for "Đã sử dụng" rating                     │   │
│  │  • Photo verification for new submissions                            │   │
│  │  • Admin review queue for flagged entries                            │   │
│  │                                                                       │   │
│  │  REWARDS:                                                             │   │
│  │  • Points for contributions → future discounts                       │   │
│  │  • "Data Contributor" badge on profile                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                              │
│  PROJECTED GROWTH:                                                          │
│                                                                              │
│  Month     │ Seed │ Self-Reg │ User Add │ Total  │ Cost                   │
│  ──────────│──────│──────────│──────────│────────│────────                │
│  Month 0   │ 3,000│    0     │    0     │  3,000 │ $0                     │
│  Month 1   │ 3,000│   500    │   100    │  3,600 │ $0                     │
│  Month 3   │ 3,000│  1,500   │   500    │  5,000 │ $0                     │
│  Month 6   │ 3,000│  3,000   │  1,500   │  7,500 │ $0                     │
│  Month 12  │ 3,000│  5,000   │  3,000   │ 11,000 │ $0                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Scripts Reference

| Script | Source | Key Required | Output |
|--------|--------|--------------|--------|
| `collect-all-free.js` | ALL | Optional | Combined data |
| `collect-osm-free.js` | OpenStreetMap | ❌ No | osm-*.json |
| `collect-foursquare-free.js` | Foursquare | ✓ Free | fsq-*.json |
| `collect-ev-stations.js` | OpenChargeMap | ✓ Free | ev-*.json |
| `export-to-supabase.js` | - | - | DB import |

---

## Data Schema

### Provider
```json
{
  "google_place_id": "ChIJ...",
  "name": "Tiệm Sửa Xe Anh Minh",
  "phone": "0909123456",
  "address": "123 Nguyễn Văn Linh, Q.7, TP.HCM",
  "lat": 10.7321,
  "lng": 106.7215,
  "rating_avg": 4.5,
  "rating_count": 156,
  "working_hours": {...},
  "photos": [...],
  "categories": ["repair", "maintenance"],
  "city": "hcm",
  "district": "quan7",
  "status": "pending"
}
```

### EV Station
```json
{
  "ocm_id": "123456",
  "name": "VinFast Charging Station",
  "operator": "VinFast",
  "address": "...",
  "lat": 10.7321,
  "lng": 106.7215,
  "chargers": [
    {"type": "CCS2", "power_kw": 60, "quantity": 2},
    {"type": "Type2", "power_kw": 22, "quantity": 4}
  ],
  "amenities": ["parking", "cafe"],
  "status": "active"
}
```
