// Usage:
//   node backend/scripts/seedAdmin.js --name "may" --email "may@store.local" --password "123"
// If args are omitted, defaults are used.

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const User = require('../models/User');
const bcrypt = require('bcryptjs');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { name: 'may', email: 'mimichmehenni@gmail.com', password: '123' };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--name') out.name = args[++i];
    else if (a === '--email') out.email = args[++i];
    else if (a === '--password') out.password = args[++i];
  }
  return out;
}

async function main() {
  const { name, email, password } = parseArgs();
  const mongoUri = process.env.DB_LINK;
  if (!mongoUri) {
    console.error('DB_LINK missing in backend/.env');
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  try {
    const hash = await bcrypt.hash(password, 10);
    const update = {
      name,
      email: email.toLowerCase(),
      role: 'admin',
      active: true,
      password: hash
    };
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      update,
      { new: true, upsert: true, runValidators: false, setDefaultsOnInsert: true }
    ).select('-password');
    console.log('Admin user ensured:', user.email);
  } catch (err) {
    console.error('Seeding admin failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
