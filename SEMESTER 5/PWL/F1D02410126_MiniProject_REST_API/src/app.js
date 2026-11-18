const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const bookRoutes = require('./routes/bookRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes');

dotenv.config();
const app = express();

// Middleware global
app.use(express.json());
app.use(logger);

// Daftar Routes API
app.use('/api/books', bookRoutes);
app.use('/api/borrowings', borrowingRoutes);

// Error Handler Terpusat (Wajib ditaruh paling bawah setelah semua routes)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});