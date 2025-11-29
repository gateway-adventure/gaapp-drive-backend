const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { fileId } = req.body;
    
    if (!fileId) {
      return res.status(400).json({ error: 'fileId is required' });
    }
    
    console.log(`📥 Downloading public file: ${fileId}`);
    
    const response = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`);
    
    if (!response.ok) {
      console.error(`❌ Google Drive download failed: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ error: 'Download failed from Google Drive' });
    }
    
    const content = await response.text();
    
    console.log(`✅ Downloaded ${content.length} bytes`);
    res.json({ content: content });
    
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
