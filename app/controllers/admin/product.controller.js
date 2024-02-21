const ApiError = require('../../middlewares/api-error.js')
const ProductService = require('../../services/admin/product.service.js')
const ProductCategoryService = require('../../services/admin/product-category.service')

// helpers
const searchHelper = require('../../helpers/search.helper.js')
const paginationHelper = require('../../helpers/pagination.helper.js')

// [GET] /products
module.exports.find = async (req, res, next) => {
    try {
        const productService = new ProductService()

        const filter = {
            deleted: false
        }

        // filter by status
        if (req.query.status) {
            filter.status = req.query.status
        }

        // filter by cateogry
        if (req.query.category) {
            const productCategoryService = new ProductCategoryService()
            const productIds = await productCategoryService.findProductIdsByCategoryId(req.query.category)
            filter._id = { $in: productIds }
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
        initPagination.totalRecords = await productService.count(filter)
        const paginationObject = paginationHelper(req.query, initPagination)

        const products = await productService.find(filter, paginationObject)
        return res.json({
            products,
            totalPages: paginationObject.totalPages,
            limit: paginationObject.limit,
            skip: paginationObject.skip
        })
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the products")
        )
    }
}

// [PATCH] /products/:id
module.exports.updateOne = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update cannot be empty"))
    }

    try {
        const productService = new ProductService()
        const productCategoryService = new ProductCategoryService()

        const { id } = req.params
        const data = req.body
        const document = await productService.updateOne(id, data)

        const { categories } = req.body
        if (categories) {
            await productCategoryService.deleteAllCategoriesOfProduct(id)
            const categoryIds = categories.map(item => item._id)
            await productCategoryService.create(id, categoryIds)
        }
        
        if (!document) {
            return next(new ApiError(404, "Product not found"))
        }
        res.send({
            message: "Product was updated successfully",
            updatedDocument: document
        })
    }
    catch (err) {
        return next(
            new ApiError(500, `Error retrieving product with id: ${req.params.id}`)
        )
    }
}

// [PATCH] /products/change-multi
module.exports.updateMany = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update cannot be empty"))
    }

    try {
        const productService = new ProductService()
        const { ids, type } = req.body
        let payload = {}
        switch (type) {
            case 'active':
            case 'inactive':
                payload = {
                    status: type
                }
                break 
            case 'delete':
                payload = {
                    deleted: true,
                    deletedAt: new Date()
                }
                break
            case 'position':
                const document = []
                const { positions } = req.body
                for(let index = 0; index < ids.length; index++) {
                    const result = await productService.updateOne(ids[index], { position: parseInt(positions[index]) })
                    document.push(result)
                }
                res.send({
                    message: "Change state of multiple product successfully",
                    updatedDocument: document
                })
                return
            default:
                break
        }
        const document = await productService.updateMany(ids, payload)
        
        if (!document) {
            return next(new ApiError(404, "Product not found"))
        }
        res.send({
            message: "Change state of multiple product successfully",
            updatedDocument: document
        })
    }
    catch (err) {
        return next(
            new ApiError(500, `An error occurred while changing the state of multiple product`)
        )
    }
}

// [POST] /products
module.exports.create = async (req, res, next) => {
    try {
        const productService = new ProductService()
        const productCategoryService = new ProductCategoryService()

        // create product information
        req.body.price = parseFloat(req.body.price)
        req.body.discountPercentage = parseInt(req.body.discountPercentage)
        req.body.stock = parseInt(req.body.stock)

        if (!req.body?.position) { 
            req.body.position = await productService.count({ deleted: false }) + 1
        } 
        else {
            req.body.position = parseInt(req.body.position)
        }

        const document = await productService.create(req.body)
        
        // create categories
        const { categories } = req.body
        if (categories) {
            const categoryIds = categories.map(item => item._id)
            await productCategoryService.create(document.id, categoryIds)
        }

        res.send({
            message: "Create a new product successfully",
            updatedDocument: document
        })
    }
    catch (err) {
        return next(
            new ApiError(500, `An error occurred while creating a new product`)
        )
    }
}

// [GET] /products/:slug
module.exports.findBySlug = async (req, res, next) => {
    try {
        const productService = new ProductService()

        const { slug } = req.params
        const filter = {
            slug,
            deleted: false 
        }
        const product = await productService.findOne(filter)
        return res.json(product)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the products")
        )
    }
}

// [DELETE] /products/:id
module.exports.deleteOne = async (req, res, next) => {
    try {
        const { id } = req.params

        const productService = new ProductService()
        const document = await productService.deleteOne(id)

        res.send({
            message: `Delete product ${id} successfully`,
            updatedDocument: document
        })
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while deleting the product")
        )
    }
}



