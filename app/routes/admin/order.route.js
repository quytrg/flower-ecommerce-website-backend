const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/admin/order.controller.js')

router.route('/')
    .get(orderController.find)

module.exports = router