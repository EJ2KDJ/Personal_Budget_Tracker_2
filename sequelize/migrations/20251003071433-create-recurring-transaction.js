'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RecurringTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      envelope_id: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      type: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      frequency: {
        type: Sequelize.STRING
      },
      next_occurrence: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RecurringTransactions');
  }
};