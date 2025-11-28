const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { accessToken, parentFolderId, folderName } = req.body;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: 'v3', auth });

    const metadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    };
    if (parentFolderId) metadata.parents = [parentFolderId];

    const r = await drive.files.create({
      requestBody: metadata,
      fields: 'id'
    });

    res.json({ success: true, folderId: r.data.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/find', async (req, res) => {
  try {
    const { accessToken, parentFolderId, folderName } = req.body;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: 'v3', auth });

    let q = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
    if (parentFolderId) q += ` and '${parentFolderId}' in parents`;

    const r = await drive.files.list({
      q,
      fields: 'files(id)',
      pageSize: 1
    });

    if (!r.data.files.length)
      return res.json({ success: false, found: false });

    res.json({ success: true, found: true, folderId: r.data.files[0].id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;