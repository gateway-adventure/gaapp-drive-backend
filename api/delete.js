const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { accessToken, folderId, fileName } = req.body;

    if (!accessToken || !folderId || !fileName)
      return res.status(400).json({ error: 'Missing required fields' });

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: 'v3', auth });

    const search = await drive.files.list({
      q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
      fields: 'files(id)',
      pageSize: 1
    });

    if (!search.data.files.length)
      return res.status(404).json({ error: 'File not found' });

    await drive.files.delete({ fileId: search.data.files[0].id });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;