const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { accessToken, folderId, fileName, content } = req.body;

    if (!accessToken || !folderId || !fileName || !content)
      return res.status(400).json({ error: 'Missing required fields' });

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.create({
      requestBody: { name: fileName, parents: [folderId] },
      media: { mimeType: 'application/json', body: content },
      fields: 'id, name'
    });

    res.json({ success: true, fileId: response.data.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;