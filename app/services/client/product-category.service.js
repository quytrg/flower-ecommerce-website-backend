class ProductCategoryService {
    constructor() {
        this.ProductCategory = require('../../models/product-category.model')
    }

    async findProductIdsByCategoryId(categoryId) {
        const productsCategory = await this.ProductCategory.find({ categoryId: categoryId })
        const productIds = productsCategory.map(item => item.productId)
        return productIds
    }

    async findCategoryIdsByProductId(productId) {
        const productsCategory = await this.ProductCategory.find({ productId: productId })
        const categoryIds = productsCategory.map(item => item.categoryId)
        return categoryIds
    }

}

module.exports = ProductCategoryService