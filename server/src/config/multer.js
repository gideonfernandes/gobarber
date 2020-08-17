const multer = require('multer');
const crypto = require('crypto');
const { extname, resolve } = require('path');

module.exports = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (request, file, callback) => {
      crypto.randomBytes(16, (error, response) => {
        if (error) return callback(error);
        return callback(
          null,
          response.toString('hex') + extname(file.originalname),
        );
      });
    },
  }),
};
