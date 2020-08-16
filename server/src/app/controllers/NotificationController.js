const User = require('../models/User');
const Notification = require('../schemas/Notification');

class NotificationController {
  async index(request, response) {
    const isProvider = await User.findOne({
      where: {
        id: request.userId,
        provider: true,
      },
    });

    if (!isProvider) {
      return response.status(401).json({
        error: 'Only providers can load notifications.',
      });
    }

    const notifications = await Notification.find({
      provider_id: request.userId,
    }).sort({ createdAt: 'desc' }).limit(20);

    return response.json(notifications);
  }
}

module.exports = new NotificationController();
