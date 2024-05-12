class OrderItemService {
    constructor() {
        this.OrderItem = require('../../models/order-item.model')
    }

    extractData(payload) {
        const orderItem = {
            orderId: payload.orderId,
            productId: payload.productId,
            quantity: payload.quantity, 
            price: payload.price,
            discountPercentage: payload.discountPercentage
        }
        
        Object.keys(orderItem).forEach(key => (
            orderItem[key] === undefined && delete orderItem[key]
        ))

        return orderItem
    }

    async create(payload) {
        const data = this.extractData(payload)
        const result = await this.OrderItem.create(data)
        await result.save()

        return result
    }
}

module.exports = OrderItemService