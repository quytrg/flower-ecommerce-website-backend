const ApiError = require('../../middlewares/api-error.js')
const ProductService = require('../../services/client/product.service.js')
const CategoryService = require('../../services/client/category.service.js')
const ProductCategoryService = require('../../services/client/product-category.service.js')

// [GET] /products
module.exports.find = async (req, res, next) => {
    try {
        const productService = new ProductService()
        const filter = {
            status: 'active',
            deleted: false
        }
        const select = "-status -position -deleted -createdBy -updatedBy -deletedBy -deletedAt -updatedAt"
        const products = await productService.find(filter, select)
        return res.status(200).json(products)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the products")
        )
    }
}

// [GET] /products/category/:categorySlug
module.exports.findByCategory = async (req, res, next) => {
    try {
        const productService = new ProductService()
        const categoryService = new CategoryService()
        const productCategoryService = new ProductCategoryService()

        const { categorySlug } = req.params
        const category = await categoryService.findOne({ slug: categorySlug, deleted: false, status: 'active' })
        const productIds = await productCategoryService.findProductIdsByCategoryId(category.id)
        const filter = {
            _id: { $in: productIds },
            deleted: false,
            status: 'active'
        }
        const products = await productService.find(filter)
        return res.json(products)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the products")
        )
    }
}

// [GET] /products/product-detail/:slug
module.exports.findBySlug = async (req, res, next) => {
    try {
        const productService = new ProductService()

        const { slug } = req.params
        const filter = {
            slug,
            deleted: false,
            status: 'active'
        }
        const select = "-status -position -deleted -createdBy -updatedBy -deletedBy -deletedAt -updatedAt"
        const product = await productService.findOne(filter, select)
        return res.json(product)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the product details")
        )
    }
}

// [GET] /products/categories/:productId
// module.exports.findCategories = async (req, res, next) => {
//     try {
//         const { productId } = req.params
//         const productService = new ProductService()
//         const categories = await productService.findCategories(productId)
//         return res.send(categories)
//     }
//     catch (err) {
//         return next (
//             new ApiError(500, "An error occurred while retrieving categories of product")
//         )
//     }
// }