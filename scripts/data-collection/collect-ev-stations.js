/**
 * XE 247 - EV Charging Station Data Collection
 * Source: OpenChargeMap API
 *
 * Usage: node collect-ev-stations.js
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const API_KEY = process.env.OPENCHARGE_API_KEY;
const BASE_URL = 'https://api.openchargemap.io/v3/poi/';
const OUTPUT_DIR = process.env.OUTPUT_DIR || './output';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Fetch EV stations from OpenChargeMap
 */
async function fetchEVStations(lat, lng, distance = 50) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        output: 'json',
        latitude: lat,
        longitude: lng,
        distance: distance, // km
        distanceunit: 'km',
        maxresults: 500,
        compact: false,
        verbose: true,
        key: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching stations: ${error.message}`);
    return [];
  }
}

/**
 * Transform OpenChargeMap data to our schema
 */
function transformStation(station) {
  const address = station.AddressInfo || {};
  const connections = station.Connections || [];

  return {
    ocm_id: station.ID?.toString(),
    uuid: station.UUID,
    name: address.Title || 'Unknown Station',
    operator: station.OperatorInfo?.Title || null,
    operator_website: station.OperatorInfo?.WebsiteURL || null,

    // Address
    address: address.AddressLine1,
    address_line2: address.AddressLine2,
    city: address.Town,
    state: address.StateOrProvince,
    postcode: address.Postcode,
    country: address.Country?.ISOCode || 'VN',

    // Coordinates
    lat: address.Latitude,
    lng: address.Longitude,

    // Chargers
    chargers: connections.map(conn => ({
      type: conn.ConnectionType?.Title || 'Unknown',
      type_id: conn.ConnectionTypeID,
      power_kw: conn.PowerKW || null,
      voltage: conn.Voltage,
      amps: conn.Amps,
      quantity: conn.Quantity || 1,
      is_fast_charge: conn.Level?.IsFastChargeCapable || false
    })),

    total_ports: connections.reduce((sum, c) => sum + (c.Quantity || 1), 0),
    max_power_kw: Math.max(...connections.map(c => c.PowerKW || 0)),

    // Status
    status: station.StatusType?.IsOperational ? 'active' : 'inactive',
    status_title: station.StatusType?.Title,
    date_last_verified: station.DateLastVerified,
    date_last_status_update: station.DateLastStatusUpdate,

    // Amenities & Usage
    usage_type: station.UsageType?.Title,
    is_free: station.UsageType?.IsPayAtLocation === false,
    usage_cost: station.UsageCost,

    // Additional info
    number_of_points: station.NumberOfPoints,
    general_comments: station.GeneralComments,
    access_comments: address.AccessComments,

    // Contact
    phone: address.ContactTelephone1 || address.ContactTelephone2,
    email: address.ContactEmail,
    website: station.OperatorInfo?.WebsiteURL,

    // Media
    photos: (station.MediaItems || []).map(m => ({
      url: m.ItemURL,
      thumbnail: m.ItemThumbnailURL,
      comment: m.Comment
    })),

    // Meta
    data_source: 'openchargemap',
    collected_at: new Date().toISOString()
  };
}

/**
 * Main collection function
 */
async function collectEVStations() {
  console.log('🔌 Starting EV Station Collection...\n');

  if (!API_KEY) {
    console.error('❌ OPENCHARGE_API_KEY not found in .env');
    console.log('   Get your free API key at: https://openchargemap.org/site/develop/api');
    process.exit(1);
  }

  const allStations = new Map(); // Use Map to dedupe by ID

  for (const [cityCode, city] of Object.entries(config.cities)) {
    console.log(`\n📍 Collecting stations in ${city.name}...`);

    // Fetch from city center with large radius
    const stations = await fetchEVStations(city.center.lat, city.center.lng, 50);

    console.log(`   Found ${stations.length} stations`);

    stations.forEach(station => {
      const transformed = transformStation(station);
      transformed.city_code = cityCode;
      allStations.set(transformed.ocm_id, transformed);
    });

    // Rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  // Convert to array and separate by city
  const stationsArray = Array.from(allStations.values());

  const hanoiStations = stationsArray.filter(s =>
    s.lat >= 20.8 && s.lat <= 21.2 && s.lng >= 105.5 && s.lng <= 106.1
  );

  const hcmStations = stationsArray.filter(s =>
    s.lat >= 10.5 && s.lat <= 11.2 && s.lng >= 106.3 && s.lng <= 107.0
  );

  // Save results
  const outputHN = path.join(OUTPUT_DIR, 'ev-stations-hn.json');
  const outputHCM = path.join(OUTPUT_DIR, 'ev-stations-hcm.json');
  const outputAll = path.join(OUTPUT_DIR, 'ev-stations-all.json');

  fs.writeFileSync(outputHN, JSON.stringify(hanoiStations, null, 2));
  fs.writeFileSync(outputHCM, JSON.stringify(hcmStations, null, 2));
  fs.writeFileSync(outputAll, JSON.stringify(stationsArray, null, 2));

  console.log('\n✅ Collection complete!');
  console.log(`   Hà Nội: ${hanoiStations.length} stations → ${outputHN}`);
  console.log(`   TP.HCM: ${hcmStations.length} stations → ${outputHCM}`);
  console.log(`   Total:  ${stationsArray.length} stations → ${outputAll}`);

  // Print summary of operators
  const operators = {};
  stationsArray.forEach(s => {
    const op = s.operator || 'Unknown';
    operators[op] = (operators[op] || 0) + 1;
  });

  console.log('\n📊 Stations by Operator:');
  Object.entries(operators)
    .sort((a, b) => b[1] - a[1])
    .forEach(([op, count]) => {
      console.log(`   ${op}: ${count}`);
    });
}

// Run
collectEVStations().catch(console.error);
