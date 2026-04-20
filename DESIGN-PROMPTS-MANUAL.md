# XE 247 - DESIGN PROMPTS (Manual Use)

> **Mục đích:** Copy prompts này vào Stitch web, Figma AI, hoặc bất kỳ AI design tool nào
> **Style Reference:** Grab, Gojek, Airbnb, Uber, Wise, Revolut
> **Device:** iPhone 14 Pro (390 x 844 pixels)

---

## QUAN TRỌNG: Design Rules

Mỗi prompt đều cần tuân thủ:

```
SAFE AREAS (iPhone):
- Top: 59px (Dynamic Island)
- Bottom: 34px (Home Indicator)

SPACING (8pt grid):
- 4px / 8px / 12px / 16px / 24px / 32px / 48px

TYPOGRAPHY (Inter font):
- Hero: 32px Bold
- H1: 24px Semibold  
- H2: 20px Semibold
- H3: 16px Medium
- Body: 14px Regular
- Caption: 12px Regular

COLORS:
- Primary: #2563EB
- Secondary: #10B981
- Accent/Emergency: #F59E0B
- Background: #F8FAFC
- Surface: #FFFFFF
- Text: #1E293B
- Text Secondary: #64748B
- Border: #E2E8F0

COMPONENTS:
- Button height: 48-56px
- Input height: 48px
- Touch target: 44px minimum
- Border radius: 8-12px
- Card shadow: 0 2px 8px rgba(0,0,0,0.08)
```

---

## CONSUMER APP

---

### C01. SPLASH SCREEN

```
Create a splash screen for "Xe 247" Vietnamese vehicle services app.

DEVICE: iPhone 14 Pro, 390x844px
STYLE: Premium fintech app like Wise or Revolut

BACKGROUND:
- Full screen gradient
- Start: #2563EB (top)
- End: #1E40AF (bottom)
- Direction: top to bottom

CENTER CONTENT (exactly centered vertically and horizontally):

1. LOGO CONTAINER
   - White circle, diameter 120px
   - Drop shadow: 0 12px 32px rgba(0,0,0,0.2)
   - Inside: "247" text
     - Font: Inter Bold, 42px
     - Color: #2563EB
     - Centered

2. APP NAME (24px below logo)
   - Text: "Xe 247"
   - Font: Inter Bold, 32px
   - Color: #FFFFFF
   - Letter spacing: -0.5px

3. TAGLINE (8px below app name)
   - Text: "Mọi dịch vụ xe - Một ứng dụng"
   - Font: Inter Regular, 16px
   - Color: rgba(255,255,255,0.7)

4. LOADING BAR (48px below tagline)
   - Container: 120px wide, 4px tall
   - Background: rgba(255,255,255,0.2)
   - Border radius: 2px
   - Animated fill bar: white, 40px wide, moving left to right

5. VERSION (fixed 24px from bottom edge)
   - Text: "v2.0.0"
   - Font: Inter Regular, 12px
   - Color: rgba(255,255,255,0.4)

NO navigation bars, NO status bar styling (let it be transparent)
```

---

### C02. ONBOARDING (Slide 1 of 3)

```
Create onboarding screen slide 1 for Xe 247 app.

DEVICE: iPhone 14 Pro, 390x844px
STYLE: Clean, friendly like modern super apps

LAYOUT:

TOP AREA (starts at 80px from top for safe area):
- "Bỏ qua" text button
  - Position: top right, 16px from right edge
  - Font: Inter Medium, 14px
  - Color: #64748B

CENTER CONTENT (centered in remaining space):

1. ILLUSTRATION AREA
   - Size: 280px x 220px
   - Content: Abstract illustration of a map with location pins
   - Style: Flat design, use brand colors
   - Primary pin: #F59E0B (orange)
   - Secondary pins: #2563EB (blue)

2. TITLE (32px below illustration)
   - Text: "Tìm dịch vụ xe nhanh chóng"
   - Font: Inter Bold, 24px
   - Color: #1E293B
   - Text align: center

3. DESCRIPTION (12px below title)
   - Text: "Hàng ngàn thợ sửa xe, xưởng bảo dưỡng, tiệm rửa xe ngay gần bạn"
   - Font: Inter Regular, 16px
   - Color: #64748B
   - Text align: center
   - Max width: 300px
   - Line height: 24px

BOTTOM AREA (fixed, 48px from bottom safe area):

1. DOT INDICATORS (centered)
   - 3 dots, 8px diameter each
   - Spacing: 8px between dots
   - Dot 1: #2563EB (active)
   - Dot 2, 3: #E2E8F0 (inactive)

2. NEXT BUTTON (16px below dots)
   - Width: calc(100% - 32px)
   - Height: 56px
   - Background: #2563EB
   - Border radius: 12px
   - Text: "Tiếp theo"
   - Font: Inter Semibold, 16px
   - Color: #FFFFFF
   - Centered
```

