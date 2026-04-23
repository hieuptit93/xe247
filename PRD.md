# XE 247 - Product Requirements Document (PRD)

> **Version:** 2.1 (Unified App + UGC)  
> **Last Updated:** 2026-04-23  
> **Author:** Team Kim Dung (Hoàng Dung - PO)  
> **Status:** Final Draft  
> **Related:** [HIGH-LEVEL-DESIGN.md](./HIGH-LEVEL-DESIGN.md)

---

## 1. Executive Summary

### 1.1 Product Vision

**Xe 247** là nền tảng marketplace kết nối chủ xe với tất cả dịch vụ xe gần nhất tại Việt Nam. App hoạt động như một trung gian, cho phép các nhà cung cấp dịch vụ (thợ sửa xe, xưởng bảo dưỡng, tiệm rửa xe, garage độ xe, dịch vụ cứu hộ,...) tự đăng ký, tự định giá, và người dùng tự chọn dịch vụ phù hợp.

**Tagline:** *"Mọi dịch vụ xe - Một ứng dụng"*

### 1.2 Product Scope

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         XE 247 - SERVICE CATEGORIES                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🆘 CỨU HỘ KHẨN CẤP          │  🔧 SỬA CHỮA & BẢO DƯỠNG               │
│  ─────────────────────────── │  ────────────────────────────────        │
│  • Cứu hộ lốp (vá, thay)     │  • Xưởng sửa chữa tổng hợp              │
│  • Cứu hộ ắc quy             │  • Bảo dưỡng định kỳ                    │
│  • Cứu hộ hết xăng           │  • Thay nhớt, lọc                       │
│  • Kéo xe                    │  • Sửa phanh, côn                       │
│  • Mở khóa xe                │  • Sửa điện, đèn                        │
│                              │  • Đồng sơn                             │
│                              │                                          │
│  🚿 RỬA XE & LÀM ĐẸP         │  🏎️ ĐỘ XE & PHỤ KIỆN                   │
│  ─────────────────────────── │  ────────────────────────────────        │
│  • Rửa xe cơ bản             │  • Garage độ xe                         │
│  • Rửa xe cao cấp            │  • Dán phim cách nhiệt                  │
│  • Đánh bóng                 │  • Wrap đổi màu                         │
│  • Phủ ceramic               │  • Nâng cấp âm thanh                    │
│  • Vệ sinh nội thất          │  • Lắp camera hành trình                │
│  • Khử mùi, diệt khuẩn       │  • Phụ kiện, đồ chơi xe                 │
│                              │                                          │
│  ⚡ TRẠM SẠC XE ĐIỆN         │  🅿️ DỊCH VỤ KHÁC                       │
│  ─────────────────────────── │  ────────────────────────────────        │
│  • Trạm sạc công cộng       │  • Bãi giữ xe                           │
│  • Trạm sạc tư nhân         │  • Đăng kiểm                            │
│  • Điểm sạc tại nhà hàng,   │  • Sang tên, đổi biển                   │
│    cafe, mall               │                                          │
│  • Sạc nhanh DC             │                                          │
│  • Sạc chậm AC              │                                          │
│                              │                                          │
│  📋 COMING SOON              │                                          │
│  ─────────────────────────── │                                          │
│  • Thuê xe                   │                                          │
│  • Bảo hiểm xe               │                                          │
│  • Mua bán xe cũ             │                                          │
│  • Học lái xe                │                                          │
│                              │                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Problem Statement

| Vấn đề hiện tại | Impact |
|-----------------|--------|
| Không biết tìm dịch vụ xe ở đâu | Mất thời gian search, hỏi bạn bè |
| Không biết giá trước | Bị chặt chém, không tin tưởng |
| Không biết chất lượng dịch vụ | Rủi ro về chất lượng, sợ bị lừa |
| Khó so sánh giữa các tiệm | Phải đi hỏi từng nơi |
| Không có review đáng tin | Chỉ có quảng cáo, không có feedback thật |
| Nhà cung cấp khó tiếp cận khách | Phụ thuộc khách quen, marketing đắt đỏ |

### 1.4 Solution

Một marketplace 2 chiều cho TẤT CẢ dịch vụ xe:
- **Consumer**: Tìm dịch vụ gần, xem giá rõ ràng, đọc review thật, đặt dịch vụ nhanh
- **Provider**: Tự đăng ký, tự định giá, tự quản lý dịch vụ, xây dựng reputation online

### 1.4 Success Metrics (North Star)

| Metric | Target MVP (3 tháng) | Target Year 1 |
|--------|---------------------|---------------|
| MAU (Consumer) | 5,000 | 50,000 |
| Active Providers | 200 | 2,000 |
| Orders/month | 1,000 | 20,000 |
| GMV/month | 100M VND | 2B VND |
| Provider retention | 60% | 75% |
| Consumer NPS | > 40 | > 50 |

---

## 2. Target Users

### 2.1 Consumer Personas

#### Persona 1: Shipper Minh - Cần cứu hộ nhanh

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Nam, 25-35 tuổi, Grab/Be driver |
| **Behavior** | Chạy xe 8-12h/ngày, cần xe luôn hoạt động |
| **Use cases** | Cứu hộ lốp, thay nhớt nhanh, sửa chữa nhỏ |
| **Pain Points** | Xe hỏng = mất tiền, cần fix NHANH nhất |
| **Goals** | Tìm thợ gần, giá rẻ, nhanh |
| **Tech Savvy** | Cao - dùng app hàng ngày |

#### Persona 2: Chị Lan - Chủ xe không rành

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Nữ, 28-40 tuổi, nhân viên văn phòng |
| **Behavior** | Đi xe máy/oto đi làm, không biết gì về xe |
| **Use cases** | Bảo dưỡng định kỳ, rửa xe, sửa chữa khi hỏng |
| **Pain Points** | Không biết giá hợp lý, sợ bị lừa/chặt chém |
| **Goals** | An tâm, giá rõ ràng, thợ uy tín có review |
| **Tech Savvy** | Trung bình |

#### Persona 3: Anh Tuấn - Chủ oto cần bảo dưỡng

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Nam, 35-50 tuổi, đi oto |
| **Behavior** | Cần bảo dưỡng định kỳ, quan tâm chất lượng |
| **Use cases** | Bảo dưỡng, rửa xe cao cấp, cứu hộ khi cần |
| **Pain Points** | Giá head hãng đắt, garage ngoài không tin |
| **Goals** | Tìm garage uy tín, giá hợp lý, chất lượng tốt |
| **Tech Savvy** | Trung bình - Cao |

#### Persona 4: Bạn Hùng - Đam mê xe, thích độ

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Nam, 22-35 tuổi, yêu xe |
| **Behavior** | Hay nâng cấp, độ xe, tìm phụ kiện |
| **Use cases** | Độ xe, wrap, phụ kiện, detailing cao cấp |
| **Pain Points** | Khó tìm thợ giỏi, sợ làm hỏng xe |
| **Goals** | Tìm garage chuyên, xem portfolio, so sánh |
| **Tech Savvy** | Cao |

#### Persona 5: Chị Hà - Cần rửa xe tiện lợi

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Nữ/Nam, 25-45 tuổi, bận rộn |
| **Behavior** | Cần rửa xe thường xuyên nhưng không có thời gian |
| **Use cases** | Rửa xe, vệ sinh nội thất |
| **Pain Points** | Tiệm gần không tốt, tiệm tốt thì xa |
| **Goals** | Tìm tiệm gần, giá OK, không phải chờ lâu |
| **Tech Savvy** | Trung bình |

#### Persona 6: Anh Nam - Chủ xe điện (VinFast, Tesla, xe máy điện)

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Nam/Nữ, 28-45 tuổi, early adopter |
| **Behavior** | Đi xe điện, cần sạc thường xuyên, đặc biệt khi đi xa |
| **Use cases** | Tìm trạm sạc, check tình trạng trạm, navigate |
| **Pain Points** | Không biết trạm sạc ở đâu, trạm hỏng/bận, range anxiety |
| **Goals** | Tìm trạm nhanh, biết trạng thái real-time, giá rõ ràng |
| **Tech Savvy** | Cao - early adopter công nghệ |

### 2.2 Provider Personas

#### Persona A: Thợ Freelance / Cứu hộ lưu động

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Nam, 25-45 tuổi, thợ tự do |
| **Behavior** | Làm việc linh hoạt, di chuyển, cứu hộ tận nơi |
| **Services** | Vá lốp, thay ắc quy, cứu hộ nhỏ |
| **Pain Points** | Khó tìm khách mới, thu nhập không ổn định |
| **Goals** | Thêm nguồn khách, tăng thu nhập |

#### Persona B: Tiệm sửa xe / Xưởng nhỏ

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Nam/Nữ, 30-55 tuổi, có tiệm cố định |
| **Behavior** | Địa điểm cố định, đã có khách quen |
| **Services** | Sửa chữa tổng hợp, bảo dưỡng, thay nhớt |
| **Pain Points** | Muốn mở rộng, tiếp cận khách online |
| **Goals** | Marketing miễn phí, đa dạng khách hàng |

