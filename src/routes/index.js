const messageRoutes = require('./messageRoutes');
const authRoutes = require('./authRoutes');
const contactRoutes = require('./contactRoutes');

function setupRoutes(app, client) {
  // API health check route
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      clientStatus: client.info ? 'authenticated' : 'not authenticated'
    });
  });

  // Setup all route groups
  app.use('/api/messages', messageRoutes(client));
  app.use('/api/auth', authRoutes(client));
  app.use('/api/contacts', contactRoutes(client));

  // Fallback 404 route
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });
}

module.exports = { setupRoutes };