---

### C03. ONBOARDING (Slide 3 - Final)

```
Create final onboarding screen for Xe 247 - emphasizing direct contact.

DEVICE: iPhone 14 Pro, 390x844px

Same layout as slide 1, but with:

ILLUSTRATION:
- Phone device showing contact options
- Icons floating around: Phone icon, Zalo logo, Facebook Messenger icon
- Style: Friendly, approachable

TITLE:
- "Liên hệ trực tiếp, không qua trung gian"

DESCRIPTION:
- "Gọi điện, nhắn Zalo, hoặc Facebook - bạn chọn cách liên hệ phù hợp nhất"

DOT INDICATORS:
- Dot 3: #2563EB (active)
- Dot 1, 2: #E2E8F0 (inactive)

BUTTON:
- Text: "Bắt đầu ngay"
- Same style as other slides
```

---

### C04. LOGIN / REGISTER

```
Create login/register screen for Xe 247 app.

DEVICE: iPhone 14 Pro, 390x844px
STYLE: Clean, trustworthy like Grab

LAYOUT:

TOP SECTION (starts 80px from top):

1. LOGO
   - Centered horizontally
   - "Xe 247" with car icon
   - Size: 48px height
   - Color: #2563EB

2. TAGLINE (16px below)
   - Text: "Mọi dịch vụ xe - Một ứng dụng"
   - Font: Inter Regular, 14px
   - Color: #64748B

FORM SECTION (centered, starts 48px below tagline):

1. SECTION TITLE
   - Text: "Đăng nhập hoặc Đăng ký"
   - Font: Inter Semibold, 20px
   - Color: #1E293B
   - Centered

2. SUBTITLE (8px below)
   - Text: "Nhập số điện thoại để tiếp tục"
   - Font: Inter Regular, 14px
   - Color: #64748B

3. PHONE INPUT (24px below)
   - Width: calc(100% - 32px)
   - Height: 56px
   - Background: #F8FAFC
   - Border: 1px solid #E2E8F0
   - Border radius: 12px
   - Left section (48px wide):
     - Vietnam flag emoji 🇻🇳
     - "+84" text
     - Divider line
   - Input area:
     - Placeholder: "912 345 678"
     - Font: Inter Regular, 16px

4. CONTINUE BUTTON (16px below)
   - Width: calc(100% - 32px)
   - Height: 56px
   - Background: #2563EB
   - Border radius: 12px
   - Text: "Tiếp tục"
   - Font: Inter Semibold, 16px
   - Color: white

5. DIVIDER (24px below)
   - Line with text "hoặc"
   - Line color: #E2E8F0
   - Text: Inter Regular, 14px, #64748B

6. SOCIAL BUTTONS (16px below, vertical stack, 12px gap):
   
   Google button:
   - Height: 52px
   - Background: white
   - Border: 1px solid #E2E8F0
   - Border radius: 12px
   - Google "G" icon (24px) + "Tiếp tục với Google"
   
   Apple button:
   - Height: 52px
   - Background: #000000
   - Border radius: 12px
   - Apple icon (white) + "Tiếp tục với Apple" (white)

FOOTER (fixed 24px from bottom safe area):
- Text: "Tiếp tục là đồng ý với Điều khoản sử dụng và Chính sách bảo mật"
- Font: Inter Regular, 12px
- Color: #64748B
- "Điều khoản" and "Chính sách" in #2563EB (links)
- Centered, max-width 300px
```

---

### C05. OTP VERIFICATION

