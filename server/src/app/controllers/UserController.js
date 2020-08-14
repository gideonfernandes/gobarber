const User = require('../models/User');

class UserController {
  async store(request, response) {
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

    const { id, name, provider } = await user.update(request.body);

    return response.json({
      id,
      name,
      email,
      provider,
    });
  }
}

module.exports = new UserController();
