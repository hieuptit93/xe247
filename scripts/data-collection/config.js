// XE 247 Data Collection Configuration

module.exports = {
  // Cities to collect data from
  cities: {
    hanoi: {
      name: 'Hà Nội',
      code: 'hn',
      center: { lat: 21.0285, lng: 105.8542 },
      // Major districts with their centers
      districts: [
        { name: 'Ba Đình', lat: 21.0340, lng: 105.8140 },
        { name: 'Hoàn Kiếm', lat: 21.0285, lng: 105.8542 },
        { name: 'Hai Bà Trưng', lat: 21.0065, lng: 105.8590 },
        { name: 'Đống Đa', lat: 21.0155, lng: 105.8270 },
        { name: 'Cầu Giấy', lat: 21.0340, lng: 105.7870 },
        { name: 'Thanh Xuân', lat: 20.9930, lng: 105.8120 },
        { name: 'Hoàng Mai', lat: 20.9790, lng: 105.8650 },
        { name: 'Long Biên', lat: 21.0470, lng: 105.8880 },
        { name: 'Tây Hồ', lat: 21.0670, lng: 105.8230 },
        { name: 'Bắc Từ Liêm', lat: 21.0680, lng: 105.7470 },
        { name: 'Nam Từ Liêm', lat: 21.0190, lng: 105.7560 },
        { name: 'Hà Đông', lat: 20.9590, lng: 105.7560 },
      ]
    },
    hcm: {
      name: 'TP. Hồ Chí Minh',
      code: 'hcm',
      center: { lat: 10.7769, lng: 106.7009 },
      districts: [
        { name: 'Quận 1', lat: 10.7756, lng: 106.7019 },
        { name: 'Quận 2', lat: 10.7870, lng: 106.7500 }, // Now Thu Duc
        { name: 'Quận 3', lat: 10.7840, lng: 106.6830 },
        { name: 'Quận 4', lat: 10.7580, lng: 106.7060 },
        { name: 'Quận 5', lat: 10.7540, lng: 106.6620 },
        { name: 'Quận 6', lat: 10.7460, lng: 106.6350 },
        { name: 'Quận 7', lat: 10.7340, lng: 106.7220 },
        { name: 'Quận 8', lat: 10.7240, lng: 106.6280 },
        { name: 'Quận 10', lat: 10.7720, lng: 106.6680 },
        { name: 'Quận 11', lat: 10.7620, lng: 106.6500 },
        { name: 'Quận 12', lat: 10.8670, lng: 106.6420 },
        { name: 'Bình Thạnh', lat: 10.8110, lng: 106.7110 },
        { name: 'Phú Nhuận', lat: 10.7990, lng: 106.6800 },
        { name: 'Gò Vấp', lat: 10.8380, lng: 106.6650 },
        { name: 'Tân Bình', lat: 10.8020, lng: 106.6520 },
        { name: 'Tân Phú', lat: 10.7900, lng: 106.6280 },
        { name: 'Bình Tân', lat: 10.7650, lng: 106.6030 },
        { name: 'Thủ Đức', lat: 10.8530, lng: 106.7590 },
      ]
    }
  },

  // Service categories to search
  categories: [
    {
      id: 'repair',
      name: 'Sửa chữa',
      googleTypes: ['car_repair'],
      keywords: ['sửa xe', 'garage', 'sửa chữa ô tô', 'sửa xe máy'],
      icon: '🔧'
    },
    {
      id: 'carwash',
      name: 'Rửa xe',
      googleTypes: ['car_wash'],
      keywords: ['rửa xe', 'car wash', 'chăm sóc xe'],
      icon: '🚿'
    },
    {
      id: 'maintenance',
      name: 'Bảo dưỡng',
      googleTypes: ['car_repair'],
      keywords: ['bảo dưỡng', 'thay nhớt', 'bảo dưỡng định kỳ'],
      icon: '⚙️'
    },
    {
      id: 'tires',
      name: 'Lốp xe',
      googleTypes: [],
      keywords: ['lốp xe', 'vỏ xe', 'vá lốp', 'thay lốp'],
      icon: '🛞'
    },
    {
      id: 'customization',
      name: 'Độ xe',
      googleTypes: [],
      keywords: ['độ xe', 'wrap xe', 'dán phim', 'phụ kiện ô tô'],
      icon: '🏎️'
    },
    {
      id: 'rescue',
      name: 'Cứu hộ',
      googleTypes: [],
      keywords: ['cứu hộ xe', 'kéo xe', 'cứu hộ giao thông'],
      icon: '🆘'
    },
    {
      id: 'painting',
      name: 'Đồng sơn',
      googleTypes: [],
      keywords: ['đồng sơn', 'sơn xe', 'gò hàn'],
      icon: '🎨'
    }
  ],

  // Search radius in meters
  searchRadius: 3000, // 3km per district center

  // Rate limiting
  rateLimiting: {
    requestsPerSecond: 10,
    delayBetweenRequests: 100 // ms
  },

  // Data filtering
  filters: {
    minRating: 0, // Include all ratings
    minReviews: 0, // Include all
    excludeChains: false
  }
};
