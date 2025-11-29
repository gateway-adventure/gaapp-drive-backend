const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.json({
    status: 'GAAPP Drive Backend Running',
    version: '1.0.0',
    endpoints: ['/api/push', '/api/pull', '/api/delete', '/api/folders', '/api/download']
  });
});

app.use('/api/push', require('./api/push'));
app.use('/api/pull', require('./api/pull'));
app.use('/api/delete', require('./api/delete'));
app.use('/api/folders', require('./api/folders'));
app.use('/api/download', require('./api/download'));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;