#### Persona C: Xưởng bảo dưỡng / Garage lớn

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Doanh nghiệp nhỏ, 5-20 nhân viên |
| **Behavior** | Chuyên nghiệp, có hệ thống, nhiều dịch vụ |
| **Services** | Bảo dưỡng full, đồng sơn, sửa chữa nặng |
| **Pain Points** | Cạnh tranh với hãng chính hãng, cần khách mới |
| **Goals** | Online presence, quản lý booking |

#### Persona D: Tiệm rửa xe / Chăm sóc xe

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Nam/Nữ, kinh doanh rửa xe |
| **Behavior** | Dịch vụ nhanh, khách walk-in nhiều |
| **Services** | Rửa xe, đánh bóng, vệ sinh nội thất |
| **Pain Points** | Phụ thuộc location, khó quảng bá |
| **Goals** | Tăng lượng khách, lấp đầy slot trống |

#### Persona E: Garage độ xe / Shop phụ kiện

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Chuyên gia độ xe, shop phụ kiện |
| **Behavior** | Khách hàng niche, dự án giá trị cao |
| **Services** | Độ xe, wrap, phụ kiện, nâng cấp |
| **Pain Points** | Khó tiếp cận đúng khách hàng |
| **Goals** | Showcase portfolio, tìm khách đam mê xe |

#### Persona F: Dịch vụ cứu hộ chuyên nghiệp

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Công ty cứu hộ, có xe kéo |
| **Behavior** | Hoạt động 24/7, khu vực rộng |
| **Services** | Kéo xe, cứu hộ nặng, vận chuyển xe |
| **Pain Points** | Chi phí vận hành cao, cần đơn hàng đều |
| **Goals** | Tối ưu route, tăng số đơn/ngày |

#### Persona G: Chủ trạm sạc xe điện

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Cá nhân/Doanh nghiệp có trạm sạc |
| **Behavior** | Có trạm sạc tại nhà, văn phòng, hoặc kinh doanh |
| **Services** | Sạc AC (chậm), Sạc DC (nhanh), kèm tiện ích |
| **Pain Points** | Trạm ít người biết, capacity chưa tối ưu |
| **Goals** | Tăng lượng khách, thu hồi vốn đầu tư |

#### Persona H: Địa điểm có trạm sạc (Mall, Cafe, Restaurant)

| Attribute | Detail |
|-----------|--------|
| **Demographics** | Quán cafe, nhà hàng, trung tâm thương mại |
| **Behavior** | Có trạm sạc như dịch vụ gia tăng thu hút khách |
| **Services** | Sạc miễn phí/có phí kèm dịch vụ ăn uống |
| **Pain Points** | Muốn quảng bá có trạm sạc để hút khách EV |
| **Goals** | Thu hút khách hàng xe điện, tăng doanh thu F&B |

---

## 3. Feature Requirements

### 3.1 Feature Priority Matrix (MoSCoW)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MVP FEATURE MATRIX                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  MUST HAVE (P0)              │  SHOULD HAVE (P1)                        │
│  ─────────────────────────── │  ────────────────────────────────        │
│  • Đăng ký/Đăng nhập        │  • Real-time tracking                    │
│  • Browse theo Category     │  • Payment online (Momo/VNPay)           │
│  • Tìm provider theo vị trí │  • Chat in-app                           │
│  • Filter/Sort kết quả      │  • Push notification                     │
│  • Xem profile & giá        │  • Lịch sử đơn hàng                      │
│  • Đặt dịch vụ (tận nơi/    │  • Provider favorite                     │
│    đến xưởng)               │  • Báo cáo chi tiết                      │
│  • Gọi điện/Chỉ đường       │  • Rút tiền tự động                      │
│  • Rating sau dịch vụ       │  • Search dịch vụ                        │
│  • Provider đăng ký         │                                          │
│  • Provider chọn categories │                                          │
│  • Provider đăng dịch vụ/giá│                                          │
│  • Provider nhận/từ chối đơn│                                          │
│  • Admin quản lý categories │                                          │
│  • Admin duyệt provider     │                                          │
│                              │                                          │
│  COULD HAVE (P2)             │  WON'T HAVE (this version)              │
│  ─────────────────────────── │  ────────────────────────────────        │
│  • Subscription Provider Pro│  • Marketplace bán phụ tùng              │
│  • Promoted listing         │  • Bảo hiểm xe tích hợp                  │
│  • Referral program         │  • Mua bán xe cũ                         │
│  • Loyalty points           │  • Multi-language                        │
│  • So sánh giá              │  • B2B Fleet management                  │
│  • Đặt lịch hẹn trước       │  • Học lái xe                            │
│                              │                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Detailed Feature Specs

---

## CONSUMER APP FEATURES

### F-C01: Đăng ký / Đăng nhập

**Priority:** P0 (Must Have)

**User Story:**
```
As a người dùng mới
I want đăng ký tài khoản nhanh chóng
So that tôi có thể sử dụng dịch vụ ngay
```

**Acceptance Criteria:**
- [ ] AC1: User có thể đăng ký bằng SĐT + OTP (6 số, timeout 60s)
- [ ] AC2: User có thể đăng nhập bằng Google/Apple (OAuth)
- [ ] AC3: User có thể dùng Guest mode (giới hạn: không lưu lịch sử, không favorite)
- [ ] AC4: OTP retry tối đa 3 lần, sau đó block 5 phút
- [ ] AC5: Session persist 30 ngày, sau đó yêu cầu đăng nhập lại

**UI/UX Notes:**
- Onboarding 3 slides trước màn đăng ký
- Auto-detect SĐT từ SIM (Android)
- Keyboard auto-focus vào input OTP

**Technical Notes:**
- Firebase Auth cho OTP và OAuth
- JWT token với refresh mechanism
- Device fingerprint để detect fraud

---

### F-C02: Tìm thợ theo vị trí

**Priority:** P0 (Must Have)

**User Story:**
```
As a người cần sửa lốp
I want tìm thợ/xưởng gần vị trí của tôi
So that tôi được phục vụ nhanh nhất
```

**Acceptance Criteria:**
- [ ] AC1: App request location permission khi mở lần đầu
- [ ] AC2: Hiển thị danh sách thợ trong bán kính 5km (default), có thể expand 10km, 20km
- [ ] AC3: Filter theo: Loại xe (xe máy/oto), Dịch vụ (vá/thay/bơm), Rating (4+), Có cứu hộ
- [ ] AC4: Sort theo: Gần nhất, Giá thấp nhất, Rating cao nhất
- [ ] AC5: Hiển thị: Tên, Rating, Khoảng cách, Giá dịch vụ, Trạng thái (rảnh/bận)
- [ ] AC6: User có thể nhập địa chỉ thủ công nếu GPS không chính xác
- [ ] AC7: Kết quả load trong < 3 giây

**UI/UX Notes:**
- Map view option (ngoài list view)
- Skeleton loading khi đang fetch
- Empty state nếu không có thợ gần

**Technical Notes:**
- Google Maps SDK cho location
- Geohashing cho query hiệu quả
- Cache kết quả 5 phút

---

### F-C03: Xem Profile Thợ

**Priority:** P0 (Must Have)

**User Story:**
```
As a người tìm thợ
I want xem thông tin chi tiết của thợ/xưởng
So that tôi quyết định có chọn thợ này không
```

**Acceptance Criteria:**
- [ ] AC1: Hiển thị: Tên, Ảnh, Rating tổng, Số đánh giá, Địa chỉ xưởng (nếu có)
- [ ] AC2: Hiển thị gallery ảnh (tối đa 5 ảnh)
- [ ] AC3: Hiển thị danh sách dịch vụ và GIÁ rõ ràng
- [ ] AC4: Hiển thị giờ hoạt động
- [ ] AC5: Hiển thị 3 review gần nhất, có nút "Xem tất cả"
- [ ] AC6: Hiển thị badges: "Top 10 Quận X", "Phản hồi nhanh", etc.
- [ ] AC7: Actions: Gọi điện, Chỉ đường, Đặt dịch vụ

**UI/UX Notes:**
- Sticky header với CTA buttons
- Image gallery với swipe gesture
- Reviews với lazy loading

---

### F-C04: Đặt dịch vụ Cứu hộ

**Priority:** P0 (Must Have)

**User Story:**
```
As a người bị xịt lốp
I want đặt thợ đến sửa tại chỗ
So that tôi không cần di chuyển xe
```

**Acceptance Criteria:**
- [ ] AC1: Chọn dịch vụ từ danh sách của thợ
- [ ] AC2: Xác nhận vị trí (GPS hoặc nhập tay)
- [ ] AC3: Thêm ghi chú (loại xe, màu xe, vấn đề cụ thể)
- [ ] AC4: Hiển thị giá DỰ KIẾN trước khi confirm
- [ ] AC5: Hiển thị phí di chuyển (nếu > bán kính free)
- [ ] AC6: Hiển thị ETA dự kiến
- [ ] AC7: Gửi request đến thợ, thợ có 2 phút để phản hồi
- [ ] AC8: Nếu thợ từ chối/timeout, suggest thợ khác

