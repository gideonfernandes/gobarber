const Yup = require('yup');
const {
  startOfHour, parseISO, isBefore, format, subHours,
} = require('date-fns');
const pt = require('date-fns/locale/pt');

const User = require('../models/User');
const Appointment = require('../models/Appointment');
const File = require('../models/File');
const Notification = require('../schemas/Notification');

const Mail = require('../../lib/Mail');

class AppointmentController {
  async index(request, response) {
    const { page = 1 } = request.query;

    const appointments = await Appointment.findAll({
      where: { user_id: request.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return response.json(appointments);
  }

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

    // Check if trying create appointment with the same user
    if (provider_id === request.userId) {
      return response.status(400).json(
        { error: 'You cannot create appointments with yourself.' },
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

    // Notify appointment to provider
    const user = await User.findByPk(request.userId);
    const formattedDate = format(
      hourStart,
      "'dia 'dd' de 'MMMM', às 'H:mm'h'",
      { locale: pt },
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user_id: request.userId,
      provider_id,
    });

    return response.json(appointment);
  }

  async delete(request, response) {
    const appointment = await Appointment.findByPk(request.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (appointment.user_id !== request.userId) {
      return response.status(401).json(
        { error: 'Only owners can delete yours appointments.' },
      );
    }

    // Verify if appointment date is available to cancell (2hours in advance)
    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      return response.status(401).json(
        { error: 'Only appointments with 2 hours in advance can be canceled.' },
      );
    }

    appointment.canceled_at = new Date();
    await appointment.save();

    // Send email with canceled appointment information to provider
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado!',
      text: 'Você tem um novo agendamento cancelado de Gideon Fernandes.',
    });

    return response.json(appointment);
  }
}

module.exports = new AppointmentController();
