class AccountService {
    constructor() {
        this.Account = require('../../models/account.model')
    }

    extractAccountData(payload) {
        const account = {
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
            token: payload.token,
            phone: payload.phone,
            avatar: payload.avatar,
            roleId: payload.roleId,
            status: payload.status,
            deleted: payload.deleted,
            deletedAt: payload.deletedAt
        }
        
        Object.keys(account).forEach(key => (
            account[key] === undefined && delete account[key]
        ))

        return account
    }

    async find(filter, pagination, sort={ position: 'desc' }) {
        const accounts = await this.Account.find(filter)
                                        .limit(pagination.limit)
                                        .skip(pagination.skip)
                                        .sort(sort)
                                        .select("-password")
        return accounts
    }

    async findOne(filter, select="") {
        const account = await this.Account.findOne(filter).select(select)
        return account
    }

    async updateOne(filter, payload) {
        const data = this.extractAccountData(payload)
        const result = await this.Account.updateOne(filter, data)
        return result
    }

    async create(payload) {
        const data = this.extractAccountData(payload)
        const result = await this.Account.create(data)
        await result.save()
        return result
    }

    async count(filter) {
        const result = await this.Account.countDocuments(filter)
        return result
    }

    async deleteOne(id) {
        const filter = {
            _id: id
        }
        const result = await this.Account.updateOne(filter, { deleted: true, deletedAt: new Date() })
        return result
    }
}

module.exports = AccountService