**UI/UX Notes:**
- Confirmation screen rõ ràng với breakdown giá
- Loading state với animation khi chờ thợ
- Option để hủy trong khi chờ

**Technical Notes:**
- Real-time notification đến thợ (FCM)
- Timeout mechanism (2 phút)
- Fallback logic nếu thợ không phản hồi

---

### F-C05: Tracking thợ

**Priority:** P1 (Should Have) - MVP sẽ dùng polling đơn giản

**User Story:**
```
As a người đang chờ thợ
I want xem thợ đang ở đâu
So that tôi biết còn chờ bao lâu
```

**Acceptance Criteria:**
- [ ] AC1: Hiển thị vị trí thợ trên map
- [ ] AC2: Hiển thị ETA cập nhật real-time
- [ ] AC3: Notification khi thợ gần đến (500m)
- [ ] AC4: Notification khi thợ đã đến
- [ ] AC5: Hiển thị thông tin thợ: Tên, SĐT, Biển số xe
- [ ] AC6: Có thể gọi/nhắn thợ trực tiếp

**MVP Implementation:**
- Polling mỗi 30 giây (thay vì WebSocket)
- ETA tính từ Google Directions API

**V1.1 Implementation:**
- WebSocket cho real-time
- Battery-optimized GPS tracking

---

### F-C06: Thanh toán

**Priority:** P0 (Must Have) - MVP chỉ COD, P1 thêm online

**User Story:**
```
As a người hoàn thành dịch vụ
I want thanh toán nhanh chóng
So that tôi có thể rời đi
```

**Acceptance Criteria:**
- [ ] AC1: Hiển thị hóa đơn chi tiết (dịch vụ + phí di chuyển + phụ phí nếu có)
- [ ] AC2: MVP: Thanh toán tiền mặt cho thợ
- [ ] AC3: V1.1: Thanh toán qua Momo, VNPay, Card
- [ ] AC4: Option tip cho thợ (10k, 20k, 50k, custom)
- [ ] AC5: Nhận biên lai qua SMS/Email

**Technical Notes:**
- VNPay SDK, Momo SDK integration (V1.1)
- Escrow model cho payment online

---

### F-C07: Rating & Review

**Priority:** P0 (Must Have)

**User Story:**
```
As a người đã sử dụng dịch vụ
I want đánh giá thợ
So that thợ tốt được ghi nhận và người khác có thông tin
```

**Acceptance Criteria:**
- [ ] AC1: Rating 1-5 sao (required)
- [ ] AC2: Quick tags: "Đúng giờ", "Thái độ tốt", "Giá hợp lý", "Làm sạch sẽ", "Chuyên nghiệp"
- [ ] AC3: Text review (optional, max 500 chars)
- [ ] AC4: Upload ảnh before/after (optional, max 3 ảnh)
- [ ] AC5: Review public sau khi submit
- [ ] AC6: Thợ có thể reply review
- [ ] AC7: Có thể đánh giá trong 24h sau dịch vụ

**Technical Notes:**
- Content moderation cho reviews (manual + AI)
- Anti-spam: 1 review per order

---

### F-C08: Tìm Trạm Sạc Xe Điện

**Priority:** P0 (Must Have)

**User Story:**
```
As a chủ xe điện (oto/xe máy)
I want tìm trạm sạc gần vị trí của tôi
So that tôi có thể sạc xe khi cần
```

**Acceptance Criteria:**
- [ ] AC1: Hiển thị map với tất cả trạm sạc trong bán kính (default 10km)
- [ ] AC2: Filter theo:
  - Loại sạc: AC (chậm) / DC (nhanh)
  - Cổng sạc: CCS2, CHAdeMO, Type 2, GB/T, Tesla
  - Xe máy điện / Oto điện
  - Công suất: 7kW, 11kW, 22kW, 50kW+
  - Trạng thái: Đang rảnh / Đang sạc / Bảo trì
  - Giá: Miễn phí / Có phí
  - Tiện ích kèm: Cafe, Nhà hàng, Mall, WC
- [ ] AC3: Hiển thị thông tin trạm:
  - Tên, địa chỉ, khoảng cách
  - Số cổng sạc, loại cổng
  - Trạng thái real-time (nếu có API)
  - Giá sạc (VND/kWh hoặc VND/phút)
  - Giờ hoạt động
  - Tiện ích xung quanh
  - Rating & Reviews
- [ ] AC4: Navigate đến trạm (Google Maps / Apple Maps)
- [ ] AC5: Xem chi tiết trạm với gallery ảnh
- [ ] AC6: Đánh giá trạm sạc sau khi sử dụng
- [ ] AC7: Báo cáo trạng thái trạm (hỏng, bận, sai thông tin)
- [ ] AC8: Lưu trạm yêu thích

**UI/UX Notes:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚡ TÌM TRẠM SẠC                                    [Filter] [List]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                                                                  │  │
│   │                         [MAP VIEW]                               │  │
│   │                                                                  │  │
│   │            ⚡ VinFast                                            │  │
│   │                 Charging                                         │  │
│   │                    🔵                                            │  │
│   │        ⚡              ⚡                                        │  │
│   │      (3 free)       (busy)     📍 You                           │  │
│   │                                                                  │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │ ⚡ VinFast Charging - Vinhomes Central Park                     │  │
│   │ 📍 720m • 🟢 3/5 cổng rảnh • ⭐ 4.8                             │  │
│   │ DC 60kW (CCS2) • 3,500đ/kWh                                     │  │
│   │ 🅿️ Parking • ☕ Cafe • 🚻 WC                                    │  │
│   │                                    [Navigate] [Chi tiết]        │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │ ⚡ EV Station - Starbucks Nguyễn Huệ                            │  │
│   │ 📍 1.2km • 🟡 1/2 cổng rảnh • ⭐ 4.5                            │  │
│   │ AC 22kW (Type 2) • MIỄN PHÍ (khách Starbucks)                  │  │
│   │ ☕ Cafe • 📶 Wifi • 🚻 WC                                       │  │
│   │                                    [Navigate] [Chi tiết]        │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Charging Station Detail Screen:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back                                                    ❤️ Save      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   [Photo Gallery - Swipe]                                               │
│                                                                          │
│   ⚡ VinFast Charging Station                                           │
│   Vinhomes Central Park, Bình Thạnh                                     │
│   ⭐ 4.8 (156 đánh giá)                                                 │
│                                                                          │
│   ─────────────────────────────────────────────────────                 │
│   📍 720m từ bạn • 🕐 24/7                                              │
│   ─────────────────────────────────────────────────────                 │
│                                                                          │
│   CỔNG SẠC:                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │ #1  DC 60kW (CCS2)     🟢 Rảnh      3,500đ/kWh                 │  │
│   │ #2  DC 60kW (CCS2)     🔴 Đang sạc  ~45 phút còn lại           │  │
│   │ #3  DC 60kW (CCS2)     🟢 Rảnh      3,500đ/kWh                 │  │
│   │ #4  AC 22kW (Type 2)   🟢 Rảnh      2,800đ/kWh                 │  │
│   │ #5  AC 22kW (Type 2)   🟡 Bảo trì                              │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│   TIỆN ÍCH:                                                             │
│   🅿️ Bãi xe miễn phí • ☕ Cafe gần • 🛒 Siêu thị • 🚻 WC             │
│                                                                          │
│   ─────────────────────────────────────────────────────                 │
│   ĐÁNH GIÁ GẦN ĐÂY:                                                     │
│   ⭐⭐⭐⭐⭐ "Sạc nhanh, tiện lợi" - Anh Minh, 2 ngày trước            │
│   ⭐⭐⭐⭐ "Có 1 cổng hay lỗi" - Chị Lan, 1 tuần trước                 │
│   [Xem tất cả 156 đánh giá]                                             │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │         [📍 Chỉ đường]        [📞 Liên hệ]                     │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│   [⚠️ Báo cáo sai thông tin / Trạm hỏng]                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Technical Notes:**
- Trạm sạc là một loại Provider đặc biệt với schema riêng (charging_stations)
- Real-time status: Integrate API từ VinFast, EVN nếu có, hoặc crowdsource
- Background location để suggest trạm khi pin xe thấp (với permission)
- Offline cache trạm sạc cho khu vực hay đi

---

### F-C09: Đóng góp địa điểm (User-Generated Content)

**Priority:** P1 (Should Have) - Feature mới thêm v2.1

**User Story:**
```
As a người dùng đã sử dụng dịch vụ tại một tiệm hay
I want đóng góp địa điểm đó lên app
So that cộng đồng cũng có thể tìm thấy và sử dụng
```

**Problem Statement:**
- Database hiện có ~1,500 providers nhưng ngoài đời có hàng chục ngàn tiệm
- Không đủ nhân lực đi khảo sát từng tiệm
- Giải pháp: Crowdsource - để cộng đồng tự đóng góp

