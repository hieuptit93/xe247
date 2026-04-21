/**
 * XE 247 - Foursquare Places API Collection (FREE TIER)
 *
 * Free tier: 99,999 calls/month
 * Đăng ký: https://foursquare.com/developers/signup
 *
 * Usage: node collect-foursquare-free.js
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.FOURSQUARE_API_KEY;
const OUTPUT_DIR = './output';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Foursquare category IDs for automotive
const CATEGORIES = {
  auto_repair: {
    id: '52f2ab2ebcbc57f1066b8b44', // Automotive Shop
    name: 'Sửa chữa ô tô'
  },
  motorcycle_shop: {
    id: '4bf58dd8d48988d115951735', // Motorcycle Shop
    name: 'Sửa chữa xe máy'
  },
  car_wash: {
    id: '4d4b7105d754a06374d81259', // Car Wash
    name: 'Rửa xe'
  },
  gas_station: {
    id: '4bf58dd8d48988d113951735', // Gas Station
    name: 'Trạm xăng'
  },
  ev_charging: {
    id: '56aa371be4b08b9a8d57350b', // EV Charging Station
    name: 'Trạm sạc EV'
  }
};

// Vietnam locations to search
const LOCATIONS = [
  // Ho Chi Minh City - các quận chính
  { name: 'Q1 HCM', lat: 10.7769, lng: 106.7009 },
  { name: 'Q3 HCM', lat: 10.7818, lng: 106.6869 },
  { name: 'Q7 HCM', lat: 10.7340, lng: 106.7215 },
  { name: 'Bình Thạnh', lat: 10.8105, lng: 106.7091 },
  { name: 'Gò Vấp', lat: 10.8386, lng: 106.6652 },
  { name: 'Thủ Đức', lat: 10.8561, lng: 106.7519 },
  { name: 'Tân Bình', lat: 10.8014, lng: 106.6525 },

  // Hanoi - các quận chính
  { name: 'Hoàn Kiếm', lat: 21.0285, lng: 105.8542 },
  { name: 'Ba Đình', lat: 21.0358, lng: 105.8194 },
  { name: 'Cầu Giấy', lat: 21.0361, lng: 105.7880 },
  { name: 'Đống Đa', lat: 21.0167, lng: 105.8281 },
  { name: 'Hai Bà Trưng', lat: 21.0089, lng: 105.8644 },
  { name: 'Thanh Xuân', lat: 20.9933, lng: 105.8097 },
  { name: 'Long Biên', lat: 21.0472, lng: 105.9122 },

  // Da Nang
  { name: 'Hải Châu', lat: 16.0471, lng: 108.2068 },
  { name: 'Thanh Khê', lat: 16.0639, lng: 108.1897 }
];

/**
 * Fetch places from Foursquare
 */
function fetchFoursquare(lat, lng, categoryId, radius = 5000) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      ll: `${lat},${lng}`,
      categories: categoryId,
      radius: radius,
      limit: 50,
      sort: 'DISTANCE'
    });

    const options = {
      hostname: 'api.foursquare.com',
      path: `/v3/places/search?${params}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': API_KEY.startsWith('fsq') ? API_KEY : API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results) {
            resolve(json.results);
          } else {
            console.error('   API Error:', json);
            resolve([]);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Get place details (costs 1 API call)
 */
function getPlaceDetails(fsqId) {
  return new Promise((resolve, reject) => {
    const fields = 'name,location,tel,website,hours,rating,photos,social_media';

    const options = {
      hostname: 'api.foursquare.com',
      path: `/v3/places/${fsqId}?fields=${fields}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.end();
  });
}

/**
 * Transform Foursquare place to our schema
 */
function transformPlace(place, category, locationName) {
  const location = place.location || {};

  return {
    // IDs
    fsq_id: place.fsq_id,

    // Basic info
    name: place.name || 'Chưa có tên',
    category: category,
    categories_fsq: (place.categories || []).map(c => c.name),

    // Location
    lat: place.geocodes?.main?.latitude || location.lat,
    lng: place.geocodes?.main?.longitude || location.lng,
    address: location.formatted_address || location.address,
    city: location.locality || null,
    district: location.neighborhood || null,
    postcode: location.postcode || null,
    country: location.country || 'VN',

    // Contact
    phone: place.tel || null,
    website: place.website || null,

    // Business
    working_hours: place.hours ? transformHours(place.hours) : null,
    is_verified: place.verified || false,

    // Ratings
    rating_avg: place.rating ? place.rating / 2 : 0, // FSQ uses 10-scale, we use 5
    popularity: place.popularity || 0,

    // Photos
    photos: (place.photos || []).slice(0, 5).map(p => ({
      url: `${p.prefix}original${p.suffix}`,
      thumbnail: `${p.prefix}300x300${p.suffix}`
    })),

    // Social
    facebook: place.social_media?.facebook_id || null,
    instagram: place.social_media?.instagram || null,

    // Meta
    search_location: locationName,
    data_source: 'foursquare',
    fsq_url: `https://foursquare.com/v/${place.fsq_id}`,
    collected_at: new Date().toISOString(),

    // For our app
    status: 'pending',
    rating_count: 0
  };
}

