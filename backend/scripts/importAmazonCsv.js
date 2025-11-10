// Usage examples:
//  node backend/scripts/importAmazonCsv.js --archiveDir archive --limit 1000 --drop --keepUrls
//  node backend/scripts/importAmazonCsv.js --archiveDir archive --limit 1000 --drop --upload
// Flags:
//  --archiveDir   Path to folder containing amazon_categories.csv and amazon_products.csv (default: archive)
//  --limit        Max number of products to import (default: 1000)
//  --drop         Drop existing products before import
//  --upload       Upload images to Cloudinary (slower). If omitted, images are kept as original URLs.
//  --keepUrls     Force keep original image URLs (default when --upload not provided)

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { archiveDir: 'archive', limit: 1000, drop: false, upload: false, keepUrls: true };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--drop') out.drop = true;
    else if (a === '--upload') { out.upload = true; out.keepUrls = false; }
    else if (a === '--keepUrls') out.keepUrls = true;
    else if (a === '--archiveDir') { out.archiveDir = args[++i]; }
    else if (a === '--limit') { out.limit = parseInt(args[++i], 10) || out.limit; }
    else if (a === '--useDatasetCategories') { out.useDatasetCategories = true; }
  }
  return out;
}

const CATEGORY_KEYWORDS = [
  // Electronics
  { keys: ['electronics','electronic','phone','mobile','smart','camera','tv','television','audio','headphone','earbud','earphone','speaker','console','gaming','tablet','watch','usb','charger','computer','laptop','pc','ssd','hard drive','printer','monitor','mouse','keyboard','router','drone'], value: 'Electronics' },
  // Clothing
  { keys: ['clothing','clothes','fashion','apparel','t-shirt','tee','shirt','jeans','dress','jacket','hoodie','sweater','sweatshirt','sneaker','shoe','skirt','pants','shorts','sock'], value: 'Clothing' },
  // Home & Garden
  { keys: ['home & garden','home and garden','home','kitchen','furniture','decor','bedding','bath','garden','outdoor','appliance','cookware','cook ware','vacuum','cleaner','pillow','blanket','sheet','sofa','chair','table','lamp','lighting','pan','pot','knife','cutlery','storage','organization'], value: 'Home & Garden' },
  // Sports
  { keys: ['sports','sport','outdoor','recreation','fitness','exercise','workout','yoga','camping','hiking','bicycle','bike','luggage','travel','backpack','ball','soccer','basketball','tennis','golf','swim','running'], value: 'Sports' }
];

function normalizeCategory(name, title) {
  const combined = `${name || ''} ${title || ''}`.toLowerCase();
  const s = combined;
  for (const group of CATEGORY_KEYWORDS) {
    if (group.keys.some(k => s.includes(k))) return group.value;
  }
  return 'Electronics';
}

