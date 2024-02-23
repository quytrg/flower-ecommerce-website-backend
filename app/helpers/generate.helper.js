const jwt = require('jsonwebtoken')

module.exports.generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
};

module.exports.generateJWT = (payload, secretKey, expiredTime) => {
    return jwt.sign(payload, secretKey, { expiresIn: expiredTime })
}