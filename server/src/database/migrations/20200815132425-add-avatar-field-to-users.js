module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'avatar_id',
    {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNUll: true,
    },
  ),

  down: async (queryInterface) => queryInterface.removeColumn(
    'users',
    'avatar_id',
  ),
};
