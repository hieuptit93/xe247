/**
 * XE 247 - OpenStreetMap Data Collection (FREE)
 *
 * Sử dụng Overpass API để lấy data từ OpenStreetMap
 * - Hoàn toàn MIỄN PHÍ
 * - Không cần API key
 * - Legal, open data
 *
 * Usage: node collect-osm-free.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './output';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Vietnam bounding boxes - All major provinces
const REGIONS = {
  // === MIỀN BẮC ===
  hanoi: {
    name: 'Hà Nội',
    bbox: [20.8, 105.5, 21.2, 106.1]
  },
  haiphong: {
    name: 'Hải Phòng',
    bbox: [20.75, 106.55, 20.95, 106.85]
  },
  quangninh: {
    name: 'Quảng Ninh',
    bbox: [20.85, 106.7, 21.25, 107.4]
  },
  bacninh: {
    name: 'Bắc Ninh',
    bbox: [21.05, 105.95, 21.25, 106.25]
  },
  hungyen: {
    name: 'Hưng Yên',
    bbox: [20.6, 105.85, 20.95, 106.15]
  },
  haiduong: {
    name: 'Hải Dương',
    bbox: [20.85, 106.2, 21.1, 106.55]
  },
  thaibinh: {
    name: 'Thái Bình',
    bbox: [20.35, 106.25, 20.7, 106.65]
  },
  namdinh: {
    name: 'Nam Định',
    bbox: [20.15, 106.0, 20.5, 106.35]
  },
  ninhbinh: {
    name: 'Ninh Bình',
    bbox: [20.0, 105.75, 20.35, 106.1]
  },
  thanhhoa: {
    name: 'Thanh Hóa',
    bbox: [19.65, 105.2, 20.15, 105.95]
  },
  nghean: {
    name: 'Nghệ An',
    bbox: [18.6, 104.4, 19.45, 105.5]
  },
  hatinh: {
    name: 'Hà Tĩnh',
    bbox: [18.15, 105.5, 18.65, 106.2]
  },

  // === MIỀN TRUNG ===
  hue: {
    name: 'Thừa Thiên Huế',
    bbox: [16.25, 107.45, 16.55, 107.75]
  },
  danang: {
    name: 'Đà Nẵng',
    bbox: [15.95, 108.05, 16.15, 108.35]
  },
  quangnam: {
    name: 'Quảng Nam',
    bbox: [15.4, 107.8, 15.95, 108.5]
  },
  quangngai: {
    name: 'Quảng Ngãi',
    bbox: [14.85, 108.65, 15.25, 109.1]
  },
  binhdinh: {
    name: 'Bình Định',
    bbox: [13.75, 108.7, 14.4, 109.3]
  },
  phuyen: {
    name: 'Phú Yên',
    bbox: [12.9, 109.0, 13.45, 109.45]
  },
  khanhhoa: {
    name: 'Khánh Hòa (Nha Trang)',
    bbox: [12.15, 108.95, 12.55, 109.35]
  },
  ninhthuan: {
    name: 'Ninh Thuận',
    bbox: [11.45, 108.7, 11.85, 109.2]
  },
  binhthuan: {
    name: 'Bình Thuận',
    bbox: [10.75, 107.65, 11.25, 108.4]
  },

  // === TÂY NGUYÊN ===
  daklak: {
    name: 'Đắk Lắk',
    bbox: [12.35, 107.7, 13.05, 108.65]
  },
  lamdong: {
    name: 'Lâm Đồng (Đà Lạt)',
    bbox: [11.8, 108.15, 12.1, 108.6]
  },

  // === MIỀN NAM ===
  hcm: {
    name: 'TP. Hồ Chí Minh',
    bbox: [10.65, 106.5, 10.95, 106.85]
  },
  binhduong: {
    name: 'Bình Dương',
    bbox: [10.85, 106.5, 11.25, 106.85]
  },
  dongnai: {
    name: 'Đồng Nai',
    bbox: [10.75, 106.75, 11.2, 107.35]
  },
  bariavungtau: {
    name: 'Bà Rịa - Vũng Tàu',
    bbox: [10.25, 107.0, 10.65, 107.45]
  },
  longan: {
    name: 'Long An',
    bbox: [10.45, 106.15, 10.9, 106.65]
  },
  tiengiang: {
    name: 'Tiền Giang',
    bbox: [10.2, 106.0, 10.55, 106.55]
  },
  bentre: {
    name: 'Bến Tre',
    bbox: [9.95, 106.25, 10.35, 106.75]
  },
  vinhlong: {
    name: 'Vĩnh Long',
    bbox: [10.0, 105.8, 10.35, 106.25]
  },
  cantho: {
    name: 'Cần Thơ',
    bbox: [9.95, 105.65, 10.15, 105.9]
  },
  angiang: {
    name: 'An Giang',
    bbox: [10.2, 104.85, 10.75, 105.55]
  },
  kiengiang: {
    name: 'Kiên Giang',
    bbox: [9.85, 104.45, 10.45, 105.35]
  },
  camau: {
    name: 'Cà Mau',
    bbox: [8.85, 104.75, 9.45, 105.35]
  }
};

// OSM tags mapping to our categories
const CATEGORY_QUERIES = {
  repair: {
    name: 'Sửa chữa xe',
    tags: [
      'shop=car_repair',
      'shop=motorcycle_repair',
      'amenity=vehicle_inspection',
      'shop=car',
      'craft=automotive_repair'
    ]
  },
  car_wash: {
    name: 'Rửa xe',
    tags: [
      'amenity=car_wash',
      'shop=car_wash'
    ]
  },
  car_parts: {
    name: 'Phụ tùng',
    tags: [
      'shop=car_parts',
      'shop=motorcycle_parts',
      'shop=tyres'
    ]
  },
  fuel: {
    name: 'Xăng dầu',
    tags: [
      'amenity=fuel'
    ]
  },
  ev_charging: {
    name: 'Trạm sạc EV',
    tags: [
      'amenity=charging_station'
    ]
  },
  parking: {
    name: 'Bãi đỗ xe',
    tags: [
      'amenity=parking'
    ]
  }
};

/**
 * Build Overpass QL query
 */
