class RoleService {
    constructor() {
        this.Role = require('../../models/role.model')
    }

    extractData(payload) {
        const role = {
            title: payload.title,
            description: payload.description,
            status: payload.status,
            deleted: payload.deleted,
            deletedAt: payload.deletedAt
        }
        
        Object.keys(role).forEach(key => (
            role[key] === undefined && delete role[key]
        ))

        return role
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

    async create(payload) {
        const data = this.extractData(payload)
        const result = await this.Role.create(data)
        await result.save()
        return result
    }

    async updateOne(filter, payload) {
        const data = this.extractData(payload)
        const result = await this.Role.updateOne(filter, data)
        return result
    }

    async deleteOne(id) {
        const result = await this.updateOne({ _id: id }, { 
            deleted: true,
            deletedAt: new Date()
        })
        return result
    }
}

module.exports = RoleService