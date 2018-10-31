const { execSync } = require('child_process');
const path = require('path');
const UserController = require('../controllers/user');

function resetDB() {
    try {
        const options = {
            env: {
                NODE_ENV: 'test'
            }
        }
        const commands = [
            'db:drop',
            'db:create',
            'db:migrate'
        ]
        const basePath = path.normalize('node_modules/.bin/sequelize');

        commands.forEach(command => {
            execSync(`${basePath} ${command}`, options);
        })
    } catch (e) {
        throw e;
    }
};

async function createUser(email = 'test@example.com', password = 'password', name = 'Test User') {
    try {
        return await UserController.createUser(email, password, name);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    resetDB,
    createUser
}