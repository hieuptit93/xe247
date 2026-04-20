/**
 * XE 247 - Provider Data Collection
 * Source: Google Places API
 *
 * Usage: node collect-providers.js [--city=hn|hcm|all] [--category=repair|carwash|all]
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const OUTPUT_DIR = process.env.OUTPUT_DIR || './output';

// Google Places API endpoints
const NEARBY_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const TEXT_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Stats tracking
const stats = {
  apiCalls: 0,
  placesFound: 0,
  detailsFetched: 0,
  errors: 0
};

/**
 * Sleep function for rate limiting
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Search for places using Text Search API
 */
async function textSearch(query, location, radius = 3000) {
  stats.apiCalls++;
  try {
    const response = await axios.get(TEXT_SEARCH_URL, {
      params: {
        query: query,
        location: `${location.lat},${location.lng}`,
        radius: radius,
        language: 'vi',
        key: API_KEY
      }
    });

    if (response.data.status === 'OK') {
      return response.data.results || [];
    } else if (response.data.status === 'ZERO_RESULTS') {
      return [];
    } else {
      console.error(`   API Error: ${response.data.status}`);
      stats.errors++;
      return [];
    }
  } catch (error) {
    console.error(`   Request Error: ${error.message}`);
    stats.errors++;
    return [];
  }
}

/**
 * Get place details
 */
async function getPlaceDetails(placeId) {
  stats.apiCalls++;
  try {
    const response = await axios.get(PLACE_DETAILS_URL, {
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,formatted_phone_number,international_phone_number,geometry,rating,user_ratings_total,opening_hours,website,url,photos,reviews,types,business_status',
        language: 'vi',
        key: API_KEY
      }
    });

    if (response.data.status === 'OK') {
      stats.detailsFetched++;
      return response.data.result;
    }
    return null;
  } catch (error) {
    console.error(`   Details Error: ${error.message}`);
    stats.errors++;
    return null;
  }
}

/**
 * Transform Google Place to our schema
 */
function transformProvider(place, details, category, city) {
  const location = details?.geometry?.location || place.geometry?.location || {};
  const hours = details?.opening_hours || {};

  return {
    google_place_id: place.place_id,
    name: details?.name || place.name,

    // Contact
    phone: details?.formatted_phone_number || null,
    phone_intl: details?.international_phone_number || null,
    website: details?.website || null,
    google_maps_url: details?.url || null,

    // Address
    address: details?.formatted_address || place.formatted_address || place.vicinity,
    lat: location.lat,
    lng: location.lng,

    // Ratings
    rating_avg: details?.rating || place.rating || null,
    rating_count: details?.user_ratings_total || place.user_ratings_total || 0,

    // Working hours
    working_hours: hours.weekday_text || null,
    is_open_now: hours.open_now,

    // Categories
    categories: [category.id],
    category_name: category.name,
    google_types: details?.types || place.types || [],

    // Business status
    business_status: details?.business_status || place.business_status,

    // Photos (store references, not actual images)
    photos: (details?.photos || place.photos || []).slice(0, 5).map(p => ({
      photo_reference: p.photo_reference,
      width: p.width,
      height: p.height,
      // URL can be constructed: https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=XXX&key=API_KEY
    })),

    // Reviews (sample)
    reviews_sample: (details?.reviews || []).slice(0, 3).map(r => ({
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.relative_time_description,
      timestamp: r.time
    })),

    // Location
    city_code: city.code,
    city_name: city.name,

    // Meta
    status: 'pending', // Will be verified by admin
    data_source: 'google_places',
    collected_at: new Date().toISOString()
  };
}

/**
 * Collect providers for a specific city and category
 */
async function collectForCityAndCategory(city, category, allProviders) {
  console.log(`\n   📂 Category: ${category.icon} ${category.name}`);

  let categoryCount = 0;

  for (const district of city.districts) {
    // Search with each keyword
    for (const keyword of category.keywords.slice(0, 2)) { // Limit keywords to save API calls
      const query = `${keyword} ${district.name} ${city.name}`;

      console.log(`      🔍 "${keyword}" in ${district.name}...`);

      const places = await textSearch(query, district, config.searchRadius);

      for (const place of places) {
        // Skip if already collected
        if (allProviders.has(place.place_id)) {
          // Add category if not already present
          const existing = allProviders.get(place.place_id);
          if (!existing.categories.includes(category.id)) {
            existing.categories.push(category.id);
          }
          continue;
        }

        // Get details (with rate limiting)
        await sleep(config.rateLimiting.delayBetweenRequests);
        const details = await getPlaceDetails(place.place_id);

        if (details) {
          const provider = transformProvider(place, details, category, city);
          allProviders.set(place.place_id, provider);
          categoryCount++;
          stats.placesFound++;
        }
      }

      // Rate limiting between searches
      await sleep(200);
    }
  }

  console.log(`      ✅ Found ${categoryCount} providers`);
}

/**
 * Main collection function
 */
async function collectProviders() {
  console.log('🔧 Starting Provider Collection...\n');

  if (!API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY not found in .env');
    console.log('   Get your API key at: https://console.cloud.google.com');
    console.log('   Enable "Places API" and set up billing');
    process.exit(1);
  }

  // Parse command line args
  const args = process.argv.slice(2);
  const cityArg = args.find(a => a.startsWith('--city='))?.split('=')[1] || 'all';
  const categoryArg = args.find(a => a.startsWith('--category='))?.split('=')[1] || 'all';

  // Filter cities
  const citiesToProcess = cityArg === 'all'
    ? Object.entries(config.cities)
    : Object.entries(config.cities).filter(([code]) => code === cityArg);

  // Filter categories
  const categoriesToProcess = categoryArg === 'all'
    ? config.categories
    : config.categories.filter(c => c.id === categoryArg);

  console.log(`Cities: ${citiesToProcess.map(([,c]) => c.name).join(', ')}`);
  console.log(`Categories: ${categoriesToProcess.map(c => c.name).join(', ')}`);
  console.log('');

  for (const [cityCode, city] of citiesToProcess) {
    console.log(`\n📍 ${city.name}`);
    console.log('='.repeat(40));

    const cityProviders = new Map();

    for (const category of categoriesToProcess) {
      await collectForCityAndCategory(city, category, cityProviders);
    }

    // Save city results
    const providers = Array.from(cityProviders.values());
    const outputFile = path.join(OUTPUT_DIR, `providers-${cityCode}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(providers, null, 2));

    console.log(`\n   💾 Saved ${providers.length} providers → ${outputFile}`);
  }

  // Print stats
  console.log('\n' + '='.repeat(50));
  console.log('📊 Collection Stats:');
  console.log(`   API Calls: ${stats.apiCalls}`);
  console.log(`   Places Found: ${stats.placesFound}`);
  console.log(`   Details Fetched: ${stats.detailsFetched}`);
  console.log(`   Errors: ${stats.errors}`);
  console.log(`   Est. Cost: ~$${((stats.apiCalls * 0.017) + (stats.detailsFetched * 0.005)).toFixed(2)}`);
}

// Run
collectProviders().catch(console.error);
