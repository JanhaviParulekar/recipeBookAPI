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
            res.status(401).send('Unauthorised User');
            return;
        }
        const user_id = jwt.verifyJWT(token).id;

        const user = await UserController.getUserById(user_id);

        if(!user) {
            res.status(401).send('Unauthorised User');
            return;
        }

        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        console.log("here");
        console.log(err);
        res.status(500).send('Internal Server Error');
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
        res.status(400).send('Bad Request');
    }
}


module.exports = {
    authenticate,
    getUser
}