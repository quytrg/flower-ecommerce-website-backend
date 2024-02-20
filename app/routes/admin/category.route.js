const express = require('express')
const router = express.Router()

const categoryController = require('../../controllers/admin/category.controller')

router.route('/')
    .get(categoryController.find)
// router.get('/:slug', categoryController.find)
router.route('/product/:id')
    .get(categoryController.findCategoriesByProductId)

module.exports = router