const ApiError = require('../../middlewares/api-error.js')
const CategoryService = require('../../services/admin/category.service.js')

// [GET] /categories/
module.exports.find = async (req, res, next) => {
    try {
        const categoryService = new CategoryService()
        const filter = {
            deleted: false,
        }
        if (req.query.status) {
            filter.status = req.query.status
        }
        const categories = await categoryService.find(filter)
        res.json(categories)
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
        const { id } = req.params
        const categories = await categoryService.findCategoriesByProductId(id)
        res.send(categories)    
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the categories")
        )
    }
}