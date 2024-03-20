const ApiError = require('../../middlewares/api-error.js')
const RoleService = require('../../services/admin/role.service.js')

// helpers
const searchHelper = require('../../helpers/search.helper.js')
const paginationHelper = require('../../helpers/pagination.helper.js')

// [GET] /roles
module.exports.find = async (req, res, next) => {
    try {
        const roleService = new RoleService()

        const filter = { 
            deleted: false,
        }

        // filter by status
        if (req.query.status) {
            filter.status = req.query.status
        }

        // search
        if (req.query.keyword) {
            const searchObj = searchHelper(req.query)
            filter.title = searchObj.regex
        }

        // pagination
        const initPagination = {
            currentPage: 1,
            limit: 6
        }
        initPagination.totalRecords = await roleService.count(filter)
        const paginationObject = paginationHelper(req.query, initPagination)

        const roles = await roleService.find(filter, paginationObject)
        return res.json({
            roles,
            totalPages: paginationObject.totalPages,
            limit: paginationObject.limit,
            skip: paginationObject.skip
        })
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the roles")
        )
    }
}

// [GET] /roles/:id
module.exports.findById = async (req, res, next) => {
    try {
        const roleService = new RoleService()

        const filter = {
            deleted: false,
            _id: req.params.id
        }
        const role = await roleService.findOne(filter)
        if (!role) {
            return next(new ApiError(404, "Not found"))
        }
        return res.status(200).json(role)
    }
    catch (err) {
        return next(new ApiError(500, "An error occured while retrieving a role"))
    }
}

// [POST] /roles/
module.exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update cannot be empty"))
    }

    try {
        const roleService = new RoleService()

        const document = await roleService.create(req.body)

        res.status(201).json({
            message: "Create a new role successfully",
            newDocument: document
        })
    }
    catch (err) {
        return next(
            new ApiError(500, `An error occurred while creating a new role`)
        )
    }
}