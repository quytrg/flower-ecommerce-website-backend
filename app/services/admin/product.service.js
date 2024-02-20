const ProductCategoryService = require('./product-category.service')

class ProductService {
    constructor() {
        this.Product = require('../../models/product.model')
    }

    extractProductData(payload) {
        const product = {
            title: payload.title,
            description: payload.description,
            price: payload.price,
            discountPercentage: payload.discountPercentage,
            stock: payload.stock,
            thumbnail: payload.thumbnail,
            status: payload.status,
            position: payload.position,
            deleted: payload.deleted,
        }
        
        Object.keys(product).forEach(key => (
            product[key] === undefined && delete product[key]
        ))

        return product
    }

    async find(filter, sort={ position: 'desc' }) {
        const query = { ...filter, deleted: false }
        if (filter.category) {
            const productCategoryService = new ProductCategoryService()
            const productIds = await productCategoryService.findProductIdsByCategoryId(filter.category)
            query._id = { $in: productIds }
            delete query.category
        }

        const products = await this.Product.find(query).sort(sort)
        return products
    }

    async findBySlug(slug) {
        const product = await this.Product.findOne({ slug, deleted: false })
        return product
    }

    async updateOne(id, payload) {
        const filter = {
            _id: id
        }
        const data = this.extractProductData(payload)
        const result = await this.Product.updateOne(filter, data)
        return result
    }

    async updateMany(data) {
        const { ids, type } = data
        let payload = {}
        switch (type) {
            case 'active':
            case 'inactive':
                payload = {
                    status: type
                }
                break 
            case 'delete':
                payload = {
                    deleted: true,
                    deletedAt: new Date()
                }
                break
            case 'position':
                let result = []
                const { positions } = data
                for(let index = 0; index < ids.length; index++) {
                    const doc = await this.updateOne({ _id: ids[index] }, { position: parseInt(positions[index]) })
                    result.push(doc)
                }
                return result
                break  
            default:
                break
        }
        const filter = {
            _id: { $in: ids }
        }
        const result = await this.Product.updateMany(filter, this.extractProductData(payload))
        return result
    }

    async create(data) {
        const payload = { ...data }

        payload.price = parseFloat(data.price)
        payload.discountPercentage = parseInt(data.discountPercentage)
        payload.stock = parseInt(data.stock)

        if (!data?.position) { 
            payload.position = await this.count() + 1
        } 
        else {
            payload.position = parseInt(data.position)
        }

        const result = await this.Product.create(this.extractProductData(payload))
        await result.save()

        return result
    }

    async count() {
        const result = await this.Product.countDocuments()
        return result
    }

    async deleteOne(id) {
        const filter = {
            _id: id
        }
        const result = await this.Product.updateOne(filter, { deleted: true, deletedAt: new Date() })
        return result
    }
}

module.exports = ProductService