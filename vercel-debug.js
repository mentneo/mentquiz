const fs = require('fs');
const path = require('path');

console.log('------------ VERCEL DEPLOYMENT DEBUGGING ------------');
console.log('Current directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync(process.cwd()));

if (fs.existsSync('package.json')) {
  console.log('package.json exists');
  console.log('package.json content:', JSON.stringify(require('./package.json'), null, 2));
} else {
  console.log('package.json not found!');
}

console.log('Node version:', process.version);
console.log('Environment variables:', Object.keys(process.env));
console.log('------------------------------------------------------');