**Acceptance Criteria:**

**AC1: One-Tap Contribution Flow**
- [ ] FAB button "+" hiển thị trên map view
- [ ] Tap "+" → Mở camera để chụp biển hiệu
- [ ] OCR auto-fill tên tiệm và SĐT từ ảnh (Google Vision API)
- [ ] GPS auto-fill vị trí hiện tại
- [ ] User confirm thông tin → Submit
- [ ] Tổng thời gian < 30 giây

**AC2: GPS Verification**
- [ ] Chỉ cho phép add location khi user ở trong bán kính 100m
- [ ] Hiển thị message nếu user ở xa: "Bạn cần đến gần địa điểm để thêm"

**AC3: Photo AI Verification**
- [ ] AI check ảnh có phải biển hiệu thật (outdoor, có text, không phải stock)
- [ ] Reject nếu ảnh không hợp lệ với hướng dẫn rõ ràng

**AC4: Duplicate Detection**
- [ ] Fuzzy match tên + địa chỉ với database (>80% similarity)
- [ ] Nếu trùng → "Địa điểm này đã có. Bạn muốn cập nhật thông tin?"

**AC5: Contribution Types**
- [ ] Thêm địa điểm mới (có ảnh): +15 điểm
- [ ] Thêm địa điểm mới (không ảnh): +5 điểm
- [ ] Upload thêm ảnh cho địa điểm có sẵn: +3 điểm
- [ ] Cập nhật thông tin (SĐT, giờ mở cửa): +5 điểm
- [ ] Báo cáo tiệm đã đóng cửa: +8 điểm
- [ ] Bị reject (spam/fake): -20 điểm

**AC6: Recognition System - "Discovered by"**
- [ ] Người add đầu tiên được gắn badge vĩnh viễn "Discovered by @username"
- [ ] Badge hiển thị trên provider profile cho tất cả users thấy
- [ ] Không thể thay đổi sau khi đã gắn

**AC7: Tier System**
- [ ] 🥉 Đồng (0-99 điểm): Badge "Người đóng góp"
- [ ] 🥈 Bạc (100-299 điểm): + Verified badge, ưu tiên support
- [ ] 🥇 Vàng (300-999 điểm): + Early access features mới
- [ ] 💎 Kim Cương (1000+ điểm): + Mời bạn bè, VIP events, quà tặng

**AC8: Progress & Gamification**
- [ ] Progress ring trên profile hiển thị tiến độ đến level tiếp theo
- [ ] Animation celebration khi level up
- [ ] Badges collection hiển thị trên profile

**AC9: Impact Visibility**
- [ ] Popup khi mở app: "X người đã xem các địa điểm bạn thêm tuần này"
- [ ] Thống kê trên profile: Địa điểm đã thêm, Thông tin đã sửa, Lượt xem

**AC10: Moderation**
- [ ] Contributions mới vào pending 24h (MVP: manual review)
- [ ] Phase 2: Community vote từ trusted contributors (Vàng+)
- [ ] Random audit 5% contributions mỗi tuần

**UI/UX Notes:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ADD LOCATION FLOW (30 seconds)                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 1: Tap FAB "+"                                                    │
│  ─────────────────────                                                  │
│  ┌──────────────────────────────┐                                       │
│  │     🗺️ Map View              │                                       │
│  │                              │                                       │
│  │         📍 📍               │                                       │
│  │              📍              │                                       │
│  │                        ┌───┐ │                                       │
│  │                        │ + │ │  ← FAB button                        │
│  │                        └───┘ │                                       │
│  └──────────────────────────────┘                                       │
│                                                                          │
│  Step 2: Camera + OCR                                                   │
│  ─────────────────────                                                  │
│  ┌──────────────────────────────┐                                       │
│  │  📷 Chụp biển hiệu           │                                       │
│  │  ┌────────────────────────┐ │                                       │
│  │  │   RỬA XE HOÀNG ANH    │ │                                       │
│  │  │      0909.123.456      │ │                                       │
│  │  └────────────────────────┘ │                                       │
│  │         [ 📸 Chụp ]         │                                       │
│  └──────────────────────────────┘                                       │
│                                                                          │
│  Step 3: Confirm (Auto-filled)                                          │
│  ──────────────────────────────                                         │
│  ┌──────────────────────────────┐                                       │
│  │  ✏️ Thêm địa điểm            │                                       │
│  │                              │                                       │
│  │  Tên: [Rửa Xe Hoàng Anh ✓] │  ← OCR auto-fill                      │
│  │  SĐT: [0909 123 456 ✓]     │  ← OCR auto-fill                      │
│  │  Vị trí: [📍 123 ABC... ✓] │  ← GPS auto-fill                      │
│  │  Loại: [🚿 Rửa xe]         │  ← 1 tap select                       │
│  │                              │                                       │
│  │     [ Thêm địa điểm 🎉 ]    │                                       │
│  └──────────────────────────────┘                                       │
│                                                                          │
│  Step 4: Celebration                                                    │
│  ───────────────────                                                    │
│  ┌──────────────────────────────┐                                       │
│  │      🎊 Confetti 🎊          │                                       │
│  │    ┌──────────────────┐     │                                       │
│  │    │  🏅 +15 điểm     │     │                                       │
│  │    │  Badge: "Người   │     │                                       │
│  │    │  khám phá"       │     │                                       │
│  │    └──────────────────┘     │                                       │
│  │  ████████░░░░ 65/100        │  ← Progress to next level             │
│  │       [ Tuyệt vời! ]        │                                       │
│  └──────────────────────────────┘                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Profile Contributor Stats:**
```
┌──────────────────────────────┐
│      👤 Minh Nguyễn          │
│   ┌─────────────────────┐   │
│   │    🥉 HẠNG ĐỒNG     │   │
│   │   ████████░░░░░░    │   │
│   │      65/100         │   │
│   └─────────────────────┘   │
│                              │
│  📊 Đóng góp của bạn         │
│  ─────────────────────────   │
│  🏪 Địa điểm đã thêm:    12  │
│  ✏️ Thông tin đã sửa:     8  │
│  📸 Ảnh đã upload:       24  │
│  👀 Lượt xem từ bạn:  1,247  │
│                              │
│  🏅 Badges                    │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │ 🔍 │ │ 📸 │ │ 🗺️ │       │
│  │Khám│ │Ảnh │ │Q.1 │       │
│  │phá │ │đẹp │ │Pro │       │
│  └────┘ └────┘ └────┘       │
└──────────────────────────────┘
```

**Technical Notes:**
- Google Vision API cho OCR (extract text từ ảnh biển hiệu)
- PostGIS cho GPS proximity check (ST_DWithin)
- Fuzzy matching với pg_trgm extension cho duplicate detection
- Contribution submissions vào `contributions` table với status pending
- Background job verify và merge vào `providers` table sau khi approved

**Motivation Research (Team Kim Dung Brainstorm):**
- Recognition > Money cho VN users: "Discovered by @username" có giá trị tâm lý lớn
- Progress system (levels, badges) tạo habit quay lại
- Impact visibility ("X người đã xem") tạo cảm giác đóng góp có ý nghĩa
- Competition (leaderboards) sẽ thêm Phase 2 để tạo viral effect

---

**Data Model - Charging Stations:**
```sql
charging_stations (
  id, provider_id,           -- Link to provider (owner)
  name, address, lat, lng,
  station_type (public/private/business),
  operator,                  -- VinFast, EVN, Private...
  working_hours,
  amenities,                 -- JSON: ["parking", "cafe", "wc", "wifi"]
  images,
  total_ports,
  rating_avg, rating_count,
  is_verified,               -- Đã verify thông tin
  created_at, updated_at
)

charging_ports (
  id, station_id,
  port_number,               -- #1, #2, #3...
  connector_type,            -- CCS2, CHAdeMO, Type2, GB/T, Tesla
  power_kw,                  -- 7, 11, 22, 50, 120...
  current_type (AC/DC),
  price_per_kwh,             -- VND/kWh
  price_per_minute,          -- VND/phút (nếu tính theo thời gian)
  status (available/charging/maintenance/offline),
  status_updated_at,
  vehicle_types,             -- ["car", "motorcycle"]
  created_at, updated_at
)

charging_reviews (
  id, station_id, user_id,
  rating, comment,
  wait_time_minutes,         -- Thời gian chờ (crowdsource data)
  created_at
)

charging_reports (
  id, station_id, port_id, user_id,
  report_type (broken/wrong_info/always_busy/other),
  description,
  status (pending/resolved),
  created_at, resolved_at
)
```

---

## PROVIDER APP FEATURES (Charging Station Mode)

### F-P01: Đăng ký làm Thợ

**Priority:** P0 (Must Have)

**User Story:**
```
As a thợ sửa xe
I want đăng ký lên platform
So that tôi có thêm nguồn khách hàng
```

