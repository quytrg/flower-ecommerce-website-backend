const express = require('express')
const router = express.Router()

const checkoutController = require('../../controllers/client/checkout.controller')

router.route('/order')
    .post(checkoutController.order)

module.exports = router