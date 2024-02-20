const ProductCategoryService = require('./product-category.service')

class CategoryService {
    constructor() {
        this.Category = require('../../models/category.model')
    }

    async find(filter, sort={ position: 'desc' }) {
        const categories = await this.Category.find(filter).sort(sort)
        return categories
    }

    async findOne(filter) {
        const category = await this.Category.findOne(filter)
        return category
    }
}

module.exports = CategoryService