# XE 247 Mobile App

> React Native app cho XE 247 - Tìm dịch vụ xe gần bạn
> 
> **PRD Version:** 2.0 (Unified App)  
> **Last Updated:** 2026-04-22

## Tech Stack

- **Framework:** React Native + Expo SDK 54
- **Navigation:** Expo Router v5
- **State:** Zustand
- **Backend:** Supabase (PostgreSQL + PostGIS)
- **Maps:** React Native Maps
- **UI:** Custom Airbnb-inspired design system
- **Auth:** Google OAuth (via expo-auth-session)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development
npm start
```

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigator (floating pill bar)
│   │   ├── _layout.tsx    # Custom tab bar config
│   │   ├── index.tsx      # Home - Search & Map view
│   │   ├── charging.tsx   # EV Charging stations
│   │   ├── favorites.tsx  # Saved providers
│   │   └── profile.tsx    # Profile & Settings
│   ├── (auth)/            # Auth screens
│   │   └── login.tsx      # Google OAuth login
│   ├── provider/          # Provider screens
│   │   └── [id].tsx       # Provider detail
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Base UI (Button, Input)
│   │   ├── CustomTabBar.tsx    # Floating pill tab bar
│   │   ├── ProviderCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── SearchBar.tsx
│   │   └── RoleSwitcher.tsx
│   ├── stores/           # Zustand stores
│   │   ├── auth.store.ts
│   │   ├── provider.store.ts
│   │   └── favorites.store.ts
│   ├── hooks/            # Custom hooks
│   │   ├── useLocation.ts
│   │   └── useColorScheme.ts
│   ├── lib/              # Utilities
│   │   └── supabase.ts   # AsyncStorage for auth
│   ├── types/            # TypeScript types
│   │   └── database.ts
│   └── constants/        # App constants
│       ├── theme.ts      # Airbnb design system
│       └── categories.ts # 5 main categories
└── assets/               # Images, fonts
```

---

## Trạng thái triển khai vs PRD

> So sánh với [PRD.md](../PRD.md) version 2.0

### ✅ Đã hoàn thành

#### F-C01: Authentication (Partial)
- [x] Google OAuth (đã đơn giản hóa, chỉ Google)
- [x] Chế độ khách (Guest mode)
- [x] Session persist với AsyncStorage
- [x] Auto redirect sau đăng nhập
- [x] Auto-create profile từ Google metadata

#### F-C02: Tìm thợ theo vị trí
- [x] Tìm kiếm providers gần vị trí (geo query)
- [x] Lọc theo 5 danh mục: Sửa chữa, Xưởng dịch vụ, Độ xe, Rửa xe, Cứu hộ
- [x] **Map view** - toggle giữa list và bản đồ
- [x] Pull to refresh
- [x] Auto-detect vị trí ngoài VN → fallback HCM/Hà Nội
- [x] Chuyển đổi giữa HCM và Hà Nội
- [x] Search text filter

#### F-C03: Xem Profile Provider
- [x] Image gallery với pagination
- [x] Thông tin cơ bản (tên, địa chỉ, điện thoại)
- [x] Bản đồ với marker
- [x] Nút "Gọi ngay" và "Zalo"
- [x] Nút chỉ đường (Google Maps/Apple Maps)
- [x] Nút share và favorite
- [x] Hiển thị dịch vụ (nếu có)

