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

    async find(filter) {
        const accounts = await this.Account.find(filter)
        return accounts
    }

    async findById(id) {
        const account = await this.Account.findOne({ _id: id, deleted: false })
        return account
    }

    async updateOne(id, payload) {
        const filter = {
            _id: id
        }
        
        const data = this.extractAccountData(payload)

        
        
        const result = await this.Account.updateOne(filter, data)

        return result
    }

    // async updateMany(ids, payload) {
    //     const filter = {
    //         _id: {$in: ids}
    //     }

    //     const data = this.extractProductData(payload)

    //     const result = await this.Product.updateMany(filter, data)

    //     return result
    // }

    async create(payload) {
        const data = this.extractAccountData(payload)

        const result = await this.Account.create(data)
        await result.save()

        return result
    }

    // async count() {
    //     const result = await this.Product.countDocuments()
    //     return result
    // }

    // async findBySlug(slug) {
    //     const product = await this.Product.findOne({ slug })
    //     return product
    // }

    async deleteOne(id) {
        const filter = {
            _id: id
        }

        const result = await this.Account.updateOne(filter, { deleted: true })
        return result
    }
}

module.exports = AccountService