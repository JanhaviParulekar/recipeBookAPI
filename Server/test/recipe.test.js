const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const jwt = require('../services/jwt');
const hooks = require('./hooks');
const expect = chai.expect;

let user, user2, recipe, alternateRecipe, privateRecipe, token;

let recipeObjAlternate = {
    "name": "Test Recipe Alternate",
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

let recipeObjPrivate = {
    "name": "Test Recipe Private",
    "description": "This is a test recipe",
    "ingredients": [
        {
            "name": "Ingredient A",
            "quantity": 3,
            "unit": "ea"
        }
    ],
    "type": "Private"
}

before((done)=> {
    hooks.resetDB();
    done();
}); 

beforeEach(async () => {

    await hooks.truncateAllTables();
    user = await hooks.createUser();
    recipe = await hooks.createRecipe(user);
    privateRecipe = await hooks.createRecipe(user, recipeObjPrivate);
    user2 = await hooks.createUser('test2@example.com', 'password2', 'Test user 2');
    alternateRecipe = await hooks.createRecipe(user2, recipeObjAlternate);
    token = hooks.getTokenForUser(user);
    // request(app)
    //     .post('/user/login')
    //     .send({
    //         email: 'test@example.com',
    //         password: 'password'
    //     })
    //     .expect(200)
    //     .end((err, res) => {
    //         token = res.body.token;
    //     })
});


describe('POST/recipes', () => {

    it('should create a new recipe', (done) => {
        request(app)
            .post('/recipes')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "recipe": {
                    "name": "Test recipe",
                    "description": "This is a test recipe",
                    "ingredients": [
                        {
                            "name": "Tomato",
                            "quantity": 3,
                            "unit": "ea"
                        }
                    ],
                    "type": "Public"
                }
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.recipe_identifier).to.exist;
                done();
            });
    });

    it('should not create a new recipe without name', (done) => {
        request(app)
            .post('/recipes')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "recipe": {
                    "name": "",
                    "description": "This is a test recipe",
                    "ingredients": [
                        {
                            "name": "Tomato",
                            "quantity": 3,
                            "unit": "ea"
                        }
                    ],
                    "type": "Public"
                }
            })
            .expect(400)
            .end(done)
    });

    it('Should not create a recipe if user is unauthorized', (done) => {
        request(app)
            .post('/recipes')
            .send({
                "recipe": {
                    "name": "Test recipe for unauthorized user",
                    "description": "This is a test recipe",
                    "ingredients": [
                        {
                            "name": "Tomato",
                            "quantity": 3,
                            "unit": "ea"
                        }
                    ],
                    "type": "Public"
                }
            })
            .expect(401)
            .end(done)
    });
});

describe('GET/recipes/:recipeIdenfier', () => {

    it('should update a recipe', (done) => {
        request(app)
            .put(`/recipes/${recipe.public_id}`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                "recipe": {
                    "name": "Test recipe",
                    "description": "This is updated test recipe",
                    "ingredients": [
                        {
                            "name": "Tomato",
                            "quantity": 3,
                            "unit": "ea"
                        }
                    ],
                    "type": "Public"
                }
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.recipe_identifier).to.exist;
                done();
            });
    });

    it('should not update a recipe with wrong recipeIdenfier', (done) => {
        request(app)
            .put(`/recipes/wrongIdentifier`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                "recipe": {
                    "name": "Test recipe",
                    "description": "This is updated test recipe",
                    "ingredients": [
                        {
                            "name": "Tomato",
                            "quantity": 3,
                            "unit": "ea"
                        }
                    ],
                    "type": "Public"
                }
            })
            .expect(404)
            .end(done);
    });

    it('should not update a recipe if the user id unauthorized', (done) => {
        request(app)
            .put(`/recipes/${recipe.public_id}`)
            .send({
                "recipe": {
                    "name": "Test recipe",
                    "description": "This is updated test recipe",
                    "ingredients": [
                        {
                            "name": "Tomato",
                            "quantity": 3,
                            "unit": "ea"
                        }
                    ],
                    "type": "Public"
                }
            })
            .expect(401)
            .end(done);
    });

    it('should not update a recipe with invalid data', (done) => {
        request(app)
            .put(`/recipes/${recipe.public_id}`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                "recipe": {
                    "name": "",
                    "description": "This is updated test recipe",
                    "ingredients": [
                        {
                            "name": "Tomato",
                            "quantity": 3,
                            "unit": "ea"
                        }
                    ],
                    "type": "Public"
                }
            })
            .expect(400)
            .end(done);
    });


    it('should only let the author update the recipe', (done) => {
        request(app)
            .put(`/recipes/${alternateRecipe.public_id}`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                "recipe": {
                    "name": "Test recipe",
                    "description": "This is updated test recipe",
                    "ingredients": [
                        {
                            "name": "Tomato",
                            "quantity": 3,
                            "unit": "ea"
                        }
                    ],
                    "type": "Public"
                }
            })
            .expect(401)
            .end(done);

    });

});

describe('GET/recipes/search', () => {

    it('should display all public recipes', (done) => {
        request(app)
            .get('/recipes/search')
            .expect(200)
            .end((err, res) => {
                expect(res.body.recipes).to.exist;
                expect(res.body.recipes).to.have.lengthOf(2);                
                 done();
            });
    });

    it('should display recipe matching the search string', (done) => {
        request(app)
        .get('/recipes/search?searchString=Test')
        .expect(200)
        .end((err, res) => {
            expect(res.body.recipes).to.exist;
            expect(res.body.recipes).to.have.lengthOf(2);                
            done();
        });
    });

    it('should display recipe matching the user identifier', (done) => {
        request(app)
        .get(`/recipes/search?userIdentifier=${user.public_id}`)
        .expect(200)
        .end((err, res) => {
            expect(res.body.recipes).to.exist;
            expect(res.body.recipes).to.have.lengthOf(1);                
            done();
        });
    });

    it('should display recipe matching both search string and user identifier', (done) => {
        request(app)
        .get(`/recipes/search?searchString=Test&userIdentifier=${user.public_id}`)
        .expect(200)
        .end((err, res) => {
            expect(res.body.recipes).to.exist;
            expect(res.body.recipes).to.have.lengthOf(1);                
            done();
        });
    });

});

describe('GET/recipes/myRecipes', () => {

    it('should display both private and public recipes for the user', (done) => {
        request(app)
        .get('/recipes/myRecipes')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end((err, res) => {
            expect(res.body.recipes).to.exist;
            expect(res.body.recipes[1].recipe_name).to.equal('Test Recipe Private');
            done();
        });
    });

    it('should not display private recipe of another user', (done) => {
        let alternateToken = hooks.getTokenForUser(user2);
        request(app)
        .get('/recipes/myRecipes')
        .set('Authorization', 'Bearer ' + alternateToken)
        .expect(200)
        .end((err, res) => {
            expect(res.body.recipes).to.exist;
            expect(res.body.recipes[0].recipe_name).to.not.equal('Test Recipe Private');
            expect(res.body.recipes).to.have.lengthOf(1);                
            done();
        });
    });

    it('should throw error when no user', (done) => {
        request(app)
        .get('/recipes/myRecipes')
        .expect(401)
        .end(done);
    });

});