function parsePrice(v) {
  if (v == null) return null;
  const s = String(v).replace(/[^0-9.,-]/g, '').replace(/,/g, '');
  if (!s) return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

async function main() {
  const opts = parseArgs();
  const archivePath = path.resolve(process.cwd(), opts.archiveDir);
  const catsPath = path.join(archivePath, 'amazon_categories.csv');
  const prodsPath = path.join(archivePath, 'amazon_products.csv');

  if (!fs.existsSync(catsPath) || !fs.existsSync(prodsPath)) {
    console.error('Could not find amazon_categories.csv or amazon_products.csv in', archivePath);
    process.exit(1);
  }

  const mongoUri = process.env.DB_LINK;
  if (!mongoUri) {
    console.error('DB_LINK missing in backend/.env');
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  try {
    // Build category id -> name map
    const catMap = new Map();
    await new Promise((resolve, reject) => {
      fs.createReadStream(catsPath)
        .pipe(csv())
        .on('data', (row) => {
          const id = row.id || row.ID || row.category_id;
          const name = row.category_name || row.name || row.category;
          if (id && name) catMap.set(String(id), String(name));
        })
        .on('end', resolve)
        .on('error', reject);
    });
    console.log('Loaded categories:', catMap.size);

    if (opts.drop) {
      await Product.deleteMany({});
      console.log('Dropped existing products');
    }
    // Build selection pools
    const limit = Math.max(1, opts.limit || 1000);
    const categories = opts.useDatasetCategories ? null : ['Electronics', 'Clothing', 'Home & Garden', 'Sports'];
    let perCatArg = null;
    let perCat = null;
    const quotas = {};
    if (!opts.useDatasetCategories) {
      perCatArg = (process.argv.includes('--perCat') ? process.argv[process.argv.indexOf('--perCat') + 1] : null);
      perCat = Math.ceil(limit / categories.length);
      if (perCatArg) {
        // format: Electronics=300,Clothing=300,Home & Garden=200,Sports=200
        perCatArg.split(',').forEach(pair => {
          const [k, v] = pair.split('=');
          if (k && v) quotas[k.trim()] = parseInt(v, 10) || perCat;
        });
      }
    }
    let target = {};
    let pools = {};
    if (!opts.useDatasetCategories) {
      target = {
        'Electronics': quotas['Electronics'] || perCat,
        'Clothing': quotas['Clothing'] || perCat,
        'Home & Garden': quotas['Home & Garden'] || perCat,
        'Sports': quotas['Sports'] || perCat
      };
      pools = { 'Electronics': [], 'Clothing': [], 'Home & Garden': [], 'Sports': [] };
    }

    let processed = 0;
    const stream = fs.createReadStream(prodsPath).pipe(csv());
    for await (const row of stream) {
      if (!opts.useDatasetCategories) {
        if (categories.every(c => pools[c].length >= target[c])) break;
      }
      processed++;

      const title = row.title || row.name || row.product_name;
      const imgUrl = row.imgUrl || row.image || row.image_url || row.imUrl;
      const price = parsePrice(row.price);
      const stars = parseFloat(row.stars || row.rating || 0) || 0;
      const reviews = parseInt(row.reviews || row.review_count || 0, 10) || 0;
      const catId = row.category_id ? String(row.category_id) : null;
      const catName = catId ? catMap.get(catId) : null;
      const category = opts.useDatasetCategories ? (catName || 'Uncategorized') : normalizeCategory(catName, title);

      if (!title || !price || !imgUrl) continue;
      if (opts.useDatasetCategories) {
        if (!pools[category]) pools[category] = [];
        pools[category].push({ title, imgUrl, price, stars, reviews, productURL: row.productURL, category });
      } else {
        if (!categories.includes(category)) continue;
        if (pools[category].length >= target[category]) continue;
        pools[category].push({ title, imgUrl, price, stars, reviews, productURL: row.productURL, category });
      }
    }

    // Interleave and create docs
    let created = 0;
    if (opts.useDatasetCategories) {
      const dynCats = Object.keys(pools);
      // Phase 1: ensure at least one per dataset category until limit reached
      for (const cat of dynCats) {
        if (created >= limit) break;
        if (!pools[cat] || pools[cat].length === 0) continue;
        const item = pools[cat][0];
        let images = [];
        if (opts.upload) {
          try {
            const up = await cloudinary.uploader.upload(item.imgUrl, { folder: 'may_store/products' });
            images.push({ public_id: up.public_id, url: up.secure_url });
          } catch (e) {
            console.warn('Upload failed for', item.imgUrl, e.message, '- keeping original URL');
            images.push({ url: item.imgUrl });
          }
        } else {
          images.push({ url: item.imgUrl });
        }
        const doc = {
          name: String(item.title).slice(0, 120),
          price: item.price,
          description: item.productURL ? `Source: ${item.productURL}` : '',
          images,
          category: cat,
          stock: 50,
          ratings: item.stars,
          numOfReviews: item.reviews,
        };
        try { await Product.create(doc); created++; } catch {}
      }
      // Phase 2: round-robin fill remaining up to limit
      const indices = Object.fromEntries(dynCats.map(c => [c, 1]));
      let progressed = true;
      while (created < limit && progressed) {
        progressed = false;
        for (const cat of dynCats) {
          const idx = indices[cat] || 1;
          if (!pools[cat] || idx >= pools[cat].length) continue;
          const item = pools[cat][idx];
          indices[cat] = idx + 1;
          let images = [];
          if (opts.upload) {
            try { const up = await cloudinary.uploader.upload(item.imgUrl, { folder: 'may_store/products' }); images.push({ public_id: up.public_id, url: up.secure_url }); }
            catch (e) { console.warn('Upload failed for', item.imgUrl, e.message, '- keeping original URL'); images.push({ url: item.imgUrl }); }
          } else { images.push({ url: item.imgUrl }); }
          const doc = { name: String(item.title).slice(0,120), price: item.price, description: item.productURL?`Source: ${item.productURL}`:'', images, category: cat, stock:50, ratings:item.stars, numOfReviews:item.reviews };
          try { await Product.create(doc); created++; progressed = true; if (created>=limit) break; } catch {}
        }
      }
    } else {
      const indices = { 'Electronics': 0, 'Clothing': 0, 'Home & Garden': 0, 'Sports': 0 };
      const maxRounds = Math.max(...categories.map(c => pools[c].length));
      for (let round = 0; round < maxRounds; round++) {
        for (const cat of categories) {
          if (indices[cat] >= pools[cat].length) continue;
          const item = pools[cat][indices[cat]++];

          let images = [];
          if (opts.upload) {
          try {
            const up = await cloudinary.uploader.upload(item.imgUrl, { folder: 'may_store/products' });
            images.push({ public_id: up.public_id, url: up.secure_url });
          } catch (e) {
            console.warn('Upload failed for', item.imgUrl, e.message, '- keeping original URL');
            images.push({ url: item.imgUrl });
          }
        } else {
          images.push({ url: item.imgUrl });
        }

        const doc = {
          name: String(item.title).slice(0, 120),
          price: item.price,
          description: item.productURL ? `Source: ${item.productURL}` : '',
          images,
          category: item.category,
          stock: 50,
          ratings: item.stars,
          numOfReviews: item.reviews,
        };
        try {
          await Product.create(doc);
          created++;
          if (created % 100 === 0) console.log(`Created ${created} products...`);
          if (created >= limit) break;
        } catch (e) {
          console.warn('Create failed for product:', item.title, e.message);
        }
        }
        if (created >= limit) break;
      }
    }

    const catKeys = Object.keys(pools);
    console.log(`Processed ${processed} rows. Created ${created} products. Pool sizes:`, Object.fromEntries(catKeys.map(c => [c, pools[c].length])));
  } catch (err) {
    console.error('Import error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
