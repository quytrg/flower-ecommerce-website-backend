const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const categorySchema = new Schema({
    title: String,
    parent_id: {
        type: String,
        default: ''
    },
    status: String,
    description: String,
    thumbnail1: String,
    thumbnail2: String,
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
    deletedAt: Date,
}, { timestamps: true })

const Category = mongoose.model('Categorie', categorySchema)

module.exports = Category