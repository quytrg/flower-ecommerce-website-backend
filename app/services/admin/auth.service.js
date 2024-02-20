class AuthService {
    constructor() {
        this.Account = require('../../models/account.model')
    }

    async findOne(filter) {
        const account = await this.Account.findOne(filter)
        return account
    }

}

module.exports = AuthService