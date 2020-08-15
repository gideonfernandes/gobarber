const Yup = require('yup');
const { startOfHour, parseISO, isBefore } = require('date-fns');

const User = require('../models/User');
const Appointment = require('../models/Appointment');

class AppointmentController {
  async store(request, response) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails.' });
    }

    const { provider_id, date } = request.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    // Check if is a valid provider
    if (!isProvider) {
      return response.status(401).json(
        { error: 'You can only create appointments with a valid provider.' },
      );
    }

    // Check if is not a past date
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return response.status(400).json(
        { error: 'Past dates are not permitted.' },
      );
    }

    // Check if date is available
    const isNotAvailable = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (isNotAvailable) {
      return response.status(400).json(
        { error: 'Appointment date is not available.' },
      );
    }

    const appointment = await Appointment.create({
      user_id: request.userId,
      provider_id,
      date: hourStart,
    });

    return response.json(appointment);
  }
}

module.exports = new AppointmentController();
