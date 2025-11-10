const fs = require('fs');
const path = require('path');

console.log('🚀 May Amina Store Setup Script');
console.log('================================\n');

// Create backend .env file
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const backendTemplatePath = path.join(__dirname, 'backend', 'env.template');

if (!fs.existsSync(backendEnvPath)) {
  if (fs.existsSync(backendTemplatePath)) {
    fs.copyFileSync(backendTemplatePath, backendEnvPath);
    console.log('✅ Created backend/.env file from template');
  } else {
    console.log('❌ Backend env template not found');
  }
} else {
  console.log('ℹ️  Backend .env file already exists');
}

// Create frontend .env file
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
const frontendTemplatePath = path.join(__dirname, 'frontend', 'env.template');

if (!fs.existsSync(frontendEnvPath)) {
  if (fs.existsSync(frontendTemplatePath)) {
    fs.copyFileSync(frontendTemplatePath, frontendEnvPath);
    console.log('✅ Created frontend/.env file from template');
  } else {
    console.log('❌ Frontend env template not found');
  }
} else {
  console.log('ℹ️  Frontend .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Configure your services (MongoDB, Stripe, Cloudinary, Gmail)');
console.log('2. Update the .env files with your credentials');
console.log('3. Run: npm run install-all');
console.log('4. Run: npm run dev');
console.log('\n📖 See SETUP_GUIDE.md for detailed instructions');




