const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    fullName: String,
    email: String,
    password: String,
    token: String,
    phone: String,
    avatar: String,
    roleId: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, { timestamps: true })

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
