class OrderService {
    constructor() {
        this.Order = require('../../models/order.model')
    }

    // extractData(payload) {
    //     const order = {
    //         orderId: payload.orderId,
    //         userId: payload.userId,
    //         fullName: payload.fullName,
    //         email: payload.email,
    //         phone: payload.phone,
    //         address: payload.address,
    //         specificAddress: payload.specificAddress,
    //         payment: payload.payment,
    //         status: payload.status,
    //         totalPrice: payload.totalPrice,
    //         totalItems: payload.totalItems,
    //         shipping: payload.shipping,
    //     }
        
    //     Object.keys(order).forEach(key => (
    //         order[key] === undefined && delete order[key]
    //     ))

    //     return order
    // }

    // async create(payload) {
    //     const data = this.extractData(payload)
    //     const result = await this.Order.create(data)
    //     await result.save()

    //     return result
    // }

    async find(filter, pagination, sort={ createdAt: 'desc' }) {
        const orders = await this.Order.find(filter)
                                        .limit(pagination.limit)
                                        .skip(pagination.skip)
                                        .sort(sort)
        return orders
    }

    async count(filter) {
        const result = await this.Order.countDocuments(filter)
        return result
    }
}

module.exports = OrderService