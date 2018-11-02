const { execSync } = require('child_process');
const path = require('path');
const UserController = require('../controllers/user');
const RecipeController = require('../controllers/recipe');
let testUser;
let token;
const jwt = require('../services/jwt');

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
        testUser = await UserController.createUser(email, password, name);
        token = jwt.signJWT({ id: testUser.id });
        return testUser;
    } catch (err) {
        throw err;
    }
}

let recipeObj = {
    "name": "Test Recipe 2",
    "description": "This is a test recipe",
    "ingredients": [
        {
            "name": "Ingredient A",
            "quantity": 3,
            "unit": "ea"
        }
    ],
    "type": "Public"
}

async function createRecipe(recipe = recipeObj) {
    try {
        return await RecipeController.createRecipe(testUser, recipe);
    } catch (err) {
        throw err;
    }
}

function getTestUser() {
    return testUser;
}

function getToken() {
    return token;
}

module.exports = {
    resetDB,
    createUser,
    createRecipe,
    getTestUser,
    getToken
}