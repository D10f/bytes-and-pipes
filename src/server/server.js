const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

require('./db/mongoose');

const app = express();

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, '../../public');

//  Used to process incoming raw (binary) data
app.use(bodyParser.raw({ limit: '10mb' }));
app.use(bodyParser.json());
app.use(express.static(PUBLIC_DIR));
app.use(require('./routes/user');
app.use(require('./routes/file');
