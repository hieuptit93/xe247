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

  // Service categories to search (matching mobile app)
  categories: [
    {
      id: 'repair',
      name: 'Sửa chữa',
      nameEn: 'Repair',
      icon: 'construct',
      color: '#ff385c',
      googleTypes: ['car_repair'],
      osmTags: ['shop=car_repair', 'amenity=car_repair', 'shop=motorcycle_repair'],
      keywords: ['sửa xe', 'garage', 'sửa chữa ô tô', 'sửa xe máy', 'gara', 'tiệm sửa xe'],
    },
    {
      id: 'service',
      name: 'Xưởng dịch vụ',
      nameEn: 'Service Workshop',
      icon: 'car-sport',
      color: '#00a699',
      googleTypes: ['car_repair', 'car_dealer'],
      osmTags: ['shop=car', 'shop=car_parts', 'amenity=vehicle_inspection'],
      keywords: ['xưởng dịch vụ', 'bảo dưỡng', 'thay nhớt', 'bảo dưỡng định kỳ', 'đại lý', 'showroom'],
    },
    {
      id: 'tuning',
      name: 'Độ xe',
      nameEn: 'Car Tuning',
      icon: 'speedometer',
      color: '#fc642d',
      googleTypes: [],
      osmTags: ['shop=car_parts'],
      keywords: ['độ xe', 'wrap xe', 'dán phim', 'phụ kiện ô tô', 'nâng cấp xe', 'body kit', 'đồ chơi xe'],
    },
    {
      id: 'car_wash',
      name: 'Rửa xe',
      nameEn: 'Car Wash',
      icon: 'water',
      color: '#428bff',
      googleTypes: ['car_wash'],
      osmTags: ['amenity=car_wash'],
      keywords: ['rửa xe', 'car wash', 'chăm sóc xe', 'detailing', 'nội thất xe'],
    },
    {
      id: 'rescue',
      name: 'Cứu hộ',
      nameEn: 'Rescue',
      icon: 'warning',
      color: '#e00b41',
      googleTypes: [],
      osmTags: [],
      keywords: ['cứu hộ xe', 'kéo xe', 'cứu hộ giao thông', 'xe cứu hộ', 'dịch vụ cứu hộ', 'hỗ trợ đường bộ'],
    },
    {
      id: 'ev_charging',
      name: 'Sạc EV',
      nameEn: 'EV Charging',
      icon: 'flash',
      color: '#00d1b2',
      googleTypes: ['electric_vehicle_charging_station'],
      osmTags: ['amenity=charging_station'],
      keywords: ['trạm sạc', 'sạc điện', 'ev charging', 'vinfast', 'sạc xe điện'],
    },
  ],

  // Category mapping for data normalization
  categoryMapping: {
    // Old category -> New category
    'car_repair': 'repair',
    'motorcycle_repair': 'repair',
    'car_parts': 'service',
    'parts': 'service',
    'maintenance': 'service',
    'car_wash': 'car_wash',
    'wash': 'car_wash',
    'customization': 'tuning',
    'painting': 'tuning',
    'tires': 'service',
    'charging': 'ev_charging',
    'ev': 'ev_charging',
    'towing': 'rescue',
    'roadside': 'rescue',
  },

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
  },

  // Output configuration
  output: {
    directory: './output',
    format: 'json',
  }
};
