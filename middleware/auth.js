const jwt = require('../services/jwt');
const UserController = require('../controllers/user');
const createError = require('http-errors')

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function authenticate(req, res, next) {
    try {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        } else {
            throw 'invalid user';
        }

        const user_id = jwt.verifyJWT(token).id;

        const user = await UserController.getUserById(user_id);

        if(!user) {
            next(createError(401, 'Unauthorized User'));    
        }

        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        next(createError(401, 'Unauthorized User'));
    }
}

async function getUser(req, res, next) {
    try {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        } else {
            next();
            return;
        }

        const user_id = jwt.verifyJWT(token).id;

        const user = await UserController.getUserById(user_id);
        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        next(createError(404, 'Bad Request'));
    }
}


module.exports = {
    authenticate,
    getUser
}