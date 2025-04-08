require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('./utils/logger');
const { setupRoutes } = require('./routes');
const { setupDatabase } = require('./database');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

// WhatsApp event handlers
client.on('qr', (qr) => {
  // Generate and display QR code in terminal
  logger.info('QR code received, scan to authenticate');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  logger.info('WhatsApp client is ready');
});

client.on('message', async (message) => {
  logger.info(`Received message: ${message.body}`);
  // Process incoming messages here
});

client.on('disconnected', (reason) => {
  logger.warn(`Client was disconnected: ${reason}`);
});

// Initialize WhatsApp client
client.initialize();

// Setup API routes
setupRoutes(app, client);

// Connect to database
setupDatabase();

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  client.destroy();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  client.destroy();
  process.exit(0);
});

module.exports = { app, client };