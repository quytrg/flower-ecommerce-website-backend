class CategoryService {
    constructor() {
        this.Category = require('../../models/category.model')
    }

    async find(filter, sort={ position: 'desc' }) {
        const categories = await this.Category.find(filter).sort(sort)
        return categories
    }
}

module.exports = CategoryService