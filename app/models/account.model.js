const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    fullName: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 1
    },
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
