const express = require('express');
const logger = require('../utils/logger');

function messageRoutes(client) {
  const router = express.Router();

  // Send a message to a contact
  router.post('/send', async (req, res) => {
    try {
      const { to, message } = req.body;
      
      if (!to || !message) {
        return res.status(400).json({ error: 'Missing required parameters: to, message' });
      }

      // Format number for WhatsApp
      const formattedNumber = to.includes('@c.us') ? to : `${to}@c.us`;
      
      // Send message
      const response = await client.sendMessage(formattedNumber, message);
      
      logger.info(`Message sent to ${to}: ${message}`);
      
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully',
        messageId: response.id._serialized
      });
    } catch (error) {
      logger.error(`Error sending message: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to send message',
        details: error.message
      });
    }
  });

  // Send media (image, document, etc)
  router.post('/send-media', async (req, res) => {
    try {
      const { to, mediaUrl, caption, mediaType } = req.body;
      
      if (!to || !mediaUrl || !mediaType) {
        return res.status(400).json({ error: 'Missing required parameters: to, mediaUrl, mediaType' });
      }

      // Format number for WhatsApp
      const formattedNumber = to.includes('@c.us') ? to : `${to}@c.us`;
      
      // Get media from URL
      const media = await MessageMedia.fromUrl(mediaUrl);
      
      // Send media
      const response = await client.sendMessage(formattedNumber, media, { caption });
      
      logger.info(`Media sent to ${to} of type ${mediaType}`);
      
      return res.status(200).json({
        success: true,
        message: 'Media sent successfully',
        messageId: response.id._serialized
      });
    } catch (error) {
      logger.error(`Error sending media: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to send media',
        details: error.message
      });
    }
  });

  // Get chat history with a contact
  router.get('/history/:contact', async (req, res) => {
    try {
      const { contact } = req.params;
      const { limit = 50 } = req.query;
      
      // Format number for WhatsApp
      const formattedNumber = contact.includes('@c.us') ? contact : `${contact}@c.us`;
      
      // Get chat with contact
      const chat = await client.getChatById(formattedNumber);
      
      // Fetch messages
      const messages = await chat.fetchMessages({ limit: parseInt(limit) });
      
      return res.status(200).json({
        success: true,
        contact: formattedNumber,
        messages: messages.map(msg => ({
          id: msg.id._serialized,
          body: msg.body,
          fromMe: msg.fromMe,
          timestamp: msg.timestamp,
          hasMedia: msg.hasMedia
        }))
      });
    } catch (error) {
      logger.error(`Error fetching chat history: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch chat history',
        details: error.message
      });
    }
  });

  return router;
}

module.exports = messageRoutes;