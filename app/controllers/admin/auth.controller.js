const md5 = require('md5')
const ApiError = require('../../middlewares/api-error.js')
const AuthService = require('../../services/admin/auth.service.js')

module.exports.find = async (req, res, next) => {
    try {

        const authService = new AuthService()
        
        const filter = {
            email: req.body.email,
            deleted: false
        }
        const account = await authService.findOne(filter)
        
        if (!account) {
            res.send("EmailNotExist")
        }

        if (account.password !== md5(req.body.password)) {
            res.send("WrongPassword")
        }

        if (account.status === 'inactive') {
            res.send("Block")
        }

        res.cookie('token', account.token)
        res.send("Success")
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while logining")
        )
    }
}