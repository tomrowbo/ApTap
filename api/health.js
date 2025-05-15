// Health check endpoint for the API
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if PassEntry API credentials are configured
  const apiConfigured = process.env.PASSENTRY_API_URL && 
                        process.env.PASSENTRY_API_KEY && 
                        process.env.PASSENTRY_TEMPLATE_ID;

  // Current time in ISO format
  const timestamp = new Date().toISOString();
  
  // Return health status
  return res.status(200).json({
    status: 'ok',
    timestamp,
    environment: process.env.NODE_ENV || 'development',
    api: {
      configured: !!apiConfigured,
      // Don't expose actual values, just whether they exist
      credentials: {
        apiUrl: !!process.env.PASSENTRY_API_URL,
        apiKey: !!process.env.PASSENTRY_API_KEY,
        templateId: !!process.env.PASSENTRY_TEMPLATE_ID
      }
    },
    version: process.env.npm_package_version || '1.0.0'
  });
} 