**Acceptance Criteria:**
- [ ] AC1: Chọn loại: Thợ cá nhân / Xưởng
- [ ] AC2: Nhập thông tin: Họ tên, SĐT, CMND/CCCD (ảnh 2 mặt)
- [ ] AC3: Nhập địa chỉ xưởng (nếu có) + pin trên map
- [ ] AC4: Chọn có cứu hộ lưu động không + bán kính
- [ ] AC5: Upload ảnh đại diện + ảnh xưởng (tối đa 5)
- [ ] AC6: Nhập giờ hoạt động
- [ ] AC7: Trạng thái: Chờ duyệt → Được duyệt / Từ chối
- [ ] AC8: Nhận notification khi được duyệt

**Verification Process:**
1. Auto-verify SĐT qua OTP
2. Manual verify CMND (admin review)
3. Optional: Video call verify
4. Timeline: 1-2 ngày làm việc

---

### F-P01b: Đăng ký Trạm Sạc Xe Điện

**Priority:** P0 (Must Have)

**User Story:**
```
As a chủ trạm sạc / địa điểm có trạm sạc
I want đăng ký trạm sạc lên platform
So that người dùng xe điện có thể tìm thấy trạm của tôi
```

**Acceptance Criteria:**
- [ ] AC1: Chọn loại: Trạm công cộng / Trạm tư nhân / Địa điểm có trạm (cafe, mall...)
- [ ] AC2: Nhập thông tin chủ sở hữu
- [ ] AC3: Nhập thông tin trạm:
  - Tên trạm, địa chỉ, vị trí trên map
  - Giờ hoạt động (24/7 hay giới hạn)
  - Operator (VinFast, tự lắp, EVN...)
- [ ] AC4: Thêm từng cổng sạc:
  - Loại cổng: CCS2, CHAdeMO, Type 2, GB/T, Tesla
  - Công suất (kW)
  - AC hay DC
  - Giá sạc (VND/kWh hoặc VND/phút hoặc miễn phí)
  - Hỗ trợ xe máy hay oto
- [ ] AC5: Upload ảnh trạm (vị trí, cổng sạc, hướng dẫn)
- [ ] AC6: Thêm tiện ích xung quanh (parking, cafe, WC, wifi...)
- [ ] AC7: Trạng thái: Chờ duyệt → Được duyệt / Từ chối
- [ ] AC8: Có thể link với business khác (nếu là cafe/mall)

**Registration Flow:**
```
Bước 1: Chọn loại trạm
├── Trạm sạc công cộng (kinh doanh sạc)
├── Trạm sạc tư nhân (cho thuê khi rảnh)
└── Địa điểm có trạm (cafe, mall, khách sạn - thu hút khách)

Bước 2: Thông tin cơ bản
├── Tên, địa chỉ
├── Pin vị trí trên map
└── Giờ hoạt động

Bước 3: Thêm cổng sạc
├── Cổng 1: [Type] [Power] [Price]
├── Cổng 2: [Type] [Power] [Price]
└── [+ Thêm cổng]

Bước 4: Ảnh & Tiện ích
├── Upload ảnh
└── Chọn tiện ích (parking, cafe, WC...)

Bước 5: Xác nhận & Chờ duyệt
```

**Quản lý trạm sạc (sau khi duyệt):**
- [ ] Update trạng thái từng cổng (manual hoặc API nếu có)
- [ ] Sửa giá, giờ hoạt động
- [ ] Xem thống kê lượt xem, navigate
- [ ] Trả lời reviews
- [ ] Báo cáo bảo trì (tạm đóng cổng)

---

### F-P02: Đăng dịch vụ & Định giá

**Priority:** P0 (Must Have)

**User Story:**
```
As a thợ
I want tự đăng dịch vụ và set giá
So that tôi kiểm soát business của mình
```

**Acceptance Criteria:**
- [ ] AC1: Chọn từ danh mục dịch vụ có sẵn hoặc tạo custom
- [ ] AC2: Set giá: Cố định hoặc "Từ X đ"
- [ ] AC3: Thêm mô tả chi tiết
- [ ] AC4: Chọn áp dụng cho loại xe nào
- [ ] AC5: Bật/Tắt dịch vụ (tạm ẩn)
- [ ] AC6: Edit/Delete dịch vụ
- [ ] AC7: Không giới hạn số dịch vụ

**Service Categories (Predefined):**
```
🆘 CỨU HỘ KHẨN CẤP:
├── Cứu hộ lốp (vá, thay, bơm)
├── Cứu hộ ắc quy (câu, thay)
├── Cứu hộ hết xăng
├── Kéo xe (xe máy)
├── Kéo xe (oto)
├── Mở khóa xe
└── [Custom]

🔧 SỬA CHỮA:
├── Sửa chữa xe máy tổng hợp
├── Sửa chữa oto tổng hợp
├── Sửa phanh
├── Sửa điện, đèn
├── Thay nhớt, lọc
├── Thay lốp, ruột
├── Sửa hộp số
└── [Custom]

🛠️ BẢO DƯỠNG:
├── Bảo dưỡng định kỳ xe máy
├── Bảo dưỡng định kỳ oto
├── Kiểm tra tổng quát
├── Thay dầu, lọc
├── Vệ sinh kim phun
├── Súc béc, rửa buồng đốt
└── [Custom]

🎨 ĐỒNG SƠN:
├── Sơn lại toàn bộ
├── Sơn phục hồi cục bộ
├── Xử lý trầy xước
├── Phục hồi đèn pha
├── Phủ nano sơn
└── [Custom]

🚿 RỬA XE & LÀM ĐẸP:
├── Rửa xe cơ bản
├── Rửa xe cao cấp
├── Rửa gầm
├── Đánh bóng
├── Phủ ceramic
├── Vệ sinh nội thất
├── Khử mùi, diệt khuẩn
├── Dọn nội thất chi tiết (detailing)
└── [Custom]

🏎️ ĐỘ XE & PHỤ KIỆN:
├── Độ pô, ống xả
├── Độ đèn, led
├── Dán phim cách nhiệt
├── Wrap đổi màu xe
├── Nâng cấp âm thanh
├── Lắp camera hành trình
├── Lắp cảm biến, thiết bị
├── Độ gầm, giảm xóc
└── [Custom]

⚡ TRẠM SẠC XE ĐIỆN:
├── Trạm sạc công cộng (VinFast, EVN, etc.)
├── Trạm sạc tư nhân
├── Điểm sạc tại cafe/nhà hàng
├── Điểm sạc tại mall/siêu thị
├── Điểm sạc tại khách sạn
├── Điểm sạc tại bãi xe
├── Sạc nhanh DC (CCS2, CHAdeMO)
├── Sạc chậm AC (Type 2)
├── Sạc xe máy điện
└── [Custom]

📋 DỊCH VỤ KHÁC:
├── Bãi giữ xe
├── Hỗ trợ đăng kiểm
├── Sang tên, đổi biển
├── Ký gửi xe
└── [Custom]
```

**Provider Type Mapping:**
| Category | Provider Types |
|----------|----------------|
| Cứu hộ khẩn cấp | Thợ freelance, Công ty cứu hộ |
| Sửa chữa | Tiệm sửa xe, Xưởng, Garage |
| Bảo dưỡng | Xưởng, Garage, Head chính hãng |
| Đồng sơn | Xưởng đồng sơn, Garage |
| Rửa xe | Tiệm rửa xe, Car care center |
| Độ xe | Garage độ, Shop phụ kiện |
| Trạm sạc | Trạm công cộng, Tư nhân, Địa điểm có sạc |

---

### F-P03: Nhận và Xử lý đơn

**Priority:** P0 (Must Have)

**User Story:**
```
As a thợ
I want nhận thông báo khi có đơn mới
So that tôi không bỏ lỡ khách hàng
```

**Acceptance Criteria:**
- [ ] AC1: Push notification khi có đơn mới
- [ ] AC2: Hiển thị: Dịch vụ, Vị trí khách, Khoảng cách, Ghi chú
- [ ] AC3: Hiển thị: Tiền thu khách, Tiền thợ nhận (sau commission)
- [ ] AC4: Actions: Nhận đơn / Từ chối (chọn lý do) / Hỏi thêm
- [ ] AC5: Timeout 2 phút nếu không phản hồi
- [ ] AC6: Sau khi nhận: Hiển thị SĐT khách + route đến
- [ ] AC7: Update trạng thái: Đang đến → Đã đến → Đang sửa → Hoàn thành

**Technical Notes:**
- High-priority FCM notification
- Foreground service để nhận đơn khi app background
- Sound + Vibration alert

---

### F-P04: Thống kê & Báo cáo

**Priority:** P0 (Must Have) - Basic, P1 (Should Have) - Advanced

**User Story:**
```
As a thợ
I want xem thống kê doanh thu và đơn hàng
So that tôi quản lý business hiệu quả
```

