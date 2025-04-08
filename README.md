# WhatsApp MCP Server

A Multi-Channel Platform server for WhatsApp integration that allows you to send and receive messages programmatically through a REST API.

## Features

- WhatsApp connection management with QR code authentication
- Send and receive text messages
- Send media messages (images, documents, etc.)
- Contact management
- Chat history
- Session persistence
- REST API for integration with other applications

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (optional but recommended for message storage)
- A WhatsApp account

## Installation

1. Clone the repository:
```
git clone https://github.com/krusleung/whatsapp-mcp-server.git
cd whatsapp-mcp-server
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file from the example:
```
cp .env.example .env
```

4. Edit the `.env` file with your configuration

## Running the Server

Start the development server:
```
npm run dev
```

For production:
```
npm start
```

## API Documentation

### Authentication

The server uses WhatsApp Web's QR code for authentication. When you start the server for the first time, a QR code will be displayed in the console. Scan this with your WhatsApp mobile app:

1. Open WhatsApp on your phone
2. Tap Menu or Settings and select WhatsApp Web
3. Scan the QR code displayed in the terminal

### API Endpoints

#### Auth Routes
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/logout` - Logout from WhatsApp
- `POST /api/auth/restart` - Restart the WhatsApp client

#### Message Routes
- `POST /api/messages/send` - Send a text message
- `POST /api/messages/send-media` - Send a media message
- `GET /api/messages/history/:contact` - Get chat history with a contact

#### Contact Routes
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get a contact by ID
- `GET /api/contacts/chats` - Get all chats

## Example Usage

### Sending a Message

```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{"to": "1234567890", "message": "Hello from WhatsApp MCP Server!"}'
```

### Getting Contacts

```bash
curl -X GET http://localhost:3000/api/contacts
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - WhatsApp Web API
- [Express](https://expressjs.com/) - Web framework
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM