const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipe');
const auth = require('../middleware/auth');

/* GET users listing. */
// router.get('/', auth.getUser, async (req, res, next) => {
//     try {
//         // let recipes = await RecipeController.getAllRecipes();
//         let recipes = await RecipeController.searchRecipes(req)
//         res.json({
//             recipes: recipes.map(recipe => {
//                 return {
//                     recipe_identifier: recipe.public_id,
//                     recipe_name: recipe.name,
//                     recipe_description: recipe.description
//                 }
//             })
//         });

//     } catch (err) {
//         next(err);
//     }
// });

router.get('/search', auth.authenticate, async (req, res, next) => {
    try {
        let searchOptions = {
            searchString: req.query.searchString,
            userIdentifier: req.query.userIdentifier
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
        let recipe = await RecipeController.createRecipe(req.user, req.body.recipe);
        if(req.body.recipe.name.length<1){
            res.status(400).send('Bad data');
            return;
        }
        res.json({
            recipe_identifier: recipe.public_id
        });
    } catch (err) {
        next(res.status(400).send('Bad data'));
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