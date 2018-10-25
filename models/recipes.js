const uuid = require('uuid/v4');

module.exports = function (sequelize, Sequelize) {
    const Recipes = sequelize.define('recipes',
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
                allowNull: false,
                unique: 'user_recipename_index'
            },
            description: {
                type: Sequelize.TEXT,
            },
            user_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                unique: 'user_recipename_index'
            },
            type: {
                type: Sequelize.ENUM('Public', 'Private'),
                defaultValue: 'Public'
            }
        },
        {
            hooks: {
                beforeValidate: (recipe) => {
                    if (!recipe.public_id) {
                        recipe.public_id = uuid();
                    }
                }
            }
        });
    return Recipes;
}