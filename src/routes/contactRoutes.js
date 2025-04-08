const express = require('express');
const logger = require('../utils/logger');

function contactRoutes(client) {
  const router = express.Router();

  // Get all contacts
  router.get('/', async (req, res) => {
    try {
      const contacts = await client.getContacts();
      
      return res.status(200).json({
        success: true,
        contacts: contacts.map(contact => ({
          id: contact.id._serialized,
          name: contact.name,
          shortName: contact.shortName,
          pushname: contact.pushname,
          isGroup: contact.isGroup,
          isWAContact: contact.isWAContact
        }))
      });
    } catch (error) {
      logger.error(`Error fetching contacts: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch contacts',
        details: error.message
      });
    }
  });

  // Get contact by ID
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Format number for WhatsApp if necessary
      const contactId = id.includes('@c.us') ? id : `${id}@c.us`;
      
      const contact = await client.getContactById(contactId);
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          error: 'Contact not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        contact: {
          id: contact.id._serialized,
          name: contact.name,
          shortName: contact.shortName,
          pushname: contact.pushname,
          isGroup: contact.isGroup,
          isWAContact: contact.isWAContact,
          profilePicUrl: await contact.getProfilePicUrl()
        }
      });
    } catch (error) {
      logger.error(`Error fetching contact: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch contact',
        details: error.message
      });
    }
  });

  // Get all chats
  router.get('/chats', async (req, res) => {
    try {
      const chats = await client.getChats();
      
      return res.status(200).json({
        success: true,
        chats: chats.map(chat => ({
          id: chat.id._serialized,
          name: chat.name,
          isGroup: chat.isGroup,
          timestamp: chat.timestamp,
          unreadCount: chat.unreadCount
        }))
      });
    } catch (error) {
      logger.error(`Error fetching chats: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch chats',
        details: error.message
      });
    }
  });

  return router;
}

module.exports = contactRoutes;