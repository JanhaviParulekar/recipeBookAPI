'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ingredients',
            {
                id: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true
                }
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('ingredients');
    }
};