function buildOverpassQuery(bbox, tags) {
  const [south, west, north, east] = bbox;
  const bboxStr = `${south},${west},${north},${east}`;

  const tagQueries = tags.map(tag => {
    const [key, value] = tag.split('=');
    return `
      node["${key}"="${value}"](${bboxStr});
      way["${key}"="${value}"](${bboxStr});
    `;
  }).join('');

  return `
[out:json][timeout:120];
(
  ${tagQueries}
);
out body center;
`;
}

/**
 * Fetch data from Overpass API
 */
function fetchOverpass(query) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;

    console.log('   Fetching from Overpass API...');

    https.get(url, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.elements || []);
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Transform OSM element to our schema
 */
function transformElement(element, category, regionCode) {
  const tags = element.tags || {};

  // Get coordinates (center for ways, direct for nodes)
  const lat = element.lat || element.center?.lat;
  const lng = element.lon || element.center?.lon;

  if (!lat || !lng) return null;

  // Extract phone - OSM uses various formats
  let phone = tags.phone || tags['contact:phone'] || tags['phone:mobile'] || null;
  if (phone) {
    // Normalize Vietnamese phone
    phone = phone.replace(/[^\d+]/g, '');
    if (phone.startsWith('84')) phone = '+' + phone;
    if (phone.startsWith('0')) phone = '+84' + phone.slice(1);
  }

  // Working hours
  let workingHours = null;
  if (tags.opening_hours) {
    workingHours = parseOpeningHours(tags.opening_hours);
  }

  return {
    // IDs
    osm_id: element.id?.toString(),
    osm_type: element.type,

    // Basic info
    name: tags.name || tags['name:vi'] || tags['name:en'] || 'Chưa có tên',
    name_en: tags['name:en'] || null,
    description: tags.description || null,

    // Category
    category: category,
    osm_tags: Object.entries(tags)
      .filter(([k]) => ['shop', 'amenity', 'craft', 'service'].includes(k))
      .map(([k, v]) => `${k}=${v}`),

    // Location
    lat,
    lng,
    address: buildAddress(tags),
    city: tags['addr:city'] || null,
    district: tags['addr:district'] || null,
    street: tags['addr:street'] || null,
    housenumber: tags['addr:housenumber'] || null,

    // Contact
    phone,
    email: tags.email || tags['contact:email'] || null,
    website: tags.website || tags['contact:website'] || null,
    facebook: tags['contact:facebook'] || null,

    // Business info
    brand: tags.brand || null,
    operator: tags.operator || null,
    working_hours: workingHours,
    working_hours_raw: tags.opening_hours || null,

    // Services (for repair shops)
    services: extractServices(tags),

    // Vehicle types
    vehicle_types: extractVehicleTypes(tags),

    // Meta
    region_code: regionCode,
    data_source: 'openstreetmap',
    osm_url: `https://www.openstreetmap.org/${element.type}/${element.id}`,
    collected_at: new Date().toISOString(),

    // For our app
    status: 'pending', // Needs verification
    rating_avg: 0,
    rating_count: 0
  };
}

