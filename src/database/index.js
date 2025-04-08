const mongoose = require('mongoose');
const logger = require('../utils/logger');

function setupDatabase() {
  // Get MongoDB URI from environment variables or use default
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-mcp';
  
  // Connect to MongoDB
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });

  // MongoDB connection events
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  return mongoose.connection;
}

module.exports = { setupDatabase };