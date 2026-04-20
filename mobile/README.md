# XE 247 Mobile App

> React Native app cho XE 247 - Tìm tiệm sửa xe gần bạn

## Tech Stack

- **Framework:** React Native + Expo SDK 54
- **Navigation:** Expo Router v5
- **State:** Zustand
- **Backend:** Supabase
- **Maps:** React Native Maps
- **UI:** Custom components + Ionicons

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
│   │   ├── index.tsx      # Home/Search
│   │   ├── favorites.tsx  # Favorites/Orders
│   │   └── profile.tsx    # Profile
│   ├── (auth)/            # Auth screens
│   │   └── login.tsx      # Phone OTP login
│   └── provider/          # Provider screens
│       └── [id].tsx       # Provider detail
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Base UI components
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
│       ├── theme.ts
│       └── categories.ts
└── assets/               # Images, fonts
```

## Features

### Consumer Mode
- [x] Search nearby providers
- [x] Filter by category
- [x] View provider details
- [x] Save favorites
- [x] Call/Zalo contact
- [x] Get directions
- [ ] Write reviews
- [ ] Search history

### Provider Mode
- [x] Role switching
- [ ] Dashboard
- [ ] Manage shop info
- [ ] View requests
- [ ] Analytics

### Common
- [x] Phone OTP authentication
- [x] Dark mode support
- [x] Location permission handling
- [ ] Push notifications
- [ ] Profile management

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Development

```bash
# iOS simulator
npm run ios

# Android emulator
npm run android

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Build

```bash
# Create native build
npm run prebuild

# Build with EAS (requires eas-cli)
npm run build:ios
npm run build:android
```

## Assets Required

Before building, add these images to `assets/images/`:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

---

Built with Expo + Supabase
