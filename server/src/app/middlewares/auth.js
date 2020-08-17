const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

module.exports = async (request, response, next) => {
  const token = request.header('auth-token');

  if (!token) {
    return response.status(401).json({ error: 'Token is not provided.' });
  }

  // Verify token
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    request.userId = decoded.id;

    return next();
  } catch (error) {
    return response.status(401).json({ error: 'Token is not valid.' });
  }
};