```
Create OTP verification screen for Xe 247.

DEVICE: iPhone 14 Pro, 390x844px

HEADER (starts 60px from top):
- Back arrow button (left, 24px)
- Title: "Xác thực OTP" (centered)
- Font: Inter Semibold, 18px

CONTENT (centered):

1. ICON (48px below header)
   - SMS/Message icon
   - Size: 64px
   - Color: #2563EB
   - Centered

2. INSTRUCTION (24px below)
   - Text: "Nhập mã xác thực đã gửi đến"
   - Font: Inter Regular, 16px
   - Color: #64748B

3. PHONE NUMBER (8px below)
   - Text: "+84 912 345 678"
   - Font: Inter Semibold, 18px
   - Color: #1E293B

4. OTP INPUT (32px below)
   - 6 separate boxes in a row
   - Each box: 48px x 56px
   - Gap between boxes: 8px
   - Background: #F8FAFC
   - Border: 2px solid #E2E8F0
   - Border radius: 12px
   - Font for numbers: Inter Semibold, 24px
   - Focused box: border #2563EB

5. RESEND ROW (24px below)
   - Text: "Gửi lại mã sau 60 giây"
   - Font: Inter Regular, 14px
   - Color: #64748B
   - When timer done: "Gửi lại mã" in #2563EB (tappable)

6. VERIFY BUTTON (32px below)
   - Width: calc(100% - 32px)
   - Height: 56px
   - Background: #2563EB (or #E2E8F0 if disabled)
   - Text: "Xác nhận"
   - Border radius: 12px

KEYBOARD: Show numeric keyboard at bottom (implied)
```

---

### C06. HOME SCREEN

```
Create home screen for Xe 247 Vietnamese vehicle services super app.

DEVICE: iPhone 14 Pro, 390x844px
STYLE: Like Grab or Gojek - clean, vibrant, easy to navigate

STRUCTURE FROM TOP:

═══════════════════════════════════════
SECTION 1: STATUS BAR AREA (59px)
═══════════════════════════════════════
- Leave space for Dynamic Island
- Background: #2563EB (extends behind status bar)

═══════════════════════════════════════
SECTION 2: HEADER (100px)
═══════════════════════════════════════
Background: #2563EB

Row 1 (16px padding horizontal):
- LEFT: Location icon (white, 20px) + "Quận 7, TP.HCM" (white, 14px) + Chevron down
- RIGHT: Bell icon (white, 24px) with red notification badge (8px dot)

Row 2 (12px below, 16px horizontal padding):
- SEARCH BAR
  - Full width
  - Height: 48px
  - Background: white
  - Border radius: 24px (pill shape)
  - Shadow: 0 2px 8px rgba(0,0,0,0.1)
  - Left: Search icon (#64748B, 20px), 16px from left edge
  - Placeholder: "Tìm dịch vụ, tiệm xe..." (#64748B, 14px)

═══════════════════════════════════════
SECTION 3: CATEGORIES (padding 16px)
═══════════════════════════════════════
Background: white

Grid: 2 rows × 4 columns
- Gap: 16px (both directions)
- Each item centered in cell

CATEGORY ITEM STRUCTURE:
- Icon container: 52px diameter circle
- Icon: 24px, centered in circle
- Label: 12px, Inter Medium, below circle (8px gap)

ROW 1:
| Icon | Background | Label |
|------|------------|-------|
| 🆘 Phone/SOS | #FEF3C7 (orange bg) | Cứu hộ |
| 🔧 Wrench | #DBEAFE (blue bg) | Sửa chữa |
| 🛠️ Tools | #DBEAFE | Bảo dưỡng |
| 🎨 Paint | #EDE9FE (purple bg) | Đồng sơn |

ROW 2:
| 🚿 Water | #CCFBF1 (teal bg) | Rửa xe |
| 🏎️ Car | #FEE2E2 (red bg) | Độ xe |
| ⚡ Bolt | #D1FAE5 (green bg) | Sạc điện |
| 📋 More | #F1F5F9 (gray bg) | Khác |

═══════════════════════════════════════
SECTION 4: EMERGENCY BANNER
═══════════════════════════════════════
Margin: 0 16px
Height: 72px
Background: Linear gradient 90deg, #F59E0B to #D97706
Border radius: 16px
Shadow: 0 4px 12px rgba(245,158,11,0.3)

Content (padding 16px):
- LEFT SIDE (flex):
  - Phone ringing icon (white, 28px)
  - 12px gap
  - Column:
    - "Cứu hộ khẩn cấp" (white, 16px, Semibold)
    - "Gọi thợ gần nhất ngay" (white 80%, 12px)
- RIGHT SIDE:
  - Chevron right icon (white, 24px)

═══════════════════════════════════════
SECTION 5: NEARBY PROVIDERS
═══════════════════════════════════════
Padding: 24px 16px 16px 16px

HEADER ROW:
- LEFT: "Gần bạn" (18px, Semibold, #1E293B)
- RIGHT: "Xem tất cả" (14px, #2563EB)

HORIZONTAL SCROLL (16px below, snaps to card):
- Card width: 260px
- Card height: 156px
- Gap between cards: 12px
- First card starts at 16px from left edge
- Last card has 16px right padding

CARD STRUCTURE:
- Background: white
- Border radius: 12px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Overflow: hidden

- TOP: Image area (100px height, full width, cover fit)
- BOTTOM (12px padding):
  - Name: "Tiệm Sửa Xe Anh Minh" (14px, Semibold, 1 line truncate)
  - Row (4px below): 
    - Star icon (yellow, 14px) + "4.8" (14px, Semibold) 
    - " • " separator
    - "720m" (14px, #64748B)
  - Tag (4px below):
    - Chip: "Sửa xe máy"
    - Background: #EFF6FF
    - Text: #2563EB, 11px
    - Padding: 4px 8px
    - Border radius: 4px

═══════════════════════════════════════
SECTION 6: BOTTOM NAVIGATION
═══════════════════════════════════════
Height: 83px (includes 34px safe area)
Background: white
Border top: 1px solid #E2E8F0
Shadow: 0 -2px 10px rgba(0,0,0,0.05)

4 items, equally distributed:

| Icon | Label | State |
|------|-------|-------|
| Home filled | Trang chủ | ACTIVE (#2563EB) |
| Bolt outline | Sạc điện | Inactive (#64748B) |
| Heart outline | Yêu thích | Inactive |
| Person outline | Tài khoản | Inactive |

Each item:
- Icon: 24px
- Label: 10px, Inter Medium
- 4px gap between icon and label
- Centered vertically in 49px area (above safe area)
```

