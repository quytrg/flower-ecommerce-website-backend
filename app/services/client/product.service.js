const CategoryService = require('./category.service')
const ProductCategoryService = require('./product-category.service')

class ProductService {
    constructor() {
        this.Product = require('../../models/product.model')
    }

    async find(filter, sort={ position: 'desc' }) {
        const products = await this.Product.find(filter).sort(sort)
        return products
    }

    async findBySlug(slug) {
        const product = await this.Product.findOne({ slug, deleted: false, status: 'active' })
        return product
    }
}

module.exports = ProductService