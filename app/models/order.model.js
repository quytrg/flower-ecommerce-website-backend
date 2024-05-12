const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderId: String,
    userId: String,
    fullName: String,
    email: String,
    phone: String,
    address: String,
    specificAddress: String,
    payment: String,
    method: String,
    status: String,
    totalPrice: Number,
    totalItems: Number,
    shipping: Number,
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
