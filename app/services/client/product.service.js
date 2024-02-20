class ProductService {
    constructor() {
        this.Product = require('../../models/product.model')
    }

    async find(filter, sort={ position: 'desc' }) {
        const products = await this.Product.find(filter).sort(sort)
        return products
    }

    async findOne(filter) {
        const product = await this.Product.findOne(filter)
        return product
    }
}

module.exports = ProductService