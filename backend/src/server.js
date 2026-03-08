require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`API running on port ${PORT}`)))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
