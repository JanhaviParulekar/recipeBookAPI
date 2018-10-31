const db = require('../models');
const IngredientController = require('./ingredient');
const UserController = require('./user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

// async function getRecipeByUser(user_id, offset = 0, limit = 10) {
//     try {
//         return await db.recipes.findAll({
//             where: {
//                 user_id: user_id
//             },
//             limit: limit,
//             offset: offset
//         });
//     } catch (err) {
//         throw err;
//     }
// }


// async function getRecipesforUser(user_id, offset = 0, limit = 10) {
//     try {
//         return await db.recipes.findAll({
//             where: {
//                 [Op.or]: [
//                     { user_id: user_id },
//                     { type: 'Public' }
//                 ]
//             },
//             limit: limit,
//             offset: offset
//         });
//     } catch (err) {
//         throw err;
//     }
// }

// async function getAllRecipes(offset = 0, limit = 10) {
//     try {
//         return await db.recipes.findAll({
//             where: {
//                 type: 'Public'
//             },
//             limit: limit,
//             offset: offset
//         });
//     } catch (err) {
//         throw err;
//     }
// }

async function createRecipe(user, recipe) {
    try {
        if (!recipe.name || recipe.name .length < 1){
            throw new Error('Please enter a name');
        }
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
            })

            let ingredientList = await Promise.all(ingredientPromises);
            return await db.recipes.create({
                name: recipe.name,
                description: recipe.description,
                user_id: user.id,
                type: recipe.type,
                recipe_ingredients: ingredientList
            }, {
                    transaction: t,
                    include: ['recipe_ingredients']
                })
        });

    } catch (err) {
        throw err;
    }
}

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
                } catch (er) {
                    throw er;
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

    } catch (e) {
        throw e;
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
 */
async function searchRecipes(options, offset = 0, limit = 10) {
    console.log(options);
    try {
        let query = {
            where: {
                type: 'Public'
            },
            limit: limit,
            offset: offset
        };
        if (options.searchString) {
            query.where[Op.or]= 
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
            console.log(user);
            if(!user) {
                return [];
            }
            query.where.user_id = user.id;
        }
        console.log(query);
        return await db.recipes.findAll(query);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    // getAllRecipes,
    getRecipeByPublicId,
    // getRecipeByUser,
    createRecipe,
    updateRecipe,
    // getRecipesforUser,
    searchRecipes
}