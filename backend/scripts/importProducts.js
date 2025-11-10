// Usage:
//  node scripts/importProducts.js <path-to-json> [--keep-urls] [--drop]
//  Example quick run:
//  node scripts/importProducts.js backend/data/products.sample.json --keep-urls

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const ALLOWED_CATEGORIES = new Map([
  ['electronics', 'Electronics'],
  ['electronic', 'Electronics'],
  ['laptops', 'Electronics'],
  ['phones', 'Electronics'],
  ['mobile', 'Electronics'],
  ['clothing', 'Clothing'],
  ['clothes', 'Clothing'],
  ['fashion', 'Clothing'],
  ['apparel', 'Clothing'],
  ['home & garden', 'Home & Garden'],
  ['home and garden', 'Home & Garden'],
  ['home', 'Home & Garden'],
  ['garden', 'Home & Garden'],
  ['sports', 'Sports'],
  ['sport', 'Sports']
]);

function normalizeCategory(input) {
  if (!input) return 'Electronics';
  const key = String(input).toLowerCase().trim();
  return ALLOWED_CATEGORIES.get(key) ||
    (Array.from(ALLOWED_CATEGORIES.keys()).find(k => key.includes(k)) ? ALLOWED_CATEGORIES.get(Array.from(ALLOWED_CATEGORIES.keys()).find(k => key.includes(k))) : 'Electronics');
}

async function main() {
  const inputPath = process.argv[2];
  const keepUrls = process.argv.includes('--keep-urls');
  const drop = process.argv.includes('--drop');

  if (!inputPath) {
    console.error('Error: Missing input JSON path.');
    console.log('Usage: node scripts/importProducts.js <path-to-json> [--keep-urls] [--drop]');
    process.exit(1);
  }

  const absPath = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(absPath)) {
    console.error('Error: File not found:', absPath);
    process.exit(1);
  }

  const mongoUri = process.env.DB_LINK;
  if (!mongoUri) {
    console.error('Error: DB_LINK is not set in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  try {
    const raw = fs.readFileSync(absPath, 'utf-8');
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) throw new Error('Input JSON must be an array');

    if (drop) {
      await Product.deleteMany({});
      console.log('Dropped existing products');
    }

    let created = 0;
    for (const item of items) {
      const name = item.name?.toString().trim();
      if (!name) continue;

      const price = Number(item.price) || 0;
      const description = item.description?.toString().trim() || '';
      const stock = Number(item.stock ?? 0);
      const category = normalizeCategory(item.category);
      const rawImages = Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []);

      let images = [];
      for (const img of rawImages) {
        if (!img) continue;
        if (keepUrls) {
          images.push({ url: img });
        } else {
          try {
            const uploaded = await cloudinary.uploader.upload(img, { folder: 'may_store/products' });
            images.push({ public_id: uploaded.public_id, url: uploaded.secure_url });
          } catch (e) {
            console.warn('Cloudinary upload failed for', img, e.message);
          }
        }
      }

      const doc = {
        name,
        price,
        description,
        images,
        category,
        stock,
        ratings: Number(item.ratings ?? 0),
        numOfReviews: Number(item.numOfReviews ?? 0),
      };

      await Product.create(doc);
      created += 1;
      if (created % 10 === 0) console.log(`Created ${created} products...`);
    }

    console.log(`Import complete. Created ${created} products.`);
  } catch (err) {
    console.error('Import failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
