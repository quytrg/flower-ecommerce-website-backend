const jwtHelper = require('../../helpers/jwt.helper')

module.exports.requireAuth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const accessToken = req.headers.authorization.split(' ')[1]
            jwtHelper.verify(accessToken, process.env.JWT_ACCESS_KEY)
                .then((decoded) => {
                    req.account = decoded
                    next()
                })
                .catch((err) => {
                    if (err.name === 'JsonWebTokenError') {
                        return res.status(401).json({
                            message: err.message
                        })
                    }
                    return res.status(500).json({
                        message: 'An error occured while verifying authorization'
                    })
                })
        }
        else {
            return res.status(401).json({
                message: 'Request needs authorization'
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: 'An error occured while requiring authorization'
        })
    }
}