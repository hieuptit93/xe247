#!/usr/bin/env node

/**
 * XE 247 - Master Data Collection Script (ALL FREE SOURCES)
 *
 * Kết hợp tất cả nguồn data miễn phí:
 * 1. OpenStreetMap (Overpass API) - Hoàn toàn free
 * 2. OpenChargeMap - Free EV stations
 * 3. Foursquare - Free tier 99,999 calls/month
 *
 * Usage: node collect-all-free.js
 *
 * Output: ./output/combined-providers.json
 */

require('dotenv').config();
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './output';

// Colors for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

/**
 * Run a script and wait for completion
 */
function runScript(scriptPath, name) {
  return new Promise((resolve) => {
    log(`\n${'═'.repeat(60)}`, 'cyan');
    log(`🚀 Running: ${name}`, 'cyan');
    log('═'.repeat(60), 'cyan');

    try {
      execSync(`node ${scriptPath}`, {
        stdio: 'inherit',
        cwd: __dirname
      });
      resolve(true);
    } catch (error) {
      log(`⚠️  ${name} had errors, continuing...`, 'yellow');
      resolve(false);
    }
  });
}

/**
 * Merge and deduplicate all collected data
 */
function mergeAllData() {
  log('\n' + '═'.repeat(60), 'green');
  log('📦 MERGING ALL DATA SOURCES', 'green');
  log('═'.repeat(60), 'green');

  const allProviders = new Map();
  const stats = {
    osm: 0,
    foursquare: 0,
    opencharge: 0,
    duplicates: 0
  };

  // Load OSM data
  const osmFile = path.join(OUTPUT_DIR, 'osm-all-providers.json');
  if (fs.existsSync(osmFile)) {
    const osmData = JSON.parse(fs.readFileSync(osmFile, 'utf8'));
    osmData.forEach(p => {
      const key = `${p.lat?.toFixed(5)}_${p.lng?.toFixed(5)}_${p.name?.toLowerCase()}`;
      if (!allProviders.has(key)) {
        allProviders.set(key, { ...p, sources: ['osm'] });
        stats.osm++;
      }
    });
    log(`   ✓ OSM: ${stats.osm} providers loaded`);
  }

  // Load Foursquare data
  const fsqFile = path.join(OUTPUT_DIR, 'fsq-providers-all.json');
  if (fs.existsSync(fsqFile)) {
    const fsqData = JSON.parse(fs.readFileSync(fsqFile, 'utf8'));
    fsqData.forEach(p => {
      const key = `${p.lat?.toFixed(5)}_${p.lng?.toFixed(5)}_${p.name?.toLowerCase()}`;
      if (allProviders.has(key)) {
        // Merge - Foursquare often has better contact info
        const existing = allProviders.get(key);
        existing.phone = existing.phone || p.phone;
        existing.website = existing.website || p.website;
        existing.photos = [...(existing.photos || []), ...(p.photos || [])].slice(0, 5);
        existing.rating_avg = p.rating_avg || existing.rating_avg;
        existing.fsq_id = p.fsq_id;
        existing.sources.push('foursquare');
        stats.duplicates++;
      } else {
        allProviders.set(key, { ...p, sources: ['foursquare'] });
        stats.foursquare++;
      }
    });
    log(`   ✓ Foursquare: ${stats.foursquare} new, ${stats.duplicates} merged`);
  }

  // Load OpenChargeMap data
  const evFiles = ['ev-stations-hcm.json', 'ev-stations-hn.json', 'ev-stations-all.json'];
  let evLoaded = false;
  for (const evFile of evFiles) {
    const evPath = path.join(OUTPUT_DIR, evFile);
    if (fs.existsSync(evPath) && !evLoaded) {
      const evData = JSON.parse(fs.readFileSync(evPath, 'utf8'));
      evData.forEach(station => {
        const key = `ev_${station.ocm_id}`;
        if (!allProviders.has(key)) {
          allProviders.set(key, {
            ...station,
            category: 'ev_charging',
            sources: ['opencharge']
          });
          stats.opencharge++;
        }
      });
      evLoaded = true;
      log(`   ✓ OpenChargeMap: ${stats.opencharge} EV stations loaded`);
    }
  }

  // Convert to array and add IDs
  const mergedArray = Array.from(allProviders.values()).map((p, index) => ({
    ...p,
    id: `xe247_${Date.now()}_${index}`,
    merged_at: new Date().toISOString()
  }));

  // Save merged data
  const outputFile = path.join(OUTPUT_DIR, 'combined-providers.json');
  fs.writeFileSync(outputFile, JSON.stringify(mergedArray, null, 2));

  // Save summary by region
  const regions = {
    hcm: mergedArray.filter(p => p.lat >= 10.5 && p.lat <= 11.2),
    hanoi: mergedArray.filter(p => p.lat >= 20.8 && p.lat <= 21.2),
    danang: mergedArray.filter(p => p.lat >= 15.9 && p.lat <= 16.2)
  };

  for (const [region, data] of Object.entries(regions)) {
    const regionFile = path.join(OUTPUT_DIR, `combined-${region}.json`);
    fs.writeFileSync(regionFile, JSON.stringify(data, null, 2));
  }

  // Save categories summary
  const categories = {};
  mergedArray.forEach(p => {
    const cat = p.category || 'other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(p);
  });

  for (const [cat, data] of Object.entries(categories)) {
    const catFile = path.join(OUTPUT_DIR, `combined-${cat}.json`);
    fs.writeFileSync(catFile, JSON.stringify(data, null, 2));
  }

  return {
    total: mergedArray.length,
    stats,
    regions: {
      hcm: regions.hcm.length,
      hanoi: regions.hanoi.length,
      danang: regions.danang.length
    },
    categories: Object.fromEntries(
      Object.entries(categories).map(([k, v]) => [k, v.length])
    )
  };
}

