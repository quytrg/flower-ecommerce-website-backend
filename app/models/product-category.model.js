const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productCategorySchema = new Schema({
    categoryId: String,
    productId: String,
})

const ProductCategory = mongoose.model('Product-category', productCategorySchema)

module.exports = ProductCategory