---

### C07. CATEGORY LIST

```
Create a category listing screen showing repair service providers.

DEVICE: iPhone 14 Pro, 390x844px
STYLE: Clean list like Grab service selection

HEADER (starts at 59px, white background):
- Height: 56px
- Back arrow (left, 24px)
- Title: "🔧 Sửa chữa" (center, 18px Semibold)
- Filter icon (right, 24px)

FILTER BAR (below header):
- Height: 52px
- Background: white
- Horizontal scroll with padding 16px

Filter chips:
- Height: 36px
- Padding: 0 16px
- Border radius: 18px
- Gap: 8px

| Chip | State |
|------|-------|
| Tất cả | Active: bg #2563EB, text white |
| Xe máy | Inactive: bg #F1F5F9, text #1E293B |
| Ô tô | Inactive |
| 4+ sao | Inactive |
| Đang mở | Inactive |

RESULTS BAR:
- Height: 40px
- Padding: 0 16px
- Background: #F8FAFC
- Left: "Tìm thấy 24 dịch vụ" (14px, #64748B)
- Right: List/Map toggle icons

PROVIDER LIST:
- Background: #F8FAFC
- Padding: 8px 16px

PROVIDER CARD:
- Background: white
- Border radius: 12px
- Margin bottom: 12px
- Shadow: 0 1px 4px rgba(0,0,0,0.06)
- Overflow: hidden
- Flex row

LEFT: Image
- Width: 100px
- Height: 100px
- Object fit: cover

RIGHT: Content (padding 12px, flex 1)

Row 1 - Name:
- "Tiệm Sửa Xe Anh Minh"
- Font: 15px Semibold
- Color: #1E293B
- 1 line, truncate

Row 2 - Rating & Distance (4px below):
- Star (yellow, 14px) + "4.8" (14px Semibold) + "(156)" (12px #64748B)
- " • "
- Pin icon (12px) + "720m"

Row 3 - Category (6px below):
- Chip: "Sửa xe máy"
- 10px, #2563EB on #EFF6FF, radius 4px

Row 4 - Price (6px below):
- "Vá lốp từ 30.000đ"
- 12px, #64748B

Row 5 - Status (6px below):
- Green dot (8px) + "Đang mở" (12px, #059669)
- OR Red dot + "Đã đóng" (12px, #DC2626)

Show 4 cards initially, scrollable

BOTTOM NAV: Same as home screen
```

---

### C08. PROVIDER PROFILE (KEY SCREEN - Contact Model)

