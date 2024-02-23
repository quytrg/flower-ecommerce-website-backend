const jwt = require('jsonwebtoken')

module.exports.generate = (payload, secretKey, expiredTime) => {
    return jwt.sign(payload, secretKey, { expiresIn: expiredTime })
}