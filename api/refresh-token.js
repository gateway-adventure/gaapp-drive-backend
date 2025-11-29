const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { clientId, clientSecret, refreshToken } = req.body;
    
    if (!clientId || !clientSecret || !refreshToken) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    console.log('🔄 Refreshing access token...');
    
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('refresh_token', refreshToken);
    params.append('grant_type', 'refresh_token');
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Token refresh failed: ${response.status} ${errorText}`);
      return res.status(response.status).json({ error: 'Token refresh failed', details: errorText });
    }
    
    const data = await response.json();
    console.log('✅ Token refreshed successfully');
    
    res.json(data);
    
  } catch (error) {
    console.error('❌ Refresh token error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
