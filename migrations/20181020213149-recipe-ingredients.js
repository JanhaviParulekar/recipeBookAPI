'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('recipe_ingredients', {
            recipe_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'recipes',
                    key: 'id'
                }
            },
            ingredient_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'ingredients',
                    key: 'id'
                }
            },
            quantity: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            unit: {
                type: Sequelize.ENUM('kg', 'lb', 'g', 'ea', 'lit', 'ml', 'oz', 'tsp', 'tbsp', 'cup', 'inch'),
                allowNull: false
            }
        });

    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('recipe_ingredients');
    }
};
