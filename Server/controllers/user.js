const db = require('../models');
const hashService =  require('../services/hash');

async function getUserByEmail(email) {
    try {
        return await db.users.findOne({ where: { email: email } });
    } catch (err) {
        throw err;
    }
}

async function validateUserPassword(email, password) {
    try {
        const user = await getUserByEmail(email);
        if(!user || !password) {
            throw new Error('UNAUTHORIZED');
        }
        if(await hashService.validateHash(password, user.password)) {
            return user;
        } else {
            throw new Error('UNAUTHORIZED');
        }
    } catch (err) {
        throw err;
    }
}

async function getUserByPublicId(public_id) {
    try {
        return await db.users.findOne({ where: { public_id: public_id } });
    } catch (err) {
        throw err;
    }
}

async function getUserById(id) {
    try {
        return await db.users.findByPk(id);
    } catch (err) {
        throw err;
    }
}

async function createUser(email, password, name) {
    try {
        if (!password || password.length < 6){
            throw new Error('BAD REQUEST');
        }
        let pwd = await hashService.generateHash(password);
        return await db.users.create({
            name, 
            email, 
            password: pwd
        });

    } catch (err) {
        throw err;
    }
}

module.exports = {
    getUserByEmail,
    getUserById,
    getUserByPublicId,
    validateUserPassword,
    createUser
}