const jwtHelper = require('../../helpers/jwt.helper')
const ApiError = require('../../middlewares/api-error.js')

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
                        return next(new ApiError(401, err.message))
                    }
                    return next(new ApiError(500, 'An error occured while verifying authorization'))
                })
        }
        else {
            return res.status(401).json({
                message: 'Request needs authorization'
            })
        }
    }
    catch (error) {
        return next(new ApiError(500, 'An error occured while requiring authorization'))
    }
}