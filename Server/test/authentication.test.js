const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const jwt = require('../services/jwt');
const hooks = require('./hooks');
const expect = chai.expect;

before((done) => {
    hooks.resetDB();
    done();
})

beforeEach(async ()=> {
    try{
        await hooks.truncateAllTables();
        user = await hooks.createUser();
    } catch (e) {
        throw e;
    }
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
                password: "pass",
                name: "Test User for sign up"
            })
            .expect(400, done)
    });

    it('should not sign up a user with no password', (done) => {
        request(app)
            .post('/user/signup')
            .send({
                email: "testuser2@example.com",
                name: "Test User for sign up"
            })
            .expect(400, done)
    });

    it('should not sign up a user with wrong email', (done) => {
        request(app)
            .post('/user/signup')
            .send({
                email: "example@wrong",
                password: "password",
                name: "Test User for sign up"
            })
            .expect(400, done)
    });

    it('should not sign up a user with empty email', (done) => {
        request(app)
            .post('/user/signup')
            .send({
                email: "",
                password: "password",
                name: "Test"
            })
            .expect(400, done)
    });

    it('should not sign up a user with duplicate email', (done) => {
        request(app)
            .post('/user/signup')
            .send({
                email: 'test@example.com',
                password: 'passwordDuplicate',
                name:'Test User duplicate'
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

    it('should return 401 if no email is provided', (done) => {
        request(app)
            .post('/user/login')
            .send({
                password: 'password'
            })
            .expect(401, done);
    });

    it('should return 401 if no password is provided', (done) => {
        request(app)
            .post('/user/login')
            .send({
                email: 'test@example.com'
            })
            .expect(401, done);
    });
});