/**
 * Transform FSQ hours to our format
 */
function transformHours(hours) {
  if (!hours.regular) return null;

  const dayMap = {
    1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu',
    5: 'fri', 6: 'sat', 7: 'sun'
  };

  const result = {};
  hours.regular.forEach(h => {
    const day = dayMap[h.day];
    if (day) {
      result[day] = {
        open: h.open,
        close: h.close
      };
    }
  });

  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Main collection function
 */
async function collectFoursquareData() {
  console.log('📍 XE 247 - Foursquare Data Collection (FREE TIER)\n');
  console.log('━'.repeat(60));

  if (!API_KEY) {
    console.error('❌ FOURSQUARE_API_KEY not found in .env');
    console.log('\n📝 How to get FREE API key:');
    console.log('   1. Go to https://foursquare.com/developers/signup');
    console.log('   2. Create a free account');
    console.log('   3. Create a new project');
    console.log('   4. Copy the API key to .env file');
    console.log('\n   Free tier: 99,999 calls/month');
    process.exit(1);
  }

  const allPlaces = new Map(); // Dedupe by fsq_id
  let apiCallCount = 0;

  // Collect for each category
  for (const [catKey, catConfig] of Object.entries(CATEGORIES)) {
    // Skip gas stations (too many)
    if (catKey === 'gas_station') continue;

    console.log(`\n🔍 Category: ${catConfig.name}`);
    console.log('─'.repeat(40));

    for (const location of LOCATIONS) {
      process.stdout.write(`   ${location.name}...`);

      try {
        const places = await fetchFoursquare(
          location.lat,
          location.lng,
          catConfig.id,
          5000 // 5km radius
        );
        apiCallCount++;

        let added = 0;
        for (const place of places) {
          if (!allPlaces.has(place.fsq_id)) {
            const transformed = transformPlace(place, catKey, location.name);
            allPlaces.set(place.fsq_id, transformed);
            added++;
          }
        }

        console.log(` ${places.length} found, ${added} new`);

        // Rate limiting
        await new Promise(r => setTimeout(r, 500));

      } catch (error) {
        console.log(` Error: ${error.message}`);
      }
    }
  }

  // Convert to array
  const placesArray = Array.from(allPlaces.values());

  // Separate by region
  const hcmPlaces = placesArray.filter(p =>
    p.lat >= 10.5 && p.lat <= 11.2 && p.lng >= 106.3 && p.lng <= 107.0
  );
  const hanoiPlaces = placesArray.filter(p =>
    p.lat >= 20.8 && p.lat <= 21.2 && p.lng >= 105.5 && p.lng <= 106.1
  );
  const danangPlaces = placesArray.filter(p =>
    p.lat >= 15.9 && p.lat <= 16.2 && p.lng >= 107.9 && p.lng <= 108.3
  );

  // Save results
  console.log('\n' + '━'.repeat(60));
  console.log('💾 Saving results...\n');

  const files = {
    'fsq-providers-all.json': placesArray,
    'fsq-providers-hcm.json': hcmPlaces,
    'fsq-providers-hanoi.json': hanoiPlaces,
    'fsq-providers-danang.json': danangPlaces
  };

  for (const [filename, data] of Object.entries(files)) {
    if (data.length === 0) continue;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`   ${filename}: ${data.length} places`);
  }

  // Save by category
  const categories = {};
  placesArray.forEach(p => {
    if (!categories[p.category]) categories[p.category] = [];
    categories[p.category].push(p);
  });

  for (const [cat, data] of Object.entries(categories)) {
    const filepath = path.join(OUTPUT_DIR, `fsq-${cat}.json`);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`   fsq-${cat}.json: ${data.length} places`);
  }

  // Summary
  console.log('\n' + '━'.repeat(60));
  console.log('📊 COLLECTION SUMMARY\n');
  console.log(`   Total places: ${placesArray.length}`);
  console.log(`   API calls used: ${apiCallCount}`);
  console.log(`   API calls remaining: ~${99999 - apiCallCount}`);
  console.log('\n   By region:');
  console.log(`     TP.HCM: ${hcmPlaces.length}`);
  console.log(`     Hà Nội: ${hanoiPlaces.length}`);
  console.log(`     Đà Nẵng: ${danangPlaces.length}`);
  console.log('\n   By category:');
  for (const [cat, data] of Object.entries(categories)) {
    console.log(`     ${CATEGORIES[cat]?.name || cat}: ${data.length}`);
  }

  console.log('\n✅ Collection complete! (FREE)');
}

// Run
collectFoursquareData().catch(console.error);
