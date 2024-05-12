const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    orderId: String,
    productId: String,
    quantity: Number, 
    price: Number,
    discountPercentage: {
        type: Number,
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, { timestamps: true })

const OrderItem = mongoose.model("Order-item", orderItemSchema);

module.exports = OrderItem;
