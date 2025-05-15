#!/usr/bin/env node

/**
 * This script sets up the Vercel development environment
 * It configures Vercel to only run API functions, not the frontend
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Check if .vercel directory exists
const vercelDir = path.join(process.cwd(), '.vercel');
if (!fs.existsSync(vercelDir)) {
  console.log('Warning: .vercel directory does not exist. Run "vercel link" first.');
  process.exit(1);
}

// Create a temporary vercel-dev.json file
const vercelDevConfig = {
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "env": {
    "PASSENTRY_API_URL": "https://api.passentry.com",
    "PASSENTRY_API_KEY": "dev-mode-mock-key",
    "PASSENTRY_TEMPLATE_ID": "dev-mode-mock-template-id"
  }
};

// Write the temporary config file
fs.writeFileSync(
  path.join(process.cwd(), 'vercel-dev.json'),
  JSON.stringify(vercelDevConfig, null, 2)
);

console.log('Created vercel-dev.json configuration file');
console.log('Running "vercel dev" with API-only configuration');
console.log('Use CTRL+C to exit');

// Run vercel dev with the custom config
try {
  execSync('vercel dev --listen 3000 -A vercel-dev.json', { stdio: 'inherit' });
} catch (error) {
  // Handle Ctrl+C gracefully
  console.log('\nVercel dev server stopped');
}

// Clean up the temporary file
try {
  fs.unlinkSync(path.join(process.cwd(), 'vercel-dev.json'));
  console.log('Cleaned up temporary configuration file');
} catch (error) {
  console.error('Warning: Could not clean up vercel-dev.json file');
} 