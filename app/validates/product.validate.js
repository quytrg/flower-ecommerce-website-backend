const ApiError = require('../middlewares/api-error')

module.exports.createProduct = async (req, res, next) => {
    try {
        // convert datatype
        req.body.price = parseFloat(req.body.price)
        req.body.discountPercentage = parseInt(req.body.discountPercentage)
        req.body.stock = parseInt(req.body.stock)

        // check conditions
        if (!req.body.title || req.body.title.length < 2 || req.body.title.length > 200) {
            return next(new ApiError(400, "Invalid data"))
        }

        if (!req.body.price || req.body.price < 1) {
            return next(new ApiError(400, "Invalid data"))
        }

        if (!req.body.stock || req.body.stock < 1) {
            return next(new ApiError(400, "Invalid data"))
        }

        if (req.body.discountPercentage == null || req.body.discountPercentage == undefined || req.body.discountPercentage < 0) {
            return next(new ApiError(400, "Invalid data"))
        }

        next()
    }
    catch (err) {
        return next(new ApiError(500, 'An error occured while verifying product data'))
    }
}

module.exports.updateProduct = async (req, res, next) => {
    try {
        // convert datatype
        req.body.price = parseFloat(req.body.price)
        req.body.discountPercentage = parseInt(req.body.discountPercentage)
        req.body.stock = parseInt(req.body.stock)

        // check conditions
        if (!req.body.title || req.body.title.length < 2 || req.body.title.length > 200) {
            return next(new ApiError(400, "Invalid data"))
        }

        if (!req.body.price || req.body.price < 1) {
            return next(new ApiError(400, "Invalid data"))
        }

        if (!req.body.stock || req.body.stock < 1) {
            return next(new ApiError(400, "Invalid data"))
        }

        if (req.body.discountPercentage == null || req.body.discountPercentage == undefined || req.body.discountPercentage < 0) {
            return next(new ApiError(400, "Invalid data"))
        }

        next()
    }
    catch (err) {
        return next(new ApiError(500, 'An error occured while verifying permission'))
    }
}

module.exports.changeStatus = async (req, res, next) => {
    try {
        const validKeys = ['status']
        Object.keys(req.body).forEach(key => (
            !validKeys.includes(key) && delete req.body[key]
        ))

        const validValues = ['active', 'inactive']
        if (!req.body.status || !validValues.includes(req.body.status)) {
            return next(new ApiError(400, 'Invalid data'))
        }

        next()
    }
    catch (err) {
        return next(new ApiError(500, 'An error occured while verifying product data'))
    }
}