# XE 247 - High-Level Design Document (HLD)

> **Version:** 1.0  
> **Last Updated:** 2026-04-20  
> **Author:** Dương Quá - Tech Lead  
> **Status:** Draft  
> **Document Type:** Technical Architecture Specification

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Context](#2-system-context)
3. [Architecture Overview](#3-architecture-overview)
4. [Component Architecture](#4-component-architecture)
5. [Data Architecture](#5-data-architecture)
6. [API Design](#6-api-design)
7. [Security Architecture](#7-security-architecture)
8. [Infrastructure & Deployment](#8-infrastructure--deployment)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Technology Decisions](#10-technology-decisions)
11. [Implementation Roadmap](#11-implementation-roadmap)

---

## 1. Executive Summary

### 1.1 Purpose

This document provides the technical architecture specification for **XE 247** - a unified mobile marketplace platform connecting vehicle owners with all automotive services in Vietnam.

### 1.2 Scope

| In Scope | Out of Scope |
|----------|--------------|
| Mobile App (Unified Consumer + Provider) | Payment Gateway Integration (Phase 2) |
| Admin Web Dashboard | Real-time Order Tracking (Phase 2) |
| Backend API Services | B2B Fleet Management |
| EV Charging Station Module | Multi-language Support |
| Rating & Review System | Marketplace for Parts |

### 1.3 Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Unified App** (Single app for Consumer + Provider) | Reduced maintenance, shared auth, flexible user roles |
| **Contact-based Model** (No in-app transactions) | Faster MVP, higher trust, less support burden |
| **Mobile-First** | Target users primarily on mobile |
| **Serverless-Ready Architecture** | Cost-effective scaling for startup |

### 1.4 System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           XE 247 SYSTEM OVERVIEW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                         ┌─────────────────────┐                             │
│                         │   UNIFIED MOBILE    │                             │
│                         │       APP           │                             │
│                         │  ┌───────────────┐  │                             │
│                         │  │ Consumer Mode │  │                             │
│                         │  │    ◄────►     │  │                             │
│                         │  │ Provider Mode │  │                             │
│                         │  └───────────────┘  │                             │
│                         └──────────┬──────────┘                             │
│                                    │                                         │
│          ┌─────────────────────────┼─────────────────────────┐              │
│          │                         │                         │              │
│          ▼                         ▼                         ▼              │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐        │
│  │  Admin Web   │         │  API Gateway │         │   CDN/Media  │        │
│  │  Dashboard   │         │   (REST)     │         │    Storage   │        │
│  └──────────────┘         └──────┬───────┘         └──────────────┘        │
│                                  │                                          │
│          ┌───────────────────────┼───────────────────────┐                 │
│          │                       │                       │                 │
│          ▼                       ▼                       ▼                 │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐           │
│  │    Auth      │       │   Business   │       │   Search &   │           │
│  │   Service    │       │    Logic     │       │    Geo       │           │
│  └──────────────┘       └──────────────┘       └──────────────┘           │
│                                  │                                          │
│                                  ▼                                          │
│                         ┌──────────────┐                                   │
│                         │  PostgreSQL  │                                   │
│                         │  + PostGIS   │                                   │
│                         │  + Redis     │                                   │
│                         └──────────────┘                                   │
│                                                                              │
│  ════════════════════════════════════════════════════════════════          │
│  EXTERNAL INTEGRATIONS:                                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                   │
│  │Firebase│ │ Google │ │ Zalo   │ │ Deep   │ │ Push   │                   │
│  │ Auth   │ │ Maps   │ │ API    │ │ Links  │ │ Notif  │                   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. System Context

### 2.1 Context Diagram (C4 Level 1)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SYSTEM CONTEXT DIAGRAM (C4-L1)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌──────────────┐                              ┌──────────────┐           │
│    │   Consumer   │                              │   Provider   │           │
│    │    User      │                              │    User      │           │
│    │  (Chủ xe)    │                              │ (Thợ/Xưởng)  │           │
│    └──────┬───────┘                              └──────┬───────┘           │
│           │                                             │                   │
│           │  Tìm dịch vụ, liên hệ, đánh giá            │  Đăng ký, quản lý │
│           │                                             │  dịch vụ          │
│           │         ┌─────────────────────┐             │                   │
│           └────────▶│                     │◄────────────┘                   │
│                     │      XE 247         │                                 │
│                     │      SYSTEM         │                                 │
│           ┌────────▶│                     │◄────────────┐                   │
│           │         └─────────────────────┘             │                   │
│           │                    │                        │                   │
│    ┌──────┴───────┐           │                 ┌──────┴───────┐           │
│    │   System     │           │                 │    Admin     │           │
│    │   Admin      │           │                 │    Staff     │           │
│    └──────────────┘           │                 └──────────────┘           │
│                               │                                             │
│                               ▼                                             │
│         ┌─────────────────────────────────────────────────────┐            │
│         │              EXTERNAL SYSTEMS                        │            │
│         │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │            │
│         │  │Firebase │ │ Google  │ │  Zalo   │ │ Apple   │   │            │
│         │  │  Auth   │ │  Maps   │ │  OAuth  │ │ SignIn  │   │            │
│         │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │            │
│         └─────────────────────────────────────────────────────┘            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Actor Definitions

| Actor | Description | Primary Interactions |
|-------|-------------|---------------------|
| **Consumer User** | Vehicle owner seeking services | Search, View, Contact, Rate |
| **Provider User** | Service provider (mechanic, shop, charging station) | Register, Manage services, View analytics |
| **Admin Staff** | Platform operators | Approve providers, Manage categories, Handle reports |
| **System Admin** | Technical administrators | System configuration, Monitoring |

### 2.3 Use Case Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USE CASE OVERVIEW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CONSUMER MODE:                    PROVIDER MODE:                           │
│  ───────────────                   ──────────────                           │
│  UC-C01: Register/Login            UC-P01: Register as Provider             │
│  UC-C02: Browse Categories         UC-P02: Setup Contact Info               │
│  UC-C03: Search Providers          UC-P03: Add/Edit Services                │
│  UC-C04: View Provider Profile     UC-P04: Manage Profile                   │
│  UC-C05: Contact Provider          UC-P05: View Analytics                   │
│  UC-C06: Navigate to Shop          UC-P06: Reply to Reviews                 │
│  UC-C07: Rate & Review             UC-P07: Manage EV Station (if applicable)│
│  UC-C08: Find EV Charging          │                                        │
│  UC-C09: Save Favorites            │                                        │
│                                                                              │
│  ADMIN:                                                                      │
│  ──────                                                                      │
│  UC-A01: Approve/Reject Providers                                           │
│  UC-A02: Manage Categories                                                  │
│  UC-A03: Handle Reports                                                     │
│  UC-A04: View Platform Analytics                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Architecture Overview

### 3.1 Architecture Style

**Modular Monolith → Microservices-Ready**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ARCHITECTURE EVOLUTION PATH                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1 (MVP)              PHASE 2                    PHASE 3              │
│  ─────────────              ───────                    ───────              │
│                                                                              │
│  ┌─────────────┐        ┌─────────────┐          ┌─────────────┐           │
│  │   Modular   │        │   Modular   │          │  Micro-     │           │
│  │   Monolith  │───────▶│   Monolith  │─────────▶│  services   │           │
│  │             │        │   + Queue   │          │             │           │
│  └─────────────┘        └─────────────┘          └─────────────┘           │
│                                                                              │
│  Single Codebase         Add Message Queue        Extract Services          │
│  Clean Boundaries        Async Processing         Event-Driven              │
│  Shared DB               Background Jobs          Service Mesh              │
│                                                                              │
│  Effort: 6-8 weeks       Effort: +2 weeks         Effort: +4-6 weeks       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Container Diagram (C4 Level 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CONTAINER DIAGRAM (C4-L2)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                     ┌─────────────────────────────────────┐                 │
│                     │         PRESENTATION LAYER          │                 │
│  ┌──────────────────┼─────────────────────────────────────┼────────────┐   │
│  │                  │                                     │            │   │
│  │  ┌───────────────▼───────────────┐    ┌───────────────▼─────────┐  │   │
│  │  │      UNIFIED MOBILE APP       │    │      ADMIN WEB APP      │  │   │
│  │  │       (React Native)          │    │        (React)          │  │   │
│  │  │                               │    │                         │  │   │
│  │  │  ┌─────────┐  ┌─────────┐    │    │  Dashboard  │  Approvals │  │   │
│  │  │  │Consumer │  │Provider │    │    │  Categories │  Reports   │  │   │
│  │  │  │  Mode   │  │  Mode   │    │    │                         │  │   │
│  │  │  └─────────┘  └─────────┘    │    └─────────────────────────┘  │   │
│  │  │                               │                                 │   │
│  │  │  Shared: Auth, Navigation,   │                                 │   │
│  │  │  Components, State           │                                 │   │
│  │  └───────────────────────────────┘                                 │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                    │                                       │
│                                    │ HTTPS/REST                            │
│                                    ▼                                       │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                         API LAYER                                   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    API GATEWAY                                │  │   │
│  │  │         (Node.js + Express / Fastify)                        │  │   │
│  │  │  ┌──────────────────────────────────────────────────────┐   │  │   │
│  │  │  │  Rate Limiting  │  Auth Middleware  │  Request Log   │   │  │   │
│  │  │  └──────────────────────────────────────────────────────┘   │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                    │                                       │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                      BUSINESS LOGIC LAYER                           │   │
│  │                                                                     │   │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│   │
│  │   │   Auth   │ │ Provider │ │  Search  │ │  Review  │ │    EV    ││   │
│  │   │  Module  │ │  Module  │ │  Module  │ │  Module  │ │  Module  ││   │
│  │   └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘│   │
│  │                                                                     │   │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │   │
│  │   │ Contact  │ │  Admin   │ │Analytics │ │  Notif   │             │   │
│  │   │  Module  │ │  Module  │ │  Module  │ │  Module  │             │   │
│  │   └──────────┘ └──────────┘ └──────────┘ └──────────┘             │   │
│  │                                                                     │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                    │                                       │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                        DATA LAYER                                   │   │
│  │                                                                     │   │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │   │
│  │   │  PostgreSQL  │  │    Redis     │  │  S3/MinIO    │            │   │
│  │   │  + PostGIS   │  │   (Cache)    │  │   (Media)    │            │   │
│  │   └──────────────┘  └──────────────┘  └──────────────┘            │   │
│  │                                                                     │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Unified App Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     UNIFIED APP - MODE SWITCHING                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                        XE 247 APP                                   │    │
│  │                                                                     │    │
│  │   ┌─────────────────────────────────────────────────────────────┐  │    │
│  │   │                     SHARED LAYER                             │  │    │
│  │   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │  │    │
│  │   │  │  Auth   │ │  State  │ │   UI    │ │  API    │           │  │    │
│  │   │  │ Context │ │  Store  │ │ Library │ │ Client  │           │  │    │
│  │   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │  │    │
│  │   └─────────────────────────────────────────────────────────────┘  │    │
│  │                              │                                      │    │
│  │              ┌───────────────┴───────────────┐                     │    │
│  │              │        MODE SWITCH            │                     │    │
│  │              │   ┌─────────────────────┐    │                     │    │
│  │              │   │  👤 Consumer Mode   │    │                     │    │
│  │              │   │        ◄──►         │    │                     │    │
│  │              │   │  🔧 Provider Mode   │    │                     │    │
│  │              │   └─────────────────────┘    │                     │    │
│  │              └───────────────┬───────────────┘                     │    │
│  │                              │                                      │    │
│  │   ┌──────────────────────────┴──────────────────────────┐         │    │
│  │   │                                                      │         │    │
│  │   ▼                                                      ▼         │    │
│  │   ┌─────────────────────────────┐  ┌─────────────────────────────┐│    │
│  │   │      CONSUMER MODE          │  │      PROVIDER MODE          ││    │
│  │   │                             │  │                             ││    │
│  │   │  📱 Screens:                │  │  📱 Screens:                ││    │
│  │   │  • Home (Categories)       │  │  • Dashboard                ││    │
│  │   │  • Search                  │  │  • Profile Management       ││    │
│  │   │  • Provider List           │  │  • Service Management       ││    │
│  │   │  • Provider Profile        │  │  • Reviews                  ││    │
│  │   │  • EV Charging Map         │  │  • Analytics                ││    │
│  │   │  • Favorites               │  │  • EV Station Manage        ││    │
│  │   │  • Rating                  │  │  • Settings                 ││    │
│  │   │  • Profile                 │  │                             ││    │
│  │   │                             │  │                             ││    │
│  │   │  🔗 Navigation:             │  │  🔗 Navigation:             ││    │
│  │   │  Home | Search | EV | Me   │  │  Dashboard | Services | Me  ││    │
│  │   │                             │  │                             ││    │
│  │   └─────────────────────────────┘  └─────────────────────────────┘│    │
│  │                                                                     │    │
│  │   ═══════════════════════════════════════════════════════════════  │    │
│  │   SWITCH TRIGGER:                                                   │    │
│  │   • Profile Screen → "Chuyển sang Provider" button                 │    │
│  │   • Provider needs to complete registration first                  │    │
│  │   • Mode persists in AsyncStorage                                  │    │
│  │   ═══════════════════════════════════════════════════════════════  │    │
│  │                                                                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Architecture

### 4.1 Mobile App Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MOBILE APP COMPONENT ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                         APP ENTRY                                   │    │
│  │  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  │  App.tsx → AuthProvider → ModeProvider → NavigationContainer │  │    │
│  │  └──────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                      NAVIGATION LAYER                               │    │
│  │                                                                     │    │
│  │  ┌─────────────────┐              ┌─────────────────┐             │    │
│  │  │ ConsumerStack   │              │ ProviderStack   │             │    │
│  │  │ ┌─────────────┐ │              │ ┌─────────────┐ │             │    │
│  │  │ │ HomeTab     │ │              │ │ DashboardTab│ │             │    │
│  │  │ │ SearchTab   │ │              │ │ ServicesTab │ │             │    │
│  │  │ │ EVTab       │ │              │ │ ProfileTab  │ │             │    │
│  │  │ │ ProfileTab  │ │              │ └─────────────┘ │             │    │
│  │  │ └─────────────┘ │              └─────────────────┘             │    │
│  │  └─────────────────┘                                               │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                       STATE MANAGEMENT                              │    │
│  │                                                                     │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │    │
│  │  │ AuthStore   │ │ UserStore   │ │ProviderStore│ │ UIStore     │  │    │
│  │  │ ─────────── │ │ ─────────── │ │ ─────────── │ │ ─────────── │  │    │
│  │  │ • user      │ │ • profile   │ │ • services  │ │ • mode      │  │    │
│  │  │ • token     │ │ • favorites │ │ • stats     │ │ • loading   │  │    │
│  │  │ • isAuth    │ │ • recent    │ │ • reviews   │ │ • theme     │  │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │    │
│  │                                                                     │    │
│  │  State Library: Zustand (lightweight, simple API)                  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                         API LAYER                                   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │                   API CLIENT (Axios)                         │   │    │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │   │    │
│  │  │  │ Interceptors│ │  Retry     │ │  Token      │           │   │    │
│  │  │  │ (Auth, Log) │ │  Logic     │ │  Refresh    │           │   │    │
│  │  │  └─────────────┘ └─────────────┘ └─────────────┘           │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐         │    │
│  │  │ AuthAPI   │ │ProviderAPI│ │ SearchAPI │ │ ReviewAPI │         │    │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘         │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐                       │    │
│  │  │ EVAPI     │ │ ContactAPI│ │ AdminAPI  │                       │    │
│  │  └───────────┘ └───────────┘ └───────────┘                       │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                       SHARED COMPONENTS                             │    │
│  │                                                                     │    │
│  │  ┌────────────────────────────────────────────────────────────┐    │    │
│  │  │                    UI COMPONENTS                            │    │    │
│  │  │  Button | Input | Card | Modal | BottomSheet | Toast       │    │    │
│  │  │  Avatar | Badge | Rating | Tag | Skeleton | EmptyState     │    │    │
│  │  └────────────────────────────────────────────────────────────┘    │    │
│  │                                                                     │    │
│  │  ┌────────────────────────────────────────────────────────────┐    │    │
│  │  │                  FEATURE COMPONENTS                         │    │    │
│  │  │  ProviderCard | ServiceItem | ReviewItem | ContactBar      │    │    │
│  │  │  CategoryGrid | MapView | SearchBar | FilterSheet          │    │    │
│  │  │  EVStationCard | ChargingPortItem | RatingForm             │    │    │
│  │  └────────────────────────────────────────────────────────────┘    │    │
│  │                                                                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Backend Module Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND MODULE ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  src/                                                                        │
│  ├── modules/                                                                │
│  │   ├── auth/                    ← Authentication & Authorization          │
│  │   │   ├── auth.controller.ts                                             │
│  │   │   ├── auth.service.ts                                                │
│  │   │   ├── auth.middleware.ts                                             │
│  │   │   ├── strategies/                                                    │
│  │   │   │   ├── jwt.strategy.ts                                           │
│  │   │   │   ├── firebase.strategy.ts                                      │
│  │   │   │   └── otp.strategy.ts                                           │
│  │   │   └── dto/                                                           │
│  │   │                                                                       │
│  │   ├── user/                    ← User Management                         │
│  │   │   ├── user.controller.ts                                             │
│  │   │   ├── user.service.ts                                                │
│  │   │   ├── user.entity.ts                                                 │
│  │   │   └── user.repository.ts                                             │
│  │   │                                                                       │
│  │   ├── provider/                ← Provider/Service Management             │
│  │   │   ├── provider.controller.ts                                         │
│  │   │   ├── provider.service.ts                                            │
│  │   │   ├── service.controller.ts                                          │
│  │   │   ├── service.service.ts                                             │
│  │   │   ├── entities/                                                      │
│  │   │   │   ├── provider.entity.ts                                        │
│  │   │   │   ├── service.entity.ts                                         │
│  │   │   │   └── category.entity.ts                                        │
│  │   │   └── dto/                                                           │
│  │   │                                                                       │
│  │   ├── search/                  ← Search & Geo Queries                    │
│  │   │   ├── search.controller.ts                                           │
│  │   │   ├── search.service.ts                                              │
│  │   │   └── geo.utils.ts                                                   │
│  │   │                                                                       │
│  │   ├── review/                  ← Rating & Review System                  │
│  │   │   ├── review.controller.ts                                           │
│  │   │   ├── review.service.ts                                              │
│  │   │   └── entities/                                                      │
│  │   │                                                                       │
│  │   ├── contact/                 ← Contact Event Tracking                  │
│  │   │   ├── contact.controller.ts                                          │
│  │   │   ├── contact.service.ts                                             │
│  │   │   └── contact.entity.ts                                              │
│  │   │                                                                       │
│  │   ├── ev/                      ← EV Charging Stations                    │
│  │   │   ├── station.controller.ts                                          │
│  │   │   ├── station.service.ts                                             │
│  │   │   ├── port.service.ts                                                │
│  │   │   └── entities/                                                      │
│  │   │                                                                       │
│  │   ├── notification/            ← Push Notifications                      │
│  │   │   ├── notification.service.ts                                        │
│  │   │   └── fcm.provider.ts                                                │
│  │   │                                                                       │
│  │   ├── admin/                   ← Admin Operations                        │
│  │   │   ├── admin.controller.ts                                            │
│  │   │   ├── approval.service.ts                                            │
│  │   │   └── report.service.ts                                              │
│  │   │                                                                       │
│  │   └── analytics/               ← Analytics & Reporting                   │
│  │       ├── analytics.controller.ts                                        │
│  │       └── analytics.service.ts                                           │
│  │                                                                           │
│  ├── common/                      ← Shared Utilities                        │
│  │   ├── decorators/                                                        │
│  │   ├── filters/                                                           │
│  │   ├── guards/                                                            │
│  │   ├── interceptors/                                                      │
│  │   └── pipes/                                                             │
│  │                                                                           │
│  ├── config/                      ← Configuration                           │
│  │   ├── database.config.ts                                                 │
│  │   ├── firebase.config.ts                                                 │
│  │   └── app.config.ts                                                      │
│  │                                                                           │
│  └── main.ts                      ← Application Entry                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Architecture

### 5.1 Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ENTITY RELATIONSHIP DIAGRAM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐                    ┌─────────────────┐                 │
│  │     USERS       │                    │   CATEGORIES    │                 │
│  │─────────────────│                    │─────────────────│                 │
│  │ PK id           │                    │ PK id           │                 │
│  │    phone        │                    │ FK parent_id    │                 │
│  │    name         │                    │    name         │                 │
│  │    email        │                    │    slug         │                 │
│  │    avatar_url   │                    │    icon         │                 │
│  │    role         │──────┐             │    sort_order   │                 │
│  │    created_at   │      │             │    is_active    │                 │
│  └─────────────────┘      │             └────────┬────────┘                 │
│         │                 │                      │                          │
│         │ 1               │ 1                    │ 1                        │
│         │                 │                      │                          │
│         │ N               │                      │ N                        │
│         ▼                 │                      ▼                          │
│  ┌─────────────────┐      │             ┌─────────────────┐                 │
│  │   PROVIDERS     │◄─────┘             │    SERVICES     │                 │
│  │─────────────────│                    │─────────────────│                 │
│  │ PK id           │                    │ PK id           │                 │
│  │ FK user_id      │──────────────────┐ │ FK provider_id  │◄────────┐      │
│  │    name         │                  │ │ FK category_id  │─────────┘      │
│  │    phone        │                  │ │    name         │                 │
│  │    zalo_id      │                  │ │    price        │                 │
│  │    facebook_url │                  │ │    price_type   │                 │
│  │    address      │                  │ │    description  │                 │
│  │    lat          │                  │ │    vehicle_types│                 │
│  │    lng          │                  │ │    is_active    │                 │
│  │    working_hours│                  │ └─────────────────┘                 │
│  │    images[]     │                  │                                     │
│  │    rating_avg   │                  │                                     │
│  │    rating_count │                  │                                     │
│  │    status       │                  │                                     │
│  │    provider_type│                  │                                     │
│  └────────┬────────┘                  │                                     │
│           │                           │                                     │
│           │ 1                         │                                     │
│           │                           │                                     │
│           │ N                         │                                     │
│           ▼                           │                                     │
│  ┌─────────────────┐                  │                                     │
│  │ CONTACT_EVENTS  │                  │                                     │
│  │─────────────────│                  │                                     │
│  │ PK id           │                  │                                     │
│  │ FK user_id      │◄─────────────────┼──────────────────────────┐         │
│  │ FK provider_id  │                  │                          │         │
│  │    contact_type │                  │                          │         │
│  │    created_at   │                  │                          │         │
│  │    rating_requested│               │                          │         │
│  │    rating_submitted│               │                          │         │
│  └────────┬────────┘                  │                          │         │
│           │                           │                          │         │
│           │ 1                         │                          │         │
│           │                           │                          │         │
│           │ 0..1                      │                          │         │
│           ▼                           │                          │         │
│  ┌─────────────────┐                  │                          │         │
│  │    REVIEWS      │                  │                          │         │
│  │─────────────────│                  │                          │         │
│  │ PK id           │                  │                          │         │
│  │ FK provider_id  │◄─────────────────┘                          │         │
│  │ FK user_id      │◄────────────────────────────────────────────┘         │
│  │ FK contact_event_id│                                                     │
│  │    rating       │                                                        │
│  │    tags[]       │                                                        │
│  │    comment      │                                                        │
│  │    images[]     │                                                        │
│  │    provider_reply│                                                       │
│  │    created_at   │                                                        │
│  └─────────────────┘                                                        │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│                          EV CHARGING DOMAIN                                  │
│  ═══════════════════════════════════════════════════════════════════════    │
│                                                                              │
│  ┌─────────────────┐                    ┌─────────────────┐                 │
│  │CHARGING_STATIONS│                    │ CHARGING_PORTS  │                 │
│  │─────────────────│                    │─────────────────│                 │
│  │ PK id           │                    │ PK id           │                 │
│  │ FK provider_id  │                    │ FK station_id   │◄────────┐      │
│  │    name         │────────────────────│    port_number  │         │      │
│  │    address      │        1           │    connector_type│         │      │
│  │    lat, lng     │                    │    power_kw     │         │      │
│  │    station_type │        N           │    current_type │         │      │
│  │    operator     │                    │    price_per_kwh│         │      │
│  │    working_hours│                    │    status       │         │      │
│  │    amenities[]  │                    │    vehicle_types│         │      │
│  │    images[]     │                    └─────────────────┘         │      │
│  │    rating_avg   │                                                │      │
│  │    is_verified  │                    ┌─────────────────┐         │      │
│  └─────────────────┘                    │CHARGING_REVIEWS │         │      │
│                                         │─────────────────│         │      │
│                                         │ PK id           │         │      │
│                                         │ FK station_id   │─────────┘      │
│                                         │ FK user_id      │                 │
│                                         │    rating       │                 │
│                                         │    comment      │                 │
│                                         │    wait_time    │                 │
│                                         └─────────────────┘                 │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│                          USER PREFERENCES                                    │
│  ═══════════════════════════════════════════════════════════════════════    │
│                                                                              │
│  ┌─────────────────┐                    ┌─────────────────┐                 │
│  │   FAVORITES     │                    │  RECENT_VIEWS   │                 │
│  │─────────────────│                    │─────────────────│                 │
│  │ PK id           │                    │ PK id           │                 │
│  │ FK user_id      │                    │ FK user_id      │                 │
│  │ FK provider_id  │                    │ FK provider_id  │                 │
│  │    created_at   │                    │    viewed_at    │                 │
│  └─────────────────┘                    └─────────────────┘                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Database Schema (SQL)

```sql
-- =============================================================================
-- XE 247 DATABASE SCHEMA
-- Version: 1.0
-- Database: PostgreSQL 15+ with PostGIS
-- =============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM ('consumer', 'provider', 'admin');
CREATE TYPE provider_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
CREATE TYPE provider_type AS ENUM ('individual', 'shop', 'garage', 'chain', 'charging_station');
CREATE TYPE price_type AS ENUM ('fixed', 'from', 'range', 'contact');
CREATE TYPE contact_type AS ENUM ('call', 'zalo', 'facebook', 'navigate');
CREATE TYPE connector_type AS ENUM ('CCS2', 'CHAdeMO', 'Type2', 'GBT', 'Tesla');
CREATE TYPE port_status AS ENUM ('available', 'charging', 'maintenance', 'offline');
CREATE TYPE station_type AS ENUM ('public', 'private', 'business');

-- =============================================================================
-- CORE TABLES
-- =============================================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone           VARCHAR(20) UNIQUE NOT NULL,
    name            VARCHAR(100),
    email           VARCHAR(255) UNIQUE,
    avatar_url      TEXT,
    role            user_role DEFAULT 'consumer',
    firebase_uid    VARCHAR(128) UNIQUE,
    
    -- Metadata
    last_login_at   TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id       UUID REFERENCES categories(id),
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    icon            VARCHAR(50),
    description     TEXT,
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE providers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    
    -- Basic Info
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    provider_type   provider_type NOT NULL,
    
    -- Contact Info
    phone           VARCHAR(20) NOT NULL,
    zalo_id         VARCHAR(50),
    facebook_url    TEXT,
    
    -- Location
    address         TEXT NOT NULL,
    location        GEOGRAPHY(POINT, 4326) NOT NULL,
    
    -- Business Info
    working_hours   JSONB,  -- {"mon": {"open": "06:00", "close": "22:00"}, ...}
    images          TEXT[], -- Array of image URLs
    
    -- Stats
    rating_avg      DECIMAL(2,1) DEFAULT 0,
    rating_count    INT DEFAULT 0,
    view_count      INT DEFAULT 0,
    contact_count   INT DEFAULT 0,
    
    -- Status
    status          provider_status DEFAULT 'pending',
    rejection_reason TEXT,
    verified_at     TIMESTAMP,
    
    -- Metadata
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE provider_categories (
    provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (provider_id, category_id)
);

CREATE TABLE services (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    category_id     UUID REFERENCES categories(id),
    
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    price           DECIMAL(12,0),
    price_max       DECIMAL(12,0),
    price_type      price_type DEFAULT 'fixed',
    duration_mins   INT,
    vehicle_types   VARCHAR(50)[], -- ['xe_may', 'oto']
    
    is_active       BOOLEAN DEFAULT true,
    sort_order      INT DEFAULT 0,
    
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- CONTACT & REVIEW TABLES
-- =============================================================================

CREATE TABLE contact_events (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID REFERENCES users(id),
    provider_id         UUID NOT NULL REFERENCES providers(id),
    
    contact_type        contact_type NOT NULL,
    contact_value       VARCHAR(255), -- Phone number or URL used
    
    -- Rating flow tracking
    rating_requested_at TIMESTAMP,
    rating_submitted_at TIMESTAMP,
    rating_dismissed    BOOLEAN DEFAULT false,
    
    created_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id         UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id),
    contact_event_id    UUID REFERENCES contact_events(id),
    
    rating              SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    tags                VARCHAR(50)[], -- ['dung_gio', 'than_thien', 'gia_hop_ly']
    comment             TEXT,
    images              TEXT[],
    
    -- Provider response
    provider_reply      TEXT,
    replied_at          TIMESTAMP,
    
    -- Moderation
    is_visible          BOOLEAN DEFAULT true,
    reported            BOOLEAN DEFAULT false,
    
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- EV CHARGING TABLES
-- =============================================================================

CREATE TABLE charging_stations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id     UUID REFERENCES providers(id),
    
    name            VARCHAR(200) NOT NULL,
    address         TEXT NOT NULL,
    location        GEOGRAPHY(POINT, 4326) NOT NULL,
    
    station_type    station_type NOT NULL,
    operator        VARCHAR(100), -- VinFast, EVN, Private, etc.
    working_hours   JSONB,
    amenities       VARCHAR(50)[], -- ['parking', 'cafe', 'wc', 'wifi']
    images          TEXT[],
    
    total_ports     INT DEFAULT 0,
    rating_avg      DECIMAL(2,1) DEFAULT 0,
    rating_count    INT DEFAULT 0,
    
    is_verified     BOOLEAN DEFAULT false,
    
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE charging_ports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id      UUID NOT NULL REFERENCES charging_stations(id) ON DELETE CASCADE,
    
    port_number     VARCHAR(10) NOT NULL,
    connector_type  connector_type NOT NULL,
    power_kw        DECIMAL(6,1) NOT NULL,
    current_type    VARCHAR(2) NOT NULL, -- AC or DC
    
    price_per_kwh   DECIMAL(10,0),
    price_per_min   DECIMAL(10,0),
    is_free         BOOLEAN DEFAULT false,
    
    vehicle_types   VARCHAR(50)[], -- ['car', 'motorcycle']
    status          port_status DEFAULT 'available',
    status_updated_at TIMESTAMP,
    
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE charging_reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id      UUID NOT NULL REFERENCES charging_stations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    
    rating          SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment         TEXT,
    wait_time_mins  INT,
    
    created_at      TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- USER PREFERENCES TABLES
-- =============================================================================

CREATE TABLE favorites (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    created_at      TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, provider_id)
);

CREATE TABLE recent_views (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    viewed_at       TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- ADMIN TABLES
-- =============================================================================

CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id     UUID REFERENCES users(id),
    provider_id     UUID REFERENCES providers(id),
    station_id      UUID REFERENCES charging_stations(id),
    
    report_type     VARCHAR(50) NOT NULL, -- 'wrong_info', 'fraud', 'closed', etc.
    description     TEXT,
    images          TEXT[],
    
    status          VARCHAR(20) DEFAULT 'pending', -- pending, resolved, dismissed
    admin_note      TEXT,
    resolved_at     TIMESTAMP,
    
    created_at      TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Users
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- Providers
CREATE INDEX idx_providers_user_id ON providers(user_id);
CREATE INDEX idx_providers_status ON providers(status);
CREATE INDEX idx_providers_location ON providers USING GIST(location);
CREATE INDEX idx_providers_rating ON providers(rating_avg DESC);

-- Services
CREATE INDEX idx_services_provider_id ON services(provider_id);
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = true;

-- Contact Events
CREATE INDEX idx_contact_events_user_id ON contact_events(user_id);
CREATE INDEX idx_contact_events_provider_id ON contact_events(provider_id);
CREATE INDEX idx_contact_events_created_at ON contact_events(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Charging Stations
CREATE INDEX idx_charging_stations_location ON charging_stations USING GIST(location);
CREATE INDEX idx_charging_ports_station_id ON charging_ports(station_id);
CREATE INDEX idx_charging_ports_status ON charging_ports(status);

-- Favorites & Recent
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_recent_views_user_id ON recent_views(user_id);
CREATE INDEX idx_recent_views_viewed_at ON recent_views(viewed_at DESC);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update provider rating stats
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE providers SET
        rating_avg = (SELECT AVG(rating) FROM reviews WHERE provider_id = NEW.provider_id AND is_visible = true),
        rating_count = (SELECT COUNT(*) FROM reviews WHERE provider_id = NEW.provider_id AND is_visible = true)
    WHERE id = NEW.provider_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_provider_rating_after_review
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_provider_rating();
```

---

## 6. API Design

### 6.1 API Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API ENDPOINTS OVERVIEW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Base URL: https://api.xe247.vn/v1                                          │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│  AUTH MODULE                                                                 │
│  ═══════════════════════════════════════════════════════════════════════    │
│  POST   /auth/otp/send          Send OTP to phone                           │
│  POST   /auth/otp/verify        Verify OTP & get token                      │
│  POST   /auth/social            Social login (Google/Apple)                 │
│  POST   /auth/refresh           Refresh access token                        │
│  POST   /auth/logout            Logout & invalidate token                   │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│  USER MODULE                                                                 │
│  ═══════════════════════════════════════════════════════════════════════    │
│  GET    /users/me               Get current user profile                    │
│  PUT    /users/me               Update profile                              │
│  GET    /users/me/favorites     Get favorites list                          │
│  POST   /users/me/favorites     Add to favorites                            │
│  DELETE /users/me/favorites/:id Remove from favorites                       │
│  GET    /users/me/recent        Get recently viewed                         │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│  PROVIDER MODULE                                                             │
│  ═══════════════════════════════════════════════════════════════════════    │
│  POST   /providers              Register as provider                        │
│  GET    /providers/me           Get own provider profile                    │
│  PUT    /providers/me           Update provider profile                     │
│  GET    /providers/me/stats     Get provider analytics                      │
│  GET    /providers/:id          Get provider public profile                 │
│  GET    /providers              Search providers (geo query)                │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│  SERVICE MODULE                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│  GET    /services               List services (by provider)                 │
│  POST   /services               Create service                              │
│  PUT    /services/:id           Update service                              │
│  DELETE /services/:id           Delete service                              │
│  GET    /categories             Get all categories                          │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│  CONTACT MODULE                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│  POST   /contacts               Log contact event                           │
│  GET    /contacts/pending-ratings  Get contacts pending rating              │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│  REVIEW MODULE                                                               │
│  ═══════════════════════════════════════════════════════════════════════    │
│  GET    /reviews                Get reviews (by provider)                   │
│  POST   /reviews                Create review                               │
│  POST   /reviews/:id/reply      Provider reply to review                    │
│  POST   /reviews/:id/report     Report review                               │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│  EV CHARGING MODULE                                                          │
│  ═══════════════════════════════════════════════════════════════════════    │
│  GET    /ev/stations            Search EV stations (geo query)              │
│  GET    /ev/stations/:id        Get station detail                          │
│  POST   /ev/stations            Register new station                        │
│  PUT    /ev/stations/:id        Update station                              │
│  PUT    /ev/ports/:id/status    Update port status                          │
│  POST   /ev/stations/:id/reviews  Add station review                        │
│  POST   /ev/stations/:id/report   Report station issue                      │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│  ADMIN MODULE                                                                │
│  ═══════════════════════════════════════════════════════════════════════    │
│  GET    /admin/providers/pending    List pending approvals                  │
│  POST   /admin/providers/:id/approve  Approve provider                      │
│  POST   /admin/providers/:id/reject   Reject provider                       │
│  GET    /admin/reports              List reports                            │
│  PUT    /admin/reports/:id          Resolve report                          │
│  GET    /admin/analytics            Platform analytics                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 API Request/Response Examples

```yaml
# =============================================================================
# Search Providers (Geo Query)
# =============================================================================
GET /v1/providers?lat=10.7769&lng=106.7009&radius=5&category=sua-chua&sort=distance

Response 200 OK:
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Xưởng Anh Tú",
      "rating_avg": 4.8,
      "rating_count": 156,
      "distance_km": 0.72,
      "address": "123 Lê Lợi, Q1",
      "phone": "0909****56",
      "working_hours": { "today": "06:00 - 22:00", "is_open": true },
      "services": [
        { "name": "Vá lốp xe máy", "price": 30000, "price_type": "fixed" },
        { "name": "Thay nhớt", "price": 50000, "price_type": "from" }
      ],
      "thumbnail": "https://cdn.xe247.vn/providers/uuid-1/thumb.jpg",
      "categories": ["sua-chua", "bao-duong"]
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "per_page": 20
  }
}

# =============================================================================
# Log Contact Event
# =============================================================================
POST /v1/contacts
{
  "provider_id": "uuid-1",
  "contact_type": "call",
  "contact_value": "0909123456"
}

Response 201 Created:
{
  "data": {
    "id": "contact-uuid",
    "provider_id": "uuid-1",
    "contact_type": "call",
    "created_at": "2026-04-20T10:30:00Z"
  }
}

# =============================================================================
# Submit Review
# =============================================================================
POST /v1/reviews
{
  "provider_id": "uuid-1",
  "contact_event_id": "contact-uuid",
  "rating": 5,
  "tags": ["dung_gio", "than_thien", "gia_hop_ly"],
  "comment": "Thợ nhiệt tình, làm nhanh, giá phải chăng",
  "images": ["https://upload.xe247.vn/reviews/img1.jpg"]
}

Response 201 Created:
{
  "data": {
    "id": "review-uuid",
    "rating": 5,
    "created_at": "2026-04-20T11:00:00Z"
  }
}
```

### 6.3 Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      { "field": "phone", "message": "Số điện thoại không đúng định dạng" }
    ]
  },
  "request_id": "req-uuid-123"
}
```

### 6.4 Common Error Codes

| HTTP Code | Error Code | Description |
|-----------|------------|-------------|
| 400 | VALIDATION_ERROR | Invalid input data |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## 7. Security Architecture

### 7.1 Security Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SECURITY ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    CLIENT LAYER SECURITY                            │    │
│  │                                                                     │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │    │
│  │  │ Certificate │ │    SSL      │ │   Token     │ │  Secure     │  │    │
│  │  │   Pinning   │ │   Pinning   │ │  Storage    │ │  Storage    │  │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │    │
│  │                                                                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    │ HTTPS/TLS 1.3                          │
│                                    ▼                                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                     API GATEWAY SECURITY                            │    │
│  │                                                                     │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │    │
│  │  │    Rate     │ │    CORS     │ │  Request    │ │   WAF       │  │    │
│  │  │  Limiting   │ │   Policy    │ │ Validation  │ │  Rules      │  │    │
│  │  │ (100/min)   │ │             │ │             │ │             │  │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │    │
│  │                                                                     │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                  │    │
│  │  │     JWT     │ │  Firebase   │ │   API Key   │                  │    │
│  │  │ Validation  │ │   Token     │ │ (Admin)     │                  │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                  │    │
│  │                                                                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                   APPLICATION LAYER SECURITY                        │    │
│  │                                                                     │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │    │
│  │  │   Input     │ │    SQL      │ │    XSS      │ │   RBAC      │  │    │
│  │  │ Sanitization│ │  Injection  │ │ Prevention  │ │  (Roles)    │  │    │
│  │  │             │ │ Prevention  │ │             │ │             │  │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │    │
│  │                                                                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                      DATA LAYER SECURITY                            │    │
│  │                                                                     │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │    │
│  │  │  Encryption │ │   PII       │ │   Audit     │ │   Backup    │  │    │
│  │  │  at Rest    │ │  Masking    │ │   Logging   │ │  Encryption │  │    │
│  │  │  AES-256    │ │   (Phone)   │ │             │ │             │  │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │    │
│  │                                                                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW (OTP)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐      │
│  │ Mobile  │        │   API   │        │Firebase │        │   DB    │      │
│  │  App    │        │ Server  │        │  Auth   │        │         │      │
│  └────┬────┘        └────┬────┘        └────┬────┘        └────┬────┘      │
│       │                  │                  │                  │            │
│       │  1. Send OTP     │                  │                  │            │
│       │  POST /auth/otp/send               │                  │            │
│       │  { phone: "0909..." }              │                  │            │
│       │─────────────────▶│                  │                  │            │
│       │                  │                  │                  │            │
│       │                  │  2. Send OTP     │                  │            │
│       │                  │─────────────────▶│                  │            │
│       │                  │                  │                  │            │
│       │                  │  3. OTP Sent     │                  │            │
│       │                  │◀─────────────────│                  │            │
│       │                  │                  │                  │            │
│       │  4. { status: "sent" }             │                  │            │
│       │◀─────────────────│                  │                  │            │
│       │                  │                  │                  │            │
│       │  5. Verify OTP   │                  │                  │            │
│       │  POST /auth/otp/verify             │                  │            │
│       │  { phone, code } │                  │                  │            │
│       │─────────────────▶│                  │                  │            │
│       │                  │                  │                  │            │
│       │                  │  6. Verify       │                  │            │
│       │                  │─────────────────▶│                  │            │
│       │                  │                  │                  │            │
│       │                  │  7. Firebase Token                  │            │
│       │                  │◀─────────────────│                  │            │
│       │                  │                  │                  │            │
│       │                  │  8. Find/Create User               │            │
│       │                  │─────────────────────────────────────▶│            │
│       │                  │                  │                  │            │
│       │                  │  9. User Record  │                  │            │
│       │                  │◀─────────────────────────────────────│            │
│       │                  │                  │                  │            │
│       │                  │  10. Generate JWT                   │            │
│       │                  │  (access_token + refresh_token)     │            │
│       │                  │                  │                  │            │
│       │  11. { access_token, refresh_token, user }            │            │
│       │◀─────────────────│                  │                  │            │
│       │                  │                  │                  │            │
│       │  12. Store tokens securely         │                  │            │
│       │      (Keychain/Keystore)           │                  │            │
│       │                  │                  │                  │            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Authorization (RBAC)

| Role | Permissions |
|------|-------------|
| **Consumer** | View providers, Search, Contact, Rate, Favorites |
| **Provider** | All Consumer + Manage own services, View own stats, Reply reviews |
| **Admin** | All + Approve providers, Manage categories, Handle reports |

---

## 8. Infrastructure & Deployment

### 8.1 Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              CLOUDFLARE                                      │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  WAF  │  DDoS Protection  │  SSL Termination  │  CDN (Static)     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ═══════════════════════════════════════════════════════════════════════   │
│                          AWS / GCP CLOUD                                    │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                     LOAD BALANCER (ALB/NLB)                         │    │
│  │                  Health Checks │ SSL Termination                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                    │                              │                         │
│                    ▼                              ▼                         │
│  ┌──────────────────────────┐    ┌──────────────────────────┐             │
│  │      API SERVERS         │    │      ADMIN WEB           │             │
│  │   (ECS / Cloud Run)      │    │   (S3 + CloudFront)      │             │
│  │                          │    │                          │             │
│  │  ┌────────┐ ┌────────┐  │    │   Static React Build     │             │
│  │  │ Task 1 │ │ Task 2 │  │    │   + API Proxy            │             │
│  │  │        │ │        │  │    │                          │             │
│  │  └────────┘ └────────┘  │    └──────────────────────────┘             │
│  │                          │                                             │
│  │  Auto-scaling: 2-10     │                                             │
│  │  CPU > 70% → Scale up   │                                             │
│  └──────────────────────────┘                                             │
│                    │                                                       │
│                    ▼                                                       │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                      DATA LAYER                                     │   │
│  │                                                                     │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │   │
│  │  │    PostgreSQL    │  │      Redis       │  │       S3         │ │   │
│  │  │   (RDS/Cloud SQL)│  │  (ElastiCache)   │  │  (Media Storage) │ │   │
│  │  │                  │  │                  │  │                  │ │   │
│  │  │ • Primary DB     │  │ • Session Cache  │  │ • Images         │ │   │
│  │  │ • PostGIS        │  │ • Query Cache    │  │ • Documents      │ │   │
│  │  │ • Read Replica   │  │ • Rate Limiting  │  │ • Backups        │ │   │
│  │  │                  │  │                  │  │                  │ │   │
│  │  │ db.t3.medium     │  │ cache.t3.small   │  │ Standard-IA      │ │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘ │   │
│  │                                                                     │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════   │
│                        EXTERNAL SERVICES                                    │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                              │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │Firebase│ │ Google │ │ Sentry │ │Datadog │ │  Zalo  │ │ Apple  │       │
│  │Auth+FCM│ │ Maps   │ │ Errors │ │ APM    │ │  API   │ │ SignIn │       │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Environment Configuration

| Environment | Purpose | Infrastructure |
|-------------|---------|----------------|
| **Development** | Local development | Docker Compose |
| **Staging** | Testing & QA | Single instance, shared DB |
| **Production** | Live users | Multi-AZ, Auto-scaling |

### 8.3 CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CI/CD PIPELINE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  Push   │───▶│  Build  │───▶│  Test   │───▶│ Deploy  │───▶│ Monitor │  │
│  │  Code   │    │         │    │         │    │ Staging │    │         │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │                                            │                        │
│       │                                            │ Manual Approve         │
│       │                                            ▼                        │
│       │                                      ┌─────────┐                   │
│       │                                      │ Deploy  │                   │
│       │                                      │  Prod   │                   │
│       │                                      └─────────┘                   │
│       │                                                                     │
│  ═════╪═════════════════════════════════════════════════════════════════   │
│       │                                                                     │
│       │  MOBILE APP PIPELINE:                                              │
│       │  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐        │
│       └─▶│  Build  │───▶│  Test   │───▶│CodePush│───▶│  Store  │        │
│          │  RN     │    │  E2E   │    │  OTA    │    │ Submit  │        │
│          └─────────┘    └─────────┘    └─────────┘    └─────────┘        │
│                                                                              │
│  Tools: GitHub Actions / GitLab CI                                          │
│  Mobile: Fastlane + CodePush (OTA updates)                                 │
│  Containerization: Docker                                                   │
│  Registry: ECR / GCR                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Non-Functional Requirements

### 9.1 Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p95) | < 500ms | DataDog APM |
| App Launch Time (cold) | < 3s | Firebase Performance |
| Search Results Load | < 2s | End-to-end |
| Image Load Time | < 1s | CDN metrics |

### 9.2 Scalability Targets

| Metric | MVP | 6 Months | 1 Year |
|--------|-----|----------|--------|
| Concurrent Users | 500 | 2,000 | 5,000 |
| Daily Active Users | 1,000 | 10,000 | 50,000 |
| API Requests/day | 50K | 500K | 2M |
| Database Size | 5 GB | 20 GB | 100 GB |

### 9.3 Availability & Reliability

| Metric | Target |
|--------|--------|
| Uptime SLA | 99.5% |
| RTO (Recovery Time Objective) | < 1 hour |
| RPO (Recovery Point Objective) | < 15 minutes |
| Error Rate | < 0.1% |

### 9.4 Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      OBSERVABILITY STACK                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        METRICS (DataDog/CloudWatch)                  │   │
│  │  • Request count, latency, error rate                               │   │
│  │  • Database connections, query time                                 │   │
│  │  • Cache hit rate                                                   │   │
│  │  • Business metrics (contacts, reviews, signups)                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        LOGGING (CloudWatch/Loki)                     │   │
│  │  • Application logs (structured JSON)                               │   │
│  │  • Access logs                                                      │   │
│  │  • Error logs with stack traces                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        TRACING (DataDog APM/Jaeger)                  │   │
│  │  • Request tracing across services                                  │   │
│  │  • Database query tracing                                           │   │
│  │  • External API call tracing                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        ERROR TRACKING (Sentry)                       │   │
│  │  • Mobile app crashes                                               │   │
│  │  • Backend exceptions                                               │   │
│  │  • Source maps for stack traces                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        ALERTING                                      │   │
│  │  • Error rate > 1% → Slack + PagerDuty                             │   │
│  │  • P95 latency > 1s → Slack                                        │   │
│  │  • Database CPU > 80% → Slack                                      │   │
│  │  • Disk usage > 85% → Email                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Technology Decisions

### 10.1 Technology Stack Summary

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Mobile App** | React Native | 0.73+ | Cross-platform, shared codebase |
| **State Management** | Zustand | 4.x | Lightweight, simple API |
| **Navigation** | React Navigation | 6.x | Standard RN navigation |
| **UI Components** | NativeWind (Tailwind) | 4.x | Consistent styling |
| **Maps** | react-native-maps | 1.x | Google Maps integration |
| **Backend** | Node.js + Express/Fastify | 20 LTS | JS ecosystem, fast dev |
| **ORM** | Drizzle ORM | 0.29+ | Type-safe, performant |
| **Database** | PostgreSQL + PostGIS | 15+ | Geo queries, reliability |
| **Cache** | Redis | 7.x | Session, caching |
| **Auth** | Firebase Auth | 10.x | OTP, OAuth ready |
| **Push** | Firebase Cloud Messaging | 10.x | Free, reliable |
| **Storage** | AWS S3 / CloudFlare R2 | - | Media storage |
| **Admin Web** | React + Vite | 18+ | Fast, modern |

### 10.2 Architecture Decision Records (ADRs)

#### ADR-001: Unified App vs Separate Apps

**Decision:** Build a single unified app with mode switching instead of separate Consumer and Provider apps.

**Context:**
- Original plan: 2 separate apps (Consumer + Provider)
- Concern: Maintenance overhead, code duplication

**Options Considered:**
1. Two separate apps (original)
2. One app with mode switching (selected)
3. One app with deep links to separate flows

**Decision Rationale:**
- Reduced development effort (~30% savings)
- Single codebase = easier maintenance
- Users can be both Consumer and Provider
- Shared authentication flow
- Single app store submission

**Consequences:**
- Slightly larger app size (~5MB increase)
- More complex navigation structure
- Need clear UI separation between modes

---

#### ADR-002: Contact-Based Model vs Transaction Model

**Decision:** Implement contact-based marketplace (no in-app transactions) for MVP.

**Context:**
- Full transaction model requires: Payment gateway, Order tracking, Dispute handling
- MVP timeline pressure

**Decision Rationale:**
- 60% faster time-to-market
- Higher user trust (direct contact)
- No commission = easier provider onboarding
- Less regulatory complexity

**Future Migration Path:**
- Phase 2: Add optional booking/scheduling
- Phase 3: Add payment integration if validated

---

#### ADR-003: PostgreSQL + PostGIS vs MongoDB

**Decision:** Use PostgreSQL with PostGIS extension for geospatial queries.

**Options:**
1. PostgreSQL + PostGIS (selected)
2. MongoDB with 2dsphere index
3. Elasticsearch for search + PostgreSQL for data

**Decision Rationale:**
- Strong ACID compliance for transactional data
- PostGIS provides superior geospatial capabilities
- Better tooling and ORM support
- Easier to maintain single DB technology

---

## 11. Implementation Roadmap

### 11.1 Phase Breakdown

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      IMPLEMENTATION ROADMAP                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: FOUNDATION (Week 1-2)                                             │
│  ═══════════════════════════════                                            │
│  • Project setup (monorepo structure)                                       │
│  • Database schema implementation                                           │
│  • Auth module (Firebase OTP + JWT)                                         │
│  • Basic API scaffold                                                       │
│  • CI/CD pipeline setup                                                     │
│                                                                              │
│  Deliverables:                                                              │
│  ✓ Backend running with auth                                               │
│  ✓ Database with seed data                                                 │
│  ✓ API documentation (Swagger)                                             │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  PHASE 2: CONSUMER FEATURES (Week 3-4)                                      │
│  ═══════════════════════════════════════                                    │
│  • Home screen with categories                                              │
│  • Provider search with geo query                                           │
│  • Provider profile & contact flow                                          │
│  • Rating & review system                                                   │
│  • Favorites & recent views                                                 │
│                                                                              │
│  Deliverables:                                                              │
│  ✓ Consumer mode fully functional                                          │
│  ✓ 15 screens implemented                                                  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  PHASE 3: PROVIDER FEATURES (Week 5-6)                                      │
│  ═══════════════════════════════════════                                    │
│  • Provider registration flow                                               │
│  • Service management                                                       │
│  • Profile management                                                       │
│  • Analytics dashboard                                                      │
│  • Mode switching implementation                                            │
│                                                                              │
│  Deliverables:                                                              │
│  ✓ Provider mode fully functional                                          │
│  ✓ 12 screens implemented                                                  │
│  ✓ Unified app with mode switch                                            │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  PHASE 4: EV CHARGING & ADMIN (Week 7)                                      │
│  ════════════════════════════════════════                                   │
│  • EV charging station module                                               │
│  • Admin web dashboard                                                      │
│  • Provider approval workflow                                               │
│  • Report handling                                                          │
│                                                                              │
│  Deliverables:                                                              │
│  ✓ EV module complete                                                      │
│  ✓ Admin dashboard functional                                              │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  PHASE 5: TESTING & POLISH (Week 8)                                         │
│  ═══════════════════════════════════                                        │
│  • Integration testing                                                      │
│  • Performance optimization                                                 │
│  • UI polish & animations                                                   │
│  • Bug fixes                                                                │
│  • App store preparation                                                    │
│                                                                              │
│  Deliverables:                                                              │
│  ✓ Production-ready app                                                    │
│  ✓ App store submission                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Sprint Planning

| Sprint | Duration | Focus | Key Deliverables |
|--------|----------|-------|------------------|
| Sprint 1 | Week 1-2 | Foundation | Auth, DB, API scaffold |
| Sprint 2 | Week 3-4 | Consumer | Search, Profile, Contact, Rating |
| Sprint 3 | Week 5-6 | Provider | Registration, Services, Analytics |
| Sprint 4 | Week 7 | EV + Admin | Charging stations, Admin dashboard |
| Sprint 5 | Week 8 | Polish | Testing, Optimization, Launch prep |

### 11.3 Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Firebase rate limits | High | Low | Implement caching, batch requests |
| Slow geo queries | Medium | Medium | PostGIS optimization, proper indexing |
| App store rejection | High | Low | Follow guidelines, pre-submit review |
| Provider onboarding slow | High | Medium | Manual seeding, incentive program |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-20 | Dương Quá (Tech Lead) | Initial HLD with unified app architecture |

---

*"Kiến trúc tốt là kiến trúc đơn giản nhất có thể giải quyết được bài toán."*

— Dương Quá, Tech Lead
