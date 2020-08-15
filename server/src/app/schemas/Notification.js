const Mongoose = require('mongoose');

const NotificationSchema = new Mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  provider_id: {
    type: Number,
    required: true,
  },
  read: {
    type: String,
    required: true,
    default: false,
  },
}, { timestamps: true });

module.exports = Mongoose.model('Notification', NotificationSchema);
