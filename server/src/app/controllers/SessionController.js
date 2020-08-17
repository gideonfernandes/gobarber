const Yup = require('yup');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const File = require('../models/File');
const authConfig = require('../../config/auth');

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails.' });
    }

    const { email, password } = request.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return response.status(401).json({ error: 'Credentials does not match.' });
    }

    if (!(await user.checkPassword(password))) {
      return response.status(401).json({ error: 'Credentials does not match.' });
    }

    const {
      id, name, avatar, provider,
    } = user;

    return response.json({
      user: {
        id,
        name,
        email,
        avatar,
        provider,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();
