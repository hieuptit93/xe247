# XE 247 Mobile App

> React Native app cho XE 247 - Tìm dịch vụ xe gần bạn

## Tech Stack

- **Framework:** React Native + Expo SDK 54
- **Navigation:** Expo Router v5
- **State:** Zustand
- **Backend:** Supabase (PostgreSQL + PostGIS)
- **Maps:** React Native Maps
- **UI:** Custom Airbnb-inspired design system
- **Auth:** Email/Password + Google OAuth

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
│   ├── (tabs)/            # Tab navigator
│   │   ├── _layout.tsx    # Tab bar config
│   │   ├── index.tsx      # Home/Search
│   │   ├── favorites.tsx  # Favorites
│   │   └── profile.tsx    # Profile
│   ├── (auth)/            # Auth screens
│   │   └── login.tsx      # Email/Google login
│   ├── provider/          # Provider screens
│   │   └── [id].tsx       # Provider detail
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Base UI (Button, Input)
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
│   │   └── supabase.ts
│   ├── types/            # TypeScript types
│   │   └── database.ts
│   └── constants/        # App constants
│       ├── theme.ts      # Airbnb design system
│       └── categories.ts
└── assets/               # Images, fonts
```

---

## Trạng thái triển khai

### ✅ Đã hoàn thành

#### Authentication
- [x] Email/Password đăng nhập & đăng ký
- [x] Google OAuth (cần cấu hình Supabase)
- [x] Chế độ khách (Guest mode)
- [x] Màn hình đăng nhập hiển thị lần đầu mở app
- [x] Lưu session với SecureStore
- [x] Auto redirect sau đăng nhập

#### Home Screen (Consumer)
- [x] Tìm kiếm providers gần vị trí
- [x] Lọc theo danh mục (Sửa chữa, Rửa xe, Phụ tùng, Sạc EV)
- [x] Pull to refresh
- [x] Auto-detect vị trí ngoài Việt Nam → fallback HCM/Hà Nội
- [x] Chuyển đổi giữa HCM và Hà Nội
- [x] Search text filter

#### Provider Card
- [x] Airbnb-style photography-first design
- [x] Hiển thị tên, địa chỉ, rating, category
- [x] Nút yêu thích (heart overlay)
- [x] Badge trạng thái "Đang mở"
- [x] Placeholder images khi không có ảnh

#### Provider Detail
- [x] Image gallery với pagination
- [x] Thông tin cơ bản (tên, địa chỉ, điện thoại)
- [x] Bản đồ với marker
- [x] Nút "Gọi ngay" và "Zalo"
- [x] Nút chỉ đường (Google Maps/Apple Maps)
- [x] Nút share và favorite
- [x] Hiển thị dịch vụ (nếu có)

#### Favorites Screen
- [x] Danh sách providers đã lưu
- [x] Pull to refresh
- [x] Empty state cho guest/chưa đăng nhập
- [x] Prompt đăng ký cho guest

#### Profile Screen
- [x] Hiển thị thông tin user
- [x] Banner "Tạo tài khoản" cho guest
- [x] Menu cài đặt, hỗ trợ, pháp lý
- [x] Đăng xuất
- [x] Role switcher (Consumer ↔ Provider)

#### Design System (Airbnb-inspired)
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

---

### 🔄 Đang phát triển / Chưa hoàn thành

#### Authentication
- [ ] Quên mật khẩu / Reset password
- [ ] Xác thực email (email confirmation)
- [ ] Đăng nhập bằng Apple ID
- [ ] Đăng nhập bằng Facebook

#### Home Screen
- [ ] Bộ lọc nâng cao (khoảng cách, rating, giờ mở cửa)
- [ ] Sắp xếp kết quả (gần nhất, rating cao nhất)
- [ ] Map view (xem trên bản đồ)
- [ ] Search suggestions / Autocomplete

#### Provider Detail
- [ ] Image gallery fullscreen zoom
- [ ] Giờ mở cửa chi tiết
- [ ] Đánh giá & bình luận
- [ ] Chia sẻ lên social

#### Reviews
- [ ] Viết đánh giá
- [ ] Upload ảnh đánh giá
- [ ] Xem danh sách đánh giá
- [ ] Lọc/sắp xếp đánh giá

#### Profile
- [ ] Chỉnh sửa thông tin cá nhân
- [ ] Upload avatar
- [ ] Quản lý xe của tôi
- [ ] Lịch sử ghé thăm
- [ ] Đánh giá của tôi
- [ ] Cài đặt thông báo

#### Provider Mode (Chủ tiệm)
- [ ] Dashboard thống kê
- [ ] Quản lý thông tin tiệm
- [ ] Upload ảnh tiệm
- [ ] Cập nhật giờ mở cửa
- [ ] Quản lý dịch vụ
- [ ] Xem & trả lời đánh giá
- [ ] Thông báo đơn hàng mới

#### Notifications
- [ ] Push notifications (Expo Notifications)
- [ ] In-app notifications
- [ ] Badge count

#### Other
- [ ] Offline mode / Caching
- [ ] Deep linking
- [ ] Analytics (Mixpanel/Amplitude)
- [ ] Error tracking (Sentry)
- [ ] Đa ngôn ngữ (i18n)
- [ ] Accessibility (a11y)

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

**Data:** 1,473 providers across 35 Vietnamese provinces  
**Design:** Airbnb-inspired UI/UX  
**Built with:** Expo + Supabase
