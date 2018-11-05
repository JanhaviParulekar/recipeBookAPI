const db = require('../models');
const IngredientController = require('./ingredient');
const UserController = require('./user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Get a recipe by public Id
 * @param {*} public_id
 * 
 * @returns 
 */
async function getRecipeByPublicId(public_id) {
    try {
        return await db.recipes.findOne({
            where: {
                public_id: public_id
            }
        });
    } catch (err) {
        throw err;
    }
}

async function getMyRecipes(user) {
    try {
        return await db.recipes.findAll({
            where: {
                user_id: user.id
            }
        });
    } catch (err) {
        throw err;
    }
}
/**
 * 
 * @param {*} user 
 * @param {*} recipe 
 * 
 * @returns
 */
async function createRecipe(user, recipe) {
    try {
        return await db.sequelize.transaction(async (t) => {

            let ingredientPromises = recipe.ingredients.map(async (ingredient) => {
                try {
                    let thisIngredient = await IngredientController.createIngredient(ingredient.name, t);
                    return {
                        ingredient_id: thisIngredient.id,
                        quantity: ingredient.quantity,
                        unit: ingredient.unit
                    }
                } catch (er) {
                    throw er;
                }
            });

            let ingredientList = await Promise.all(ingredientPromises);
            return await db.recipes.create(
                {
                    name: recipe.name,
                    description: recipe.description,
                    user_id: user.id,
                    type: recipe.type,
                    recipe_ingredients: ingredientList
                }, {
                    transaction: t,
                    include: ['recipe_ingredients']
                });
        });

    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} user 
 * @param {*} recipe 
 * @param {*} newRecipe 
 * 
 * @returns
 */
async function updateRecipe(user, recipe, newRecipe) {
    try {
        return await db.sequelize.transaction(async (t) => {
            // delete all ingredients in this recipe
            await db.recipeIngredients.destroy({
                where: {
                    recipe_id: recipe.id
                }
            }, { transaction: t });

            //find or create all new ingredients
            let ingredientPromises = newRecipe.ingredients.map(async (ingredient) => {
                try {
                    let thisIngredient = await IngredientController.createIngredient(ingredient.name, t);
                    return {
                        recipe_id: recipe.id,
                        ingredient_id: thisIngredient.id,
                        quantity: ingredient.quantity,
                        unit: ingredient.unit
                    }
                } catch (err) {
                    throw err;
                }
            })
            let ingredientList = await Promise.all(ingredientPromises);

            // update recipe in db
            recipe.name = newRecipe.name;
            recipe.description = newRecipe.description;
            recipe.type = newRecipe.type;
            await recipe.save({ transaction: t });

            // create recipe ingredients
            await db.recipeIngredients.bulkCreate(ingredientList, { transaction: t })
        });

    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} options search options 
 * {
 *     searchString: 'abc',
 *     userIdentifier: 'hdsihfknd93hiuw9erxnkcl'
 * }
 * @param {*} offset 
 * @param {*} limit 
 * 
 * @returns 
 */
async function searchRecipes(options, offset = 0, limit = 10) {
    try {
        let query = {
            where: {
                type: 'Public'
            },
            limit: limit,
            offset: offset
        };
        if (options.searchString) {
            query.where[Op.or] =
                [
                    {
                        name: {
                            [Op.like]: `%${options.searchString}%`
                        }
                    },
                    {
                        description: {
                            [Op.like]: `%${options.searchString}%`
                        }
                    }
                ];
        }

        if (options.userIdentifier) {
            let user = await UserController.getUserByPublicId(options.userIdentifier);
            if (!user) {
                return [];
            }
            query.where.user_id = user.id;
        }

        return await db.recipes.findAll(query);

    } catch (err) {
        throw err;
    }
}

module.exports = {
    getRecipeByPublicId,
    createRecipe,
    updateRecipe,
    searchRecipes,
    getMyRecipes
}