```
Create provider detail screen with contact bar for Xe 247.
This is the MOST IMPORTANT conversion screen.

DEVICE: iPhone 14 Pro, 390x844px
STYLE: Like Airbnb listing detail - premium, trustworthy

═══════════════════════════════════════
PHOTO GALLERY (Full width, behind status bar)
═══════════════════════════════════════
- Height: 280px
- Full bleed (edge to edge)
- Image of repair shop / garage
- Swipeable indicator: 5 white dots at bottom (20px from bottom)
- Current dot: solid white
- Other dots: white 50%

FLOATING HEADER (on top of gallery):
- Position: 59px from top (below status bar)
- Padding: 16px horizontal

Left button:
- White circle, 36px diameter
- Shadow: 0 2px 8px rgba(0,0,0,0.15)
- Back arrow icon (20px, #1E293B)

Right buttons (8px gap):
- Share button: same white circle style
- Heart button: same style, heart outline icon

═══════════════════════════════════════
CONTENT CARD (overlaps gallery)
═══════════════════════════════════════
- Background: white
- Border radius: 20px 20px 0 0
- Margin top: -24px (overlaps gallery)
- Padding: 24px 16px

PROVIDER NAME:
- "Tiệm Sửa Xe Anh Minh"
- Font: Inter Bold, 24px
- Color: #1E293B

RATING ROW (8px below):
- Star icon (yellow, 16px)
- "4.8" (16px Semibold)
- "(156 đánh giá)" (14px #64748B)
- " • " separator
- Pin icon (14px #64748B)
- "720m" (14px #64748B)

STATUS ROW (12px below):
- Clock icon (16px #64748B)
- "07:00 - 21:00" (14px)
- Status badge:
  - Background: #D1FAE5
  - Text: "Đang mở" (#059669, 12px Semibold)
  - Padding: 4px 8px
  - Border radius: 4px

BADGES ROW (16px below, horizontal scroll):
- Gap: 8px
- Each badge:
  - Padding: 8px 12px
  - Border radius: 8px
  - Font: 12px Medium

| Badge | Background | Icon |
|-------|------------|------|
| Top 10 Quận 7 | #F8FAFC | 🏆 |
| Phản hồi nhanh | #F8FAFC | ⚡ |
| Đã xác minh | #D1FAE5 | ✓ |

DIVIDER (24px margin vertical):
- Height: 1px
- Color: #E2E8F0

SERVICES SECTION:
Header: "Dịch vụ" (18px Semibold)

Service list (16px below, no borders):
Each row:
- Height: 48px
- Left: Service name (15px)
- Right: Price (15px Semibold) or "từ XX đ"
- Chevron icon (gray, 16px)
- Bottom border: 1px #F1F5F9

| Service | Price |
|---------|-------|
| Vá lốp xe máy | 30.000đ |
| Thay ruột xe máy | 50.000đ |
| Thay nhớt | từ 50.000đ |
| Sửa phanh | từ 100.000đ |

"Xem tất cả 12 dịch vụ" link (14px, #2563EB, 16px below)

DIVIDER

ABOUT SECTION:
Header: "Giới thiệu" (18px Semibold)
Text (12px below):
- "Chuyên sửa chữa xe máy các loại. Kinh nghiệm 15 năm trong nghề, phục vụ tận tâm, giá cả hợp lý. Bảo hành 6 tháng cho tất cả dịch vụ."
- Font: 14px, line height 22px
- Color: #64748B
- Max 3 lines, truncate
- "Xem thêm" link (#2563EB)

DIVIDER

REVIEWS SECTION:
Header row:
- Left: "Đánh giá" (18px Semibold)
- Right: "Xem tất cả" (14px #2563EB)

Rating summary (16px below):
- Large "4.8" (32px Bold)
- 5 star icons (yellow, 16px each)
- "(156 đánh giá)" (14px #64748B)

Review card (16px below):
- Padding: 16px
- Background: #F8FAFC
- Border radius: 12px

| Avatar (40px circle) | Name + Date |
| Photo placeholder | "Nguyễn Văn A" (14px Semibold) |
|  | "2 ngày trước" (12px #64748B) |

Stars: 5 yellow stars (12px)
Comment (8px below): "Làm nhanh, giá hợp lý, sẽ quay lại!" (14px)

BOTTOM PADDING: 140px (for sticky contact bar)

═══════════════════════════════════════
STICKY CONTACT BAR (Fixed at bottom)
═══════════════════════════════════════
- Position: fixed bottom
- Height: 108px (includes 34px safe area)
- Background: white
- Shadow: 0 -4px 20px rgba(0,0,0,0.1)
- Padding: 16px 16px 34px 16px

BUTTON ROW (flex, gap 12px):

BUTTON 1 - CALL (Primary, wider):
- Flex: 1.5
- Height: 56px
- Background: #2563EB
- Border radius: 12px
- Content:
  - Phone icon (white, 20px)
  - "Gọi ngay" (white, 15px Semibold)
  - Horizontal layout, centered, 8px gap

BUTTON 2 - ZALO:
- Flex: 1
- Height: 56px
- Background: #EFF6FF
- Border: 1px solid #BFDBFE
- Border radius: 12px
- Content:
  - Zalo icon or chat bubble (#2563EB, 20px)
  - "Zalo" (#2563EB, 13px Medium)
  - Vertical layout

BUTTON 3 - FACEBOOK:
- Same style as Zalo
- FB Messenger icon
- "FB" text

BUTTON 4 - NAVIGATE:
- Same style as Zalo
- Navigation/directions icon
- "Đường" text
```

