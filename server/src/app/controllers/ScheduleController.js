const { startOfDay, endOfDay, parseISO } = require('date-fns');
const { Op } = require('sequelize');

const User = require('../models/User');
const Appointment = require('../models/Appointment');

class ScheduleController {
  async index(request, response) {
    const isProvider = await User.findOne({
      where: { id: request.userId, provider: true },
    });

    if (!isProvider) {
      return response.status(401).json({ error: 'User is not a provider.' });
    }

    const { date } = request.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: request.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });

    return response.json(appointments);
  }
}

module.exports = new ScheduleController();
