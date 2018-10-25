const uuid = require('uuid/v4');

module.exports = function (sequelize, Sequelize) {

    const Ingredients = sequelize.define('ingredients',
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
        }, {
            hooks: {
                beforeValidate: (ingredient) => {
                    ingredient.name = ingredient.name.toLowerCase();
                }
            }
        });

    return Ingredients;
}