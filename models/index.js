const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    database: process.env.db_name || 'recipebook',
    username: process.env.db_username || 'root',
    password: process.env.db_password || 'password',
    host: process.env.db_host || 'localhost',
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: false,
    define: {
        timestamps: false
    }
});

let db = {
    sequelize: sequelize,
    Sequelize: Sequelize
}

db.users = db.sequelize.import('./users');
db.recipes = db.sequelize.import('./recipes');
db.recipeIngredients = db.sequelize.import('./recipe-ingredients');
db.ingredients = db.sequelize.import('./ingredients');

db.users.hasMany(db.recipes, { foreignKey: 'user_id', sourceKey: 'id' });
db.recipes.belongsTo(db.users, { foreignKey: 'user_id', targetKey: 'id' });

db.recipes.belongsToMany(db.ingredients, { through: db.recipeIngredients });
db.ingredients.belongsToMany(db.recipes, { through: db.recipeIngredients });

db.recipes.hasMany(db.recipeIngredients, { foreignKey: 'recipe_id', sourceKey: 'id' });
db.recipeIngredients.belongsTo(db.recipes, { foreignKey: 'recipe_id', targetKey: 'id' });

db.ingredients.hasMany(db.recipeIngredients, { foreignKey: 'ingredient_id', sourceKey: 'id' });
db.recipeIngredients.belongsTo(db.ingredients, { foreignKey: 'ingredient_id', targetKey: 'id' });

module.exports = db;