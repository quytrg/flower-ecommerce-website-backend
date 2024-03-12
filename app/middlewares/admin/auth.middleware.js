const jwtHelper = require('../../helpers/jwt.helper')
const ApiError = require('../../middlewares/api-error.js')
const RoleService = require('../../services/admin/role.service.js')
const AccountService = require('../../services/admin/account.service.js')

module.exports.requireAuth = async (req, res, next) => {
    try {
        const { accessToken } = req.cookies
        if (accessToken) {
            jwtHelper.verify(accessToken, process.env.JWT_ACCESS_KEY)
                .then(async (decoded) => {
                    req.account = decoded
                    const accountService = new AccountService()
                    const account = await accountService.findOne({
                        _id: req.account.id,
                        deleted: false
                    })
                    // check if the account exists or not
                    if (!account) {
                        return res.status(404).json({
                            message: "Account does not exists"
                        })
                    }
                    // check if the account is locked or not
                    if (account.status === 'inactive') {
                        return res.status(403).json({
                            message: "Account is locked"
                        })
                    }

                    // retrieving role info
                    const roleService = new RoleService()
                    const filter = {
                        _id: req.account.roleId,
                        deleted: false
                    }
                    const select = 'permissions'
                    const role = await roleService.findOne(filter, select)
                    req.account.permissions = role.permissions
                    next()
                })
                .catch((err) => {
                    if (err.name === 'TokenExpiredError') {
                        return res.json({
                            code: 401,
                            message: err.message
                        })
                    }
                    return next(new ApiError(500, 'An error occured while verifying authorization'))
                })
        }
        else {
            return res.json({
                code: 401,
                message: 'jwt required'
            })
        }
    }
    catch (error) {
        return next(new ApiError(500, 'An error occured while requiring authorization'))
    }
}