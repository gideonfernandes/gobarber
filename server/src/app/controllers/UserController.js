const Yup = require('yup');
const User = require('../models/User');
const File = require('../models/File');

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails.' });
    }

    const {
      name, email, provider, password,
    } = request.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return response.status(400).json({ error: 'User already exists.' });
    }

    const user = await User.create({
      name,
      email,
      provider,
      password,
    });

    return response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider,
    });
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when(
        'oldPassword',
        (oldPassword, field) => (oldPassword ? field.required() : field),
      ),
      confirmPassword: Yup.string().min(6).when(
        'password', (password, field) => (password ? field.required()
          .oneOf([Yup.ref('password')]) : field),
      ),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails.' });
    }

    const { email, oldPassword } = request.body;

    const user = await User.findByPk(request.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return response.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return response.status(401).json({ error: 'Password does not match.' });
    }

    await user.update(request.body);

    const { id, name, avatar } = await User.findByPk(request.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return response.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

module.exports = new UserController();
