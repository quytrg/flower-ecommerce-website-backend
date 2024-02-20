class RoleService {
    constructor() {
        this.Role = require('../../models/role.model')
    }

    async find(filter) {
        const roles = await this.Role.find(filter)
        return roles
    }
}

module.exports = RoleService