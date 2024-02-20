const ProductCategoryService = require('./product-category.service')

class CategoryService {
    constructor() {
        this.Category = require('../../models/category.model')
    }

    async find(filter, sort={ position: 'desc' }) {
        filter = {
            ...filter, 
            deleted: false,
            status: 'active'
        }
        const categories = await this.Category.find(filter).sort(sort)
        return categories
    }

    async findBySlug(slug) {
        const category = await this.Category.findOne({ slug, deleted: false, status: 'active' })
        return category
    }

    async findCategoriesByProductId(id) {
        const productCategoryService = new ProductCategoryService()
        const categoryIds = await productCategoryService.findCategoryIdsByProductId(id)

        const filter = {
            _id: { $in: categoryIds },
            deleted: false,
            status: 'active'
        }
        const categories = await this.Category.find(filter).select('title slug')
        return categories
    }
}

module.exports = CategoryService