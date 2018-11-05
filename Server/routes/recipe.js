const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipe');
const auth = require('../middleware/auth');

router.get('/search', async (req, res, next) => {
    try {
        let searchOptions =  {
            searchString: req.query.searchString || null,
            userIdentifier: req.query.userIdentifier || null
        };

        let recipes = await RecipeController.searchRecipes(searchOptions);
        res.json({
            recipes: recipes.map(recipe => {
                return {
                    recipe_identifier: recipe.public_id,
                    recipe_name: recipe.name,
                    recipe_description: recipe.description
                }
            })
        });

    } catch (err) {
        next(err);
    }
});

router.post('/', auth.authenticate, async (req, res, next) => {
    try {

        if (!req.body.recipe || !req.body.recipe.name || req.body.recipe.name.length < 1) {
            
            throw new Error('BAD REQUEST');
        }

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

        if (!req.body.recipe || !req.body.recipe.name || req.body.recipe.name.length < 1) {    
            throw new Error('BAD REQUEST');
        }

        let recipe = await RecipeController.getRecipeByPublicId(req.params.recipeIdentifier);
        if(!recipe) {
            throw new Error('NOT FOUND');
        }

        if(req.user.id != recipe.user_id){
            throw new Error('UNAUTHORIZED');
        }

        

        await RecipeController.updateRecipe(req.user, recipe, req.body.recipe);
        
        res.json({
            recipe_identifier: recipe.public_id
        });

    } catch (err) {
        next(err);
    }
});

router.get('/myRecipes', auth.authenticate, async (req, res, next) => {
    try {
        let recipes = await RecipeController.getMyRecipes(req.user);
        res.json({
            recipes: recipes.map(recipe => {
                return {
                    recipe_identifier: recipe.public_id,
                    recipe_name: recipe.name,
                    recipe_description: recipe.description
                }
            })
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;