**Acceptance Criteria:**
- [ ] AC1: Dashboard: Doanh thu hôm nay, Số đơn, Rating
- [ ] AC2: Filter theo: Ngày, Tuần, Tháng
- [ ] AC3: Chart doanh thu theo thời gian
- [ ] AC4: Top dịch vụ bán chạy
- [ ] AC5: Giờ cao điểm
- [ ] AC6: Export báo cáo (Excel) - P1

---

### F-P05: Ví & Rút tiền

**Priority:** P1 (Should Have) - MVP dùng COD, thợ giữ tiền mặt

**User Story:**
```
As a thợ nhận thanh toán online
I want rút tiền về tài khoản
So that tôi nhận được thu nhập
```

**Acceptance Criteria:**
- [ ] AC1: Hiển thị số dư khả dụng
- [ ] AC2: Hiển thị tiền đang chờ (đơn online chưa qua 24h)
- [ ] AC3: Rút tiền về ngân hàng/Momo
- [ ] AC4: Lịch sử giao dịch
- [ ] AC5: Thời gian rút: Trong 24h
- [ ] AC6: Phí rút: 0đ

---

### F-P06: Quản lý Profile

**Priority:** P0 (Must Have)

**User Story:**
```
As a thợ
I want cập nhật thông tin profile
So that khách hàng thấy thông tin chính xác
```

**Acceptance Criteria:**
- [ ] AC1: Edit: Tên, Ảnh, Địa chỉ, Giờ mở cửa
- [ ] AC2: Edit: Mô tả giới thiệu
- [ ] AC3: Update gallery ảnh
- [ ] AC4: Toggle: Online/Offline status
- [ ] AC5: Toggle: Có cứu hộ lưu động / Chỉ tại xưởng

---

## ADMIN FEATURES

### F-A01: Duyệt Thợ mới

**Priority:** P0 (Must Have)

**Acceptance Criteria:**
- [ ] AC1: Danh sách thợ chờ duyệt
- [ ] AC2: Xem chi tiết hồ sơ + ảnh CMND
- [ ] AC3: Actions: Duyệt / Từ chối (ghi lý do)
- [ ] AC4: Auto-send notification khi duyệt/từ chối

---

### F-A02: Quản lý Đơn hàng

**Priority:** P0 (Must Have)

**Acceptance Criteria:**
- [ ] AC1: Danh sách tất cả đơn
- [ ] AC2: Filter: Status, Date range, Area, Provider
- [ ] AC3: Xem chi tiết đơn
- [ ] AC4: Xử lý dispute/khiếu nại

---

### F-A03: Analytics Dashboard

**Priority:** P1 (Should Have)

**Acceptance Criteria:**
- [ ] AC1: Tổng quan: Orders, Revenue, Users, Providers
- [ ] AC2: Charts theo thời gian
- [ ] AC3: Heatmap đơn hàng theo khu vực
- [ ] AC4: Top providers

---

## 4. Non-Functional Requirements

### 4.1 Performance

| Metric | Requirement |
|--------|-------------|
| App launch time | < 3 seconds |
| Search results load | < 3 seconds |
| API response time | < 500ms (p95) |
| Push notification delivery | < 5 seconds |

### 4.2 Scalability

| Metric | MVP Target | Year 1 Target |
|--------|------------|---------------|
| Concurrent users | 500 | 5,000 |
| Orders per day | 100 | 1,000 |
| Database size | 10 GB | 100 GB |

### 4.3 Security

- [ ] Data encryption at rest and in transit (TLS 1.3)
- [ ] PII (CMND, SĐT) encrypted with AES-256
- [ ] OWASP Top 10 compliance
- [ ] Rate limiting on all APIs
- [ ] Phone number masking between consumer-provider

### 4.4 Availability

- [ ] 99.5% uptime SLA
- [ ] Graceful degradation khi service down
- [ ] Offline fallback: Hiện hotline khi mất mạng

### 4.5 Compliance

- [ ] Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân
- [ ] Terms of Service và Privacy Policy
- [ ] CMND verification và lưu trữ theo quy định

---

## 5. Technical Architecture

### 5.1 System Overview (Unified App Architecture)

> **THAY ĐỔI QUAN TRỌNG (v2.0):** Consumer App và Provider App được gộp thành **MỘT APP DUY NHẤT** với chức năng chuyển đổi mode.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE (UNIFIED APP)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│          ┌─────────────────────────────────────┐                        │
│          │         XE 247 UNIFIED APP          │                        │
│          │          (React Native)             │                        │
│          │                                     │                        │
│          │   ┌───────────┐  ┌───────────┐    │   ┌──────────────┐     │
│          │   │ Consumer  │  │ Provider  │    │   │    Admin     │     │
│          │   │   Mode    │◄─┤   Mode    │    │   │  Web (React) │     │
│          │   └───────────┘  └───────────┘    │   └──────┬───────┘     │
│          │                                     │          │             │
│          │   Shared: Auth, UI, Navigation     │          │             │
│          └──────────────┬──────────────────────┘          │             │
│                         │                                 │             │
│                         └─────────────┬───────────────────┘             │
│                                       │                                  │
│                                       ▼                                  │
│                              ┌─────────────────┐                        │
│                              │   API Gateway   │                        │
│                              │  (Express.js)   │                        │
│                              └────────┬────────┘                        │
│                                       │                                  │
│             ┌─────────────────────────┼─────────────────────────┐       │
│             │                         │                         │       │
│             ▼                         ▼                         ▼       │
│      ┌─────────────┐          ┌─────────────┐          ┌─────────────┐ │
│      │    Auth     │          │   Search    │          │  Provider   │ │
│      │   Module    │          │   Module    │          │   Module    │ │
│      └─────────────┘          └─────────────┘          └─────────────┘ │
│             │                         │                         │       │
│      ┌─────────────┐          ┌─────────────┐          ┌─────────────┐ │
│      │   Review    │          │     EV      │          │  Contact    │ │
│      │   Module    │          │   Module    │          │   Module    │ │
│      └─────────────┘          └─────────────┘          └─────────────┘ │
│                                       │                                  │
│                                       ▼                                  │
│                              ┌─────────────────┐                        │
│                              │   PostgreSQL    │                        │
│                              │   + PostGIS     │                        │
│                              │   + Redis       │                        │
│                              └─────────────────┘                        │
│                                                                          │
│   External Services:                                                    │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│   │ Firebase │ │ Google   │ │  Zalo    │ │ Facebook │ │ Deep     │   │
│   │ Auth+FCM │ │ Maps     │ │   API    │ │ Messenger│ │ Links    │   │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                         UNIFIED APP MODE SWITCHING
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   USER OPENS APP                                                        │
│         │                                                               │
│         ▼                                                               │
│   ┌─────────────┐     YES    ┌─────────────┐                           │
│   │ Has Provider │─────────▶│  Show Mode  │                           │
│   │   Account?  │           │   Selector  │                           │
│   └──────┬──────┘           └──────┬──────┘                           │
│          │ NO                      │                                    │
│          ▼                         ▼                                    │
│   ┌─────────────┐           ┌─────────────┐                           │
│   │  Consumer   │           │  User picks │                           │
│   │    Mode     │           │    mode     │                           │
│   └─────────────┘           └──────┬──────┘                           │
│                                    │                                    │
│              ┌─────────────────────┼─────────────────────┐             │
│              │                     │                     │             │
│              ▼                     │                     ▼             │
│      ┌─────────────┐              │              ┌─────────────┐      │
│      │  CONSUMER   │              │              │  PROVIDER   │      │
│      │    MODE     │◄─────────────┼─────────────▶│    MODE     │      │
│      │             │    Switch    │    Switch    │             │      │
│      │ • Home      │    Button    │    Button    │ • Dashboard │      │
│      │ • Search    │    in        │    in        │ • Services  │      │
│      │ • EV Map    │    Profile   │    Profile   │ • Analytics │      │
│      │ • Profile   │    Tab       │    Tab       │ • Profile   │      │
│      └─────────────┘              │              └─────────────┘      │
│                                   │                                    │
│                         ┌─────────┴─────────┐                         │
│                         │                   │                         │
│                         │  BECOME PROVIDER  │                         │
│                         │  (First time)     │                         │
│                         │                   │                         │
│                         │  • Registration   │                         │
│                         │  • Verification   │                         │
│                         │  • Setup Services │                         │
│                         │                   │                         │
│                         └───────────────────┘                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.1.1 Unified App Benefits

| Aspect | 2 Apps (Before) | 1 Unified App (Now) |
|--------|-----------------|---------------------|
| **Development** | 2 codebases | 1 codebase (-40% effort) |
| **Maintenance** | 2x updates | 1x updates |
| **User Experience** | Download 2 apps | 1 app, switch modes |
| **Auth** | Login twice | Login once |
| **App Size** | 2 × 50MB | 1 × 65MB |
| **Store Submission** | 2 submissions | 1 submission |

