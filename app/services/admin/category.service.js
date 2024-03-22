class CategoryService {
    constructor() {
        this.Category = require('../../models/category.model')
    }

    async find(filter, pagination={}, sort={ position: 'desc' }) {
        const categories = await this.Category.find(filter)
                                        .limit(pagination?.limit)
                                        .skip(pagination?.skip)
                                        .sort(sort)
        return categories
    }

    async count(filter) {
        const result = await this.Category.countDocuments(filter)
        return result
    }
}

module.exports = CategoryService