/**
 * Generate import-ready SQL/JSON
 */
function generateImportFiles(stats) {
  log('\n' + '═'.repeat(60), 'blue');
  log('📤 GENERATING IMPORT FILES', 'blue');
  log('═'.repeat(60), 'blue');

  const data = JSON.parse(
    fs.readFileSync(path.join(OUTPUT_DIR, 'combined-providers.json'), 'utf8')
  );

  // Generate SQL insert statements
  const sqlStatements = data.map(p => {
    const name = (p.name || '').replace(/'/g, "''");
    const address = (p.address || '').replace(/'/g, "''");
    const phone = p.phone || null;
    const lat = p.lat || 0;
    const lng = p.lng || 0;

    return `INSERT INTO providers (name, address, phone, lat, lng, category, status, data_source, created_at)
VALUES ('${name}', '${address}', ${phone ? `'${phone}'` : 'NULL'}, ${lat}, ${lng}, '${p.category || 'other'}', 'pending', '${(p.sources || []).join(',')}', NOW());`;
  });

  const sqlFile = path.join(OUTPUT_DIR, 'import-providers.sql');
  fs.writeFileSync(sqlFile, sqlStatements.join('\n\n'));
  log(`   ✓ SQL: ${sqlFile}`);

  // Generate CSV
  const csvHeader = 'id,name,phone,address,lat,lng,category,status,source\n';
  const csvRows = data.map(p =>
    `"${p.id}","${(p.name || '').replace(/"/g, '""')}","${p.phone || ''}","${(p.address || '').replace(/"/g, '""')}",${p.lat || ''},${p.lng || ''},"${p.category || ''}","pending","${(p.sources || []).join(';')}"`
  );
  const csvFile = path.join(OUTPUT_DIR, 'import-providers.csv');
  fs.writeFileSync(csvFile, csvHeader + csvRows.join('\n'));
  log(`   ✓ CSV: ${csvFile}`);

  // Generate Supabase-ready JSON
  const supabaseData = data.map(p => ({
    name: p.name,
    phone: p.phone,
    address: p.address,
    location: p.lat && p.lng ? `POINT(${p.lng} ${p.lat})` : null,
    category: p.category,
    status: 'pending',
    metadata: {
      sources: p.sources,
      osm_id: p.osm_id,
      fsq_id: p.fsq_id,
      ocm_id: p.ocm_id,
      photos: p.photos,
      working_hours: p.working_hours
    }
  }));
  const supabaseFile = path.join(OUTPUT_DIR, 'import-supabase.json');
  fs.writeFileSync(supabaseFile, JSON.stringify(supabaseData, null, 2));
  log(`   ✓ Supabase JSON: ${supabaseFile}`);
}

/**
 * Print final summary
 */
function printSummary(mergeStats) {
  log('\n' + '═'.repeat(60), 'green');
  log('✅ DATA COLLECTION COMPLETE (100% FREE)', 'green');
  log('═'.repeat(60), 'green');

  log('\n📊 FINAL STATISTICS:\n');

  log('   By Source:');
  log(`     • OpenStreetMap: ${mergeStats.stats.osm}`);
  log(`     • Foursquare:    ${mergeStats.stats.foursquare}`);
  log(`     • OpenChargeMap: ${mergeStats.stats.opencharge}`);
  log(`     • Merged/Deduped: ${mergeStats.stats.duplicates}`);

  log('\n   By Region:');
  log(`     • TP.HCM:   ${mergeStats.regions.hcm}`);
  log(`     • Hà Nội:   ${mergeStats.regions.hanoi}`);
  log(`     • Đà Nẵng:  ${mergeStats.regions.danang}`);

  log('\n   By Category:');
  for (const [cat, count] of Object.entries(mergeStats.categories)) {
    log(`     • ${cat}: ${count}`);
  }

  log(`\n   📦 TOTAL: ${mergeStats.total} providers`, 'green');

  log('\n📁 Output Files:');
  log('   ./output/combined-providers.json  (all data)');
  log('   ./output/combined-hcm.json        (HCM only)');
  log('   ./output/combined-hanoi.json      (Hanoi only)');
  log('   ./output/import-providers.sql     (SQL import)');
  log('   ./output/import-providers.csv     (CSV import)');
  log('   ./output/import-supabase.json     (Supabase ready)');

  log('\n💰 COST BREAKDOWN:', 'yellow');
  log('   OpenStreetMap API:  $0 (free, unlimited)');
  log('   OpenChargeMap API:  $0 (free, unlimited)');
  log('   Foursquare API:     $0 (free tier)');
  log('   ─────────────────────────────────');
  log('   TOTAL COST:         $0', 'green');

  log('\n📝 NEXT STEPS:');
  log('   1. Review data quality in ./output/');
  log('   2. Import to database using SQL/CSV');
  log('   3. Set up Provider self-registration');
  log('   4. Add "Thêm tiệm" feature for users');
}

/**
 * Main execution
 */
async function main() {
  console.clear();
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║        XE 247 - FREE DATA COLLECTION SUITE                 ║', 'cyan');
  log('║        $0 cost • Legal • Open Data                         ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  const startTime = Date.now();

  // Check what APIs are available
  const hasOSM = true; // Always available
  const hasOpenCharge = !!process.env.OPENCHARGE_API_KEY;
  const hasFoursquare = !!process.env.FOURSQUARE_API_KEY;

  log('\n📋 Available Sources:', 'yellow');
  log(`   • OpenStreetMap: ✓ (no key needed)`);
  log(`   • OpenChargeMap: ${hasOpenCharge ? '✓' : '✗ (add OPENCHARGE_API_KEY to .env)'}`);
  log(`   • Foursquare:    ${hasFoursquare ? '✓' : '✗ (add FOURSQUARE_API_KEY to .env)'}`);

  if (!hasOpenCharge && !hasFoursquare) {
    log('\n💡 TIP: Add API keys to .env for more data:', 'yellow');
    log('   OPENCHARGE_API_KEY=xxx  (free at openchargemap.org)');
    log('   FOURSQUARE_API_KEY=xxx  (free at foursquare.com/developers)');
  }

  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Run collectors
  await runScript('collect-osm-free.js', 'OpenStreetMap (FREE)');

  if (hasOpenCharge) {
    await runScript('collect-ev-stations.js', 'OpenChargeMap EV Stations (FREE)');
  }

  if (hasFoursquare) {
    await runScript('collect-foursquare-free.js', 'Foursquare Places (FREE TIER)');
  }

  // Merge all data
  const mergeStats = mergeAllData();

  // Generate import files
  generateImportFiles(mergeStats);

  // Print summary
  printSummary(mergeStats);

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  log(`\n⏱️  Total time: ${duration} minutes`);
  log('\n🎉 Done! All data collected for FREE!\n', 'green');
}

// Run
main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
