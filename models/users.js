const uuid = require('uuid/v4');

module.exports = function (sequelize, Sequelize) {
    const Users = sequelize.define('users',
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
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            }
        }, {
            hooks: {
                beforeValidate: (user) => {
                    console.log(user);
                    if (!user.public_id) {
                        user.public_id = uuid();
                    }
                }
            }

        });

    return Users;
}