### 5.2 Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Mobile** | React Native (Unified App) | Cross-platform, single codebase cho cả Consumer và Provider |
| **State Management** | Zustand | Lightweight, dễ quản lý mode switching |
| **Navigation** | React Navigation 6 | Hỗ trợ nested navigators cho 2 modes |
| **Admin Web** | React + Vite | Fast, modern |
| **Backend** | Node.js + Express/Fastify | JavaScript ecosystem, fast development |
| **Database** | PostgreSQL + PostGIS | Relational data, geospatial queries |
| **ORM** | Drizzle ORM | Type-safe, performant |
| **Cache** | Redis | Session, caching |
| **Cloud** | AWS / GCP | Scalable, reliable |
| **Auth** | Firebase Auth | OTP, OAuth ready |
| **Push** | Firebase Cloud Messaging | Free, reliable |
| **Maps** | Google Maps SDK | Best coverage VN |
| **Contact** | Zalo API, Deep Links | Liên hệ trực tiếp qua Zalo/FB |

### 5.3 Database Schema (Simplified)

```sql
-- Users (Consumer)
users (
  id, phone, name, email, avatar,
  created_at, updated_at
)

-- Service Categories (Admin defined)
categories (
  id, parent_id,              -- Null if top-level
  name, slug, icon,           -- "Cứu hộ khẩn cấp", "cuu-ho", "🆘"
  description,
  sort_order, is_active,
  created_at, updated_at
)

-- Example categories:
-- id=1: Cứu hộ khẩn cấp (parent=null)
-- id=2: Cứu hộ lốp (parent=1)
-- id=3: Cứu hộ ắc quy (parent=1)
-- id=10: Rửa xe & Làm đẹp (parent=null)
-- id=11: Rửa xe cơ bản (parent=10)

-- Provider Types
provider_types (
  id, name, slug,             -- "Thợ freelance", "Tiệm rửa xe", "Garage"
  description, icon,
  requires_verification,      -- true/false
  created_at
)

-- Providers (Thợ/Xưởng/Tiệm)
providers (
  id, user_id, 
  provider_type_id,           -- FK to provider_types
  name, description, 
  address, lat, lng,
  working_hours,              -- JSON: {"mon": "6:00-22:00", ...}
  has_mobile_service,         -- Có cứu hộ/dịch vụ tận nơi?
  service_radius,             -- km
  images,                     -- JSON array of URLs
  status (pending/approved/rejected/suspended),
  rating_avg, rating_count,
  verified_at,
  created_at, updated_at
)

-- Provider Categories (Many-to-many: Provider thuộc categories nào)
provider_categories (
  provider_id, category_id,
  PRIMARY KEY (provider_id, category_id)
)

-- Services (Dịch vụ cụ thể của Provider)
services (
  id, provider_id, 
  category_id,                -- FK to categories (leaf level)
  name,                       -- Custom name hoặc dùng category name
  price, price_type (fixed/from/range/contact),
  price_max,                  -- Nếu type=range
  description,
  duration_minutes,           -- Thời gian dự kiến
  vehicle_types,              -- JSON: ["xe_may", "oto"]
  is_active,
  created_at, updated_at
)

-- Orders
orders (
  id, consumer_id, provider_id, service_id,
  order_type (mobile/at_shop), -- Tận nơi hay đến xưởng
  status (pending/accepted/arriving/in_progress/completed/cancelled),
  address, lat, lng, note,
  vehicle_type, vehicle_info,  -- "Xe máy", "Wave RSX đỏ"
  price, extra_fee, tip, commission, total,
  payment_method, payment_status,
  scheduled_at,               -- Null = ngay, có giá trị = đặt lịch
  created_at, accepted_at, arrived_at, completed_at
)

-- Reviews
reviews (
  id, order_id, consumer_id, provider_id,
  rating, tags,               -- JSON: ["dung_gio", "than_thien"]
  comment, images,
  provider_reply, replied_at,
  is_visible,                 -- Admin có thể ẩn
  created_at
)

-- Provider Wallet
wallets (
  id, provider_id, 
  balance, pending_balance,
  updated_at
)

-- Transactions
transactions (
  id, wallet_id, 
  type (order_credit/commission_debit/withdrawal/refund),
  amount, reference_id, 
  status (pending/completed/failed),
  note,
  created_at
)

-- Saved Providers (Favorites)
saved_providers (
  user_id, provider_id,
  created_at,
  PRIMARY KEY (user_id, provider_id)
)
```

---

### 5.4 Unified App Screen Inventory

> **Total: 43 screens** (38 screens v2.0 + 5 screens UGC v2.1)

#### Shared Screens (5 screens)

| # | Screen | Mô tả |
|---|--------|-------|
| S01 | Splash | Loading screen |
| S02 | Onboarding | 3 slides giới thiệu |
| S03 | Login/Register | SĐT + OTP |
| S04 | OTP Input | Nhập mã xác thực |
| S05 | Mode Selector | Chọn Consumer/Provider mode |

#### Consumer Mode Screens (23 screens) - Updated v2.1

| # | Screen | Mô tả |
|---|--------|-------|
| C01 | Home | Categories + Nearby + Search |
| C02 | Category List | Danh sách provider theo category |
| C03 | Map View | Xem provider trên map |
| C04 | Provider Profile | Chi tiết + LIÊN HỆ buttons |
| C05 | Provider Gallery | Xem ảnh |
| C06 | Provider Reviews | Tất cả đánh giá |
| C07 | EV Charging Map | Bản đồ trạm sạc |
| C08 | EV Station Detail | Chi tiết trạm sạc |
| C09 | EV Station Filter | Bộ lọc trạm sạc |
| C10 | Search | Tìm kiếm dịch vụ |
| C11 | Search Results | Kết quả tìm kiếm |
| C12 | Rating Screen | Đánh giá sau liên hệ |
| C13 | Rating Success | Xác nhận đã đánh giá |
| C14 | Consumer Profile | Thông tin cá nhân + Contributor Stats |
| C15 | Favorites | Danh sách yêu thích |
| C16 | Recently Viewed | Đã xem gần đây |
| C17 | Settings | Cài đặt app |
| C18 | Report Provider | Báo cáo sai thông tin |
| **C19** | **Add Location Camera** | **Chụp ảnh biển hiệu (OCR)** |
| **C20** | **Add Location Confirm** | **Xác nhận thông tin địa điểm** |
| **C21** | **Contribution Success** | **Celebration + điểm + badge** |
| **C22** | **My Contributions** | **Danh sách địa điểm đã đóng góp** |
| **C23** | **Contributor Leaderboard** | **Bảng xếp hạng (Phase 2)** |

#### Provider Mode Screens (12 screens)

| # | Screen | Mô tả |
|---|--------|-------|
| P01 | Provider Dashboard | Overview + Stats |
| P02 | Registration Form | Đăng ký provider mới |
| P03 | Contact Setup | Thiết lập Zalo/FB/SĐT |
| P04 | Pending Approval | Chờ duyệt |
| P05 | Profile Management | Sửa thông tin |
| P06 | Service List | Quản lý dịch vụ |
| P07 | Add/Edit Service | Thêm/sửa dịch vụ |
| P08 | Reviews List | Xem đánh giá |
| P09 | Reply Review | Trả lời đánh giá |
| P10 | Statistics | Thống kê chi tiết |
| P11 | EV Station Setup | Đăng ký trạm sạc |
| P12 | EV Station Manage | Quản lý trạm sạc |

#### Admin Web Screens (6 screens)

| # | Screen | Mô tả |
|---|--------|-------|
| A01 | Login | Admin login |
| A02 | Dashboard | Overview stats |
| A03 | Provider List | Danh sách provider |
| A04 | Provider Approval | Duyệt provider mới |
| A05 | Category Management | Quản lý danh mục |
| A06 | Reports | Xử lý báo cáo |

---

## 6. Business Model

### 6.1 Revenue Streams

| Stream | Model | Rate | When |
|--------|-------|------|------|
| **Commission** | % per order | 15% | MVP |
| **Promoted Listing** | CPC/CPD | 50k/day | V1.1 |
| **Subscription** | Monthly fee | 200-500k/mo | V2.0 |
| **Lead Fee** | Per call/direction | 5-10k | V2.0 |

### 6.2 Commission Structure

```
Đơn hàng: 100,000đ

Consumer trả: 100,000đ
├── Provider nhận: 85,000đ (85%)
└── Platform: 15,000đ (15%)

Nếu COD: Thợ thu 100k → Cuối tuần trừ commission
Nếu Online: App giữ → Chuyển 85k cho thợ
```

### 6.3 Unit Economics (Target)

| Metric | Target |
|--------|--------|
| Average Order Value (AOV) | 80,000đ |
| Commission Rate | 15% |
| Revenue per Order | 12,000đ |
| Orders per Provider/month | 50 |
| Revenue per Provider/month | 600,000đ |
| Target Providers (Year 1) | 2,000 |
| Monthly Revenue Target | 1.2B VND |

---

## 7. Go-to-Market Strategy

### 7.1 Launch Plan

**Phase 0: Pre-launch (Week 1-4)**
- Seed 50-100 providers trong Q1, HCM
- Manual onboarding, training
- Free 3 tháng (no commission)

