module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('delivery_problems', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNul: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('delivery_problems');
  },
};
