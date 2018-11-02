const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const jwt = require('../services/jwt');
const hooks = require('./hooks');
const expect = chai.expect;

before(async () => {
    hooks.resetDB();
    user = await hooks.createUser();
})

describe('POST/user/signup', () => {
    it('should sign up user', (done) => {
        request(app)
            .post('/user/signup')
            .send({
                email: "testuser@example.com",
                password: "test1234",
                name: "Test User for sign up"
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.token).to.exist;
                done();
            });
    });

    it('should not sign up a user with incomplete password', (done) => {
        request(app)
            .post('/user/signup')
            .send({
                email: "testuser2@example.com",
                password: "",
                name: "Test User for sign up"
            })
            .expect(400, done)
    });

    it('should not sign up a user with duplicate email', (done) => {
        request(app)
            .post('/user/signup')
            .send({
                email: "testuser@example.com",
                password: "test1234",
                name: "Test User for sign up"
            })
            .expect(400, done)
    });
});

describe('POST/user/login', () => {
    it('should login user and return the token', (done) => {
        request(app)
            .post('/user/login')
            .send({
                email: 'test@example.com',
                password: 'password'
            })
            .expect(200)
            .end((err, res) => {
                expect(jwt.verifyJWT(res.body.token)).to.exist;
                done();
            })
    });

    it('should return 401 if user is unauthorised', (done) => {
        request(app)
            .post('/user/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            })
            .expect(401, done);
    });

    it('should return 401 if user does not exist', (done) => {
        request(app)
            .post('/user/login')
            .send({
                email: 'wrongUser@example.com',
                password: 'password'
            })
            .expect(401, done);
    });
});



describe.only('POST/recipes', () => {
    let token;
    beforeEach((done) => {
        request(app)
        .post('/user/login')
        .send({
            email: 'test@example.com',
            password: 'password'
        })
        .expect(200)
        .end((err, res) => {
            token = res.body.token;
            done();
        })
    })

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

            .end((err, res) => {
                done();
            })
    });
});

describe('GET/recipes/search', () => {
    it('should display all public recipes', (done) => {
        request(app)
            .get('/recipes/search')
            .expect(200)
            .expect((res) => {
                expect(res.body.recipes).to.exist;
            }, done);
    });
});
