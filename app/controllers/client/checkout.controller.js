const ApiError = require('../../middlewares/api-error.js')
const OrderService = require('../../services/client/order.service.js')
const OrderItemService = require('../../services/client/order-item.service.js')
const generateHelper = require('../../helpers/generate.helper.js')

// [POST] /checkout/order
module.exports.order = async (req, res, next) => {
    try {
        const orderService = new OrderService()
        const orderItemService = new OrderItemService()

        // create order information
        const orderInfo = {
            fullName: req.body.info.fullName,
            email: req.body.info.email,
            phone: req.body.info.phone,
            specificAddress: req.body.info.specificAddress,
            method: 'COD',
            status: 'pending',
            totalPrice: req.body.totalPrice,
            totalItems: req.body.totalItems,
            shipping: req.body.shipping
        }

        const orderId = generateHelper.generateRandomCapString(10)
        orderInfo.orderId = orderId

        const address = req.body.info.ward.ward_name + ', ' + req.body.info.district.district_name + ', ' + req.body.info.province.province_name
        orderInfo.address = address

        await orderService.create(orderInfo)

        // create order-item info
        for (item of req.body.items) {
            const orderItemInfo = {
                orderId: orderId,
                productId: item._id,
                quantity: item.quantity, 
                price: item.price,
                discountPercentage: item.discountPercentage
            }
            await orderItemService.create(orderItemInfo)
        }
        
        return res.status(200).json({
            orderId: orderId,
            message: "Order successfully!"
        })
    }
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while creating the order")
        )
    }
}
