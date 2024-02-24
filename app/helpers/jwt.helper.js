const jwt = require('jsonwebtoken')

module.exports.generate = async (payload, secretKey, expiredTime) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, { expiresIn: expiredTime }, (err, token) => {
            if (err) reject(err)
            resolve(token)
        }) 
    })
}

module.exports.verify = async (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) reject(err)
            resolve(decoded)
        })
    })
}