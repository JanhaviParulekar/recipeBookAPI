const bcrypt = require('bcrypt');
const saltRounds = 10;

async function generateHash(password) {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (err) {
        throw err;
    }

}

async function validateHash(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    generateHash,
    validateHash
}