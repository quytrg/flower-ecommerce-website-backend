const ApiError = require('../../middlewares/api-error.js')
const CategoryService = require('../../services/client/category.service.js')
const ProductCategoryService = require('../../services/client/product-category.service.js')

// [GET] /categories
module.exports.find = async (req, res, next) => {
    try {
        const categoryService = new CategoryService()
        const filter = {
            deleted: false,
            status: 'active'
        }
        const categories = await categoryService.find(filter)
        res.json(categories)    
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the categories")
        )
    }
}

// [GET] /categories/:slug
module.exports.findOne = async (req, res, next) => {
    try {
        const categoryService = new CategoryService()
        const { slug } = req.params
        filter = {
            slug,
            deleted: false,
            status: 'active'
        }
        const category = await categoryService.findOne(filter)
        res.send(category)    
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the category")
        )
    }
}

// [GET] /categories/product/:id
module.exports.findCategoriesByProductId = async (req, res, next) => {
    try {
        const categoryService = new CategoryService()
        const productCategoryService = new ProductCategoryService()

        const { id } = req.params
        const categoryIds = await productCategoryService.findCategoryIdsByProductId(id)

        const filter = {
            _id: { $in: categoryIds },
            deleted: false,
            status: 'active'
        }
        const categories = await categoryService.find(filter)
        res.send(categories)    
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the categories")
        )
    }
}
