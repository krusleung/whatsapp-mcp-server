const express = require('express');
const logger = require('../utils/logger');

function authRoutes(client) {
  const router = express.Router();

  // Get authentication status
  router.get('/status', (req, res) => {
    try {
      const isAuthenticated = client.info !== undefined;
      
      return res.status(200).json({
        success: true,
        authenticated: isAuthenticated,
        info: isAuthenticated ? {
          wid: client.info.wid,
          platform: client.info.platform,
          pushname: client.info.pushname
        } : null
      });
    } catch (error) {
      logger.error(`Error checking auth status: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to check authentication status',
        details: error.message
      });
    }
  });

  // Logout from WhatsApp
  router.post('/logout', async (req, res) => {
    try {
      await client.logout();
      logger.info('Logged out from WhatsApp');
      
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error(`Error logging out: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to logout',
        details: error.message
      });
    }
  });

  // Restart client
  router.post('/restart', async (req, res) => {
    try {
      await client.destroy();
      client.initialize();
      
      logger.info('WhatsApp client restarted');
      
      return res.status(200).json({
        success: true,
        message: 'Client restarted successfully'
      });
    } catch (error) {
      logger.error(`Error restarting client: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to restart client',
        details: error.message
      });
    }
  });

  return router;
}

module.exports = authRoutes;