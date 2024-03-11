const ApiError = require('../../middlewares/api-error.js')
const AccountService = require('../../services/admin/account.service.js')

// hash password with bcrypt
const bcrypt = require('bcrypt')

// helpers
const jwtHelper = require('../../helpers/jwt.helper.js')

// database
const database = require('../../config/database/index.js')

// [POST] /auth/login
module.exports.login = async (req, res, next) => {
    try {
        const accountService = new AccountService()
        
        const filter = {
            email: req.body.email,
            deleted: false
        }
        const account = await accountService.findOne(filter)
        
        // check if the account exists or not
        if (!account) {
            res.status(401).send("Wrong email or password!")
            return
        }

        // check password
        const hashedPassword = account.password
        const plaintextPassword = req.body.password;
        const match = await bcrypt.compare(plaintextPassword, hashedPassword);
        if (!match) {
            res.status(401).send("Wrong email or password!")
            return
        }

        // check if the account is locked or not
        if (account.status === 'inactive') {
            res.status(403).send("Account is locked!")
            return
        }

        // remove password before returning data
        const { password, ...info } = account._doc

        // generate jwt
        const accessTokenExpire = 1 * 60 * 60 // 1h in seconds
        const refreshTokenExpire = 60 * 24 * 60 * 60 // 60 days in seconds
        const accessToken = await jwtHelper.generate(
            {
                id: info._id,
                roleId: info.roleId
            },
            process.env.JWT_ACCESS_KEY,
            `${accessTokenExpire}s`
        )
        .catch((err) => {
            return next(new ApiError(500, err.message))
        }) 
        const refreshToken = await jwtHelper.generate(
            {
                id: info._id,
                roleId: info.roleId
            },
            process.env.JWT_REFRESH_KEY,
            `${refreshTokenExpire}s`
        )
        .catch((err) => {
            return next(new ApiError(500, err.message))
        }) 

        // save refresh token to redis
        const client = await database.connectRedis()
        await client.set(info._id.toString(), refreshToken, (err, reply) => {
            if (err) {
                return next(new ApiError(500, 'An error occurred while saving refresh token to redis'))
            }
        })
        await client.expire(info._id.toString(), refreshTokenExpire)
        await client.disconnect()

        // save refreshToken to cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
        })

        // save refreshToken to cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
            expires : new Date(Date.now() + refreshTokenExpire * 1000) // milliseconds
        })

        res.status(200).json(info)

    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while logging in")
        )
    }
}

// [PATCH] /auth/refresh-token
module.exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies
        if (!refreshToken) {
            return next(new ApiError(401, "You're not authenticated"))
        }

        // verify refresh token
        const { iat, exp, ...payload } = await jwtHelper.verify(refreshToken, process.env.JWT_REFRESH_KEY)
                                    .catch((err) => {
                                        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
                                            return next(new ApiError(401, err.message))
                                        }
                                        return next(new ApiError(500, 'An error occured while verifying authorization'))
                                    })

        // check if refresh token exists in the database
        const client = await database.connectRedis()
        const currentRefreshToken = await client.get(payload.id, (err, reply) => {
            if (err) {
                return next(new ApiError(500, 'An error occured while retrieving refresh token from database'))
            }
        })
        if (currentRefreshToken !== refreshToken) {
            return next(new ApiError(401, "You're not authenticated"))
        }

        // generate new tokens
        const accessTokenExpire = 1 * 60 * 60 // 1h in seconds
        const refreshTokenExpire = 60 * 24 * 60 * 60 // 60 days in seconds

        const newAccessToken = await jwtHelper.generate(payload, process.env.JWT_ACCESS_KEY, `${accessTokenExpire}s`)
        const newRefreshToken = await jwtHelper.generate(payload, process.env.JWT_REFRESH_KEY, `${refreshTokenExpire}s`)

        // save refresh token to redis
        await client.set(payload.id, newRefreshToken, (err, reply) => {
            if (err) {
                return next(new ApiError(500, 'An error occurred while saving refresh token to redis'))
            }
        })
        await client.expire(payload.id, refreshTokenExpire)
        await client.disconnect()

        // save token to cookies
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
        })
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
            expires : new Date(Date.now() + refreshTokenExpire * 1000) // milliseconds
        })

        return res.status(200).json({
            message: 'Refresh token succussfully'
        })
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while refreshing token")
        )
    }
}

// [DELETE] /auth/logout
module.exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies
        if (!refreshToken) {
            return next(new ApiError(401, 'Unauthorized'))
        }

        // clear accessToken and refreshToken from cookies
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

        // delete freshToken from redis
        const client = await database.connectRedis()
        await client.del(refreshToken, (err, reply) => {
            if (err) {
                return next(new ApiError(500, "An error occurred while deleting refresh token from redis"))
            }
        })

        res.status(200).json({
            message: "Log out successfully"
        })
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while logging out")
        )
    }
}