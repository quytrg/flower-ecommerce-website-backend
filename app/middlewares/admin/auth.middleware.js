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
                    const { id, roleId } = decoded
                    const accountService = new AccountService()
                    const accountSelect = "-password -deleted -deletedAt -updatedAt -__v"
                    const account = await accountService.findOne({
                        _id: id,
                        deleted: false
                    }, accountSelect)
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
                    req.account = account._doc

                    // retrieving role info
                    const roleService = new RoleService()
                    const filter = {
                        _id: roleId,
                        deleted: false
                    }
                    const roleSelect = 'permissions'
                    const role = await roleService.findOne(filter, roleSelect)
                    req.account.roleTitle = role.title
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