const ApiError = require('../../middlewares/api-error.js')

module.exports.readAccounts = async (req, res, next) => {
    try {
        if (req.account.permissions.includes("read_accounts")) {
            next();
        } else {
            return next(new ApiError(403, "Access denied"))
        }
    }
    catch (err) {
        return next(new ApiError(500, 'An error occured while verifying permission'))
    }
}