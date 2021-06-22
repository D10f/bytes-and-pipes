const mongoose = require('mongoose');
const app = require('../app');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connection to DB established')
  app.listen(PORT, process.env.HOST, () => console.log(`Listening on port ${PORT}`));
}).catch(err => {
  console.error(err.message);
  process.exit(1);
});
