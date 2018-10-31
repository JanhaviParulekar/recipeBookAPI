const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const UserController = require('../controllers/user');
const jwt = require('../services/jwt');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', async (req, res, next) => {
    try {
        let user = await UserController.validateUserPassword(req.body.email, req.body.password);
        if (!user) {
            res.status(401).send('Unauthorised User');
            return;
        }
        let token = jwt.signJWT({ id: user.id });

        res.json({ token });
    } catch (err) {
        next(err);
    }
});

router.post('/signup', async (req, res, next) => {
    try {
        let user = await UserController.createUser(req.body.email, req.body.password, req.body.name);
        if(req.body.password.length<6){
            res.status(400).send('Bad data');
            return;
        }
        let token = jwt.signJWT({ id: user.id });

        res.json({ token });
    } catch (err) {
        next(res.status(400).send('Bad data'));
    }
});
module.exports = router;
