const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const jwt = require('../services/jwt');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', async (req, res, next) => {
    try {
        let user = await UserController.validateUserPassword(req.body.email, req.body.password);
        let token = jwt.signJWT({ id: user.id });

        res.json({ token });
    } catch (err) {
        next(err);
    }
});

router.post('/signup', async (req, res, next) => {
    try {
        let user = await UserController.createUser(req.body.email, req.body.password, req.body.name);
        let token = jwt.signJWT({ id: user.id });

        res.json({ token });
    } catch (err) {
        next(err);
    }
});
module.exports = router;
