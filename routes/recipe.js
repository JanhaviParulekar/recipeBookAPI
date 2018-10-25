const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipe');
const auth = require('../middleware/auth');

/* GET users listing. */
router.get('/', auth.getUser, async (req, res, next) => {
    try {
        next();

    } catch (err) {
        next(err);
    }
});

router.post('/', auth.authenticate, async (req, res, next) => {
    try {
        let recipe = await RecipeController.createRecipe(req.user, req.body.recipe);
        res.json({
            recipe_identifier: recipe.public_id
        });
    } catch (err) {
        next(err);
    }
});

router.put('/:recipeIdentifier', auth.authenticate, async (req, res, next) => {
    try {
        let recipe = await RecipeController.getRecipeByPublicId(req.params.recipeIdentifier);

        await RecipeController.updateRecipe(req.user, recipe, req.body.recipe);

        res.json({
            recipe_identifier: recipe.public_id
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;