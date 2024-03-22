class CategoryService {
    constructor() {
        this.Category = require('../../models/category.model')
    }

    extractData(payload) {
        const category = {
            title: payload.title,
            description: payload.description,
            thumbnails: payload.thumbnails,
            status: payload.status,
            position: payload.position,
            deleted: payload.deleted,
        }
        
        Object.keys(category).forEach(key => (
            category[key] === undefined && delete category[key]
        ))

        return category
    }

    async find(filter, pagination={}, sort={ position: 'desc' }) {
        const categories = await this.Category.find(filter)
                                        .limit(pagination?.limit)
                                        .skip(pagination?.skip)
                                        .sort(sort)
        return categories
    }

    async count(filter) {
        const result = await this.Category.countDocuments(filter)
        return result
    }

    async create(payload) {
        const data = this.extractData(payload)
        const result = await this.Category.create(data)
        await result.save()

        return result
    }
}

module.exports = CategoryService