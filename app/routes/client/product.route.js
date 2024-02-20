const express = require('express')
const router = express.Router()

const productController = require('../../controllers/client/product.controller')

router.route('/product-details/:slug')
    .get(productController.findOne)

router.route('/category/:categorySlug')
    .get(productController.findByCategory)

router.route('/')
    .get(productController.find)

module.exports = router