---

### C09. SEARCH SCREEN

```
Create search screen for Xe 247.

DEVICE: iPhone 14 Pro, 390x844px
STYLE: Clean search like Google or Airbnb

HEADER (starts 59px from top):
- Height: 56px
- Background: white

Row:
- Back arrow (44px touch area, 24px icon)
- Search input (flex 1, margin 0 12px):
  - Height: 44px
  - Background: #F1F5F9
  - Border radius: 22px
  - Padding: 0 16px
  - Search icon (left, gray, 20px)
  - Input text area (auto focus cursor)
  - Placeholder: "Tìm dịch vụ, tiệm xe..."
- "Hủy" text (14px #2563EB, right)

CONTENT (scrollable):

RECENT SEARCHES (padding 16px):
Header row:
- "Tìm kiếm gần đây" (14px Semibold #64748B)
- "Xóa tất cả" (12px #2563EB, right)

List (12px below):
Each row (height 48px):
- Clock icon (20px #94A3B8)
- Text (16px #1E293B), 12px gap
- X close button (right, 20px #94A3B8)

| Recent searches |
|-----------------|
| Vá lốp |
| Rửa xe |
| Thay nhớt |

DIVIDER: 8px height #F1F5F9 full width

POPULAR SEARCHES (padding 16px):
Header: "Tìm kiếm phổ biến" (14px Semibold #64748B)

Chips (wrap, 8px gap):
- Padding: 10px 16px
- Background: #F1F5F9
- Border radius: 20px
- Font: 14px #1E293B

| 🔥 Cứu hộ | Thay nhớt | Rửa xe |
| Sạc điện | Bảo dưỡng | Đồng sơn |

DIVIDER

BROWSE CATEGORIES (padding 16px):
Header: "Duyệt theo danh mục" (14px Semibold #64748B)

Category rows (height 56px each, full width tap):
- Left: Icon in colored circle (40px)
- Text: Category name (16px)
- Right: Chevron gray

| Icon BG | Category |
|---------|----------|
| #FEF3C7 | 🆘 Cứu hộ khẩn cấp |
| #DBEAFE | 🔧 Sửa chữa |
| #DBEAFE | 🛠️ Bảo dưỡng |
| #CCFBF1 | 🚿 Rửa xe & Làm đẹp |
| #FEE2E2 | 🏎️ Độ xe & Phụ kiện |
| #D1FAE5 | ⚡ Trạm sạc xe điện |
| #F1F5F9 | 📋 Dịch vụ khác |

NO bottom navigation (modal feel)
```

---

### C10. RATING SCREEN (Contact-based)

