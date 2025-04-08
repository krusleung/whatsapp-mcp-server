const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  hasMedia: {
    type: Boolean,
    default: false
  },
  mediaUrl: {
    type: String
  },
  mediaType: {
    type: String
  },
  isFromMe: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  }
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;