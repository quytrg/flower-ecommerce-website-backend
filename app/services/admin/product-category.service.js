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

    async create(productId, categoryIds) {
        categoryIds.forEach(async (categoryId) => {
            const doc = await this.ProductCategory.create({ categoryId: categoryId, productId: productId })
            await doc.save()
        });
    }

    async deleteAllCategoriesOfProduct(productId) {
        const result = await this.ProductCategory.deleteMany({ productId: productId })
        return result
    }
}

module.exports = ProductCategoryService