```
Create rating prompt screen for Xe 247 (V2 - based on contact, not order).

DEVICE: iPhone 14 Pro, 390x844px
STYLE: Clean, encouraging feedback

HEADER (59px from top):
- Close X button (right, 24px)
- Title: "Đánh giá dịch vụ" (center, 18px Semibold)

CONTENT (centered):

PROVIDER CARD (16px margin, top 32px below header):
- Background: #F8FAFC
- Border radius: 16px
- Padding: 20px
- Flex row, centered

Avatar (left):
- Circle, 56px
- Image of shop

Info (right, 12px gap):
- Name: "Tiệm Sửa Xe Anh Minh" (16px Semibold)
- "Bạn đã liên hệ ngày 10/04" (14px #64748B)

RATING SECTION (32px below card):
Question:
- "Trải nghiệm của bạn thế nào?"
- Font: 20px Semibold
- Color: #1E293B
- Centered

Stars (24px below):
- 5 stars, 44px each, 12px gap
- Tappable
- Empty: outline #E2E8F0
- Filled: solid #FBBF24

QUICK TAGS (32px below stars):
- Wrap layout, centered, gap 8px
- Each tag:
  - Padding: 10px 16px
  - Border radius: 20px
  - Unselected: border 1px #E2E8F0, text #64748B
  - Selected: bg #2563EB, text white

Tags:
| Đúng giờ | Thái độ tốt | Giá hợp lý |
| Làm sạch sẽ | Chuyên nghiệp |

COMMENT (24px below tags):
- Textarea:
  - Width: calc(100% - 32px)
  - Height: 100px
  - Background: #F8FAFC
  - Border: 1px #E2E8F0
  - Border radius: 12px
  - Padding: 16px
  - Placeholder: "Chia sẻ thêm trải nghiệm của bạn (không bắt buộc)"
- Character count (right aligned, 12px #94A3B8): "0/500"

PHOTO BUTTON (16px below):
- Outlined button
- Border: 1px dashed #E2E8F0
- Padding: 12px 16px
- Border radius: 8px
- Camera icon + "Thêm ảnh" (14px #64748B)

BOTTOM BUTTONS (fixed, 16px from bottom safe area):

Skip link:
- "Chưa sử dụng dịch vụ"
- Font: 14px #64748B
- Centered
- 16px margin bottom

Submit button:
- Width: calc(100% - 32px)
- Height: 56px
- Border radius: 12px
- Disabled state: bg #E2E8F0, text #94A3B8
- Enabled state: bg #2563EB, text white
- Text: "Gửi đánh giá"
```

---

### C11. FAVORITES SCREEN

```
Create favorites/saved providers screen for Xe 247.

DEVICE: iPhone 14 Pro, 390x844px

HEADER (59px from top):
- Title: "Yêu thích" (center, 20px Semibold)

CONTENT:

If empty:
- Centered content
- Heart illustration (120px)
- "Chưa có mục yêu thích" (18px Semibold, 16px below)
- "Lưu các tiệm bạn thích để truy cập nhanh hơn" (14px #64748B, 8px below)
- "Khám phá ngay" button (outlined, 32px below)

If has items:
- Padding: 8px 16px
- Background: #F8FAFC

Same card style as Category List but with:
- Red heart icon (filled) at top right of card
- Tap heart to unfavorite

BOTTOM NAV: Heart tab active (#2563EB)
```

---

### C12. EV CHARGING MAP

```
Create EV charging station map screen for Xe 247.

DEVICE: iPhone 14 Pro, 390x844px
STYLE: Like Google Maps or ChargePoint

FULL SCREEN MAP (behind all UI):
- Map showing streets, buildings
- Multiple charging station pins

CHARGING STATION PINS:
- Green ⚡ icon: Available
- Yellow ⚡ icon: Partially available
- Red ⚡ icon: All busy/offline
- Pin size: 36px
- Drop shadow

USER LOCATION:
- Blue dot with pulse ring

FLOATING SEARCH (top, starts 70px from top):
- Margin: 0 16px
- Height: 48px
- Background: white
- Border radius: 24px
- Shadow: 0 2px 12px rgba(0,0,0,0.15)
- Back arrow (left) + "Tìm trạm sạc..." placeholder + Filter icon

FILTER CHIPS (12px below search):
- Horizontal scroll
- Chips: Tất cả | DC nhanh | AC chậm | Miễn phí | Còn chỗ

BOTTOM SHEET (collapsed state):
- Height: 180px
- Background: white
- Border radius: 20px 20px 0 0
- Shadow: 0 -4px 20px rgba(0,0,0,0.1)
- Drag handle: 40px x 4px gray bar, centered, 8px from top

Station card inside:
- Padding: 16px
- ⚡ icon (green, 24px)
- Name: "VinFast Charging - Vinhomes" (16px Semibold)
- "🟢 3/5 cổng rảnh • 720m" (14px #64748B)
- "3.500đ/kWh • DC 60kW" (14px)
- Two buttons at bottom:
  - "Chỉ đường" (outlined)
  - "Chi tiết" (filled blue)

BOTTOM NAV: Sạc điện tab active
```

---

## PROVIDER APP

---

### P01. PROVIDER DASHBOARD

