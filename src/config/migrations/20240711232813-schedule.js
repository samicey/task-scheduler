'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Schedules', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      day: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startHour: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      startMinutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      endHour: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      endMinutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Schedules');
  }
};

