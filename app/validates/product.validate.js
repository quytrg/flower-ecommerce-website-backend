const ApiError = require('../middlewares/api-error')

module.exports.validate = async (req, res, next) => {
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

        if (!req.body.discountPercentage || req.body.discountPercentage < 0) {
            return next(new ApiError(400, "Invalid data"))
        }

        next()
    }
    catch (err) {
        return next(new ApiError(500, 'An error occured while verifying permission'))
    }
}