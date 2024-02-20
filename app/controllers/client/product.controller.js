const ApiError = require('../../middlewares/api-error.js')
const ProductService = require('../../services/client/product.service.js')

// [GET] /products
module.exports.find = async (req, res, next) => {
    try {
        const productService = new ProductService()
        const filter = {}
        const products = await productService.find(filter)
        return res.send(products)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the products")
        )
    }
}

// [GET] /products/category/:category
module.exports.findByCategory = async (req, res, next) => {
    try {
        const { category } = req.params
        const productService = new ProductService()
        const products = await productService.findByCategory(category)
        return res.send(products)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the products")
        )
    }
}

// [GET] /products/product-detail/:slug
module.exports.findOne = async (req, res, next) => {
    try {
        const { slug } = req.params
        const productService = new ProductService()
        const product = await productService.findBySlug(slug)
        return res.send(product)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the product details")
        )
    }
}

// [GET] /products/categories/:productId
module.exports.findCategories = async (req, res, next) => {
    try {
        const { productId } = req.params
        const productService = new ProductService()
        const categories = await productService.findCategories(productId)
        return res.send(categories)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving categories of product")
        )
    }
}