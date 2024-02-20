const express = require('express')
const router = express.Router()

const categoryController = require('../../controllers/client/category.controller')

router.route('/')
    .get(categoryController.find)

router.route('/:slug')
    .get(categoryController.findOne)

router.route('/product/:id')
    .get(categoryController.findCategoriesByProductId)

module.exports = router