class ProductService {
    constructor() {
        this.Product = require('../../models/product.model')
    }

    async find(filter, select="",sort={ position: 'desc' }) {
        console.log(select)
        const products = await this.Product.find(filter).sort(sort).select(select)
        return products
    }

    async findOne(filter, select="") {
        const product = await this.Product.findOne(filter).select(select)
        return product
    }
}

module.exports = ProductService