```
Create provider dashboard for Xe 247 Provider app.

DEVICE: iPhone 14 Pro, 390x844px
STYLE: Clean dashboard like Grab Driver

HEADER (59px from top, white):
Row:
- Avatar circle (44px, left)
- Column:
  - "Tiệm Sửa Xe Anh Minh" (16px Semibold)
  - Status toggle: 🟢 "Đang mở" (12px, green badge, tappable)
- Notification bell (right)

STATS CARDS (horizontal scroll, 16px margin top):
Card style:
- Width: 140px
- Height: 100px
- Background: white
- Border radius: 12px
- Border: 1px #E2E8F0
- Padding: 16px

| Card | Icon | Number | Label | Trend |
|------|------|--------|-------|-------|
| 1 | 👁 | 1,234 | Lượt xem | ↑ 12% |
| 2 | 📞 | 56 | Liên hệ | ↑ 8% |
| 3 | ⭐ | 4.8 | Đánh giá | (156) |

RECENT REVIEWS (24px below):
Header: "Đánh giá gần đây" + "Xem tất cả"

Review cards (condensed version)

QUICK ACTIONS (24px below):
2x2 grid of action buttons:
| 📋 Dịch vụ & Giá | 📸 Ảnh & Profile |
| 📊 Thống kê | ⚙️ Cài đặt |

Each button: 
- Square, equal size
- Border: 1px #E2E8F0
- Icon (32px) + Label (12px)

BOTTOM NAV:
Trang chủ (active) | Đánh giá | Profile | Cài đặt
```

---

### P02. CONTACT SETUP

```
Create contact information setup screen for provider.

DEVICE: iPhone 14 Pro, 390x844px

HEADER:
- Back arrow
- Title: "Thông tin liên hệ"
- Subtitle: "Khách hàng sẽ liên hệ bạn qua:"

CONTENT (16px padding):

PHONE SECTION:
- Label: "Số điện thoại chính *" (14px Semibold)
- Input: Phone number field, pre-filled
- Helper: "Số này sẽ hiển thị công khai" (12px #64748B)

ZALO SECTION (24px below):
- Toggle row: "Nhận liên hệ qua Zalo" + Switch
- If ON, show:
  - Input: "Số Zalo hoặc Zalo OA ID"
  - Preview card showing how it appears to customers

FACEBOOK SECTION (24px below):
- Toggle row: "Nhận liên hệ qua Facebook" + Switch
- If ON, show:
  - Input: "Link Facebook Page hoặc Messenger"
  - Example: "m.me/yourpage hoặc fb.com/yourpage"
  - Preview card

BOTTOM:
- "Hoàn tất" button (full width, blue)
```

---

## ADMIN WEB (Desktop)

---

### A01. ADMIN DASHBOARD

```
Create admin dashboard for Xe 247 admin web portal.

DEVICE: Desktop, 1440x900px
STYLE: Clean admin dashboard like Stripe or Linear

LEFT SIDEBAR (width 240px):
- Background: #1E293B
- Logo: "Xe 247 Admin" (white)
- Nav items (white text, icons):
  - Dashboard (active, with blue indicator)
  - Providers
  - Categories
  - Reports
  - Settings

MAIN CONTENT (flex 1):
Background: #F8FAFC
Padding: 32px

HEADER ROW:
- "Dashboard" (24px Semibold)
- Date range picker (right)

STATS CARDS ROW (4 cards, gap 24px):
Card style:
- Background: white
- Border radius: 12px
- Padding: 24px
- Shadow

| Label | Value | Trend |
|-------|-------|-------|
| Total Users | 12,345 | ↑ 12% |
| Providers | 456 | ↑ 8% |
| Active | 423 | - |
| Pending Approval | 12 | Action needed |

CHARTS ROW (2 columns):
- Left: Line chart "Growth over time"
- Right: Bar chart "Contacts by category"

RECENT ACTIVITY TABLE:
Columns: Date | Type | Provider | User | Status | Action
```

---

## SUMMARY

Tổng cộng **25 prompts chi tiết** cho:
- Consumer App: 12 màn hình chính
- Provider App: 2 màn hình chính  
- Admin Web: 1 màn hình

Bạn có thể:
1. Copy từng prompt vào Stitch web
2. Dùng với Figma AI
3. Dùng với bất kỳ AI design tool nào

Các prompt đã bao gồm:
- ✅ Safe area handling (60px top, 34px bottom)
- ✅ Exact pixel measurements
- ✅ Color codes
- ✅ Typography specs
- ✅ Component details
- ✅ Modern design patterns
