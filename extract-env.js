#!/usr/bin/env node

/**
 * סקריפט עזר: מציג את משתני הסביבה בפורמט מוכן להעתקה ל-Vercel
 * הרצה: node extract-env.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ קובץ .env.local לא נמצא!');
  console.log('ודא שהקובץ נמצא באותה תיקייה כמו הסקריפט');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

console.log('\n📋 העתק את המשתנים האלה ל-Vercel:');
console.log('=' .repeat(60));
console.log('\nEnvironment Variables → Add New\n');

lines.forEach(line => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=').trim();
  
  if (key && value) {
    console.log(`Name:  ${key.trim()}`);
    console.log(`Value: ${value}`);
    console.log('-'.repeat(60));
  }
});

console.log('\n✅ סה"כ', lines.length, 'משתנים');
console.log('\n💡 טיפ: לחץ "Add" אחרי כל משתנה, אחר כך המשך להבא\n');
