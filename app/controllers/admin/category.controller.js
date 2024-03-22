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

// [POST] /categories
module.exports.create = async (req, res, next) => {
    try {
        const categoryService = new CategoryService()

        if (!req.body?.position) { 
            req.body.position = await categoryService.count({ deleted: false }) + 1
        } 
        else {
            req.body.position = parseInt(req.body.position)
        }

        const document = await categoryService.create(req.body)
        
        res.status(201).json({
            message: "Create a new category successfully",
            document: document
        })
    }
    catch (err) {
        return next(
            new ApiError(500, `An error occurred while creating a new product`)
        )
    }
}

// [GET] /categories/:id
module.exports.findOne = async (req, res, next) => {
    try {
        const categoryService = new CategoryService()

        const { id } = req.params
        const filter = {
            _id: id,
            deleted: false,
        }
        const select = "-deleted -deletedAt -__v"
        const category = await categoryService.findOne(filter, select)
        return res.status(200).json(category)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the account")
        )
    }
}

// [PATCH] /categories/:id
module.exports.updateOne = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update cannot be empty"))
    }

    try {
        const categoryService = new CategoryService()

        const { id } = req.params
        const data = req.body
        const document = await categoryService.updateOne(id, data)
        
        if (!document) {
            return next(new ApiError(404, "Category not found"))
        }
        return res.status(200).json({
            message: "Category was updated successfully",
            updatedDocument: document
        })
    }
    catch (err) {
        return next(
            new ApiError(500, `Error retrieving category with id: ${req.params.id}`)
        )
    }
}