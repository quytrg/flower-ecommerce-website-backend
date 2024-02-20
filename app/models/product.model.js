const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    featured: String,
    discountPercentage: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 1
    },
    thumbnail: String,
    status: {
        type: String,
        default: 'active'
    },
    position: Number,
    slug: {
        type: String,
        slug: "title",
        unique: true,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    updatedBy:[
        {
            account_id: String,
            updatedAt: Date
        }
    ],
    deletedBy: {
        account_id: String,
        deletedAt: Date
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product