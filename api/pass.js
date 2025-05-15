// Vercel serverless function for handling wallet passes
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const API_URL = process.env.PASSENTRY_API_URL;
  const API_KEY = process.env.PASSENTRY_API_KEY;
  const TEMPLATE_ID = process.env.PASSENTRY_TEMPLATE_ID;

  if (!API_URL || !API_KEY) {
    return res.status(500).json({ error: 'API credentials not configured' });
  }

  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // GET request to get an existing pass
    if (req.method === 'GET') {
      const response = await fetch(`${API_URL}/api/v1/passes/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
      });

      if (response.status === 404) {
        return res.status(404).json({ error: 'Pass not found' });
      }

      const data = await response.json();
      
      return res.status(response.status).json({
        passUrl: data?.data?.attributes?.downloadUrl || null,
        status: response.status,
      });
    }
    
    // POST request to create a new pass
    if (req.method === 'POST') {
      if (!TEMPLATE_ID) {
        return res.status(500).json({ error: 'Template ID not configured' });
      }

      const requestUrl = `${API_URL}/api/v1/passes?passTemplate=${TEMPLATE_ID}&extId=${walletAddress}`;
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          pass: {
            nfc: { 
              enabled: true,
              source: "extId"
            },
            qr: {
              value: walletAddress
            },
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Wallet pass creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        return res.status(response.status).json({ error: 'Failed to create wallet pass', details: errorData });
      }

      const data = await response.json();
      return res.status(response.status).json({
        passUrl: data?.data?.attributes?.downloadUrl || null,
        status: response.status,
      });
    }
    
    // PATCH request to update pass balance
    if (req.method === 'PATCH') {
      const { balance } = req.body;
      
      if (balance === undefined) {
        return res.status(400).json({ error: 'Balance is required' });
      }

      const response = await fetch(`${API_URL}/api/v1/loyalty/${walletAddress}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          overrideBalance: balance
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Pass balance update failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        return res.status(response.status).json({ error: 'Failed to update pass balance', details: errorData });
      }

      return res.status(200).json({
        status: response.status,
        success: true
      });
    }

    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
} 