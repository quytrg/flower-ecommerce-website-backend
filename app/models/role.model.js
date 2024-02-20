const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, { timestamps: true })

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;