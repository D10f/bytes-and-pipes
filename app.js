const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, 'dist');
// const PUBLIC_DIR = path.resolve(__dirname, 'client/dist');

// Used to process custom request headers and cross-site origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.DOMAIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', "Content-type,Content-parts,Content-filesize");
  res.setHeader('X-Content-Type-Options', "nosniff");
  next();
});

// Used to process incoming raw (binary) data
app.use(bodyParser.raw({ limit: '11mb' }));
app.use(bodyParser.json());
app.use(express.static(PUBLIC_DIR));
app.use(require('./routes/user'));
app.use(require('./routes/file'));
app.use('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

module.exports = app;
