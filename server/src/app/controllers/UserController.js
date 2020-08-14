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
    return response.json({ ok: true });
  }
}

module.exports = new UserController();
