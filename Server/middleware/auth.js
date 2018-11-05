const jwt = require('../services/jwt');
const UserController = require('../controllers/user');

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
            throw new Error('UNAUTHORIZED');
        }
        const user_id = jwt.verifyJWT(token).id;

        const user = await UserController.getUserById(user_id);

        if(!user) {
            throw new Error('UNAUTHORIZED');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        next(err);
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
        next(new Error('UNAUTHORIZED'));
    }
}


module.exports = {
    authenticate,
    getUser
}