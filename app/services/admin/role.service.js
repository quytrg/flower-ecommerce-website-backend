class RoleService {
    constructor() {
        this.Role = require('../../models/role.model')
    }

    async find(filter, pagination, sort={ position: 'desc' }) {
        const role = await this.Role.find(filter)
                                        .limit(pagination.limit)
                                        .skip(pagination.skip)
                                        .sort(sort)
        return role
    }

    async count(filter) {
        const result = await this.Role.countDocuments(filter)
        return result
    }

    async findOne(filter, select="") {
        const role = await this.Role.findOne(filter).select(select)
        return role
    }
}

module.exports = RoleService