/**
 * Build address string from OSM tags
 */
function buildAddress(tags) {
  const parts = [];

  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:district']) parts.push(tags['addr:district']);
  if (tags['addr:city']) parts.push(tags['addr:city']);

  if (parts.length > 0) {
    return parts.join(', ');
  }

  // Fallback to full address if available
  return tags['addr:full'] || null;
}

/**
 * Parse OSM opening_hours format
 */
function parseOpeningHours(hoursStr) {
  // Simple parser - OSM format is complex
  // Example: "Mo-Fr 08:00-17:00; Sa 08:00-12:00"
  try {
    const result = {};
    const dayMap = {
      'Mo': 'mon', 'Tu': 'tue', 'We': 'wed', 'Th': 'thu',
      'Fr': 'fri', 'Sa': 'sat', 'Su': 'sun'
    };

    // Handle 24/7
    if (hoursStr === '24/7') {
      Object.values(dayMap).forEach(day => {
        result[day] = { open: '00:00', close: '24:00' };
      });
      return result;
    }

    // Basic parsing
    const parts = hoursStr.split(';').map(s => s.trim());
    parts.forEach(part => {
      const match = part.match(/([A-Za-z,-]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})/);
      if (match) {
        const [, days, open, close] = match;
        // Expand day ranges like "Mo-Fr"
        const dayRange = days.split('-');
        if (dayRange.length === 2) {
          const dayKeys = Object.keys(dayMap);
          const start = dayKeys.indexOf(dayRange[0]);
          const end = dayKeys.indexOf(dayRange[1]);
          for (let i = start; i <= end; i++) {
            result[dayMap[dayKeys[i]]] = { open, close };
          }
        } else {
          days.split(',').forEach(d => {
            if (dayMap[d.trim()]) {
              result[dayMap[d.trim()]] = { open, close };
            }
          });
        }
      }
    });

    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}

/**
 * Extract services from tags
 */
function extractServices(tags) {
  const services = [];

  // Service tags
  const serviceKeys = ['service', 'service:vehicle', 'repair'];
  serviceKeys.forEach(key => {
    if (tags[key]) {
      tags[key].split(';').forEach(s => services.push(s.trim()));
    }
  });

  // Specific services
  if (tags['service:vehicle:tyres'] === 'yes') services.push('tyres');
  if (tags['service:vehicle:oil_change'] === 'yes') services.push('oil_change');
  if (tags['service:vehicle:car_wash'] === 'yes') services.push('car_wash');
  if (tags['service:vehicle:air_conditioning'] === 'yes') services.push('air_conditioning');
  if (tags['service:vehicle:brakes'] === 'yes') services.push('brakes');

  return [...new Set(services)];
}

/**
 * Extract vehicle types
 */
function extractVehicleTypes(tags) {
  const types = [];

  if (tags.motorcycle === 'yes' || tags['service:vehicle:motorcycle'] === 'yes') {
    types.push('motorcycle');
  }
  if (tags.car === 'yes' || tags['service:vehicle:car'] === 'yes') {
    types.push('car');
  }

  // Default based on shop type
  if (types.length === 0) {
    if (tags.shop === 'motorcycle_repair' || tags.shop === 'motorcycle_parts') {
      types.push('motorcycle');
    } else if (tags.shop === 'car_repair' || tags.shop === 'car_parts') {
      types.push('car');
    } else {
      types.push('car', 'motorcycle'); // Default both
    }
  }

  return types;
}

