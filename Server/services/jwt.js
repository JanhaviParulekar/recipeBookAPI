const jwt = require('jsonwebtoken');
const secret = 'coco';

function signJWT(data, expiry = '30 days') {
    return jwt.sign(data, secret, { expiresIn: expiry });
}

function verifyJWT(key) {
    try {
        return jwt.verify(key, secret);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    signJWT,
    verifyJWT
}