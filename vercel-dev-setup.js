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

// Load environment variables from .env.local if it exists
const envFilePath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envFilePath)) {
  console.log('.env.local file found, loading environment variables...');
  const envContent = fs.readFileSync(envFilePath, 'utf8');
  
  // Parse the environment variables
  envContent.split('\n').forEach(line => {
    // Skip empty lines and comments
    if (!line || line.startsWith('#')) return;
    
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      
      // Only add to process.env, not to the config file
      process.env[key] = value;
    }
  });
  
  console.log('Environment variables loaded from .env.local');
} else {
  console.log('Warning: .env.local file not found. API will run without credentials.');
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
  ]
  // IMPORTANT: No env section - variables will be passed from process.env
};

// Write the temporary config file
fs.writeFileSync(
  path.join(process.cwd(), 'vercel-dev.json'),
  JSON.stringify(vercelDevConfig, null, 2)
);

console.log('Created vercel-dev.json configuration file (without sensitive data)');
console.log('Running "vercel dev" with API-only configuration');
console.log('Environment variables will be passed from process.env');
console.log('Use CTRL+C to exit');

// Create a cleanup function
const cleanup = () => {
  try {
    const devJsonPath = path.join(process.cwd(), 'vercel-dev.json');
    if (fs.existsSync(devJsonPath)) {
      fs.unlinkSync(devJsonPath);
      console.log('Cleaned up temporary configuration file');
    }
  } catch (error) {
    console.error('Warning: Could not clean up vercel-dev.json file:', error.message);
  }
};

// Register cleanup on process exit
process.on('exit', cleanup);
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, cleaning up...');
  cleanup();
  process.exit(0);
});
process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, cleaning up...');
  cleanup();
  process.exit(0);
});

// Run vercel dev with the custom config
try {
  // Pass environment directly to vercel dev command
  execSync('vercel dev --listen 3000 -A vercel-dev.json', { 
    stdio: 'inherit',
    env: process.env 
  });
} catch (error) {
  // Handle Ctrl+C gracefully
  console.log('\nVercel dev server stopped');
  cleanup();
} 