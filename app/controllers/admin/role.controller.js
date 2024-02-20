const ApiError = require('../../middlewares/api-error.js')
const RoleService = require('../../services/admin/role.service.js')
const searchHelper = require('../../helpers/search.helper.js')


module.exports.find = async (req, res, next) => {
    try {
        const filter = { 
            deleted: false,
        }
        if (req.query.status) {
            filter.status = req.query.status
        }
        if (req.query.category) {
            filter.category = req.query.category
        }
        if (req.query.keyword) {
            const searchObj = searchHelper(req.query)
            filter.title = searchObj.regex
        }

        const roleService = new RoleService()
        const roles = await roleService.find(filter)
        return res.send(roles)
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while retrieving the products")
        )
    }
}