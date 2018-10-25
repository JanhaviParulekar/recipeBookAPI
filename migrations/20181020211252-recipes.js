'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.createTable('recipes',
            {
                id: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                public_id: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                description: {
                    type: Sequelize.TEXT
                },
                user_id: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    }
                },
                type: {
                    type: Sequelize.ENUM('Public', 'Private'),
                    defaultValue: 'Public'
                }
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('recipes');
    }
};
