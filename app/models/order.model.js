const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: String,
    fullName: String,
    email: String,
    phone: String,
    address: String,
    specificAddress: String,
    payment: String,
    status: String,
    totalPrice: Number,
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
