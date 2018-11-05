const { execSync } = require('child_process');
const path = require('path');
const UserController = require('../controllers/user');
const RecipeController = require('../controllers/recipe');
const db = require('../models');
let testUser;
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
            try {
                execSync(`${basePath} ${command}`, options);
            } catch (e) {
            }
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

async function truncateAllTables() {
    try {
        const tables = [
            'recipe_ingredients',
            'ingredients',
            'recipes',
            'users',
        ];
        
        let query = 'SET FOREIGN_KEY_CHECKS=0; ';

        tables.forEach(tableName => {
            query += `TRUNCATE TABLE ${tableName}; `;
        });

        query += 'SET FOREIGN_KEY_CHECKS=1;'
        return await db.sequelize.query(query);
    } catch (e) {
        throw e;
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

async function createRecipe(user = testUser, recipe = recipeObj) {
    try {
        return await RecipeController.createRecipe(user, recipe);
    } catch (err) {
        throw err;
    }
}

function getTokenForUser(user) {
    return jwt.signJWT({ id: user.id });
}

function getTestUser() {
    return testUser;
}

module.exports = {
    resetDB,
    createUser,
    createRecipe,
    getTestUser,
    getTokenForUser,
    truncateAllTables
}