const Sequelize = require('sequelize');

class File extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize,
      },
    );

    return this;
  }
}

module.exports = File;