**Phase 1: Soft Launch (Week 5-8)**
- Launch Consumer app trong Q1
- Marketing: FB Ads targeting shipper
- Target: 500 MAU, 50 orders/week

**Phase 2: Expansion (Month 3-6)**
- Mở rộng Q3, Q7, Bình Thạnh
- Onboard thêm 200 providers
- Target: 5,000 MAU, 200 orders/week

**Phase 3: Scale (Month 6-12)**
- Mở rộng toàn HCM
- Launch Hà Nội
- Target: 50,000 MAU

### 7.2 Marketing Channels

| Channel | Target | Budget |
|---------|--------|--------|
| Facebook Ads | Shipper, văn phòng | 30% |
| Google Ads | "cứu hộ lốp", "vá lốp gần đây" | 20% |
| Referral | Existing users | 20% |
| Partnership | Grab, Be, Gojek | 15% |
| Offline | Flyers tại tiệm lốp | 15% |

### 7.3 Chicken-Egg Solution

```
PROBLEM: Không có thợ → Không có khách → Không có thợ

SOLUTION:

1. SEED SUPPLY FIRST
   - Đội ngũ đi đăng ký 50 thợ/xưởng đầu tiên
   - Incentive: Free 3 tháng, priority support
   - Focus 1 quận trước (Q1, HCM)

2. THEN DRIVE DEMAND
   - Marketing campaign trong quận đó
   - Đảm bảo user luôn tìm thấy thợ
   - Word of mouth trong giới shipper

3. NETWORK EFFECTS
   - Thợ thấy có đơn → Tự đăng ký thêm
   - User thấy có thợ → Giới thiệu bạn bè
   - Virtuous cycle begins
```

---

## 8. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Không đủ supply (thợ) | High | Medium | Seed manually, incentivize early adopters |
| Chất lượng thợ kém | High | Medium | Verify CMND, rating system, suspension policy |
| Thợ chặt chém (giá khác app) | Medium | High | Mandatory photo receipt, dispute process |
| Competition (Grab, Be) | High | Low | First mover, chuyên sâu vertical |
| Payment fraud | Medium | Low | KYC, transaction limits, monitoring |

---

## 9. Timeline & Milestones

> **Timeline được tối ưu** nhờ Unified App approach (giảm 3-4 tuần so với 2 apps riêng)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROJECT TIMELINE (UNIFIED APP)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PHASE 1: FOUNDATION (Week 1-2)                                         │
│  ═══════════════════════════════                                        │
│  ├── Finalize PRD + HLD ✓                                               │
│  ├── Database schema + Seed data                                        │
│  ├── Auth module (Firebase OTP + JWT)                                   │
│  ├── Basic API scaffold                                                 │
│  └── CI/CD pipeline setup                                               │
│                                                                          │
│  PHASE 2: CONSUMER FEATURES (Week 3-4)                                  │
│  ════════════════════════════════════                                   │
│  ├── Home screen với categories                                         │
│  ├── Provider search (geo query)                                        │
│  ├── Provider profile + Contact flow                                    │
│  ├── Rating & Review system                                             │
│  └── Favorites & Recent views                                           │
│                                                                          │
│  PHASE 3: PROVIDER FEATURES (Week 5-6)                                  │
│  ════════════════════════════════════                                   │
│  ├── Provider registration flow                                         │
│  ├── Service management                                                 │
│  ├── Profile management + Analytics                                     │
│  └── MODE SWITCHING implementation                                      │
│                                                                          │
│  PHASE 4: EV CHARGING + ADMIN (Week 7)                                  │
│  ════════════════════════════════════                                   │
│  ├── EV charging station module                                         │
│  ├── Admin web dashboard                                                │
│  └── Provider approval workflow                                         │
│                                                                          │
│  PHASE 5: TESTING & POLISH (Week 8)                                     │
│  ═══════════════════════════════════                                    │
│  ├── Integration testing                                                │
│  ├── Performance optimization                                           │
│  ├── UI polish & animations                                             │
│  └── App store submission prep                                          │
│                                                                          │
│  PHASE 6: SOFT LAUNCH (Week 9-10)                                       │
│  ═══════════════════════════════                                        │
│  ├── Seed 50-100 providers (Q1, HCM)                                    │
│  ├── Beta launch + Feedback collection                                  │
│  └── Critical fixes                                                     │
│                                                                          │
│  PHASE 7: PUBLIC LAUNCH (Month 3+)                                      │
│  ════════════════════════════════                                       │
│  ├── App Store + Google Play release                                    │
│  ├── Marketing campaign                                                 │
│  └── Scale to other districts                                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                         EFFORT COMPARISON
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   Approach          │  Screens  │  Dev Effort  │  Timeline              │
│   ──────────────────┼───────────┼──────────────┼─────────────────       │
│   2 Separate Apps   │    61     │   100%       │   12 weeks             │
│   1 Unified App     │    38     │   ~65%       │   8-10 weeks           │
│   ──────────────────┼───────────┼──────────────┼─────────────────       │
│   SAVINGS           │   -38%    │   -35%       │   -3-4 weeks           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Appendix

### A. Competitive Analysis

**Cứu hộ & Sửa chữa:**
| Competitor | Model | Pros | Cons |
|------------|-------|------|------|
| Cứu hộ 24h | Hotline | Known brand | No app, no transparency |
| VETC | Subscription | Large network | Not specialized |
| Lốp Việt | Chain store | Quality assured | Not mobile, chỉ lốp |

**Bảo dưỡng:**
| Competitor | Model | Pros | Cons |
|------------|-------|------|------|
| Head hãng (Honda, Toyota...) | Authorized | Trust, warranty | Expensive |
| Garage độc lập | Local | Cheaper | No review system |
| MyGo (Bosch) | Franchise | Quality | Limited locations |

**Rửa xe:**
| Competitor | Model | Pros | Cons |
|------------|-------|------|------|
| Tiệm rửa xe local | Walk-in | Nhiều nơi | Chất lượng không đều |
| JAVI | Chain | Consistent | Giới hạn location |
| Các app rửa xe nhỏ | On-demand | Tiện | Không scale được |

**Độ xe:**
| Competitor | Model | Pros | Cons |
|------------|-------|------|------|
| Garage độ local | Offline | Expertise | Khó tìm, khó so sánh |
| Groups Facebook | Social | Community | Không có booking/payment |

**Tổng hợp - Cơ hội:**
- Chưa có platform nào cover TẤT CẢ dịch vụ xe
- Fragmented market = opportunity cho aggregator
- First mover advantage trong category này

### B. Glossary

| Term | Definition |
|------|------------|
| Consumer | Chủ xe, người dùng cần dịch vụ |
| Provider | Nhà cung cấp dịch vụ (thợ, xưởng, tiệm) |
| GMV | Gross Merchandise Value - Tổng giá trị giao dịch |
| MAU | Monthly Active Users |
| COD | Cash on Delivery - Thanh toán khi nhận |
| ETA | Estimated Time of Arrival |
| Walk-in | Khách đến trực tiếp không đặt trước |
| Mobile service | Dịch vụ tận nơi (thợ đến chỗ khách) |
| Detailing | Vệ sinh, làm đẹp xe chuyên sâu |

### C. Open Questions

- [ ] Commission rate: 15% hay 10%? Có khác nhau theo category?
- [ ] Minimum withdrawal amount?
- [ ] Verification process: Manual hay video call? Khác nhau theo loại provider?
- [ ] Insurance/Liability khi có sự cố?
- [ ] Có cho phép provider set multiple locations không?
- [ ] Booking ahead (đặt lịch) có cần MVP không?
- [ ] Có category nào cần verify chứng chỉ/bằng cấp?

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-10 | Hoàng Dung | Initial draft - Lốp 247 |
| 1.1 | 2026-04-10 | Hoàng Dung | Mở rộng thành Xe 247 - đa dịch vụ |
| 2.0 | 2026-04-20 | Hoàng Dung + Dương Quá | Unified App Architecture - Gộp Consumer + Provider thành 1 app với mode switching. Thêm HLD document. Giảm 38% screens, 35% effort. |
| **2.1** | **2026-04-23** | **Team Kim Dung (Hoa Sơn Luận Kiếm)** | **Thêm F-C09: UGC Feature** - User đóng góp địa điểm với OCR, GPS verification, gamification (tiers, badges, leaderboards). 48 ideas brainstorm → 5 top initiatives. +5 screens mới. |

---

## Related Documents

- **[HIGH-LEVEL-DESIGN.md](./HIGH-LEVEL-DESIGN.md)** - Chi tiết kiến trúc kỹ thuật
- **[USER-FLOWS.md](./USER-FLOWS.md)** - Chi tiết user flows
- **[DESIGN.md](./DESIGN.md)** - Design specifications

---

*"Sản phẩm tốt giải quyết vấn đề thật. Xe 247 - Mọi dịch vụ xe, một ứng dụng."*

— Hoàng Dung, Product Owner
