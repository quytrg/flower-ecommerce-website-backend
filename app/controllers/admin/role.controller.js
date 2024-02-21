const ApiError = require('../../middlewares/api-error.js')
const RoleService = require('../../services/admin/role.service.js')

// helpers
const searchHelper = require('../../helpers/search.helper.js')
const paginationHelper = require('../../helpers/pagination.helper.js')

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
            new ApiError(500, "An error occurred while retrieving the products")
        )
    }
}