const ApiError = require('../../middlewares/api-error.js')
const CategoryService = require('../../services/admin/category.service.js')
const ProductCategoryService = require('../../services/admin/product-category.service.js')

// helpers
const searchHelper = require('../../helpers/search.helper.js')
const paginationHelper = require('../../helpers/pagination.helper.js')


// [GET] /categories/
module.exports.find = async (req, res, next) => {
    try {
        const categoryService = new CategoryService()

        const filter = {
            deleted: false,
        }

        // filter by status
        if (req.query.status) {
            filter.status = req.query.status
        }

        // seach
        if (req.query.keyword) {
            const searchObj = searchHelper(req.query)
            filter.title = searchObj.regex
        }

        // pagination
        const initPagination = {
            currentPage: 1,
            limit: 6
        }
        initPagination.totalRecords = await categoryService.count(filter)
        const paginationObject = paginationHelper(req.query, initPagination)
        
        const categories = await categoryService.find(filter, paginationObject)
        return res.status(200).json({
            categories,
            totalPages: paginationObject.totalPages,
            limit: paginationObject.limit,
            skip: paginationObject.skip
        })
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving categories")
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