#### F-C08: Trạm Sạc Xe Điện
- [x] **Tab riêng cho EV Charging** (tách khỏi Home)
- [x] Map view mặc định với markers
- [x] Quick filters: Tất cả, VinFast, Sạc nhanh
- [x] Station cards với status badges
- [x] EV Green accent color (#00d1b2)
- [x] Khoảng cách và số cổng hiển thị

#### Favorites (P1 - Done early)
- [x] Danh sách providers đã lưu
- [x] Pull to refresh
- [x] Empty state cho guest/chưa đăng nhập
- [x] Supabase favorites table với RLS

#### Provider Card
- [x] Airbnb-style photography-first design
- [x] Hiển thị tên, địa chỉ, rating, category
- [x] Nút yêu thích (heart overlay)
- [x] Badge trạng thái "Đang mở"
- [x] Placeholder images khi không có ảnh

#### Profile Screen
- [x] Hiển thị thông tin user (từ Google)
- [x] Banner "Tạo tài khoản" cho guest
- [x] Menu cài đặt, hỗ trợ, pháp lý
- [x] Đăng xuất
- [x] Role switcher (Consumer ↔ Provider)

#### UI/UX
- [x] **Floating pill tab bar** (liquid glass style)
- [x] Color palette: Rausch Red (#ff385c), Near Black (#222222)
- [x] Typography: Semibold headings, medium body
- [x] Shadows: 3-layer card shadow
- [x] Border radius: 8px buttons, 16px cards
- [x] Dark mode support

#### Database & Backend
- [x] Supabase PostgreSQL với PostGIS
- [x] 1,473 providers từ 35 tỉnh thành
- [x] RPC function `search_nearby_providers`
- [x] Row Level Security (RLS)
- [x] Profiles, Providers, Reviews, Favorites tables
- [x] Categories table với 5 danh mục mới

---

### 🔄 Partially Implemented

#### F-C07: Rating & Review
- [x] Hiển thị rating trong provider card
- [ ] Viết đánh giá (chưa có flow)
- [ ] Upload ảnh đánh giá
- [ ] Xem danh sách đánh giá đầy đủ
- [ ] Quick tags ("Đúng giờ", "Thái độ tốt"...)

#### Provider Mode Switching
- [x] Role switcher UI
- [ ] Full registration flow (F-P01)
- [ ] Provider dashboard

---

### ❌ Chưa triển khai (theo PRD Priority)

#### P0 - Must Have
| Feature | PRD ID | Notes |
|---------|--------|-------|
| SĐT + OTP Authentication | F-C01 | Simplified to Google-only |
| Đặt dịch vụ Cứu hộ | F-C04 | Booking flow chưa có |
| Tracking thợ | F-C05 | Real-time location tracking |
| Thanh toán | F-C06 | MVP should be COD |
| Provider đăng ký | F-P01 | Registration form cần hoàn thiện |
| Provider đăng dịch vụ | F-P02 | Service management |
| Provider nhận/xử lý đơn | F-P03 | Order management |
| Admin duyệt provider | F-A01 | Admin panel |

#### P1 - Should Have
| Feature | PRD ID | Notes |
|---------|--------|-------|
| Real-time tracking (WebSocket) | F-C05 | Polling trước, WebSocket sau |
| Payment online (Momo/VNPay) | F-C06 | Sau COD |
| Push notification | - | Expo Notifications |
| Chat in-app | - | - |
| Provider thống kê | F-P04 | Analytics dashboard |
| Provider ví & rút tiền | F-P05 | Wallet system |

#### P2 - Could Have
| Feature | Notes |
|---------|-------|
| Subscription Provider Pro | - |
| Promoted listing | - |
| Referral program | - |
| Loyalty points | - |
| So sánh giá | - |
| Đặt lịch hẹn trước | - |

---

### 📊 Progress Summary

| Category | Done | Total | % |
|----------|------|-------|---|
| Consumer Screens (PRD) | 11 | 18 | 61% |
| Provider Screens (PRD) | 2 | 12 | 17% |
| Admin Screens (PRD) | 0 | 6 | 0% |
| **Overall** | **13** | **36** | **36%** |

**Next priorities (theo PRD roadmap):**
1. Hoàn thiện Rating flow (F-C07)
2. Provider registration flow (F-P01)
3. Service management (F-P02)
4. Basic booking flow (F-C04) - đơn giản hóa cho MVP

---

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Google OAuth Setup

1. Vào [Supabase Dashboard](https://supabase.com/dashboard) → Authentication → Providers
2. Bật Google provider
3. Tạo OAuth credentials tại [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Thêm redirect URI: `https://[PROJECT_ID].supabase.co/auth/v1/callback`
5. Điền Client ID và Secret vào Supabase
6. Trong app, sử dụng `expo-auth-session` với `expo-web-browser` để handle OAuth flow

**Lưu ý:** Session được lưu trong AsyncStorage (thay vì SecureStore) để tránh lỗi 2KB limit với JWT tokens.

## Development

```bash
# iOS simulator
npm run ios

# Android emulator  
npm run android

# With tunnel (for physical device)
npx expo start --tunnel
```

## Build

```bash
# Create native build
npm run prebuild

# Build with EAS
eas build --platform ios
eas build --platform android
```

---

## Categories (Updated 2026-04-22)

| Key | Name (Vi) | Icon | Color |
|-----|-----------|------|-------|
| `repair` | Sửa chữa | construct | #ff385c |
| `service` | Xưởng dịch vụ | car-sport | #00a699 |
| `tuning` | Độ xe | speedometer | #fc642d |
| `car_wash` | Rửa xe | water | #428bff |
| `rescue` | Cứu hộ | warning | #e00b41 |
| `ev_charging` | Trạm sạc EV | flash | #00d1b2 |

> EV Charging được tách riêng tab, không hiển thị trong category filter ở Home.

---

**Data:** 1,473 providers across 35 Vietnamese provinces  
**Design:** Airbnb-inspired UI/UX with floating pill tab bar  
**Built with:** Expo SDK 54 + Supabase + Google OAuth
