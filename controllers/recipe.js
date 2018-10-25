const db = require('../models');
const IngredientController = require('../controllers/ingredient');

async function getRecipeByPublicId(public_id) {
    try {
        return await db.recipes.findOne({ where: { public_id: public_id } });
    } catch (err) {
        throw err;
    }
}

async function getRecipeByUser(user_id, offset = 0, limit = 10) {
    try {
        return await db.recipes.findAll({ where: { user_id: user_id }, limit: limit, offset: offset });
    } catch (err) {
        throw err;
    }
}

async function getAllRecipes(offset = 0, limit = 10) {
    try {
        return await db.recipes.findAll({ limit: limit, offset: offset });
    } catch (err) {
        throw err;
    }
}

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

module.exports = {
    getAllRecipes,
    getRecipeByPublicId,
    getRecipeByUser,
    createRecipe,
    updateRecipe
}