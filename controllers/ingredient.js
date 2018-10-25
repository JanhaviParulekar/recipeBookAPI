const db = require('../models');

/**
 * Checks if the ingredient exists else create a new one
 * @param {string} ingredientName name of ingredient
 * 
 * @returns {Ingredient} newly created or found ingredient
 */
async function createIngredient(ingredientName, transaction = null) {
    try {
        let ingredientArr = await db.ingredients.findOrCreate({
            where: {
                name: ingredientName
            },
            transaction: transaction
        });
        return ingredientArr[0];
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createIngredient
}