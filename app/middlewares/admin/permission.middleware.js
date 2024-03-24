const ApiError = require('../../middlewares/api-error.js')

module.exports.createProducts = async (req, res, next) => {
    try {
        if (req.account.permissions.includes("create_products")) {
            next();
        } else {
            return next(new ApiError(403, "Access denied"))
        }
    }
    catch (err) {
        return next(new ApiError(500, 'An error occured while verifying permission'))
    }
}

module.exports.readProducts = async (req, res, next) => {
    try {
        if (req.account.permissions.includes("read_products")) {
            next();
        } else {
            return next(new ApiError(403, "Access denied"))
        }
    }
    catch (err) {
        return next(new ApiError(500, 'An error occured while verifying permission'))
    }
}

module.exports.updateProducts = async (req, res, next) => {
    try {
        if (req.account.permissions.includes("update_products")) {
            next();
        } else {
            return next(new ApiError(403, "Access denied"))
        }
    }
    catch (err) {
        return next(new ApiError(500, 'An error occured while verifying permission'))
    }
}

module.exports.deleteProducts = async (req, res, next) => {
    try {
        if (req.account.permissions.includes("delete_products")) {
            next();
        } else {
            return next(new ApiError(403, "Access denied"))
        }
    }
    catch (err) {
        return next(new ApiError(500, 'An error occured while verifying permission'))
    }
}