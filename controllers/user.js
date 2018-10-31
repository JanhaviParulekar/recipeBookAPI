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
        if(!user) {
            return ;
        }
        if(await hashService.validateHash(password, user.password)) {
            return user;
        };
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
        return await db.users.findById(id);
    } catch (err) {
        throw err;
    }
}

async function createUser(email, password, name) {
    try {
        if (!password || password.length < 6){
            throw new Error('Please enter a password having minimum length 6');
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