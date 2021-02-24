const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./routes/user');
const fileRouter = require('./routes/file');

const app = express();

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, '../../public');

// const MONGO_URI = 'mongodb://127.0.0.1:27017/uploader'

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, () => {
  console.log('Connection to MongoDB established');
  app.listen(PORT, () => { console.log(`Server running, listening to port ${PORT}`) });
});

//  Used to process incoming raw (binary) data
app.use(bodyParser.raw({ limit: '11mb' }));
app.use(bodyParser.json());
app.use(express.static(PUBLIC_DIR));
app.use(fileRouter);
app.use(userRouter);