/**
 * Main collection function
 */
async function collectOSMData() {
  console.log('🗺️  XE 247 - OpenStreetMap Data Collection (FREE)\n');
  console.log('━'.repeat(60));

  const allData = {
    repair: [],
    car_wash: [],
    car_parts: [],
    fuel: [],
    ev_charging: [],
    parking: []
  };

  const stats = {
    total: 0,
    byRegion: {},
    byCategory: {}
  };

  // Collect for each region
  for (const [regionCode, region] of Object.entries(REGIONS)) {
    console.log(`\n📍 Region: ${region.name}`);
    console.log('─'.repeat(40));

    stats.byRegion[regionCode] = 0;

    // Collect each category
    for (const [category, config] of Object.entries(CATEGORY_QUERIES)) {
      // Skip parking and fuel for MVP (too many results)
      if (['parking', 'fuel'].includes(category)) continue;

      console.log(`\n   🔍 ${config.name}...`);

      try {
        const query = buildOverpassQuery(region.bbox, config.tags);
        const elements = await fetchOverpass(query);

        const transformed = elements
          .map(el => transformElement(el, category, regionCode))
          .filter(Boolean);

        allData[category].push(...transformed);
        stats.byRegion[regionCode] += transformed.length;
        stats.byCategory[category] = (stats.byCategory[category] || 0) + transformed.length;
        stats.total += transformed.length;

        console.log(`   ✓ Found ${transformed.length} places`);

        // Rate limiting - be nice to the free API
        await new Promise(r => setTimeout(r, 2000));

      } catch (error) {
        console.error(`   ✗ Error: ${error.message}`);
      }
    }
  }

  // Save results
  console.log('\n' + '━'.repeat(60));
  console.log('💾 Saving results...\n');

  // Save by category
  for (const [category, data] of Object.entries(allData)) {
    if (data.length === 0) continue;

    const filename = path.join(OUTPUT_DIR, `osm-${category}.json`);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`   ${category}: ${data.length} → ${filename}`);
  }

  // Save combined file
  const allProviders = [
    ...allData.repair,
    ...allData.car_wash,
    ...allData.car_parts,
    ...allData.ev_charging
  ];

  const combinedFile = path.join(OUTPUT_DIR, 'osm-all-providers.json');
  fs.writeFileSync(combinedFile, JSON.stringify(allProviders, null, 2));

  // Save by region
  for (const regionCode of Object.keys(REGIONS)) {
    const regionData = allProviders.filter(p => p.region_code === regionCode);
    const regionFile = path.join(OUTPUT_DIR, `osm-providers-${regionCode}.json`);
    fs.writeFileSync(regionFile, JSON.stringify(regionData, null, 2));
  }

  // Print summary
  console.log('\n' + '━'.repeat(60));
  console.log('📊 COLLECTION SUMMARY\n');

  console.log('By Region:');
  for (const [region, count] of Object.entries(stats.byRegion)) {
    console.log(`   ${REGIONS[region].name}: ${count}`);
  }

  console.log('\nBy Category:');
  for (const [cat, count] of Object.entries(stats.byCategory)) {
    console.log(`   ${CATEGORY_QUERIES[cat]?.name || cat}: ${count}`);
  }

  console.log(`\n✅ TOTAL: ${stats.total} providers collected (FREE!)`);
  console.log(`📁 Output: ${OUTPUT_DIR}/`);

  // Print data quality note
  console.log('\n' + '━'.repeat(60));
  console.log('📝 NOTES:\n');
  console.log('   • Data cần được verify trước khi dùng');
  console.log('   • Nhiều record thiếu phone/address');
  console.log('   • Recommend: Kết hợp với Provider self-register');
  console.log('   • License: ODbL (free to use with attribution)');
}

// Run
collectOSMData().catch(console.error);
