require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require("./routes/userRoutes")
const { handleError } = require('./utils/errorHandler');
const { httpLogger, logger } = require('./utils/logger');
const gigWorkerRoutes = require("./routes/gigWorkerRoutes");
const roleRoutes = require('./routes/roleRoutes'); // Adjust path accordingly
const supportRoutes = require("./routes/supportRoutes");
const discountRoutes = require("./routes/discountRoutes");
const orderRoutes = require("./routes/orderRoutes");
const clientRoutes= require("./routes/clientRoutes");
const reviewRoutes = require('./routes/reviewRoutes'); // Adjust path accordingly
const paymentMethodRoutes = require('./routes/paymentMethodRoutes'); // Adjust path accordingly
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(httpLogger);

// Routes
app.use('/api/admin', adminRoutes);
app.use('/',userRoutes )
app.use('/api/gigWorker',gigWorkerRoutes);
// Only Used to creating default Roles Not needed further
app.use('/api/roles', roleRoutes);
app.use('/api',supportRoutes);
app.use('/api',discountRoutes);
app.use('/api',orderRoutes);
app.use('/api/client',clientRoutes);
app.use('/api',reviewRoutes);
app.use('/api',paymentMethodRoutes);
// --------------------------------

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Application error:', err);
  handleError(err, res);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});