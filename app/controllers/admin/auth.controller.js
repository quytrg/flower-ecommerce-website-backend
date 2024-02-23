const ApiError = require('../../middlewares/api-error.js')
const AccountService = require('../../services/admin/account.service.js')

// hash password with bcrypt
const bcrypt = require('bcrypt')

// helpers
const jwtHelper = require('../../helpers/jwt.helper.js')

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
            res.status(404).send("Email does not exist!")
            return
        }

        // check password
        const hashedPassword = account.password
        const plaintextPassword = req.body.password;
        const match = await bcrypt.compare(plaintextPassword, hashedPassword);
        if (!match) {
            res.status(404).send("Wrong password!")
            return
        }

        // check if the account is locked or not
        if (account.status === 'inactive') {
            res.status(404).send("Account is locked!")
            return
        }

        // remove password before returning data
        const { password, ...info } = account._doc

        // generate jwt
        const accessToken = jwtHelper.generate(
            {
                id: info._id,
                roleId: info.roleId
            },
            process.env.JWT_ACCESS_KEY,
            '2h'
        )
        const refreshToken = jwtHelper.generate(
            {
                id: info._id,
                roleId: info.roleId
            },
            process.env.JWT_REFRESH_KEY,
            '3w'
        )

        // temporarily save accessToken in cookies -> save in pinia
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false, // -> true when deploying
            path: '/',
            sameSite: 'strict'
        })

        // save refreshToken in cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // -> true when deploying
            path: '/',
            sameSite: 'strict'
        })

        res.status(200).json({ ...info, accessToken, refreshToken })

    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while logging in")
        )
    }
}